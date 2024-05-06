import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import asyncHandler from 'express-async-handler';
import HttpStatusCode from '../exceptions/HttpStatusCode.js';
import Exception from '../exceptions/Exception.js';
import { printDebug, OutputTypeDebug } from '../helpers/printDebug.js';

const verifyToken = (req, res, next) => {
    const token = req.headers?.authorization?.split(' ')[1] || req.headers?.Authorization?.split(' ')[1];

    if (!token) {
        printDebug('Token không hợp lệ!', OutputTypeDebug.INFORMATION);
        res.status(HttpStatusCode.UNAUTHORIZED);
        throw new Exception(Exception.USER_NOT_AUTHORIZED_OR_TOKEN_MISSING);
    }

    jwt.verify(token, process.env.JWT_SECRET_ACCESS, (err, decoded) => {
        if (err || !decoded.user) {
            printDebug('Xác thực token không thành công!', OutputTypeDebug.INFORMATION);
            res.status(HttpStatusCode.UNAUTHORIZED);
            throw new Exception(Exception.USER_NOT_AUTHORIZED_OR_TOKEN_MISSING);
        }

        req.role = decoded.user.role;
        req.userId = decoded.user.userId;
        printDebug(`role: ${req.role}`, OutputTypeDebug.INFORMATION);
        printDebug(`userIs: ${req.userId}`, OutputTypeDebug.INFORMATION);
    });

    next();
};

const isAdmin = asyncHandler(async (req, res, next) => {
    // Giải mã role
    let isMatched = await bcrypt.compare(process.env.ADMIN, req.role);
    printDebug(`CLIENT: ${process.env.ADMIN}`, OutputTypeDebug.INFORMATION);
    printDebug(`isMatched: ${isMatched}`, OutputTypeDebug.INFORMATION);
    if (!isMatched) {
        printDebug('Xác thực Admin không thành công!', OutputTypeDebug.INFORMATION);
        res.status(HttpStatusCode.UNAUTHORIZED);
        throw new Exception(Exception.USER_NOT_AUTHORIZED_OR_TOKEN_MISSING);
    }
    printDebug('Xác thực Admin thành công!', OutputTypeDebug.INFORMATION);
    next();
});

const isClient = asyncHandler(async (req, res, next) => {
    // Giải mã role
    let isMatched = await bcrypt.compare(process.env.CLIENT, req.role);
    printDebug(`CLIENT: ${process.env.CLIENT}`, OutputTypeDebug.INFORMATION);
    printDebug(`isMatched: ${isMatched}`, OutputTypeDebug.INFORMATION);
    if (!isMatched) {
        printDebug('Xác thực Client không thành công!', OutputTypeDebug.INFORMATION);
        res.status(HttpStatusCode.UNAUTHORIZED);
        throw new Exception(Exception.USER_NOT_AUTHORIZED_OR_TOKEN_MISSING);
    }
    printDebug('Xác thực Client thành công!', OutputTypeDebug.INFORMATION);
    next();
});

export { verifyToken, isAdmin, isClient };
