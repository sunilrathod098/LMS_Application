import { Router } from 'express';
import {
    createLesson,
    deleteLesson,
    getCourseLessons,
    updateLesson,
    uploadLessonVideo
} from '../controllers/lessonController.js';
import { verifyJWT } from '../middleware/authMiddleware.js';
import { restrictTo } from '../middleware/roleMiddleware.js';
import { handleUpload, uploadVideo } from '../middleware/uploadMiddleware.js';

const router = Router();


router.route('/courses/:courseId').get(getCourseLessons);
router.use(verifyJWT);

router.use(restrictTo('instructor', 'admin'));
router.route('/courses/:courseId/lessons')
    .post(
        uploadVideo,
        handleUpload(uploadVideo),
        createLesson
    );

router.route('/lessons/:lessonId')
    .put(updateLesson)
    .delete(deleteLesson);

router.route('/lessons/:lessonId/video')
    .patch(
        uploadVideo,
        handleUpload(uploadVideo),
        uploadLessonVideo
    );


export default router;