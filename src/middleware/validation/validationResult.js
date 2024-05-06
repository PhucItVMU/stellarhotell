import { validationResult } from 'express-validator';
import HttpStatusCode from '../../exceptions/HttpStatusCode.js';
import Exception from '../../exceptions/Exception.js';

export default function validationError(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(HttpStatusCode.BAD_REQUEST);
        throw new Exception(errors.array()[0].msg);
    }
    next();
}
