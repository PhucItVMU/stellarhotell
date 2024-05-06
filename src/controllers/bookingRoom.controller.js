import asyncHandler from 'express-async-handler';
import { bookingRoomRepository } from '../repositories/index.js';
import HttpStatusCode from '../exceptions/HttpStatusCode.js';
import { STATUS, MAX_RECORDS } from '../global/constants.js';
import { dateTimeInputFormat, DateStrFormat } from '../helpers/timezone.js';
import { printDebug, OutputTypeDebug } from '../helpers/printDebug.js';
import { query } from 'express';

const bookingRoom = asyncHandler(async (req, res) => {
    const userId = req.userId;
    const checkinDate = dateTimeInputFormat(req.body.checkinDate + ' 12:00', DateStrFormat.DATE_AND_TIME);
    const checkoutDate = dateTimeInputFormat(req.body.checkoutDate + ' 12:00', DateStrFormat.DATE_AND_TIME);
    printDebug(`checkinDate format: ${checkinDate}`, OutputTypeDebug.INFORMATION);
    printDebug(`checkoutDate format: ${checkoutDate}`, OutputTypeDebug.INFORMATION);
    const { typeRoom, quantity, acreage, typeBed, view, prices } = req.body;

    const booking = await bookingRoomRepository.bookingRoom({
        userId,
        checkinDate,
        checkoutDate,
        typeRoom,
        quantity,
        acreage,
        typeBed,
        view,
        prices,
    });

    res.status(HttpStatusCode.INSERT_OK).json({
        status: STATUS.SUCCESS,
        message: 'Booking room successful',
        data: booking,
    });
});

const getTotalPrices = asyncHandler(async (req, res) => {
    const checkinDate = dateTimeInputFormat(req.query.checkinDate + ' 12:00', DateStrFormat.DATE_AND_TIME);
    const checkoutDate = dateTimeInputFormat(req.query.checkoutDate + ' 12:00', DateStrFormat.DATE_AND_TIME);
    printDebug(`checkinDate format: ${checkinDate}`, OutputTypeDebug.INFORMATION);
    printDebug(`checkoutDate format: ${checkoutDate}`, OutputTypeDebug.INFORMATION);
    const { typeRoom, quantity, acreage, typeBed, view, prices } = req.query;

    const totoaPrices = await bookingRoomRepository.getTotalPrices({
        checkinDate,
        checkoutDate,
        typeRoom,
        quantity,
        acreage,
        typeBed,
        view,
        prices,
    });

    res.status(HttpStatusCode.OK).json({
        status: STATUS.SUCCESS,
        message: 'Get total prices successfully',
        data: totoaPrices,
    });
});

const getTransactionHistory = asyncHandler(async (req, res) => {
    const userId = req.userId;
    let { page = 1, size = MAX_RECORDS } = req.query;
    size = size >= MAX_RECORDS ? MAX_RECORDS : size;

    const existingBookingRooms = await bookingRoomRepository.getTransactionHistory({ userId, page, size });

    res.status(HttpStatusCode.OK).json({
        status: STATUS.SUCCESS,
        message: 'Get a list of successful transaction history',
        data: existingBookingRooms,
    });
});

const getTransactionHistoryForAdmin = asyncHandler(async (req, res) => {
    let { userId, page = 1, size = MAX_RECORDS } = req.query;
    size = size >= MAX_RECORDS ? MAX_RECORDS : size;

    const existingBookingRooms = await bookingRoomRepository.getTransactionHistoryForAdmin({ userId, page, size });

    res.status(HttpStatusCode.OK).json({
        status: STATUS.SUCCESS,
        message: 'Get a list of successful transaction history',
        data: existingBookingRooms,
    });
});

const getTotalTransactionHistory = asyncHandler(async (req, res) => {
    const userId = req.userId;

    const existingBookingRooms = await bookingRoomRepository.getTotalTransactionHistory({ userId });

    res.status(HttpStatusCode.OK).json({
        status: STATUS.SUCCESS,
        message: 'Get total list of successful transaction history',
        data: existingBookingRooms,
    });
});

const getTotalTransactionHistoryForAdmin = asyncHandler(async (req, res) => {
    const { userId } = req.query;

    const existingBookingRooms = await bookingRoomRepository.getTotalTransactionHistoryForAdmin({ userId });

    res.status(HttpStatusCode.OK).json({
        status: STATUS.SUCCESS,
        message: 'Get total list of successful transaction history',
        data: existingBookingRooms,
    });
});

const getAllTransactionHistory = asyncHandler(async (req, res) => {
    let { page = 1, size = MAX_RECORDS, searchString = '' } = req.query;
    size = size >= MAX_RECORDS ? MAX_RECORDS : size;

    const existingBookingRooms = await bookingRoomRepository.getAllTransactionHistory({ page, size, searchString });

    res.status(HttpStatusCode.OK).json({
        status: STATUS.SUCCESS,
        message: 'Get a complete list of successful transaction history',
        data: existingBookingRooms,
    });
});

const getTotalAllTransactionHistory = asyncHandler(async (req, res) => {
    const existingBookingRooms = await bookingRoomRepository.getTotalAllTransactionHistory();

    res.status(HttpStatusCode.OK).json({
        status: STATUS.SUCCESS,
        message: 'Get total list of successful transaction history',
        data: existingBookingRooms,
    });
});

const getTransactionHistoryById = asyncHandler(async (req, res) => {
    const { idBooking } = req.query;
    const exsitBooking = await bookingRoomRepository.getTransactionHistoryById({ idBooking });

    res.status(HttpStatusCode.OK).json({
        status: STATUS.SUCCESS,
        message: 'Get list of successful transaction history by id',
        data: exsitBooking,
    });
});

const createPayment = asyncHandler(async (req, res) => {
    const { orderId, bankCode } = req.body;
    const result = await bookingRoomRepository.createPayment({ orderId, bankCode });
    res.status(HttpStatusCode.OK).json({
        status: STATUS.SUCCESS,
        message: 'Create Payment successfully.',
        data: result,
    });
});
const vnpayReturn = asyncHandler(async (req, res) => {
    var vnp_Params = req.query;
    console.log(res);

    await bookingRoomRepository.vnpayReturn(vnp_Params, res);

    res.redirect('https://fe-stellar.vercel.app/danh-sach-giao-dich');
});

const getSalesStatistics = asyncHandler(async (req, res) => {
    const startDate = dateTimeInputFormat(req.query.startDate + ' 12:00', DateStrFormat.DATE_AND_TIME);
    const endDate = dateTimeInputFormat(req.query.endDate + ' 12:00', DateStrFormat.DATE_AND_TIME);
    printDebug(`startDate format: ${startDate}`, OutputTypeDebug.INFORMATION);
    printDebug(`endDate format: ${endDate}`, OutputTypeDebug.INFORMATION);

    let existingBookingRooms = await bookingRoomRepository.getSalesStatistics({
        startDate,
        endDate,
    });

    res.status(HttpStatusCode.OK).json({
        status: STATUS.SUCCESS,
        message: 'Get sales statistics successfully',
        data: existingBookingRooms,
    });
});

export default {
    bookingRoom,
    getTotalPrices,
    getTransactionHistory,
    getTransactionHistoryForAdmin,
    getAllTransactionHistory,
    getTotalTransactionHistoryForAdmin,
    getTotalTransactionHistory,
    getTotalAllTransactionHistory,
    getTransactionHistoryById,
    createPayment,
    vnpayReturn,
    getSalesStatistics,
};
