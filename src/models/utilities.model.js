import mongoose from 'mongoose';
import { URL_ROOM_DEFAULT } from '../global/constants.js';
import { DEFAULT_UTILITIES } from '../global/constants.js'

const utilitiesSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        image: {
            type: [String],
            required: true,
            default: URL_ROOM_DEFAULT
        },
        description: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: {
                values: [DEFAULT_UTILITIES.RES, DEFAULT_UTILITIES.UTILITIES],
                message: '{VALUE} is not supported',
            },
        }
    },
    {
        timestamps: {
            currentTime: () => new Date().getTime(),
        },
    },
);

export default mongoose.model('Utilities', utilitiesSchema);
