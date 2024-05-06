import { userModel, bookingRoomModel, typeRoomModel, roomModel } from '../models/index.js';
import { STATUS_BOOKING } from '../global/constants.js';
import Exception from '../exceptions/Exception.js';
import { OutputTypeDebug, printDebug } from '../helpers/printDebug.js';

import asyncHandler from 'express-async-handler';
import { dDate, dateTimeOutputFormat, DateStrFormat, nDate } from '../helpers/timezone.js';
import date from 'date-and-time';
import querystring from 'qs';
import crypto from 'crypto';

const handleBookingRooms = asyncHandler(
    async ({ checkinDate, checkoutDate, typeRoom, quantity, acreage, typeBed, view, prices, messageError }) => {
        const existingTypeRoom = await typeRoomModel.findById(typeRoom);
        if (!existingTypeRoom) {
            printDebug('Không tồn tại loại phòng', OutputTypeDebug.INFORMATION);
            throw new Exception(messageError);
        }

        const getListRoomsBookedByDate = await bookingRoomModel
            .find(
                {
                    $and: [
                        {
                            typeRoom: existingTypeRoom.id,
                        },
                        {
                            $or: [
                                {
                                    checkinDate: { $gt: checkinDate, $lt: checkoutDate },
                                    checkoutDate: { $gte: checkoutDate },
                                },
                                {
                                    checkinDate: { $lte: checkinDate },
                                    checkoutDate: { $gte: checkoutDate },
                                },
                                {
                                    checkinDate: { $lte: checkinDate },
                                    checkoutDate: { $gt: checkinDate, $lt: checkoutDate },
                                },
                                {
                                    checkinDate: { $gt: checkinDate },
                                    checkoutDate: { $lt: checkoutDate },
                                },
                            ],
                        },
                    ],
                },
                { _id: 0, rooms: 1 },
            )
            .exec()
            .then((elements) => {
                let idRooms = [];
                elements.map((element) => idRooms.push(...element.rooms));
                return idRooms;
            })
            .catch((exception) => {
                printDebug('Lấy danh sách phòng đã đặt thất bại', OutputTypeDebug.INFORMATION);
                printDebug(`${exception.message}`, OutputTypeDebug.ERROR);
                throw new Exception(messageError);
            });
        printDebug(`getListRoomsBookedByDate: ${getListRoomsBookedByDate}`, OutputTypeDebug.INFORMATION);

        // Xử lý tham số truyền vào
        // Lọc và tìm kiếm phòng đặt hợp lệ
        let parameters = { typeRoom: existingTypeRoom._id };
        if (acreage) {
            parameters = { ...parameters, acreage };
        }
        if (typeBed) {
            parameters = { ...parameters, typeBed };
        }
        if (view) {
            parameters = { ...parameters, view };
        }
        if (prices) {
            parameters = { ...parameters, prices };
        }

        const handleBookingRooms = await roomModel
            .find(parameters, { _id: 1, roomNumber: 1, prices: 1 })
            .sort({ roomNumber: 1 })
            .exec()
            .then((elements) => {
                const getAvailableRooms = elements.filter((item) => {
                    return (
                        !getListRoomsBookedByDate.includes(item.roomNumber) && {
                            id: item.id,
                            roomNumber: item.roomNumber,
                            prices: item.prices,
                        }
                    );
                });
                printDebug(`getAvailableRooms: ${getAvailableRooms}`, OutputTypeDebug.INFORMATION);

                const d = dDate(checkinDate, checkoutDate);
                printDebug(`dDate: ${d}`, OutputTypeDebug.INFORMATION);

                return {
                    getAvailableRooms,
                    idRooms: getAvailableRooms.slice(0, quantity).map((element) => element.roomNumber),
                    totalPrice: getAvailableRooms
                        .slice(0, quantity)
                        .map((element) => element.prices)
                        .reduce((partialSum, a) => partialSum + a * d, 0),
                };
            })
            .catch((exception) => {
                printDebug('Xử lý phòng bị lỗi', OutputTypeDebug.INFORMATION);
                printDebug(`${exception.message}`, OutputTypeDebug.ERROR);
                throw new Exception(messageError);
            });

        if (handleBookingRooms.getAvailableRooms.length === 0) {
            throw new Exception(Exception.OUT_OF_ROOMS);
        }
        if (handleBookingRooms.getAvailableRooms.length < quantity) {
            throw new Exception(`Stellar only ${handleBookingRooms.idRooms.length} rooms left`);
        }
        printDebug(`Lấy danh sách mã phòng thành công: ${handleBookingRooms.idRooms}`, OutputTypeDebug.INFORMATION);
        printDebug(`Tổng tiền đặt phòng: ${handleBookingRooms.totalPrice}`, OutputTypeDebug.INFORMATION);

        return handleBookingRooms;
    },
);

const bookingRoom = async ({
    userId,
    checkinDate,
    checkoutDate,
    typeRoom,
    quantity,
    acreage,
    typeBed,
    view,
    prices,
}) => {
    const existingUser = await userModel.findById(userId);
    if (!existingUser) {
        printDebug('Không tồn tại User', OutputTypeDebug.INFORMATION);
        throw new Exception(Exception.BOOKING_FAILED);
    }

    let messageError = Exception.BOOKING_FAILED;

    const getInfoBookingRooms = await handleBookingRooms({
        checkinDate,
        checkoutDate,
        typeRoom,
        quantity,
        acreage,
        typeBed,
        view,
        prices,
        messageError,
    });

    const booking = await bookingRoomModel
        .create({
            user: existingUser._id,
            typeRoom,
            quantity,
            checkinDate,
            checkoutDate,
            rooms: getInfoBookingRooms.idRooms,
            totalprice: getInfoBookingRooms.totalPrice,
        })
        .catch((exception) => {
            printDebug('Đặt phòng khong thành công!', OutputTypeDebug.INFORMATION);
            printDebug(`${exception.message}`, OutputTypeDebug.ERROR);
            throw new Exception(Exception.BOOKING_FAILED);
        });
    return {
        id: booking._id,
        totalPrice: booking.totalprice,
    };
};

const getTotalPrices = async ({ checkinDate, checkoutDate, typeRoom, quantity, acreage, typeBed, view, prices }) => {
    let messageError = Exception.GET_TOTAL_PRICES_FAILED;

    const getInfoBookingRooms = await handleBookingRooms({
        checkinDate,
        checkoutDate,
        typeRoom,
        quantity,
        acreage,
        typeBed,
        view,
        prices,
        messageError,
    });

    return { totalPrice: getInfoBookingRooms.totalPrice };
};

const getTransactionHistory = async ({ userId, page, size }) => {
    const existingUser = await userModel.findById(userId);
    if (!existingUser) {
        throw new Exception(Exception.GET_TRANSACTION_HISTORY_FAILED);
    }

    size = parseInt(size);
    page = parseInt(page);

    return await bookingRoomModel
        .find(
            { user: existingUser._id },
            { _id: 1, typeRoom: 1, rooms: 1, quantity: 1, totalprice: 1, status: 1, checkinDate: 1, checkoutDate: 1 },
        )

        .populate({ path: 'typeRoom', select: { _id: 0, name: 1 } })
        .sort({ createdAt: 1 })
        .skip((page - 1) * size)
        .limit(size)
        .exec()
        .then((results) => {
            return results.map((result) => {
                const { typeRoom, checkinDate, checkoutDate, ...objNew } = result;
                objNew._doc.typeRoom = typeRoom.name;
                objNew._doc.checkinDate = dateTimeOutputFormat(checkinDate, DateStrFormat.DATE_AND_TIME);
                objNew._doc.checkoutDate = dateTimeOutputFormat(checkoutDate, DateStrFormat.DATE_AND_TIME);
                return objNew._doc;
            });
        })
        .catch((exception) => {
            printDebug('Đặt phòng khong thành công!', OutputTypeDebug.INFORMATION);
            printDebug(`${exception.message}`, OutputTypeDebug.ERROR);
            throw new Exception(Exception.GET_TRANSACTION_HISTORY_FAILED);
        });
};

const getTransactionHistoryForAdmin = async ({ userId, page, size }) => {
    const existingUser = await userModel.findById(userId);
    if (!existingUser) {
        throw new Exception(Exception.GET_TRANSACTION_HISTORY_FAILED);
    }

    size = parseInt(size);
    page = parseInt(page);

    return await bookingRoomModel
        .find(
            { user: existingUser._id },
            { _id: 1, typeRoom: 1, rooms: 1, quantity: 1, totalprice: 1, status: 1, checkinDate: 1, checkoutDate: 1 },
        )

        .populate({ path: 'typeRoom', select: { _id: 0, name: 1 } })
        .sort({ createdAt: 1 })
        .skip((page - 1) * size)
        .limit(size)
        .exec()
        .then((results) => {
            return results.map((result) => {
                const { typeRoom, checkinDate, checkoutDate, ...objNew } = result;
                objNew._doc.typeRoom = typeRoom.name;
                objNew._doc.checkinDate = dateTimeOutputFormat(checkinDate, DateStrFormat.DATE_AND_TIME);
                objNew._doc.checkoutDate = dateTimeOutputFormat(checkoutDate, DateStrFormat.DATE_AND_TIME);
                return objNew._doc;
            });
        })
        .catch((exception) => {
            printDebug('Đặt phòng khong thành công!', OutputTypeDebug.INFORMATION);
            printDebug(`${exception.message}`, OutputTypeDebug.ERROR);
            throw new Exception(Exception.GET_TRANSACTION_HISTORY_FAILED);
        });
};

const getTotalTransactionHistory = async ({ userId }) => {
    const existingUser = await userModel.findById(userId);
    if (!existingUser) {
        throw new Exception(Exception.GET_TOTAL_TRANSACTION_HISTORY_FAILED);
    }

    return await bookingRoomModel
        .find({ user: existingUser._id })
        .exec()
        .then((results) => {
            return { totalTransactionHistory: results.reduce((partialSum, a) => partialSum + 1, 0) };
        })
        .catch((exception) => {
            printDebug('Đặt phòng khong thành công!', OutputTypeDebug.INFORMATION);
            printDebug(`${exception.message}`, OutputTypeDebug.ERROR);
            throw new Exception(Exception.GET_TOTAL_TRANSACTION_HISTORY_FAILED);
        });
};

const getTotalTransactionHistoryForAdmin = async ({ userId }) => {
    const existingUser = await userModel.findById(userId);
    if (!existingUser) {
        throw new Exception(Exception.GET_TOTAL_TRANSACTION_HISTORY_FAILED);
    }

    return await bookingRoomModel
        .find({ user: existingUser._id })
        .exec()
        .then((results) => {
            return { totalTransactionHistory: results.reduce((partialSum, a) => partialSum + 1, 0) };
        })
        .catch((exception) => {
            printDebug('Đặt phòng khong thành công!', OutputTypeDebug.INFORMATION);
            printDebug(`${exception.message}`, OutputTypeDebug.ERROR);
            throw new Exception(Exception.GET_TOTAL_TRANSACTION_HISTORY_FAILED);
        });
};

const getAllTransactionHistory = async ({ page, size, searchString }) => {
    size = parseInt(size);
    page = parseInt(page);

    const obj = /^\d+$/.test(searchString)
        ? {
              $or: [
                  {
                      rooms: { $in: [parseInt(searchString)] },
                  },
                  {
                      quantity: parseInt(searchString),
                  },
                  {
                      totalprice: parseInt(searchString),
                  },
              ],
          }
        : {};

    return await bookingRoomModel
        .find(obj, {
            _id: 1,
            user: 1,
            typeRoom: 1,
            rooms: 1,
            quantity: 1,
            totalprice: 1,
            status: 1,
            checkinDate: 1,
            checkoutDate: 1,
        })
        .populate({ path: 'user', select: { _id: 1 } })
        .populate({
            path: 'typeRoom',
            select: { _id: 0, name: 1 },
        })
        .sort({ createdAt: 1 })
        .skip((page - 1) * size)
        .limit(size)
        .exec()
        .then((results) => {
            const handelResults = results.map((result) => {
                const { user, typeRoom, checkinDate, checkoutDate, ...objNew } = result;
                objNew._doc.user = user.id;
                objNew._doc.typeRoom = typeRoom.name;
                objNew._doc.checkinDate = dateTimeOutputFormat(checkinDate, DateStrFormat.DATE_AND_TIME);
                objNew._doc.checkoutDate = dateTimeOutputFormat(checkoutDate, DateStrFormat.DATE_AND_TIME);
                return objNew._doc;
            });

            if (!/^\d+$/.test(searchString)) {
                return handelResults.filter((item) => {
                    return item.typeRoom.includes(searchString);
                });
            } else {
                return handelResults;
            }
        })
        .catch((exception) => {
            printDebug('Đặt phòng khong thành công!', OutputTypeDebug.INFORMATION);
            printDebug(`${exception.message}`, OutputTypeDebug.ERROR);
            throw new Exception(Exception.GET_ALL_TRANSACTION_HISTORY_FAILED);
        });
};

const getTransactionHistoryById = async ({ idBooking }) => {
    const existingBooking = await bookingRoomModel.findById(idBooking);
    if (!existingBooking) {
        printDebug('Không tồn tại đơn đặt phòng', OutputTypeDebug.INFORMATION);
        throw new Exception(Exception.GET_TRANSACTION_HISTORY_FAILED);
    }
    const idUser = existingBooking.user;
    const existingUser = await userModel.findById(idUser);
    if (!existingUser) {
        throw new Exception(Exception.GET_TRANSACTION_HISTORY_FAILED);
    }
    return {
        id: existingBooking._id,
        user: {
            id: existingUser._id,
            name: existingUser.userName,
            email: existingUser.email,
            phone: existingUser.phoneNumber,
        },
        typeRoom: existingBooking.typeRoom,
        rooms: existingBooking.rooms,
        quantity: existingBooking.quantity,
        totalprice: existingBooking.totalprice,
        status: existingBooking.status,
        checkinDate: existingBooking.checkinDate,
        checkoutDate: existingBooking.checkoutDate,
    };
};

const getTotalAllTransactionHistory = async () => {
    return await bookingRoomModel
        .find({})
        .exec()
        .then((results) => {
            return results.reduce((partialSum, a) => partialSum + 1, 0);
        })
        .catch((exception) => {
            printDebug(`${exception.message}`, OutputTypeDebug.ERROR);
            throw new Exception(Exception.GET_TOTAL_TRANSACTION_HISTORY_FAILED);
        });
};

const createPayment = async ({ orderId, bankCode }) => {
    var ipAddr = '127.0.0.1';
    var tmnCode = '9P74Q5DB';
    var secretKey = 'WCBCNCNRFRCERDQNTQLCIWCVQSWJOOCQ';
    var vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
    // var returnUrl = 'http://localhost:8080/booking-room/vnpay_return';
    var returnUrl = 'https://stellarapi.onrender.com/booking-room/vnpay_return';

    var createDate = date.format(new Date(), 'YYYYMMDDHHmmss');
    let exsitBooking = await bookingRoomModel.findById(orderId);
    if (!exsitBooking) throw new Exception(Exception.BOOKING_NOT_FOUND);
    var currCode = 'VND';
    var vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    // vnp_Params['vnp_Merchant'] = ''
    vnp_Params['vnp_Locale'] = 'vn';
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = 'Dat phong khach san';
    vnp_Params['vnp_OrderType'] = 170000;
    vnp_Params['vnp_Amount'] = exsitBooking.totalprice * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    if (bankCode !== null && bankCode !== '') {
        vnp_Params['vnp_BankCode'] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);
    var signData = querystring.stringify(vnp_Params, { encode: false });
    var hmac = crypto.createHmac('sha512', secretKey);
    var signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
    return vnpUrl;
};
function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
    }
    return sorted;
}
const vnpayReturn = async (vnp_Params, res) => {
    printDebug(vnp_Params['vnp_TxnRef'], OutputTypeDebug.INFORMATION);
    var secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    var rspCode = vnp_Params['vnp_ResponseCode'];

    vnp_Params = sortObject(vnp_Params);

    var secretKey = 'WCBCNCNRFRCERDQNTQLCIWCVQSWJOOCQ';
    var signData = querystring.stringify(vnp_Params, { encode: false });
    var hmac = crypto.createHmac('sha512', secretKey);
    var signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');

    let paymentStatus = '0';
    let checkOrderId = true;
    let checkAmount = true;
    if (secureHash === signed) {
        if (checkOrderId) {
            if (checkAmount) {
                if (paymentStatus == '0') {
                    if (rspCode == '00') {
                        let payment = await bookingRoomModel.findById(vnp_Params['vnp_TxnRef']);
                        payment.status = STATUS_BOOKING.PAID;
                        await payment.save();
                        printDebug(payment, OutputTypeDebug.INFORMATION);
                    } else {
                        let payment = await bookingRoomModel.findById(vnp_Params['vnp_TxnRef']);
                        payment.status = STATUS_BOOKING.CANCELLED;
                        await payment.save();
                        printDebug(payment, OutputTypeDebug.INFORMATION);
                    }
                } else {
                    return { RspCode: '02', Message: 'This order has been updated to the payment status' };
                }
            } else {
                return { RspCode: '04', Message: 'Amount invalid' };
            }
        } else {
            res.status(200).json({ RspCode: '01', Message: 'Order not found' });
        }
    } else {
        return 'fail';
    }
};

const getSalesStatistics = async ({ startDate, endDate }) => {
    return await bookingRoomModel
        .find(
            {
                createdAt: { $gte: startDate, $lte: endDate },
            },
            { _id: 0, totalprice: 1, createdAt: 1 },
        )
        .sort({ createdAt: 1 })
        .exec()
        .then((results) => {
            const d = dDate(startDate, endDate);
            let n;
            let arr = [];
            for (let i = 0; i <= d; i++) {
                n = i !== 0 ? nDate(n) : startDate;
                let total = results
                    .filter((result, index, results) =>
                        results
                            .map((result) => dateTimeOutputFormat(result.createdAt, DateStrFormat.DATE))
                            .includes(dateTimeOutputFormat(n, DateStrFormat.DATE)),
                    )
                    .reduce((sum, result) => sum + result.totalprice, 0);
                arr.push({
                    date: dateTimeOutputFormat(n, DateStrFormat.DATE),
                    totalPrice: total,
                });
            }
            return arr;
        })
        .catch((exception) => {
            printDebug(`${exception.message}`, OutputTypeDebug.ERROR);
            throw new Exception(Exception.GET_SALES_STATISTICS_FAILED);
        });
};

export default {
    bookingRoom,
    getTotalPrices,
    getTransactionHistory,
    getTransactionHistoryForAdmin,
    getTotalTransactionHistory,
    getTotalTransactionHistoryForAdmin,
    getAllTransactionHistory,
    getTransactionHistoryById,
    getTotalAllTransactionHistory,
    createPayment,
    vnpayReturn,
    getSalesStatistics,
};
