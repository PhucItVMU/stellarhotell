// Route-> controller-> service-> model
import express from 'express';
import * as dotenv from 'dotenv'; // tải các biến môi trường từ tệp .env vào tệp process.env
import cors from 'cors';

import { notFound, errorMiddleware } from './src/middleware/errorMiddleware.js';
import loggerMiddleware from './src/middleware/loggerMiddleware.js';
import { OutputType, print } from './src/helpers/print.js';
import connect from './src/database/database.js';
import {
    userRoutes,
    authRoutes,
    roomRoutes,
    typeRoomRoutes,
    bookingRoomRoutes,
    utilitiesRoutes,
    conferenceRoutes,
} from './src/routes/index.js';

dotenv.config();
const app = express();

app.use(express.json());
app.use(
    cors({
        origin: ['http://localhost:8888', 'http://localhost:3000', process.env.CLIENT_URL_CLIENT, process.env.CLIENT_URL_ADMIN],
        // origin: [process.env.CLIENT_URL_CLIENT, process.env.CLIENT_URL_ADMIN],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    }),
);

app.get('/', (req, res) => {
    res.send('Wellcome to Stellar API');
});

app.use(loggerMiddleware); //Logger Middleware
// app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/room', roomRoutes);
app.use('/type-room', typeRoomRoutes);
app.use('/booking-room', bookingRoomRoutes);
app.use('/utilities', utilitiesRoutes);
app.use('/conference', conferenceRoutes);

app.use(notFound);
app.use(errorMiddleware);

const port = process.env.PORT || 3002;
connect()
    .then(() => {
        app.listen(port, async () => {
            print(`Server is running on port ${port}`, OutputType.INFORMATION);
        });
    })
    .catch(() => {
        print(`Server is not working`, OutputType.INFORMATION);
    });
