import { userRepository } from '../repositories/index.js';
import HttpStatusCode from '../exceptions/HttpStatusCode.js';
import { STATUS, MAX_RECORDS } from '../global/constants.js';
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';

//Admin
const getAllUser = asyncHandler(async (req, res) => {
    let { page = 1, size = MAX_RECORDS, searchString = '' } = req.query;
    size = size >= MAX_RECORDS ? MAX_RECORDS : size;

    const filterUser = await userRepository.getAllUser({ page, size, searchString });

    res.status(HttpStatusCode.OK).json({
        status: STATUS.SUCCESS,
        message: 'Get the list of successful users.',
        data: filterUser,
    });
});

const updateUser = asyncHandler(async (req, res) => {
    const { id, email, userName, phoneNumber, gender, nationality, yearOfBirth } = req.body;

    const existingUser = await userRepository.updateUser({
        id,
        email,
        userName,
        phoneNumber,
        gender,
        nationality,
        yearOfBirth,
    });

    res.status(HttpStatusCode.OK).json({
        status: STATUS.SUCCESS,
        message: 'Update user information successfully!',
        data: existingUser,
    });
});

const deleteUser = asyncHandler(async (req, res) => {
    // const { id } = req.body;
    const id = new mongoose.Types.ObjectId(req.body.id);

    const existingUser = await userRepository.deleteUser(id);

    res.status(HttpStatusCode.OK).json({
        status: STATUS.SUCCESS,
        message: 'Delete user successfully!',
        data: existingUser,
    });
});

//Client
const getUser = asyncHandler(async (req, res) => {
    const userId = req.userId;

    const user = await userRepository.getUser(userId);

    res.status(HttpStatusCode.OK).json({
        status: STATUS.SUCCESS,
        message: 'Get user information successfully!',
        data: user,
    });
});

const getName = asyncHandler(async (req, res) => {
    const userId = req.userId;

    const existingUser = await userRepository.getName({ userId });

    res.status(HttpStatusCode.OK).json({
        status: STATUS.SUCCESS,
        message: 'Get user information successfully!',
        data: existingUser,
    });
});

const updateProfile = asyncHandler(async (req, res) => {
    const { email, userName, phoneNumber, gender, nationality, yearOfBirth } = req.body;
    const id = req.userId;

    const existingUser = await userRepository.updateProfile({
        id,
        email,
        userName,
        phoneNumber,
        gender,
        nationality,
        yearOfBirth,
    });

    res.status(HttpStatusCode.OK).json({
        status: STATUS.SUCCESS,
        message: 'Update user information successfully!',
        data: existingUser,
    });
});

const getTotalAccount = asyncHandler(async (req, res) => {
    const existingUser = await userRepository.getTotalAccount();

    res.status(HttpStatusCode.OK).json({
        status: STATUS.SUCCESS,
        message: 'Get total accounts successfully!',
        data: existingUser,
    });
});

const updateStatus = asyncHandler(async (req, res) => {
    const { userId } = req.body;

    await userRepository.updateStatus({userId});

    res.status(HttpStatusCode.OK).json({
        status: STATUS.SUCCESS,
        message: 'Update status successfully!',
    });
});

export default { getAllUser, updateUser, deleteUser, getUser, getName, updateProfile, getTotalAccount, updateStatus };
