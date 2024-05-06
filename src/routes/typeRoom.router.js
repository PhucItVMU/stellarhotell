import express from 'express';
import { typeRoomController } from '../controllers/index.js';
import upload from '../middleware/uploadMedia.js';
import { verifyToken, isAdmin, isClient } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', typeRoomController.filterTypeRooms);
router.get('/get-type-room-by-id', typeRoomController.getTypeRoomById);
router.patch('/update-typeroom', verifyToken, isAdmin, upload.array('image', 4), typeRoomController.updateTypeRoom);
router.get('/get-total-typerooms', verifyToken, isAdmin, typeRoomController.getTotalTyperooms);
router.get('/get-type-room-names', typeRoomController.getTypeRoomNames);
router.get('/get-list-total-rooms-by-typeroom', verifyToken, isAdmin, typeRoomController.getListTotalRoomsByTypeRoom);

export default router;
