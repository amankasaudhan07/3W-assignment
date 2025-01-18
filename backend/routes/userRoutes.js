// routes/userRoutes.js
const express = require('express');
const upload = require('../multerConfig');
const cloudinary = require('../cloudinaryConfig');
const User = require('../models/User');
const router = express.Router();

// POST endpoint to create a user and upload images to Cloudinary
router.post('/create', upload.array('images', 5), async (req, res) => {
  try {
    // console.log("Backend call")
    const { name, socialMediaHandle } = req.body;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const imageUploadPromises = files.map((file) => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: 'auto' },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve({
                url: result.secure_url,
                public_id: result.public_id,
              });
            }
          }
        );
        uploadStream.end(file.buffer); // Use the buffer from Multer's memory storage
      });
    });

    // Wait for all images to upload
    const uploadedImages = await Promise.all(imageUploadPromises);

    // Create a new user with the uploaded images
    const newUser = new User({
      name,
      socialMediaHandle,
      images: uploadedImages,
    });

    await newUser.save();

    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
});



module.exports = router;
