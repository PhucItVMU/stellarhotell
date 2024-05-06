import { utilitiesController } from '../controllers/index.js';
import express from 'express';
import upload from '../middleware/uploadMedia.js';
import { verifyToken, isAdmin, isClient } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', utilitiesController.getAllUtilities);
router.post('/create', verifyToken, isAdmin, upload.array('image', 4), utilitiesController.createUtility);
router.patch('/update', verifyToken, isAdmin, upload.array('image', 4), utilitiesController.updateUtility);
router.delete('/delete', verifyToken, isAdmin, utilitiesController.deleteUtility);

export default router;
