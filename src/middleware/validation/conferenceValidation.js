import { body } from 'express-validator';
import isEmail from 'validator/lib/isEmail.js';
import Exception from '../../exceptions/Exception.js';

const validateCreateContact = [
    body('email')
    .trim()
    .not()
    .isEmpty()
    .custom((value, { req }) => {
        return isEmail(value);
    })
    .withMessage(Exception.INVALID_EMAIL),

    body('phoneNumber')
    .trim()
    .not()
    .isEmpty()
    .custom((value, { req }) => {
        return /^\d{10}$/.test(value);
    })
    .withMessage(Exception.INVALID_PHONENUMBER),
]

export default { validateCreateContact };
