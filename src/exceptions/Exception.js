import { OutputTypeDebug, printDebug } from '../helpers/printDebug.js';

export default class Exception extends Error {
    static USER_NOT_AUTHORIZED_OR_TOKEN_MISSING = 'User is not authorized or token is missing!';
    static INVALID_EMAIL = 'Invalid email';
    static INVALID_OTP = 'Invalid otp';
    static CHECK_OTP_FAILED = 'Check otp failed';
    static RESET_PASSWORD_FAILED = 'Reset password failed';
    static INVALID_PASSWORD =
        'Password must be at least 8 characters. Includes uppercase, lowercase letters and numbers.';
    static NEW_PASS_NOT_VALID = 'New password is not valid';
    static INVALID_USERNAME = 'First and last name is a string of letters that do not contain special characters.';
    static INVALID_PHONENUMBER = 'Phone number consists of 10 digits.';
    static INVALID_TYPE_ROOM = 'Invalid type of room';
    static INVALID_CHECKIN_DATE = 'Invalid checkin date';
    static INVALID_CHECKOUT_DATE = 'Invalid checkout date';
    static WRONG_DB_USERNAME_PASSWORD = "Wrong database's username and password";
    static WRONG_DB_CONNECTION_STRING = 'Wrong server name connection string';
    static CANNOT_CONECT_MONGODB = "Can't connect to Mongoose";
    static GET_USER_FAILED = 'Get user failed';
    static UPDATE_USER_FAILED = 'Update user failed';
    static ACCOUNT_DISABLED = 'Account disabled';
    static SEND_OTP_SUCCESS =
        'OTP has been sent to your email. Please check and enter OTP in the box below to authenticate the user!';
    static SEND_OTP_FAILED = 'Send OTP failed';
    static OTP_CORRECT = 'OTP is correct';
    static OTP_INCORRECT = 'OTP is incorrect';
    static OTP_EXPIRED = 'OTP is expired';
    static CHANGED_PASSWORD_SUCCESS = 'You have successfully changed your password';
    static CHANGED_PASSWORD_FAILED = 'You have failed to change your password';
    static INCORRECT_PASS = 'Incorrect password';
    static ACCOUNT_EXIST = 'Account already exists';
    static CANNOT_REGISTER_ACCOUNT = "Can't register Account";
    static WRONG_EMAIL_OR_PASSWORD = 'Wrong email or password';
    static LOGIN_FAILED = 'Login failed';
    static LOGOUT_FAILED = 'Logout failed';
    static UPDATE_USER_FAILED = 'User information update failed';
    static GET_USER_FAILED = 'Get user failed';
    static DELETE_USER_FAILED = 'Delete user failed';
    static DELETE_USER_SUCCESS = 'Delete user successfully';
    static BOOKING_FAILED = 'Booking failed';
    static OUT_OF_ROOMS = 'Out of rooms';
    static DATA_RETRIEVAL_FAILED = 'Data retrieval failed';
    static TYPE_ROOM_NOT_EXIST = 'Type room not exist';
    static ROOM_EXIST = 'Room exist';
    static GET_NUMBER_AVAILABLE_ROOMS_FAILED = 'Retrieve list of available rooms failed';
    static CREATE_ROOM_FAILED = "Can't create room";
    static GET_ROOMS_BY_TYPE_ROOM_FAILED = 'Get Rooms by typeRooms failed';
    static GET_ACREAGE_ROOMS_FAILED = 'Get the list of room acreage failed';
    static CANNOT_ADD_ROOM = "Can't add room";
    static GET_TOTAL_PRICES_FAILED = 'Get total prices failed';
    static GET_TOTAL_ACCOUNTS_FAILED = 'Get total accounts failed';
    static CANNOT_UPDATE_ROOM = "Can't update room";
    static UTILITIES_NOT_EXIST = 'Utilities not exist';
    static UTILITIES_EXIST = 'Utilities already exists';
    static CREATE_UTILITIES_ERROR = "Can't create utilities";
    static DELETE_UTILITIES_SUCCESS = 'Delete utilities successfully';
    static GET_TRANSACTION_HISTORY_FAILED = 'Get the list of failed transaction history';
    static GET_TOTAL_TRANSACTION_HISTORY_FAILED = 'Get the total number of failed transactions';
    static GET_TOTAL_TYPE_ROOMS_FAILED = 'Get the total number of failed type rooms';
    static GET_ALL_TRANSACTION_HISTORY_FAILED = 'Get full list of failed transaction history';
    static GET_LIST_TOAL_ROOMS_BY_TYPE_ROOM_FAILED = 'Get list total rooms by typeroom failed';
    static GET_LIST_TYPE_ROOMS_NAME_FAILED = 'Get list type rooms name failed';
    static GET_SALES_STATISTICS_FAILED = 'Get sales statistics failed';
    static UPDATE_STATUS_FAILED = 'Update status failed';
    static GET_ROOM_BY_ID_FAILED = 'Get room by id failed';
    static DELETE_ROOM_FAILED = 'Delete room failed';
    static INVALID_ID_ROOM = 'Invalid id room';
    static GET_PAYMENT_FAILED = 'Get the list of failed payment';
    static CREATE_CONTACT_FAILED = 'Create contact failed';
    static GET_CONTACT_FAILED = 'Get contact failed';
    static UPDATE_CONTACT_FAILED = 'Update contact failed';
    constructor(message, validatorErrors = {}) {
        super(message); // call constructor of parent class(Error)
        printDebug(message, OutputTypeDebug.ERROR);
        this.validatorErrors = validatorErrors;
    }
}
