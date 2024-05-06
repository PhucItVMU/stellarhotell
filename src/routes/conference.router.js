import express from 'express';
import {conferenceController} from '../controllers/index.js';
import {validationError, conferenceValidation} from '../middleware/validation/index.js';
import { verifyToken,  isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/get-all-contact', verifyToken,  isAdmin, conferenceController.getAllContact);
router.post('/create-contact',conferenceValidation.validateCreateContact, validationError,  conferenceController.createContact);
router.patch('/update-contact', verifyToken,  isAdmin, conferenceController.updateContact);
export default router;