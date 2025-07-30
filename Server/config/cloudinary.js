import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { logger } from '../utils/logger.js';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadOnCloud = async (localFilePath) => {
    try {
        if (localFilePath) return null;
        const fileResponse = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto',
            folder: 'LMS_Application'
        });
        fs.unlinkSync(localFilePath)
        return fileResponse;
    } catch (error) {
        fs.unlinkSync(localFilePath);
        logger.error(`Cloudinary upload failed: ${error.message}`);
        return null;
    }
}

export const deleteFromCloud = async (publicId, resourceType = 'image') => {
    try {
        const fileResponse = await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType
        });
        return fileResponse;
    } catch (error) {
        logger.Error(`Cloudinary deletion failed: ${error.message}`);
        return null;

    }
}