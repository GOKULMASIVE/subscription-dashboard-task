const express = require("express");
const router = express.Router();
const { getAllSubscriptions } = require("../controllers/subscription.controller");
const { protect, adminOnly } = require("../middleware/auth.middleware");

router.get("/subscriptions", protect, adminOnly, getAllSubscriptions);

module.exports = router;
