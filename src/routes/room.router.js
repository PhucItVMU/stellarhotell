import { roomController } from '../controllers/index.js';
import express from 'express';
import { validationError, roomValidation } from '../middleware/validation/index.js';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create-room', verifyToken, isAdmin, roomController.createRoom);
router.patch('/update', verifyToken, isAdmin, roomController.updateRoom);
router.get(
    '/get-number-available-rooms',
    roomValidation.validateGetNumberAvailableRooms,
    validationError,
    roomController.getNumberAvailableRooms,
);
router.get(
    '/get-number-status-rooms',
    roomValidation.validateGetNumberStatusRooms,
    validationError,
    verifyToken,
    isAdmin,
    roomController.getNumberStatusRooms,
);
router.get(
    '/get-parameters-room',
    roomValidation.validateGetParametersRoom,
    validationError,
    roomController.getParametersRoom,
);
router.get(
    '/',
    roomValidation.validateGetRoomsByTypeRoom,
    validationError,
    verifyToken,
    isAdmin,
    roomController.getRoomsByTypeRoom,
);
router.get('/get-room-by-id', verifyToken, isAdmin, roomController.getRoomById);
router.delete('/', roomValidation.validateDeleteRoom, validationError, verifyToken, isAdmin, roomController.deleteRoom);

export default router;
