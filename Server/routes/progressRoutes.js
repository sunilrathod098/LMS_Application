import { Router } from 'express';
import {
    getCourseProgress,
    getUserProgress,
    updateProgress
} from '../controllers/progressController.js';
import { verifyJWT } from '../middlewares/authMiddleware.js';

const router = Router();


router.use(verifyJWT);
router.route('/:courseId/:lessonId').patch(updateProgress);
router.route('/:courseId').get(getUserProgress);
router.use('/admin', restrictTo('admin'));
router.route('/course/:courseId').get(getCourseProgress);

export default router;