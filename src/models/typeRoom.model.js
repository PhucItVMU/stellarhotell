import mongoose from 'mongoose';
import { TYPE_ROOMS, URL_ROOM_DEFAULT, DESCRIPTION_ROOM } from '../global/constants.js';

const typeRoomSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            enum: {
                values: [
                    TYPE_ROOMS.SUPERIOR_DOUBLE_OR_TWIN_ROOM,
                    TYPE_ROOMS.DELUXE_DOUBLE_ROOM,
                    TYPE_ROOMS.EXECUTIVE_CITY_VIEW_ROOM,
                    TYPE_ROOMS.SUITE_GARDEN_ROOM,
                ],
                massage: '{VALUE} is not supported',
            },
        },
        image: {
            type: [String],
            required: true,
            default: URL_ROOM_DEFAULT,
        },
        capacity: {
            type: String,
            required: true,
            default: '2 người lớn',
        },
        description: {
            type: String,
            required: true,
            enum: {
                values: [
                    DESCRIPTION_ROOM.SUPERIOR_DOUBLE_OR_TWIN_ROOM,
                    DESCRIPTION_ROOM.DELUXE_DOUBLE_ROOM,
                    DESCRIPTION_ROOM.EXECUTIVE_CITY_VIEW_ROOM,
                    DESCRIPTION_ROOM.SUITE_GARDEN_ROOM,
                ],
                massage: '{VALUE} is not supported',
            },
        },
    },
    {
        timestamps: {
            currentTime: () => new Date().getTime(),
        },
    },
);

export default mongoose.model('TypeRooms', typeRoomSchema);
