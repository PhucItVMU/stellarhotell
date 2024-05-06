import { roomModel, typeRoomModel, bookingRoomModel, userModel } from '../models/index.js';
import Exception from '../exceptions/Exception.js';
import { TYPE_BED } from '../global/constants.js';
import { OutputTypeDebug, printDebug } from '../helpers/printDebug.js';

import { dDate, dateTimeOutputFormat, DateStrFormat } from '../helpers/timezone.js';

const getNumberAvailableRooms = async ({ typeRoom, checkinDate, checkoutDate, acreage, typeBed, view, prices }) => {
    // Kiểm tra có tồn tại loại phòng không
    const existingTypeRoom = await typeRoomModel.findById(typeRoom);
    if (!existingTypeRoom) {
        printDebug('Không tồn tại loại phòng', OutputTypeDebug.INFORMATION);
        throw new Exception(Exception.GET_NUMBER_AVAILABLE_ROOMS_FAILED);
    }

    let parameters = { typeRoom: existingTypeRoom._id };
    if (acreage) {
        parameters = { ...parameters, acreage };
    }
    if (typeBed) {
        parameters = { ...parameters, typeBed };
    }
    if (view) {
        parameters = { ...parameters, view };
    }
    if (prices) {
        parameters = { ...parameters, prices };
    }

    // Lấy só lượng phòng theo mã phòng
    const getListRoomsByParameters = await roomModel
        .find(parameters, { _id: 0, roomNumber: 1 })
        .sort({ roomNumber: 1 })
        .exec()
        .then((elements) => {
            return elements.map((element) => element.roomNumber);
        })
        .catch((exception) => {
            printDebug('Lấy danh sách phòng cần đặt không thành công', OutputTypeDebug.INFORMATION);
            printDebug(`${exception.message}`, OutputTypeDebug.ERROR);
            throw new Exception(Exception.GET_NUMBER_AVAILABLE_ROOMS_FAILED);
        });
    printDebug(`getListRoomsByParameters: ${getListRoomsByParameters}`, OutputTypeDebug.INFORMATION);

    const getListRoomsBookedByDate = await bookingRoomModel
        .find(
            {
                $and: [
                    {
                        typeRoom: existingTypeRoom.id,
                    },
                    {
                        $or: [
                            {
                                checkinDate: { $gt: checkinDate, $lt: checkoutDate },
                                checkoutDate: { $gte: checkoutDate },
                            },
                            {
                                checkinDate: { $lte: checkinDate },
                                checkoutDate: { $gte: checkoutDate },
                            },
                            {
                                checkinDate: { $lte: checkinDate },
                                checkoutDate: { $gt: checkinDate, $lt: checkoutDate },
                            },
                            {
                                checkinDate: { $gt: checkinDate },
                                checkoutDate: { $lt: checkoutDate },
                            },
                        ],
                    },
                ],
            },
            { _id: 0, rooms: 1 },
        )
        .exec()
        .then((elements) => {
            let idRooms = [];
            elements.map((element) => idRooms.push(...element.rooms));
            return idRooms;
        })
        .catch((exception) => {
            printDebug('Lấy danh sách phòng đã đặt không thành công', OutputTypeDebug.INFORMATION);
            printDebug(`${exception.message}`, OutputTypeDebug.ERROR);
            throw new Exception(Exception.GET_NUMBER_AVAILABLE_ROOMS_FAILED);
        });

    printDebug(`getListRoomsBookedByDate: ${getListRoomsBookedByDate}`, OutputTypeDebug.INFORMATION);

    const getListAvailableRooms = getListRoomsByParameters.filter((item) => !getListRoomsBookedByDate.includes(item));
    printDebug(`getListAvailableRooms: ${getListAvailableRooms}`, OutputTypeDebug.INFORMATION);
    const d = dDate(checkinDate, checkoutDate);
    return { result: getListAvailableRooms.length, dDate: d };
};

const getParametersRoom = async ({ typeRoom }) => {
    const existingTypeRoom = await typeRoomModel.findById(typeRoom);
    if (!existingTypeRoom) {
        printDebug('Không tồn tại loại phòng', OutputTypeDebug.INFORMATION);
        throw new Exception(Exception.GET_ACREAGE_ROOMS_FAILED);
    }

    const getParametersRoom = await roomModel
        .find({ typeRoom: existingTypeRoom.id }, { acreage: 1, typeBed: 1, view: 1, prices: 1 })
        .exec()
        .then((elements) => {
            const acreages = elements
                .map((element) => element.acreage)
                .filter((item, index, arr) => arr.indexOf(item) === index);

            const typeBeds = elements
                .map((element) => element.typeBed)
                .filter((item, index, arr) => arr.indexOf(item) === index);

            const views = elements
                .map((element) => element.view)
                .filter((item, index, arr) => arr.indexOf(item) === index);

            const prices = elements
                .map((element) => element.prices)
                .filter((item, index, arr) => arr.indexOf(item) === index);
            return { acreages, typeBeds, views, prices };
        })
        .catch((exception) => {
            printDebug('Lấy danh sách diện tích phòng không thành công!', OutputTypeDebug.INFORMATION);
            printDebug(`${exception.message}`, OutputTypeDebug.ERROR);
            throw new Exception(Exception.GET_ACREAGE_ROOMS_FAILED);
        });

    return getParametersRoom;
};

const getRoomsByTypeRoom = async ({ userId, typeRoom, page, size, searchString }) => {
    const existingUser = await userModel.findById(userId);
    if (!existingUser) {
        throw new Exception(Exception.GET_ROOMS_BY_TYPE_ROOM_FAILED);
    }

    let existingTypeRoom = await typeRoomModel.findById(typeRoom);
    if (!existingTypeRoom) {
        throw new Exception(Exception.GET_ROOMS_BY_TYPE_ROOM_FAILED);
    }

    page = parseInt(page);
    size = parseInt(size);

    const existingRooms = await roomModel
        .aggregate([
            {
                $match: {
                    $and: [
                        {
                            typeRoom: existingTypeRoom._id,
                        },
                        {
                            $or: [
                                {
                                    roomNumber: parseInt(searchString),
                                },
                                {
                                    acreage: parseInt(searchString),
                                },
                                {
                                    typeBed: { $regex: `.*${searchString}.*`, $options: 'i' },
                                },
                                {
                                    view: { $regex: `.*${searchString}.*`, $options: 'i' },
                                },
                                {
                                    prices: parseInt(searchString),
                                },
                            ],
                        },
                    ],
                },
            },
            {
                $skip: (page - 1) * size, // số phần tử bỏ qua
            },
            {
                $limit: size, // Giới hạn phần tử trong size
            },
            {
                $project: {
                    _id: 1,
                    typeRoom: 1,
                    roomNumber: 1,
                    price: 1,
                    acreage: 1,
                    typeBed: 1,
                    view: 1,
                    prices: 1,
                    createdAt: 1,
                    updatedAt: 1,
                },
            },
        ])
        .exec();

    if (!existingRooms) {
        throw new Exception(Exception.GET_ROOMS_BY_TYPE_ROOM_FAILED);
    }

    return existingRooms;
};

const createRoom = async ({ idTypeRoom, roomNumber, acreage, typeBed, view, prices }) => {
    let existingTypeRoom = await typeRoomModel.findById(idTypeRoom);

    if (!existingTypeRoom) {
        throw new Exception(Exception.TYPE_ROOM_NOT_EXIST);
    }

    let newroom = await roomModel.create({
        typeRoom: existingTypeRoom.id,
        roomNumber,
        acreage,
        typeBed,
        view,
        prices,
    });

    if (!newroom) {
        throw new Exception(Exception.CREATE_ROOM_FAILED);
    }
};

const updateRoom = async ({ id, roomNumber, acreage, typeBed, view, prices }) => {
    try {
        let existingRoom = await roomModel.findById(id);

        if (!existingRoom) {
            throw new Error('ROOM_NOT_EXIST');
        } else {
            existingRoom.roomNumber = roomNumber ?? existingRoom.roomNumber;
            existingRoom.acreage = acreage ?? existingRoom.acreage;
            existingRoom.typeBed = typeBed ?? existingRoom.typeBed;
            existingRoom.view = view ?? existingRoom.view;
            existingRoom.prices = prices ?? existingRoom.prices;

            await existingRoom.save();
        }
    } catch (error) {
        if (error.message === 'TYPE_ROOM_NOT_EXIST' || error.message === 'ROOM_NOT_EXIST') {
            throw error;
        } else {
            throw 'UPDATE_ROOM_FAILED';
        }
    }
};

const getNumberStatusRooms = async ({ date, typeRoom }) => {
    let getListRoomsParameters;
    let getListRoomsBookedByDateParameters;
    if (typeRoom === '') {
        getListRoomsParameters = {};
        getListRoomsBookedByDateParameters = {
            checkinDate: { $lte: date },
            checkoutDate: { $gte: date },
        };
    } else {
        const existingTypeRoom = await typeRoomModel.findById(typeRoom);
        if (!existingTypeRoom) {
            printDebug('Không tồn tại loại phòng', OutputTypeDebug.INFORMATION);
            throw new Exception(Exception.GET_NUMBER_AVAILABLE_ROOMS_FAILED);
        }
        getListRoomsParameters = { typeRoom: existingTypeRoom._id };
        getListRoomsBookedByDateParameters = {
            typeRoom: existingTypeRoom._id,
            checkinDate: { $lte: date },
            checkoutDate: { $gte: date },
        };
    }

    const getListRooms = await roomModel
        .find(getListRoomsParameters, { _id: 0, roomNumber: 1 })
        .sort({ roomNumber: 1 })
        .exec()
        .then((elements) => {
            return elements.map((element) => element.roomNumber);
        })
        .catch((exception) => {
            printDebug('Lấy danh sách phòng không thành công', OutputTypeDebug.INFORMATION);
            printDebug(`${exception.message}`, OutputTypeDebug.ERROR);
            throw new Exception(Exception.GET_NUMBER_AVAILABLE_ROOMS_FAILED);
        });
    printDebug(`getListRooms: ${getListRooms}`, OutputTypeDebug.INFORMATION);

    // Lâý danh sách phòng đã đặt theo ngày
    const getListRoomsBookedByDate = await bookingRoomModel
        .find(getListRoomsBookedByDateParameters, {
            _id: 0,
            rooms: 1,
        })
        .exec()
        .then((elements) => {
            let idRooms = [];
            elements.map((element) => idRooms.push(...element.rooms));
            return idRooms;
        })
        .catch((exception) => {
            printDebug('Lấy danh sách phòng đã đặt không thành công', OutputTypeDebug.INFORMATION);
            printDebug(`${exception.message}`, OutputTypeDebug.ERROR);
            throw new Exception(Exception.GET_NUMBER_AVAILABLE_ROOMS_FAILED);
        });

    printDebug(`getListRoomsBookedByDate: ${getListRoomsBookedByDate}`, OutputTypeDebug.INFORMATION);

    return {
        bookedRoomsNumber: getListRoomsBookedByDate.length,
        availableRoomsNumber: getListRooms.length - getListRoomsBookedByDate.length,
    };
};

const getRoomById = async ({ id }) => {
    return await roomModel
        .findById(id, { _id: 0, roomNumber: 1, acreage: 1, typeBed: 1, view: 1, prices: 1 })
        .catch((exception) => {
            printDebug(`${exception.message}`, OutputTypeDebug.ERROR);
            throw new Exception(Exception.GET_ROOM_BY_ID_FAILED);
        });
};

const deleteRoom = async (id) => {
    return await roomModel.findByIdAndDelete(id).catch((exception) => {
        printDebug(`${exception.message}`, OutputTypeDebug.ERROR);
        throw new Exception(Exception.DELETE_ROOM_FAILED);
    });
};

export default {
    getNumberAvailableRooms,
    getParametersRoom,
    getRoomsByTypeRoom,
    createRoom,
    updateRoom,
    getNumberStatusRooms,
    getRoomById,
    deleteRoom
};
