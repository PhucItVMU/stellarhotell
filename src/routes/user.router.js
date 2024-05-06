import express from 'express';
import { userController } from '../controllers/index.js';
import { verifyToken, isAdmin, isClient } from '../middleware/authMiddleware.js';
import { userValidation } from '../middleware/validation/index.js';
const router = express.Router();

router.get('/', verifyToken, isAdmin, userController.getAllUser);
router.patch('/update-user', userValidation.updateUserValidation, verifyToken, isAdmin, userController.updateUser);
router.patch('/delete-user', verifyToken, isAdmin, userController.deleteUser);
router.get('/profile', verifyToken, isClient, userController.getUser);
router.get('/get-name', verifyToken, isClient, userController.getName);
router.patch(
    '/update-profile',
    userValidation.updateUserValidation,
    verifyToken,
    isClient,
    userController.updateProfile,
);
router.get('/get-total-account', verifyToken, isAdmin, userController.getTotalAccount);
router.patch('/update-status', verifyToken, isAdmin, userController.updateStatus);

export default router;
