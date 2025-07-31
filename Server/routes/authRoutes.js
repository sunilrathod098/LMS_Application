import { Router } from 'express';
import {
    resetPassword,
    signinUser,
    signupUser,
    updateAvatar
} from '../controllers/authController.js';
import { handleUpload, uploadAvatar } from '../middleware/uploadMiddleware.js';


const router = Router();

router.route('/signup').post(signupUser);
router.route('/signin').post(signinUser);
router.route('/reset-password').post(resetPassword);
router.route('/avatar/:userId').put(uploadAvatar, handleUpload(uploadAvatar), updateAvatar);

export default router;