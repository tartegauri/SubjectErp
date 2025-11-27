import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const env = process.env.NODE_ENV || 'development';
const envFile = `.env.${env}`;
const envPath = path.join(__dirname, `../${envFile}`);

import fs from 'fs';
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (file, folder = 'assignments', options = {}) => {
  try {
    const uploadOptions = {
      folder: folder,
      resource_type: 'auto',
      ...options,
    };

    if (file.buffer) {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          uploadOptions,
          (error, result) => {
            if (error) {
              console.error('Cloudinary upload error:', error);
              reject(error);
            } else {
              resolve({
                public_id: result.public_id,
                secure_url: result.secure_url,
                url: result.url,
                format: result.format,
                resource_type: result.resource_type,
                bytes: result.bytes,
              });
            }
          }
        );
        uploadStream.end(file.buffer);
      });
    } else {
      const result = await cloudinary.uploader.upload(file, uploadOptions);
      return {
        public_id: result.public_id,
        secure_url: result.secure_url,
        url: result.url,
        format: result.format,
        resource_type: result.resource_type,
        bytes: result.bytes,
      };
    }
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};

export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw error;
  }
};

export default cloudinary;

