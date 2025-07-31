import { Router } from 'express';
import {
    createQuiz,
    deleteQuiz,
    getCourseQuiz,
    submitQuiz,
    updateQuiz
} from '../controllers/quizController.js';
import { verifyJWT } from '../middleware/authMiddleware.js';

const router = Router();

router.use(verifyJWT);
router.route('/course/:courseId').get(getCourseQuiz);
router.route('/:quizId/submit')
    .post(restrictTo('user'), submitQuiz);

router.use(restrictTo('instructor', 'admin'));

router.route('/courses/:courseId')
    .post(createQuiz);

router.route('/:quizId')
    .put(updateQuiz)
    .delete(deleteQuiz);

export default router;