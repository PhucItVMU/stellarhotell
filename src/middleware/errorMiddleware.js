import { OutputTypeDebug, printDebug } from '../helpers/printDebug.js';
import { OutputType, print } from '../helpers/print.js';
import HttpStatusCode from '../exceptions/HttpStatusCode.js';
import { STATUS } from '../global/constants.js';

const notFound = (req, res, next) => {
    const err = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(err);
};

const errorMiddleware = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    switch (statusCode) {
        case HttpStatusCode.BAD_REQUEST:
            res.json({
                status: STATUS.ERROR,
                title: 'Bad Request',
                message: err.message,
            });
            break;
        case HttpStatusCode.NOT_FOUND:
            res.json({
                status: STATUS.ERROR,
                title: 'Not Found',
                message: err.message,
            });
            break;
        case HttpStatusCode.UNAUTHORIZED:
            res.json({
                status: STATUS.ERROR,
                title: 'Unauthorized',
                message: err.message,
            });
            break;
        case HttpStatusCode.FORBIDDEN:
            res.json({
                status: STATUS.ERROR,
                title: 'Forbidden',
                message: err.message,
            });
            break;
        case HttpStatusCode.INTERNAL_SERVER_ERROR:
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
                status: STATUS.ERROR,
                title: 'Internal Server Error',
                message: err.message,
            });
            break;
        default:
            print('No Error!!!', OutputTypeDebug.INFORMATION);
            break;
    }
    printDebug(err.stack, OutputTypeDebug.ERROR);
    print(`Error massage: ${err.message}`, OutputType.ERROR);
};

export { notFound, errorMiddleware };
