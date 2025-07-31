import { Router } from 'express';
import {
    enrollUser,
    getUserEnrollments,
    unenrollUser
} from '../controllers/enrollmentController.js';
import { verifyJWT } from '../middleware/authMiddleware.js';
import { restrictTo } from '../middleware/roleMiddleware.js';

const router = Router();

router.use(verifyJWT);
router.route('/:courseId').post(enrollUser);
router.route('/my-courses').get(getUserEnrollments);
router.route('/:courseId').delete(unenrollUser);
router.use(restrictTo('admin'));
router.route('/admin/all').get(getUserEnrollments);

export default router;
