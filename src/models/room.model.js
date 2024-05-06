import mongoose from 'mongoose';
import { TYPE_BED, ROOM_STATUS, COLLECTION } from '../global/constants.js';

const roomSchema = new mongoose.Schema(
    {
        typeRoom: {
            type: mongoose.Schema.Types.ObjectId,
            ref: COLLECTION.TYPE_ROOMS,
            index: false,
        },
        roomNumber: {
            type: Number,
            unique: true,
            required: true,
        },
        acreage: {
            type: Number,
            required: true,
        },
        typeBed: {
            type: String,
            required: true,
            enum: {
                values: [TYPE_BED.SINGLE_BED, TYPE_BED.DOUBLE_BED],
                massage: '{VALUE} is not supported',
            },
        },
        view: {
            type: String,
        },
        prices: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum: {
                values: [ROOM_STATUS.AVAILABLE, ROOM_STATUS.BOOKED, ROOM_STATUS.USING],
                massage: '{VALUE} is not supported',
            },
            default: ROOM_STATUS.AVAILABLE,
        },
    },
    {
        timestamps: {
            currentTime: () => new Date().getTime(),
        },
    },
);

export default mongoose.model('Rooms', roomSchema);
