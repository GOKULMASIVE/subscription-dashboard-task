const Plan = require("../models/Plan");

// @desc    Get all active plans
// @route   GET /api/plans
const getPlans = async (req, res) => {
  try {
    const plans = await Plan.find({ isActive: true }).sort({ price: 1 });
    res.json({ success: true, data: plans });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getPlans };
