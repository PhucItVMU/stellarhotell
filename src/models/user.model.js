import mongoose from 'mongoose';
import isEmail from 'validator/lib/isEmail.js';
import * as dotenv from 'dotenv';

import Exception from '../exceptions/Exception.js';
import { DEFAULT_ROLES, DEFAULT_GENDER } from '../global/constants.js';

dotenv.config();
const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            validate: {
                validator: (email) => {
                    isEmail;
                },
                message: Exception.INVALID_EMAIL,
            },
        },
        password: {
            type: String,
            required: true,
            validate: {
                validator: (password) => {
                    return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/.test(password);
                },
                message: Exception.INVALID_PASSWORD,
            },
        },
        role: {
            type: String,
            enum: {
                values: [process.env.CLIENT, process.env.ADMIN],
                massage: '{VALUE} is not supported',
            },
            required: true,
            default: process.env.CLIENT,
        },
        userName: {
            type: String,
            required: true,
            default: 'Anonymous',
            trim: true,
            validate: {
                validator: (name) => {
                    return /^[\p{L}\s]*$/mu.test(name);
                },
                message: Exception.INVALID_USERNAME,
            },
        },
        phoneNumber: {
            type: String,
            required: true,
            validate: {
                validator: (phoneNumber) => {
                    return /^\d{10}$/.test(phoneNumber);
                },
                message: Exception.INVALID_PHONENUMBER,
            },
        },
        gender: {
            type: String,
            enum: {
                values: [DEFAULT_GENDER.MALE, DEFAULT_GENDER.FEMALE],
                message: '{VALUE} is not supported',
            },
            default: DEFAULT_GENDER.MALE,
        },
        nationality: {
            type: String,
        },
        yearOfBirth: {
            type: Number,
        },
        status: {
            type: Number,
            enum: {
                values: [0, 1],
                message: '{VALUE} is not supported',
            },
            default: 1,
        },
        otp: {
            type: Number,
        },
    },
    {
        timestamps: {
            currentTime: () => new Date().getTime(),
        },
    },
);

export default mongoose.model('Users', userSchema);
