import asyncHandler from 'express-async-handler';
import { authRepository } from '../repositories/index.js';
import HttpStatusCode from '../exceptions/HttpStatusCode.js';
import { STATUS } from '../global/constants.js';

const register = asyncHandler(async (req, res) => {
    const { email, password, phoneNumber } = req.body;

    await authRepository.register({ email, password, phoneNumber });

    res.status(HttpStatusCode.INSERT_OK).json({
        status: STATUS.SUCCESS,
        message: 'Register Account successfully',
    });
});

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const existingAccount = await authRepository.login({ email, password });
    res.status(HttpStatusCode.OK).json({
        status: STATUS.SUCCESS,
        message: 'Login successfully',
        data: existingAccount,
    });
});

const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const existingAccount = await authRepository.loginAdmin({ email, password });
    res.status(HttpStatusCode.OK).json({
        status: STATUS.SUCCESS,
        message: 'Login successfully',
        data: existingAccount,
    });
});

const prefreshToken = asyncHandler(async (req, res) => {
    const { token } = req.body;
    // const userId = req.userId;

    const prefreshToken = await authRepository.prefreshToken({ token });

    res.status(HttpStatusCode.OK).json({
        status: STATUS.SUCCESS,
        message: 'Refresh Token successfully',
        data: prefreshToken,
    });
});

const logout = asyncHandler(async (req, res) => {
    const userId = req.userId;
    await authRepository.logout({ userId });

    res.status(HttpStatusCode.OK).json({
        status: STATUS.SUCCESS,
        message: 'Logout successfully',
    });
});

//reset password
const sendOTPresetPass = asyncHandler(async (req, res) => {
    const userId = req.userId;

    const result = await authRepository.sendOTPresetPass({ userId });

    res.status(HttpStatusCode.OK).json({
        status: STATUS.SUCCESS,
        message: 'Send OTP successfully.',
        data: result,
    });
});

const resetPassword = asyncHandler(async (req, res) => {
    const { oldpass, newpass, otp } = req.body;
    const userId = req.userId;
    const result = await authRepository.resetPassword(userId, oldpass, newpass, otp);
    res.status(HttpStatusCode.OK).json({
        status: STATUS.SUCCESS,
        message: 'Reset Password successfully.',
        data: result,
    });
});

//forgot password
const sendOTPforgotPass = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const result = await authRepository.sendOTPforgotPass({ email });

    res.status(HttpStatusCode.OK).json({
        status: STATUS.SUCCESS,
        message: 'Send OTP successfully.',
        data: result,
    });
});

const checkOTPforgotPass = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    const result = await authRepository.checkOTPforgotPass({ email, otp });

    res.status(HttpStatusCode.OK).json({
        status: STATUS.SUCCESS,
        message: 'Check OTP successfully.',
        data: result,
    });
});


export default {
    register,
    login,
    loginAdmin,
    prefreshToken,
    logout,
    sendOTPresetPass,
    resetPassword,
    sendOTPforgotPass,
    checkOTPforgotPass,
};
