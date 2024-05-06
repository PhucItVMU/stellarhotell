import mongoose from 'mongoose';

import { STATUS_BOOKING, COLLECTION } from '../global/constants.js';

const bookingRoomSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: COLLECTION.USERS,

            index: false,
        },
        typeRoom: {
            type: mongoose.Schema.Types.ObjectId,
            ref: COLLECTION.TYPE_ROOMS,
            index: false,
        },
        rooms: {
            type: [Number],
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            default: 0,
        },
        totalprice: {
            type: Number,
            required: true,
            default: 0,
        },
        status: {
            type: String,
            enum: {
                values: [STATUS_BOOKING.BOOKED, STATUS_BOOKING.PAID, STATUS_BOOKING.CANCELLED],
                message: '{VALUE} is not supported',
            },
            default: STATUS_BOOKING.BOOKED,
        },
        checkinDate: {
            type: Date,
            required: true,
        },
        checkoutDate: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: {
            currentTime: () => new Date().getTime(),
        },
    },
);

export default mongoose.model('BookingRooms', bookingRoomSchema);
