import mongoose from 'mongoose';
import {STATUS_CONFERENCES} from '../global/constants.js';

const conferenceSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
        },
        message: {
            type: String,
        },
        status: {
            type: String,
            enum: [STATUS_CONFERENCES.PENDING, STATUS_CONFERENCES.SOVLED],
            default: STATUS_CONFERENCES.PENDING,
        }
    },
    {
        timestamps: {
            currentTime: () => new Date().getTime(),
        },
    },
);

export default mongoose.model('Conference', conferenceSchema);
