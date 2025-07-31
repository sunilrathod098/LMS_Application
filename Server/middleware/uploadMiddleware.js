import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Set up Cloudinary storage for multer
const avatarStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'LMS_Application/images/avatars',
        allowed_formats: ['jpg', 'jpeg', 'png'],
        transformation: [{ width: 200, height: 200, crop: 'thumb' }]
    },
});

const resourceStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'LMS_Application/images/resources',
        allowed_formats: ['pdf', 'docx', 'pptx', 'txt'],
    },
});

//Here Multer upload instances
export const uploadAvatar = multer({ storage: avatarStorage }).single("avatar");
export const uploadResource = multer({ storage: resourceStorage }).single("file");

//Here Error handling wrapper
export const handleUpload = (uploadFunction) => (req, res, next) => {
    uploadFunction(req, res, (err) => {
        if (err) {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({ message: err.message });
            }
            return res.status(500).json({ message: err.message });
        }
        next();
    });
};