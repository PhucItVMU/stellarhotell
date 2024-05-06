import { userModel, prefreshTokenModel } from '../models/index.js';
import Exception from '../exceptions/Exception.js';
import nodemailer from 'nodemailer';
import { OutputTypeDebug, printDebug } from '../helpers/printDebug.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const register = async ({ email, password, phoneNumber }) => {
    let existingAccount = await userModel.findOne({ email });
    if (existingAccount) {
        printDebug('Đã tồn tại tài khoản', OutputTypeDebug.INFORMATION);
        throw new Exception(Exception.ACCOUNT_EXIST);
    }

    const hashPassword = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS));

    await userModel.create({
        email,
        password: hashPassword,
        phoneNumber,
    });
};

const login = async ({ email, password }) => {
    let existingAccount = await userModel.findOne({ email });

    if (!existingAccount || existingAccount.role === process.env.ADMIN) {
        printDebug('Email không hợp lệ!', OutputTypeDebug.INFORMATION);
        throw new Exception(Exception.WRONG_EMAIL_OR_PASSWORD);
    }

    if (existingAccount.status === 0) {
        printDebug('Tài khoản đã bị khóa', OutputTypeDebug.INFORMATION);
        throw new Exception(Exception.ACCOUNT_DISABLED);
    }

    let isMatched = await bcrypt.compare(password, existingAccount.password);
    if (!isMatched) {
        printDebug('Mật khẩu không đúng!', OutputTypeDebug.INFORMATION);
        throw new Exception(Exception.WRONG_EMAIL_OR_PASSWORD);
    }

    let hashRole = await bcrypt.hash(existingAccount.role, parseInt(process.env.SALT_ROUNDS));

    // Create a java web token
    let accessToken = jwt.sign(
        {
            user: {
                userId: existingAccount.id,
                role: hashRole,
            },
        },
        process.env.JWT_SECRET_ACCESS,
        {
            expiresIn: '5m',
        },
    );

    let prefreshToken = jwt.sign(
        {
            user: {
                userId: existingAccount.id,
                role: hashRole,
            },
        },
        process.env.JWT_SECRET_PREFRESH,
        {
            expiresIn: '1 days',
        },
    );

    await prefreshTokenModel.findOneAndDelete({ userId: existingAccount.id });
    await prefreshTokenModel.create({ userId: existingAccount.id, prefreshToken }).catch((exception) => {
        printDebug('Không tạo được prefreshToken', OutputTypeDebug.INFORMATION);
        printDebug(`${exception.message}`, OutputTypeDebug.ERROR);
        throw new Exception(Exception.LOGIN_FAILED);
    });

    return {
        accessToken,
        prefreshToken
    };
};

const loginAdmin = async ({ email, password }) => {
    let existingAccount = await userModel.findOne({ email });

    if (!existingAccount || existingAccount.role === process.env.CLIENT) {
        printDebug('Email không hợp lệ!', OutputTypeDebug.INFORMATION);
        throw new Exception(Exception.WRONG_EMAIL_OR_PASSWORD);
    }

    if (existingAccount.status === 0) {
        printDebug('Tài khoản đã bị khóa', OutputTypeDebug.INFORMATION);
        throw new Exception(Exception.ACCOUNT_DISABLED);
    }

    let isMatched = await bcrypt.compare(password, existingAccount.password);
    if (!isMatched) {
        printDebug('Mật khẩu không đúng!', OutputTypeDebug.INFORMATION);
        throw new Exception(Exception.WRONG_EMAIL_OR_PASSWORD);
    }

    let hashRole = await bcrypt.hash(existingAccount.role, parseInt(process.env.SALT_ROUNDS));

    // Create a java web token
    let accessToken = jwt.sign(
        {
            user: {
                userId: existingAccount.id,
                role: hashRole,
            },
        },
        process.env.JWT_SECRET_ACCESS,
        {
            expiresIn: '5m',
        },
    );

    let prefreshToken = jwt.sign(
        {
            user: {
                userId: existingAccount.id,
                role: hashRole,
            },
        },
        process.env.JWT_SECRET_PREFRESH,
        {
            expiresIn: '1 days',
        },
    );

    await prefreshTokenModel.findOneAndDelete({ userId: existingAccount.id });
    await prefreshTokenModel.create({ userId: existingAccount.id, prefreshToken }).catch((exception) => {
        printDebug('Không tạo được prefreshToken', OutputTypeDebug.INFORMATION);
        printDebug(`${exception.message}`, OutputTypeDebug.ERROR);
        throw new Exception(Exception.LOGIN_FAILED);
    });

    return {
        accessToken,
        prefreshToken,
    };
};

const prefreshToken = async ({ userId, token }) => {
    const existingPrefreshToken = await prefreshTokenModel.findOne({ prefreshToken: token }).exec();
    if (!existingPrefreshToken) {
        throw new Exception(Exception.USER_NOT_AUTHORIZED_OR_TOKEN_MISSING);
    }

    let accessToken;
    jwt.verify(existingPrefreshToken.prefreshToken, process.env.JWT_SECRET_PREFRESH, (err, decoded) => {
        if (err || !decoded.user) {
            printDebug('Xác thực prefreshToken không thành công!', OutputTypeDebug.INFORMATION);
            throw new Exception(Exception.USER_NOT_AUTHORIZED_OR_TOKEN_MISSING);
        }
        accessToken = jwt.sign(
            {
                user: decoded.user,
            },
            process.env.JWT_SECRET_ACCESS,
            {
                expiresIn: '1h',
            },
        );
    });

    return {
        accessToken,
    };
};

const logout = async ({ userId }) => {
    await prefreshTokenModel.findOneAndDelete({ userId }).catch((exception) => {
        printDebug(`${exception.message}`, OutputTypeDebug.ERROR);
        throw new Exception(Exception.LOGOUT_FAILED);
    });
};

//Reset password
const sendOTPresetPass = async ({ userId }) => {
    const filterUser = await userModel.findById({ _id: userId });
    printDebug(filterUser, OutputTypeDebug.INFORMATION);

    const otp = Math.floor(1000 + Math.random() * 9000);

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
        to: filterUser.email,
        subject: 'Xác thực người dùng',
        html: `<h1>Xác thực người dùng</h1>
                    <p>OTP xác thực người dùng của bạn là: ${otp},  có hiệu lực trong vòng 5 phút.</p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            printDebug(error, OutputTypeDebug.ERROR);
        } else {
            printDebug('Email sent: ' + info.response, OutputTypeDebug.INFORMATION);
        }
    });

    await userModel
        .findByIdAndUpdate(filterUser._id, {
            otp: otp,
        })
        .exec();

    return Exception.SEND_OTP_SUCCESS;
};

const checkOTPresetPass = async ({ userId, email, otp }) => {
    await userModel
        .findById({ _id: userId })
        .exec()
        .then(async (user) => {
            if (user.email !== email) {
                throw new Exception(Exception.CHECK_OTP_FAILED);
            }

            if (user.otp === Number(otp)) {
                await userModel.updateOne({ _id: user._id }, { $set: { otp: null } });
                return Exception.OTP_CORRECT;
            } else {
                throw new Exception(Exception.OTP_INCORRECT);
            }
        })
        .catch((exception) => {
            printDebug(`${exception.message}`, OutputTypeDebug.ERROR);
            throw new Exception(Exception.CHECK_OTP_FAILED);
        });
};

const resetPassword = async (userId, oldpass, newpass, otp) => {
    let user = await userModel.findById({ _id: userId });
    if (user.otp === Number(otp)) {
        const hashPassword = await bcrypt.hash(newpass, parseInt(process.env.SALT_ROUNDS));

        let isMatched = await bcrypt.compare(oldpass, user.password);
        if (!isMatched) {
            printDebug('Mật khẩu không đúng!', OutputTypeDebug.INFORMATION);
            throw new Exception(Exception.WRONG_EMAIL_OR_PASSWORD);
        }

        user.password = hashPassword ?? user.password;
        user.otp = null;
        await user.save().catch((exception) => {
            printDebug(` ${exception.message}`, OutputTypeDebug.ERROR);
            throw new Exception(Exception.RESET_PASSWORD_FAILED);
        });
        printDebug('Đổi mật khẩu thành công', OutputTypeDebug.INFORMATION);
        return Exception.CHANGED_PASSWORD_SUCCESS;
    }
    printDebug('otp không hợp lệ', OutputTypeDebug.INFORMATION);
    throw new Exception(Exception.RESET_PASSWORD_FAILED);
};

//forgot password
const sendOTPforgotPass = async ({ email }) => {
    const filterUser = await userModel.findOne({ email, role: process.env.CLIENT });

    if (!filterUser) {
        printDebug('Email không hợp lệ!', OutputTypeDebug.INFORMATION);
        throw new Exception(Exception.SEND_OTP_FAILED);
    }

    const otp = Math.floor(1000 + Math.random() * 9000);

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
        subject: 'Xác thực người dùng',
        html: `<h1>Xác thực người dùng</h1>
                    <p>OTP xác thực người dùng của bạn là: ${otp},  có hiệu lực trong vòng 1 phút.</p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            printDebug(error, OutputTypeDebug.ERROR);
        } else {
            printDebug('Email sent: ' + info.response, OutputTypeDebug.INFORMATION);
        }
    });

    await userModel
        .findByIdAndUpdate(filterUser._id, {
            otp: otp,
        })
        .exec();
    return Exception.SEND_OTP_SUCCESS;
};

const checkOTPforgotPass = async ({ email, otp }) => {
    const user = await userModel.findOne({ email });
    if (!user) {
        throw new Exception(Exception.CHECK_OTP_FAILED);
    }

    if (user.otp === null) {
        printDebug('Yêu cầu người dùng send otp', OutputTypeDebug.INFORMATION);
        throw new Exception(Exception.CHECK_OTP_FAILED);
    }

    if (user.otp !== Number(otp)) {
        printDebug('otp không hợp lệ', OutputTypeDebug.INFORMATION);
        throw new Exception('otp không hợp lệ');
    }

    await userModel.updateOne({ _id: user._id }, { $set: { otp: null } });
    sendPasswordByEmail(user._id, email);
};

const sendPasswordByEmail = async (id, email) => {
    const length = 12;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&';
    let password = '';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charactersLength);
        password += characters.charAt(randomIndex);
    }
    printDebug(password, OutputTypeDebug.INFORMATION);

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
        subject: 'Xác thực người dùng',
        html: `<h1>Xác thực người dùng</h1>
                    <p>Mật khẩu mới của bạn là: ${password},  để an toàn bạn nên cập nhật lại mật khẩu của mình!.</p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            printDebug(error, OutputTypeDebug.ERROR);
        } else {
            printDebug('Email sent: ' + info.response, OutputTypeDebug.INFORMATION);
        }
    });
    const hashPassword = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS));

    await userModel
        .findByIdAndUpdate(id, {
            password: hashPassword,
        })
        .exec();
};

export default {
    register,
    login,
    loginAdmin,
    prefreshToken,
    logout,
    sendOTPresetPass,
    checkOTPresetPass,
    resetPassword,
    sendOTPforgotPass,
    checkOTPforgotPass,
};
