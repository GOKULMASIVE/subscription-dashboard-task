require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected to MongoDB for seeding");
};

const Plan = require("../models/Plan");
const User = require("../models/User");

const plans = [
  {
    name: "Starter",
    price: 0,
    features: ["1 Project", "5 GB Storage", "Email Support", "Basic Analytics"],
    duration: 30,
    badge: null,
  },
  {
    name: "Pro",
    price: 29,
    features: [
      "10 Projects",
      "50 GB Storage",
      "Priority Email Support",
      "Advanced Analytics",
      "API Access",
      "Custom Domain",
    ],
    duration: 30,
    badge: "Most Popular",
  },
  {
    name: "Business",
    price: 79,
    features: [
      "Unlimited Projects",
      "200 GB Storage",
      "24/7 Phone & Email Support",
      "Advanced Analytics",
      "Full API Access",
      "Custom Domain",
      "Team Collaboration (up to 10)",
      "SSO Integration",
    ],
    duration: 30,
    badge: "Best Value",
  },
  {
    name: "Enterprise",
    price: 199,
    features: [
      "Unlimited Projects",
      "1 TB Storage",
      "Dedicated Account Manager",
      "Custom Analytics & Reports",
      "Full API Access",
      "Custom Domain & Branding",
      "Unlimited Team Members",
      "SSO & SAML Integration",
      "SLA Guarantee",
      "On-premise Deployment",
    ],
    duration: 365,
    badge: "Enterprise",
  },
];

const seedAdminUser = async () => {
  const existing = await User.findOne({ email: "admin@demo.com" });
  if (!existing) {
    const salt = await bcrypt.genSalt(12);
    const hashed = await bcrypt.hash("Admin@123", salt);
    await User.create({
      name: "Admin User",
      email: "admin@demo.com",
      password: hashed,
      role: "admin",
    });
    console.log("✅ Admin user created: admin@demo.com / Admin@123");
  } else {
    console.log("ℹ️  Admin user already exists.");
  }
};

const seed = async () => {
  try {
    await connectDB();

    // Seed plans
    await Plan.deleteMany({});
    await Plan.insertMany(plans);
    console.log(`✅ Seeded ${plans.length} plans.`);

    // Seed admin
    await seedAdminUser();

    console.log("🎉 Seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
};

seed();
