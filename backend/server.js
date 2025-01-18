// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes')

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin:true,
    credentials:true,
    methods:["POST","GET"]
}));

// Routes
app.use('/api', userRoutes);
app.use('/api', adminRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI,{
    family:4
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
