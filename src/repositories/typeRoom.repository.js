import { roomModel, typeRoomModel } from '../models/index.js';
import Exception from '../exceptions/Exception.js';
import { OutputTypeDebug, printDebug } from '../helpers/printDebug.js';

const filterTypeRooms = async ({ page, size, searchString }) => {
    const filterTypeRooms = await typeRoomModel.aggregate([
        {
            $match: {
                $or: [
                    {
                        name: { $regex: `.*${searchString}.*`, $options: 'i' },
                    },
                ],
            },
        },
        {
            $skip: (page - 1) * size,
        },
        {
            $limit: Number(size),
        },
        {
            $project: {
                name: 1,
                image: 1,
                description: 1,
            },
        },
    ]);

    if (!filterTypeRooms) {
        throw new Exception(Exception.DATA_RETRIEVAL_FAILED);
    }

    return filterTypeRooms;
};

const getTypeRoomById = async (idTypeRoom) => {
    const existingTypeRoom = await typeRoomModel.findById(idTypeRoom).exec();
    if (!existingTypeRoom) {
        throw new Exception(Exception.TYPE_ROOM_NOT_EXIST);
    }
    return {
        id: existingTypeRoom._id,
        name: existingTypeRoom.name,
        image: existingTypeRoom.image,
        description: existingTypeRoom.description,
    };
};

const getTypeRoomNames = async () => {
    return await typeRoomModel
        .find({}, { _id: 1, name: 1 })
        .exec()
        .catch((exception) => {
            printDebug(`${exception.message}`, OutputTypeDebug.ERROR);
            throw new Exception(Exception.GET_LIST_TYPE_ROOMS_NAME_FAILED);
        });
};

const updateTypeRoom = async (idTypeRoom, link_img) => {
    const existingTypeRoom = await typeRoomModel
        .findByIdAndUpdate(idTypeRoom, {
            image: link_img ?? existingTypeRoom.image,
        })
        .exec();
    if (!existingTypeRoom) {
        throw new Exception(Exception.TYPE_ROOM_NOT_EXIST);
    }
    return {
        id: existingTypeRoom._id,
        name: existingTypeRoom.name,
        image: existingTypeRoom.image,
        description: existingTypeRoom.description,
    };
};

const getTotalTyperooms = async () => {
    return await typeRoomModel
        .find({})
        .exec()
        .then((results) => {
            return results.reduce((partialSum, a) => partialSum + 1, 0);
        })
        .catch((exception) => {
            printDebug(`${exception.message}`, OutputTypeDebug.ERROR);
            throw new Exception(Exception.GET_TOTAL_TYPE_ROOMS_FAILED);
        });
};

const getListTotalRoomsByTypeRoom = async () => {
    return await roomModel
        .find({}, { _id: 1, typeRoom: 1 })
        .populate({ path: 'typeRoom', select: { _id: 0, name: 1 } })
        .exec()
        .then((results) => {
            const typeRooms = results
                .map((result) => {
                    return result.typeRoom.name;
                })
                .filter((item, index, array) => array.indexOf(item) === index);

            return typeRooms.map((typeRoom) => {
                return {
                    typeRoom,
                    totalRoom: results.reduce((sum, result) => {
                        if (result.typeRoom.name === typeRoom) {
                            return sum + 1;
                        }
                        return sum;
                    }, 0),
                };
            });
        })
        .catch((exception) => {
            printDebug(`${exception.message}`, OutputTypeDebug.ERROR);
            throw new Exception(Exception.GET_LIST_TOAL_ROOMS_BY_TYPE_ROOM_FAILED);
        });
};

export default {
    filterTypeRooms,
    getTypeRoomNames,
    updateTypeRoom,
    getTotalTyperooms,
    getListTotalRoomsByTypeRoom,
    getTypeRoomById,
};
