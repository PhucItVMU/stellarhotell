import express from 'express';
import { authController } from '../controllers/index.js';
import { validationError, authValidation } from '../middleware/validation/index.js';
import { verifyToken, isClient } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', authValidation.validateRegister, validationError, authController.register);
router.post('/login', authValidation.validateLogin, validationError, authController.login);
router.post('/admin/login', authValidation.validateLogin, validationError, authController.loginAdmin);

router.post('/prefresh-token', verifyToken, authValidation.validatePrefreshToken, validationError, authController.prefreshToken);
router.post('/logout', verifyToken, authController.logout);
//reset password
router.post('/sendotp', verifyToken, isClient, authController.sendOTPresetPass);
router.post(
    '/resetpass',
    authValidation.resetPassword,
    validationError,
    verifyToken,
    isClient,
    authController.resetPassword,
);
//forgot password
router.post(
    '/sendotp-forgotpass',
    authValidation.validateCheckEmail,
    validationError,
    authController.sendOTPforgotPass,
);
router.post(
    '/checkotp-forgotpass',
    authValidation.validateCheckOTP,
    validationError,
    authController.checkOTPforgotPass,
);

export default router;
