import { Router } from 'express';
import {
    createCourse,
    deleteCourse,
    getAllCourses,
    getCourseById,
    updateCourse
} from '../controllers/courseController.js';
import {
    admin,
    instructor,
    verifyJWT
} from '../middleware/authMiddleware.js';

const router = Router();


router.route('/').get(getAllCourses);
router.route('/:coursesId').get(getCourseById);
router.use(verifyJWT);
router.route('/').post(admin || instructor, createCourse);
router.route('/:courseId').put(admin || instructor, updateCourse);
router.route('/:courseId').delete(admin || instructor, deleteCourse);

export default router;