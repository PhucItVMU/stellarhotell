import { userModel } from '../models/index.js';
import Exception from '../exceptions/Exception.js';
import { OutputTypeDebug, printDebug } from '../helpers/printDebug.js';
import e from 'express';

//Admin
const getAllUser = async ({ page, size, searchString }) => {
    size = parseInt(size);
    page = parseInt(page);
    const filterUser = await userModel
        .aggregate([
            {
                $match: {
                    role: process.env.CLIENT,
                    $or: [
                        {
                            email: { $regex: `.*${searchString}.*`, $options: 'i' },
                        },
                        {
                            userName: { $regex: `.*${searchString}.*`, $options: 'i' },
                        },
                        {
                            phoneNumber: { $regex: `.*${searchString}.*`, $options: 'i' },
                        },
                    ],
                },
            },
            {
                $sort: { email: 1 },
            },
            {
                $skip: (page - 1) * size,
            },
            {
                $limit: size,
            },

            {
                $project: {
                    email: 1,
                    userName: 1,
                    phoneNumber: 1,
                    gender: 1,
                    nationality: 1,
                    yearOfBirth: 1,
                    status: 1,
                },
            },
        ])
        .exec();

    if (filterUser) {
        return filterUser;
    } else {
        throw new Exception(Exception.GET_USER_FAILED);
    }
};

//Client
const getUser = async (userId) => {
    let existingUser = await userModel.findById(userId);

    if (!existingUser || existingUser.role !== process.env.CLIENT) {
        throw new Exception(Exception.GET_USER_FAILED);
    }

    return {
        id: existingUser._id,
        userName: existingUser.userName,
        email: existingUser.email,
        phoneNumber: existingUser.phoneNumber,
        gender: existingUser.gender || '',
        nationality: existingUser.nationality || '',
        yearOfBirth: existingUser.yearOfBirth || '',
    };
};

const updateProfile = async ({ id, email, userName, phoneNumber, gender, nationality, yearOfBirth }) => {
    let existingUser = await userModel.findById(id);
    if (!existingUser) {
        throw new Exception(Exception.UPDATE_USER_FAILED);
    }

    // Update information user
    existingUser.email = email ?? existingUser.email;
    existingUser.userName = userName ?? existingUser.userName;
    existingUser.phoneNumber = phoneNumber ?? existingUser.phoneNumber;
    existingUser.gender = gender ?? existingUser.gender;
    existingUser.nationality = nationality ?? existingUser.nationality;
    existingUser.yearOfBirth = yearOfBirth ?? existingUser.yearOfBirth;
    await existingUser.save().catch((exception) => {
        printDebug(`${exception.message}`, OutputTypeDebug.ERROR);
        throw new Exception(Exception.UPDATE_USER_FAILED);
    });

    return {
        id: existingUser._id,
        userName: existingUser.userName,
        email: existingUser.email,
        phoneNumber: existingUser.phoneNumber,
        gender: existingUser.gender || '',
        nationality: existingUser.nationality || '',
        yearOfBirth: existingUser.yearOfBirth || '',
    };
};

const getName = async ({ userId }) => {
    let existingUser = await userModel.findById(userId);
    if (!existingUser) {
        throw new Exception(Exception.GET_USER_FAILED);
    }

    return {
        userName: existingUser.userName,
    };
};

const updateUser = async ({ id, email, userName, phoneNumber, gender, nationality, yearOfBirth }) => {
    let existingUser = await userModel.findById(id);
    if (!existingUser || existingUser.role !== process.env.CLIENT) {
        throw new Exception(Exception.UPDATE_USER_FAILED);
    }

    // Update information user
    existingUser.email = email ?? existingUser.email;
    existingUser.userName = userName ?? existingUser.userName;
    existingUser.phoneNumber = phoneNumber ?? existingUser.phoneNumber;
    existingUser.gender = gender ?? existingUser.gender;
    existingUser.nationality = nationality ?? existingUser.nationality;
    existingUser.yearOfBirth = yearOfBirth ?? existingUser.yearOfBirth;
    await existingUser.save().catch((exception) => {
        printDebug(`${exception.message}`, OutputTypeDebug.ERROR);
        throw new Exception(Exception.UPDATE_USER_FAILED);
    });

    return {
        id: existingUser._id,
        userName: existingUser.userName,
        yearOfBirth: existingUser.yearOfBirth,
        gender: existingUser.gender,
        nationality: existingUser.nationality,
        email: existingUser.email,
        phoneNumber: existingUser.phoneNumber,
    };
};

const deleteUser = async (userId) => {
    let existingUser = await userModel.findOneAndUpdate({ _id: userId, status: 1 }, { status: 0 }).exec();

    if (!existingUser) {
        throw new Exception(Exception.DELETE_USER_FAILED);
    }

    return Exception.DELETE_USER_SUCCESS;
};

const getTotalAccount = async () => {
    return await userModel
        .find({ role: process.env.CLIENT, status: 1 })
        .count()
        .exec()
        .catch((exception) => {
            printDebug(`${exception.message}`, OutputTypeDebug.ERROR);
            throw new Exception(Exception.GET_TOTAL_ACCOUNTS_FAILED);
        });
};

const updateStatus = async ({ userId }) => {
    return await userModel
        .findById(userId)
        .exec()
        .then((user) => {
            user.status = user.status === 0 ? 1 : 0;
            return user.save().catch((exception) => {
                printDebug(`${exception.message}`, OutputTypeDebug.ERROR);
                throw new Exception(Exception.UPDATE_STATUS_FAILED);
            });
        })
        .catch((exception) => {
            printDebug(`${exception.message}`, OutputTypeDebug.ERROR);
            throw new Exception(Exception.UPDATE_STATUS_FAILED);
        });
};

export default { getAllUser, updateUser, getUser, updateProfile, getName, deleteUser, getTotalAccount, updateStatus };
