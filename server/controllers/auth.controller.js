const User = require("../models/User");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../config/jwt");

// @desc    Register new user
// @route   POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered.",
      });
    }

    const user = await User.create({ name, email, password, role });

    const accessToken = generateAccessToken({ id: user._id, role: user.role });
    const refreshToken = generateRefreshToken({ id: user._id });

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    res.status(201).json({
      success: true,
      message: "Registration successful.",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        accessToken,
        refreshToken,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select(
      "+password +refreshToken",
    );
    const passwordCheck = await user?.comparePassword(password);
    console.log(user, passwordCheck);
    if (!user || !(await user?.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const accessToken = generateAccessToken({ id: user._id, role: user.role });
    const refreshToken = generateRefreshToken({ id: user._id });

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    res.json({
      success: true,
      message: "Login successful.",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        accessToken,
        refreshToken,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh
const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res
        .status(401)
        .json({ success: false, message: "Refresh token required." });
    }

    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.id).select("+refreshToken");

    if (!user || user.refreshToken !== refreshToken) {
      return res
        .status(403)
        .json({ success: false, message: "Invalid refresh token." });
    }

    const newAccessToken = generateAccessToken({
      id: user._id,
      role: user.role,
    });
    const newRefreshToken = generateRefreshToken({ id: user._id });

    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    res.json({
      success: true,
      data: { accessToken: newAccessToken, refreshToken: newRefreshToken },
    });
  } catch (err) {
    res
      .status(403)
      .json({ success: false, message: "Invalid or expired refresh token." });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      await User.findOneAndUpdate(
        { refreshToken },
        { refreshToken: null },
        { new: true },
      );
    }
    res.json({ success: true, message: "Logged out successfully." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
const getMe = async (req, res) => {
  res.json({ success: true, data: req.user });
};

module.exports = { register, login, refresh, logout, getMe };
