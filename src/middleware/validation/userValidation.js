import { body, query } from 'express-validator';
import Exception from '../../exceptions/Exception.js';

const updateUserValidation = [
    body('email')
        .trim()
        .not()
        .isEmpty()
        .custom((value, { req }) => {
            return isEmail(value);
        })
        .withMessage(Exception.INVALID_EMAIL),
    body ('phoneNumber')
        .trim()
        .not()
        .isEmpty()
        .custom((value, { req }) => {
            return /^\d{10}$/.test(value);
        })
        .withMessage(Exception.INVALID_PHONENUMBER),
    body('userName')
        .trim() 
        .not()
        .isEmpty()
        .custom((value, { req }) =>  {
            if (!/^[a-zA-Z0-9 ]+$/.test(value)) {
                throw new Error('Tên không được chứa ký tự đặt biệt.');
            }
            return true;})

];
export default { updateUserValidation };