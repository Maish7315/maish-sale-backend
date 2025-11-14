const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_URL ? new URL(process.env.CLOUDINARY_URL).hostname.split('.')[0] : undefined,
  api_key: process.env.CLOUDINARY_URL ? new URL(process.env.CLOUDINARY_URL).username : undefined,
  api_secret: process.env.CLOUDINARY_URL ? new URL(process.env.CLOUDINARY_URL).password : undefined,
});

const uploadToCloudinary = (buffer, folder = 'receipts') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(error);
        } else {
          console.log('File uploaded to Cloudinary:', result.secure_url);
          resolve(result.secure_url);
        }
      }
    );
    uploadStream.end(buffer);
  });
};

module.exports = { uploadToCloudinary };