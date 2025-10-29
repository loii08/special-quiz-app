const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const auth = require('../middleware/auth');

const router = express.Router();

// Configure Cloudinary with your credentials from .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up multer to store files in memory as buffers
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 },
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype) return cb(null, true);
    cb(new Error('Error: Images Only!'));
  }
}).single('rewardImage');

router.post('/', auth, (req, res) => {
  upload(req, res, (err) => {
    if (err) return res.status(400).json({ msg: err.message });
    if (!req.file) return res.status(400).json({ msg: 'No file selected' });

    // Upload the file buffer from memory to Cloudinary
    cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
      if (error || !result) return res.status(500).json({ msg: 'Cloudinary upload failed.' });
      // Return the secure, permanent URL from Cloudinary
      res.json({ filePath: result.secure_url });
    }).end(req.file.buffer);
  });
});

module.exports = router;