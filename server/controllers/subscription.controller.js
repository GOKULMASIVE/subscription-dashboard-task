const Subscription = require("../models/Subscription");
const Plan = require("../models/Plan");
const razorpay = require("../config/razorpay");

// @desc    Subscribe to a plan
// @route   POST /api/subscribe/:planId
const subscribe = async (req, res) => {
  try {
    const { planId } = req.params;
    const userId = req.user._id;

    const plan = await Plan.findById(planId);
    console.log(plan, "-----");
    if (!plan || !plan.isActive) {
      return res
        .status(404)
        .json({ success: false, message: "Plan not found or inactive." });
    }
    console.log(plan);
    let subscriptionData;
    const start_date = new Date();
    const end_date = new Date();
    end_date.setDate(end_date.getDate() + plan.duration);
    if (plan.plan_id) {
      const sub = await razorpay.subscriptions.create({
        plan_id: plan?.plan_id,
        customer_notify: true,
        quantity: 1,
        total_count: 1,
      });
      if (sub.id) {
        const subscription = await Subscription.create({
          user_id: userId,
          plan_id: planId,
          start_date,
          end_date,
          status: "active",
          sub_id: sub?.id,
        });
        await subscription.populate("plan_id");
        subscriptionData = subscription.toObject();

        subscriptionData.short_url = sub?.short_url;
      }
    } else {
      const subscription = await Subscription.create({
        user_id: userId,
        plan_id: planId,
        start_date,
        end_date,
        status: "active",
      });
      await subscription.populate("plan_id");
      subscriptionData = subscription.toObject();
    }

    res.status(201).json({
      success: true,
      message: `Successfully subscribed to ${plan.name}!`,
      data: subscriptionData,
    });
  } catch (err) {
    console.log(err, "😁😁");
    res.status(500).json({ success: false, message: err.message });
  }
};

const cancelSubscription = async (req, res) => {
  try {
    const { subId } = req.params;
    const userId = req.user._id;

    const subscription = await Subscription.findOne({
      sub_id: subId,
      user_id: userId,
    });
    console.log(subscription, "-----");
    if (!subscription) {
      return res
        .status(404)
        .json({ success: false, message: "Subscription not found." });
    }
    console.log(subscription);
    const sub = await razorpay.subscriptions.cancel(subscription.sub_id, {
      cancel_at_cycle_end: true,
    });

    if (sub.id) {
      const subscription = await Subscription.updateOne(
        {
          user_id: userId,
          status: "active",
          sub_id: subId,
        },
        { status: "cancel" },
      );

      await subscription.populate("plan_id");

      res.status(201).json({
        success: true,
        message: `Successfully canceled`,
        data: subscription,
      });
    }
  } catch (err) {
    console.log(err, "😁😁");
    res.status(500).json({ success: false, message: err.message });
  }
};
// @desc    Get my active subscription
// @route   GET /api/my-subscription
const getMySubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      user_id: req.user._id,
    })
      .populate("plan_id")
      .sort({ createdAt: -1 });
    if (!subscription) {
      return res.json({
        success: true,
        data: null,
        message: "No active subscription found.",
      });
    }
    let subDetails;
    if (subscription.sub_id)
      subDetails = await razorpay.subscriptions.fetch(subscription?.sub_id);
    // console.log(subDetails, "-=-=--=---");

    // Check if expired
    if (new Date() > subscription.end_date) {
      subscription.status = "expired";
      await subscription.save();
      return res.json({
        success: true,
        data: subscription,
        message: "Subscription has expired.",
      });
    }

    res.json({
      success: true,
      data: subscription?.sub_id
        ? {
            ...subscription.toObject(),
            status: subDetails?.status,
            razor_plan_id: subDetails?.plan_id,
            customer_id: subDetails?.customer_id,
          }
        : { ...subscription.toObject() },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get all subscriptions (admin)
// @route   GET /api/admin/subscriptions
const getAllSubscriptions = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const skip = (page - 1) * limit;
    const [subscriptions, total] = await Promise.all([
      Subscription.find(filter)
        .populate("user_id", "name email role")
        .populate("plan_id", "name price duration")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Subscription.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: subscriptions,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
        limit: Number(limit),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  subscribe,
  getMySubscription,
  getAllSubscriptions,
  cancelSubscription,
};
