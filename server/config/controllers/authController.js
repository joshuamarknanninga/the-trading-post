import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = await User.create({ name, email, password });
    
    // Generate JWT
    const token = generateToken(user._id);
    
    res.status(201).json({ 
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = generateToken(user._id);
    
    res.json({ 
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};