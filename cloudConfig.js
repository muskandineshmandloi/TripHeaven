const cloudinary = require("cloudinary").v2;
const multer = require("multer");

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});


const storage = multer.memoryStorage();

const upload = multer({ storage });

const uploadToCloudinary = (fileBuffer, folder = "TripHeaven_DEV") => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder, allowed_formats: ["png", "jpg", "jpeg"] },
      (err, result) => (err ? reject(err) : resolve(result))
    ).end(fileBuffer);
  });
};

module.exports = { cloudinary, upload, uploadToCloudinary };