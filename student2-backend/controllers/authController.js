const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (user) => {
  const secret = process.env.JWT_SECRET || 'smartspend_super_secret_jwt_key_2026_team_dev';
  const expiresIn = process.env.JWT_EXPIRE || '7d';
  return jwt.sign(
    { id: user._id, email: user.email, name: user.name },
    secret,
    { expiresIn }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, monthlyBudgetLimit, currency } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      monthlyBudgetLimit: Number(monthlyBudgetLimit) || 2500,
      currency: currency || 'USD',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name.trim())}`
    });

    const token = generateToken(newUser);

    res.status(201).json({
      success: true,
      message: 'User registered successfully!',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        monthlyBudgetLimit: newUser.monthlyBudgetLimit,
        currency: newUser.currency,
        avatar: newUser.avatar
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        monthlyBudgetLimit: user.monthlyBudgetLimit,
        currency: user.currency,
        avatar: user.avatar
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        monthlyBudgetLimit: user.monthlyBudgetLimit,
        currency: user.currency,
        avatar: user.avatar,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
const updateProfile = async (req, res) => {
  try {
    const { name, monthlyBudgetLimit, currency, password, avatar } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const updates = {};
    if (name) updates.name = name.trim();
    if (monthlyBudgetLimit !== undefined) updates.monthlyBudgetLimit = Number(monthlyBudgetLimit);
    if (currency) updates.currency = currency;
    if (avatar) updates.avatar = avatar;

    if (password && password.length >= 6) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(password, salt);
    }

    const updated = await User.findByIdAndUpdate(req.user.id, updates, { new: true });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      user: {
        id: updated._id,
        name: updated.name,
        email: updated.email,
        monthlyBudgetLimit: updated.monthlyBudgetLimit,
        currency: updated.currency,
        avatar: updated.avatar
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile
};
