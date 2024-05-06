import {v2 as cloudinary} from 'cloudinary';
import {CloudinaryStorage} from 'multer-storage-cloudinary';
import multer from 'multer';
import * as dotenv from 'dotenv'; 

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    folder: 'Stellar',
    allowedFormats: ['jpg', 'png'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
    maxFileSize: 7000000,

});
const upload = multer({ storage: storage });
export default upload;