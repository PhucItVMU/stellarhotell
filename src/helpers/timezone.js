import moment from 'moment-timezone';

class DateStrFormat {
    static DATE = 'DD-MM-YYYY';
    static DATE_AND_TIME = 'DD-MM-YYYY hh:mm';
}

const dateTimeInputFormat = (date, dateStFrormat) => {
    let dateFormat = moment(date, dateStFrormat).tz('Asia/Ho_Chi_Minh').utc().format();
    return (
        (/^(\d{2}-\d{2}-\d{4})+( \d{2}:\d{2})?$/.test(date) &&
            (DateStrFormat.DATE === dateStFrormat || DateStrFormat.DATE_AND_TIME === dateStFrormat) &&
            dateFormat !== 'Invalid date' &&
            dateFormat) ||
        null
    );
};

const dateTimeOutputFormat = (date, dateStFrormat) => {
    let dateFormat = moment(date).tz('Asia/Ho_Chi_Minh').format(dateStFrormat);
    return (
        ((DateStrFormat.DATE === dateStFrormat || DateStrFormat.DATE_AND_TIME === dateStFrormat) &&
            dateFormat !== 'Invalid date' &&
            dateFormat) ||
        null
    );
};

const dDate = (checkinDate, checkoutDate) => {
    return Number((new Date(checkoutDate) - new Date(checkinDate)) / 86400000);
};

const nDate = (date) => {
    const nDate = new Date(date);
    nDate.setDate(nDate.getDate() + 1);
    return nDate.toISOString();
};

export { DateStrFormat, dateTimeInputFormat, dateTimeOutputFormat, dDate, nDate };
