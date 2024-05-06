import { body } from 'express-validator';
import isEmail from 'validator/lib/isEmail.js';

import Exception from '../../exceptions/Exception.js';

const validateRegister = [
    body('email')
        .trim()
        .not()
        .isEmpty()
        .custom((value, { req }) => {
            return isEmail(value);
        })
        .withMessage(Exception.INVALID_EMAIL),
    body('password')
        .trim()
        .not()
        .isEmpty()
        .custom((value, { req }) => {
            return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/.test(value);
        })
        .withMessage(Exception.INVALID_PASSWORD),
    body('phoneNumber')
        .trim()
        .not()
        .isEmpty()
        .custom((value, { req }) => {
            return /^\d{10}$/.test(value);
        })
        .withMessage(Exception.INVALID_PHONENUMBER),
];

const validateLogin = [
    body('email')
        .trim()
        .not()
        .isEmpty()
        .custom((value, { req }) => {
            return isEmail(value);
        })
        .withMessage(Exception.INVALID_EMAIL),
    body('password')
        .trim()
        .not()
        .isEmpty()
        .custom((value, { req }) => {
            return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/.test(value);
        })
        .withMessage(Exception.INVALID_PASSWORD),
];

const validatePrefreshToken = [body('token').trim().not().isEmpty()];

const validateCheckEmail = [
    body('email')
        .trim()
        .not()
        .isEmpty()
        .custom((value, { req }) => {
            return isEmail(value);
        })
        .withMessage(Exception.INVALID_EMAIL),
];

const validateCheckOTP = [
    body('email')
        .trim()
        .not()
        .isEmpty()
        .custom((value, { req }) => {
            return isEmail(value);
        })
        .withMessage(Exception.INVALID_EMAIL),
    body('otp').trim().not().isEmpty().withMessage(Exception.INVALID_OTP),
];

const resetPassword = [
    body('oldpass')
        .trim()
        .not()
        .isEmpty()
        .custom((value, { req }) => {
            return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/.test(value);
        })
        .withMessage(Exception.INVALID_PASSWORD),
    body('newpass')
        .trim()
        .not()
        .isEmpty()
        .custom((value, { req }) => {
            return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/.test(value);
        })
        .withMessage(Exception.INVALID_PASSWORD),
    body('checknewpass')
        .trim()
        .not()
        .isEmpty()
        .custom((value, { req }) => {
            return value === req.body.newpass;
        })
        .withMessage(Exception.NEW_PASS_NOT_VALID),
];

const forgetpass = [
    body('email')
        .trim()
        .not()
        .isEmpty()
        .custom((value, { req }) => {
            return isEmail(value);
        })
        .withMessage(Exception.INVALID_EMAIL),
    body('newpass')
        .trim()
        .not()
        .isEmpty()
        .custom((value, { req }) => {
            return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/.test(value);
        })
        .withMessage(Exception.INVALID_PASSWORD),
    body('checknewpass')
        .trim()
        .not()
        .isEmpty()
        .custom((value, { req }) => {
            return value === req.body.newpass;
        })
        .withMessage(Exception.NEW_PASS_NOT_VALID),
];

export default {
    validateRegister,
    validateLogin,
    validatePrefreshToken,
    validateCheckEmail,
    validateCheckOTP,
    resetPassword,
    forgetpass,
};
