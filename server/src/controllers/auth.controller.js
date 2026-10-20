const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Store = require('../models/Store');
const asyncHandler = require('../utils/asyncHandler');
const { validateRegister } = require('../utils/validators');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

const publicUser = (u) => ({
  id: u._id,
  name: u.name,
  email: u.email,
  address: u.address,
  role: u.role,
});

exports.register = asyncHandler(async (req, res) => {
  const errors = validateRegister(req.body);
  if (errors.length) return res.status(400).json({ message: errors[0], errors });

  const { name, email, address, password, role, storeName } = req.body;
  const exists = await User.findOne({ email: email.trim().toLowerCase() });
  if (exists) return res.status(409).json({ message: 'An account with this email already exists' });

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, address, password: hashed, role });

  if (role === 'STORE_OWNER') {
    try {
      await Store.create({ name: storeName, address, owner: user._id });
    } catch (err) {
      await User.findByIdAndDelete(user._id);
      throw err;
    }
  }

  res.status(201).json({ token: signToken(user._id), user: publicUser(user) });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

  const user = await User.findOne({ email: String(email).trim().toLowerCase() }).select('+password');
  const ok = user && (await bcrypt.compare(password, user.password));
  if (!ok) return res.status(401).json({ message: 'Invalid email or password' });

  res.json({ token: signToken(user._id), user: publicUser(user) });
});

exports.me = (req, res) => res.json({ user: publicUser(req.user) });