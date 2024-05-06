import { conferenceModel } from '../models/index.js';
import { OutputTypeDebug, printDebug } from '../helpers/printDebug.js';
import nodemailer from 'nodemailer';
import Exception from '../exceptions/Exception.js';
import { STATUS_CONFERENCES } from '../global/constants.js';

const getAllContact = async (page, size, searchString) => {
    size = parseInt(size);
    page = parseInt(page);
    const contacts = await conferenceModel
        .aggregate([
            {
                $match: {
                    $or: [
                        {
                            name: { $regex: `.*${searchString}.*`, $options: 'i' },
                        },
                        {
                            email: { $regex: `.*${searchString}.*`, $options: 'i' },
                        },
                        {
                            phoneNumber: { $regex: `.*${searchString}.*`, $options: 'i' },
                        },
                        {
                            status: { $regex: `.*${searchString}.*`, $options: 'i' },
                        },
                    ],
                },
            },
            {
                $sort: {
                    status: 1,
                    createdAt: 1
                },
            },
            {
                $skip: (page - 1) * size,
            },
            {
                $limit: size,
            },

            {
                $project: {
                    name: 1,
                    email: 1,
                    phoneNumber: 1,
                    message: 1,
                    status: 1,
                },
            },
        ])
        .exec();
    if (contacts) {
        return contacts;
    }
    throw new Exception(Exception.GET_CONTACT_FAILED);
};

const createContact = async ({ name, email, phoneNumber, message }) => {
    const contact = await conferenceModel.create({
        name,
        email,
        phoneNumber,
        message,
    });
    if (!contact) {
        printDebug('Nội dung truyền vào thiếu email hoặc tên', OutputTypeDebug.ERROR);
        throw new Exception(Exception.CREATE_CONTACT_FAILED);
    }
    //send mail
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: true,
        auth: {
            user: 'nguyetque65697@gmail.com',
            pass: 'kfsxdgbvewakanjq',
        },
    });

    let mailOptions = {
        from: 'nguyetquepham7@gmail.com',
        to: email,
        subject: 'Xác nhận đặt phòng Hội nghị & Sự kiện Stellar Hotel',
        html: `<h1>Xác nhận đặt phòng Hội nghị & Sự kiện</h1>
                    <p>Gửi ông/bà ${name}</p>
                    <p>Chúng tôi đã nhận được thông tin đặt phòng của ông/bà. Xin vui lòng để ý điện thoại</p>
                    <p>Chúng tôi sẽ liên hệ với ông/bà trong thời gian sớm nhất.</p>
                    <p>Trân trọng cảm ơn.</p>
                    <p>Stellar Hotel</p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            printDebug(error, OutputTypeDebug.ERROR);
        } else {
            printDebug('Email sent: ' + info.response, OutputTypeDebug.INFORMATION);
        }
    });
    return {
        message: 'Main đã được gửi đi. Vui lòng kiểm tra email của bạn',
    };
};

const updateContact = async ({ id }) => {
    const contact = await conferenceModel.findByIdAndUpdate(id, {
        status: STATUS_CONFERENCES.SOVLED,
    });
    if (!contact) {
        printDebug('id không tồn tại', OutputTypeDebug.ERROR);
        throw new Exception(Exception.UPDATE_CONTACT_FAILED);
    }
    printDebug('Cập nhật trạng thái thành công', OutputTypeDebug.SUCCESS);
};

export default { createContact, getAllContact, updateContact };
