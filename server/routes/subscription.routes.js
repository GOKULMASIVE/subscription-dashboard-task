const express = require("express");
const router = express.Router();
const {
  subscribe,
  getMySubscription,
  cancelSubscription,
} = require("../controllers/subscription.controller");
const { protect } = require("../middleware/auth.middleware");

router.post("/subscribe/:planId", protect, subscribe);
router.put("/subscribe/:subId", protect, cancelSubscription);
router.get("/my-subscription", protect, getMySubscription);

module.exports = router;
