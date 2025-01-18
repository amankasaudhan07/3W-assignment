// multerConfig.js
const multer = require('multer');

// Set up Multer to store files temporarily in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports = upload;
