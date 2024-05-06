import asyncHandler from 'express-async-handler';
import { roomRepository } from '../repositories/index.js';
import HttpStatusCode from '../exceptions/HttpStatusCode.js';
import { STATUS, MAX_RECORDS } from '../global/constants.js';
import { dateTimeInputFormat, DateStrFormat } from '../helpers/timezone.js';
import { printDebug, OutputTypeDebug } from '../helpers/printDebug.js';

const createRoom = asyncHandler(async (req, res) => {
    const { idTypeRoom, roomNumber, acreage, typeBed, view, prices } = req.body;

    await roomRepository.createRoom({
        idTypeRoom,
        roomNumber,
        acreage,
        typeBed,
        view,
        prices,
    });

    res.status(HttpStatusCode.INSERT_OK).json({
        status: STATUS.SUCCESS,
        message: 'Add Room successfully.',
    });
});

const updateRoom = asyncHandler(async (req, res) => {
    const { id, roomNumber, acreage, typeBed, view, prices } = req.body;

    const result = await roomRepository.updateRoom({ id, roomNumber, acreage, typeBed, view, prices });

    res.status(HttpStatusCode.OK).json({
        status: STATUS.SUCCESS,
        message: 'Update Room successfully.',
        data: result,
    });
});

const getNumberAvailableRooms = asyncHandler(async (req, res) => {
    const { typeRoom, acreage, typeBed, view, prices } = req.query;
    const checkinDate = dateTimeInputFormat(req.query.checkinDate + ' 12:00', DateStrFormat.DATE_AND_TIME);
    const checkoutDate = dateTimeInputFormat(req.query.checkoutDate + ' 12:00', DateStrFormat.DATE_AND_TIME);
    printDebug(`checkinDate format: ${checkinDate}`, OutputTypeDebug.INFORMATION);
    printDebug(`checkoutDate format: ${checkoutDate}`, OutputTypeDebug.INFORMATION);

    const existingRooms = await roomRepository.getNumberAvailableRooms({
        typeRoom,
        checkinDate,
        checkoutDate,
        acreage,
        typeBed,
        view,
        prices,
    });

    res.status(HttpStatusCode.OK).json({
        status: STATUS.SUCCESS,
        message: 'Get the successful room list!',
        data: existingRooms,
    });
});

const getNumberStatusRooms = asyncHandler(async (req, res) => {
    const date = dateTimeInputFormat(req.query.date + ' 12:00', DateStrFormat.DATE_AND_TIME);
    const { typeRoom = '' } = req.query;
    printDebug(`date: ${date}`, OutputTypeDebug.INFORMATION);
    printDebug(`typeRoom: ${typeRoom}`, OutputTypeDebug.INFORMATION);

    const existingRooms = await roomRepository.getNumberStatusRooms({
        date,
        typeRoom,
    });

    res.status(HttpStatusCode.OK).json({
        status: STATUS.SUCCESS,
        message: 'Get number status available rooms successfully!',
        data: existingRooms,
    });
});

const getParametersRoom = asyncHandler(async (req, res) => {
    const { typeRoom } = req.query;
    const existingRooms = await roomRepository.getParametersRoom({
        typeRoom,
    });

    res.status(HttpStatusCode.OK).json({
        status: STATUS.SUCCESS,
        message: 'Get the list of room Parameters successfully!',
        data: existingRooms,
    });
});

const getRoomsByTypeRoom = asyncHandler(async (req, res) => {
    const userId = req.userId;

    let { page = 1, size = MAX_RECORDS, searchString = '', typeRoom } = req.query;
    size = size >= MAX_RECORDS ? MAX_RECORDS : size;

    const existingRooms = await roomRepository.getRoomsByTypeRoom({
        userId,
        typeRoom,
        page,
        size,
        searchString,
    });

    res.status(HttpStatusCode.OK).json({
        status: STATUS.SUCCESS,
        message: 'Get the successful room list by type room!',
        data: existingRooms,
    });
});

const getRoomById = asyncHandler(async (req, res) => {
    const { id } = req.query;
    const existingRoom = await roomRepository.getRoomById({ id });
    res.status(HttpStatusCode.OK).json({
        status: STATUS.SUCCESS,
        message: 'Get room by id successfully!',
        data: existingRoom,
    });
});

const deleteRoom = asyncHandler(async (req, res) => {
    const id = req.query.id;
    await roomRepository.deleteRoom(id);
    res.status(HttpStatusCode.OK).json({
        status: STATUS.SUCCESS,
        message: 'Delete room successfully!',
    });
});

export default {
    createRoom,
    updateRoom,
    getNumberAvailableRooms,
    getNumberStatusRooms,
    getParametersRoom,
    getRoomsByTypeRoom,
    getRoomById,
    deleteRoom,
};
