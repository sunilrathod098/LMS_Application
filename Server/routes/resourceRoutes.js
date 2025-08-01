import { Router } from 'express';
import {
    addResource,
    deleteResource,
    getCourseResources
} from '../controllers/resourcesController.js';
import {  verifyJWT } from '../middleware/authMiddleware.js';
import { handleUpload, uploadResource } from '../middleware/uploadMiddleware.js';
import { restrictTo } from '../middleware/roleMiddleware.js';
import { instructor, admin } from '../middleware/roleMiddleware.js';

const router = Router();

router.route('/:coursesId').get(getCourseResources);
router.use(verifyJWT);
router.route('/courses/:courseId').post(admin || instructor, uploadResource, handleUpload(uploadResource), addResource);
router.route('/:resourcesId').delete(admin || instructor, deleteResource);

export default router;