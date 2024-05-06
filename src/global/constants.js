const STATUS = {
    SUCCESS: 'success',
    ERROR: 'error',
};

const DEFAULT_ROLES = {
    CLIENT: 'client',
    ADMIN: 'admin',
};

const DEFAULT_GENDER = {
    MALE: 'male',
    FEMALE: 'female',
};

const DEFAULT_UTILITIES = {
    RES: 'Restaurant',
    UTILITIES: 'Utilities',
};

const MAX_RECORDS = 100;

const TYPE_ROOMS = {
    SUPERIOR_DOUBLE_OR_TWIN_ROOM: 'Phòng Superior Double Or Twin',
    DELUXE_DOUBLE_ROOM: 'Phòng Deluxe Double',
    EXECUTIVE_CITY_VIEW_ROOM: 'Phòng Executive City View',
    SUITE_GARDEN_ROOM: 'Phòng Suite Garden',
};

const URL_ROOM_DEFAULT =
    'https://www.google.com/url?sa=i&url=https%3A%2F%2Fpistachiohotel.com%2Fvi%2Falbum-anh&psig=AOvVaw17Bp4SBdoUCBjSlnPT-3to&ust=1691672214173000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCMDWzJzQz4ADFQAAAAAdAAAAABAE';

const TYPE_BED = {
    SINGLE_BED: '02 Single bed',
    DOUBLE_BED: 'Double bed',
};

const ROOM_STATUS = {
    AVAILABLE: 'available',
    BOOKED: 'booked',
    USING: 'using',
};

const DESCRIPTION_ROOM = {
    SUPERIOR_DOUBLE_OR_TWIN_ROOM: `Phòng nghỉ Stellar - Superior Double Or Twin mang đến sự ấm cúng bởi nét duyên dáng của lịch sử và những tiện nghi hiện đại nhất. Với sàn nhà kết hợp gỗ và gạch ốp, giường đôi thoải mái và đồ nội thất trang nhã, tất cả tạo nên sự cân bằng giữa “cổ điển” và “hiện đại”.`,
    DELUXE_DOUBLE_ROOM: `Phòng nghỉ Stellar - Deluxe Double, căn phòng ấm áp này mang lại sự hoàn hảo trong kỳ nghỉ tại Sài Gòn. Không gian làm việc kết nối với các tiện nghi phòng nghỉ, cùng giường ngủ với bộ chăn lông vũ êm ái, chất liệu cao cấp cùng dịch vụ phục vụ phòng tận nơi mang lại sự thoải mái và thư giãn tối đa.`,
    EXECUTIVE_CITY_VIEW_ROOM: `Với hai cửa sổ lớn cho quang cảnh tuyệt vời nhìn ra thành phố, Phòng Executive City View mang lại cho quý khách một không gian thoáng đãng, rộng mở. được trang trí bằng sàn gỗ kết hợp gạch, những món đồ nội thất phảng phất phong cách Đông Dương kết hợp những tiện nghi hiện đại tạo nên một tổng thể hài hoà, đương đại mà quý khách có thể trải nghiệm để cảm nhận nét đẹp Sài Gòn chuẩn xác nhất.`,
    SUITE_GARDEN_ROOM: `Phòng Suite Garden được phối hợp phong cách hiện đại với cảm hứng từ cây xanh, rộng rãi, hoàn hảo cho các kì nghỉ cuối tuần hay chuyến khám phá của quý khách. Ban công rộng và được sắp xếp để quý khách luôn cảm nhận được không khí trong lành, gió nhẹ lay và bóng mát từ các tán cây. Loại phòng nghỉ này đáp ứng đầy đủ nhu cầu ngắm nhìn đường phố, tận hưởng những giây phút đắm mình trong bồn tắm bể sục.`,
};

const COLLECTION = {
    USERS: 'Users',
    TYPE_ROOMS: 'TypeRooms',
    ROOMS: 'Rooms',
    BOOKING_ROM: 'BookingRooms',
};

const STATUS_BOOKING = {
    BOOKED: 'Chưa thanh toán',
    PAID: 'Đã thanh toán',
    CANCELLED: 'Đã hủy',
};

const STATUS_CONFERENCES = {
    PENDING: 'chưa xử lý',
    SOVLED: 'đã xử lý',
}

export {
    STATUS,
    DEFAULT_ROLES,
    DEFAULT_GENDER,
    MAX_RECORDS,
    TYPE_ROOMS,
    URL_ROOM_DEFAULT,
    TYPE_BED,
    ROOM_STATUS,
    DESCRIPTION_ROOM,
    COLLECTION,
    STATUS_BOOKING,
    DEFAULT_UTILITIES,
    STATUS_CONFERENCES,
};
