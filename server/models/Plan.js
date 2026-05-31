const mongoose = require("mongoose");

const planSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Plan name is required"],
      unique: true,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
    },
    plan_id: {
      type: String,
      trim: true,
    },
    features: {
      type: [String],
      default: [],
    },
    duration: {
      type: Number, // in days
      required: [true, "Duration is required"],
      min: 1,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    badge: {
      type: String,
      default: null, // e.g., "Most Popular", "Best Value"
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Plan", planSchema);
