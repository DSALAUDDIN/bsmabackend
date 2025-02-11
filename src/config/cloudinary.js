const cloudinary = require('cloudinary').v2;
const config = require('./config');

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret
});

const uploadToCloudinary = async (file, folder) => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: folder,
      resource_type: "auto"
    });
    return {
      public_id: result.public_id,
      url: result.secure_url
    };
  } catch (error) {
    throw new Error('Error uploading to Cloudinary');
  }
};

const deleteFromCloudinary = async (public_id) => {
  try {
    await cloudinary.uploader.destroy(public_id);
    return { message: 'File deleted successfully' };
  } catch (error) {
    throw new Error('Error deleting from Cloudinary');
  }
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary
};
