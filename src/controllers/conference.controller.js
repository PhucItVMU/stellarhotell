import asyncHandler from 'express-async-handler';
import {conferenceRepository} from '../repositories/index.js';
import HttpStatusCode from '../exceptions/HttpStatusCode.js';
import { STATUS } from '../global/constants.js';
import { MAX_RECORDS } from '../global/constants.js';

const getAllContact = asyncHandler(async (req, res) => {
    let { page = 1, size = MAX_RECORDS, searchString = '' } = req.query;
    size = size >= MAX_RECORDS ? MAX_RECORDS : size;

    const contacts = await conferenceRepository.getAllContact(page, size, searchString);
    res.status(HttpStatusCode.OK).json({
        status: STATUS.SUCCESS,
        message: 'Get the successful contact list!',
        data: contacts,
    });
});

const createContact = asyncHandler(async (req, res)=> {
    const {name, email, phoneNumber, message} = req.body;
    const contact = await conferenceRepository.createContact({
        name,
        email,
        phoneNumber,
        message,
    });
    res.status(HttpStatusCode.INSERT_OK).json({
        status: STATUS.SUCCESS,
        data: contact,
    });

});

const updateContact = asyncHandler(async (req, res) => {
   const {id} = req.body;
    const contact = await conferenceRepository.updateContact({
        id
    });
    res.status(HttpStatusCode.OK).json({
        status: STATUS.SUCCESS,
        message: 'Contact updated successfully!',
        data: contact,
    });
});


export default { createContact, getAllContact, updateContact };
    