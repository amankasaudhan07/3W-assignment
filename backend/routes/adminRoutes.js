const express = require('express');
const User = require('../models/User');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

// Admin login
router.post('/admin/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const isMatchedUsername = username == process.env.ADMIN_USERNAME;
    const isMatchedPassword = password == process.env.ADMIN_PASSWORD;

    // console.log(isMatchedPassword,isMatchedUsername);

   if(!isMatchedPassword || !isMatchedUsername)
     return res.status(401).json({message:"Invalid Credentials"})
   

    // Generate a JWT token
    // console.log("tokenization");
    // console.log("jwt",process.env.JWT_SECRET);
    const token = jwt.sign({username}, process.env.JWT_SECRET, { expiresIn: '1d' });
    // console.log("token",token);


    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Middleware to protect routes
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(403).json({ message: 'Access denied, no token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // req.admin = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// GET endpoint to fetch all users (protected route)
router.get('/admin/dashboard', verifyToken, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
});

module.exports = router;
