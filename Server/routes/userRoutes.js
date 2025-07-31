import { Router } from 'express';
import {
    deleteUser,
    getAllUsers,
    getUserById,
    updateUser
} from '../controllers/userController.js';
import { admin } from '../middleware/adminMiddleware.js';
import { verifyJWT } from '../middleware/authMiddleware.js';

const router = Router();

router.route('/').get(verifyJWT, admin, getAllUsers);
router.route('/:userId').get(verifyJWT, getUserById);
router.route('/:userId').put(verifyJWT, updateUser);
router.route('/:userId').delete(verifyJWT, deleteUser);

export default router;