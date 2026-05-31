const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    plan_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      required: true,
    },
    sub_id: {
      type: String,
      trim: true,
    },
    start_date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    end_date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "expired", "cancelled"],
      default: "active",
    },
  },
  { timestamps: true },
);

// Auto-compute status based on end_date
subscriptionSchema.methods.computeStatus = function () {
  if (this.status === "cancelled") return "cancelled";
  return new Date() > this.end_date ? "expired" : "active";
};

module.exports = mongoose.model("Subscription", subscriptionSchema);
