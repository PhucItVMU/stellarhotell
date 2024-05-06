import { utilitiesRepository } from '../repositories/index.js';
import { validationResult } from 'express-validator';
import HttpStatusCode from '../exceptions/HttpStatusCode.js';
import { STATUS, MAX_RECORDS } from '../global/constants.js';
import { v2 as cloudinary } from 'cloudinary';
import asyncHandler from 'express-async-handler';

const getAllUtilities = asyncHandler(async (req, res) => {
    let { page = 1, size = MAX_RECORDS, searchString = '' } = req.query;
    size = size >= MAX_RECORDS ? MAX_RECORDS : size;

    const existingUtilities = await utilitiesRepository.getAllUtilities(page, size, searchString);
    res.status(HttpStatusCode.OK).json({
        status: STATUS.SUCCESS,
        data: existingUtilities,
    });
});

const createUtility = async (req, res) => {
    const { files } = req;
    let link_img = [];
    if (!files) {
        link_img =
            'https://www.google.com/url?sa=i&url=https%3A%2F%2Fpistachiohotel.com%2Fvi%2Falbum-anh&psig=AOvVaw17Bp4SBdoUCBjSlnPT-3to&ust=1691672214173000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCMDWzJzQz4ADFQAAAAAdAAAAABAE';
    } else {
        link_img = files.map((file) => file.path);
    }
    const { name, description, type } = req.body;
    try {
        const newUtility = await utilitiesRepository.createUtility(name, link_img, description, type);
        res.status(HttpStatusCode.OK).json({
            status: STATUS.SUCCESS,
            message: 'Create utility successfully.',
            data: newUtility,
        });
    } catch (exception) {
        try {
            for (const file of files) {
                await cloudinary.uploader.destroy(file.filename, { invalidate: true, resource_type: 'image' });
            }
        } catch (error) {
            console.log(error);
        }
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
            error: STATUS.ERROR,
            message: `${exception.message}`,
        });
    }
};

const updateUtility = async (req, res) => {
    const { files } = req;
    let link_img = [];
    if (!files) {
        link_img =
            'https://www.google.com/url?sa=i&url=https%3A%2F%2Fpistachiohotel.com%2Fvi%2Falbum-anh&psig=AOvVaw17Bp4SBdoUCBjSlnPT-3to&ust=1691672214173000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCMDWzJzQz4ADFQAAAAAdAAAAABAE';
    } else {
        link_img = files.map((file) => file.path);
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({ errors: errors.array() });
    }
    const { id, name, description, type } = req.body;
    try {
        const updatedUtility = await utilitiesRepository.updateUtility(id, name, link_img, description, type);
        res.status(HttpStatusCode.OK).json({
            status: STATUS.SUCCESS,
            message: 'Update utility successfully.',
            data: updatedUtility,
        });
    } catch (exception) {
        try {
            for (const file of files) {
                await cloudinary.uploader.destroy(file.filename, { invalidate: true, resource_type: 'image' });
            }
        } catch (error) {
            console.log(error);
        }
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
            error: STATUS.ERROR,
            message: `${exception.message}`,
        });
    }
};
const deleteUtility = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({ errors: errors.array() });
    }
    const { id } = req.query;
    try {
        const deletedUtility = await utilitiesRepository.deleteUtility(id);
        res.status(HttpStatusCode.OK).json({
            status: STATUS.SUCCESS,
            message: 'Delete utility successfully.',
            data: deletedUtility,
        });
    } catch (exception) {
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
            error: STATUS.ERROR,
            message: `${exception.message}`,
        });
    }
};

export default { getAllUtilities, createUtility, updateUtility, deleteUtility };
