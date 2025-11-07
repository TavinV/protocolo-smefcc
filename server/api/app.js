import express from 'express';
import cors from 'cors';
import bodyParser from "body-parser";
import { configDotenv } from 'dotenv';

const app = express();

configDotenv();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import itemModelRoutes from './routes/itemModelRoutes.js';
import itemRoutes from './routes/itemRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import rfidPendingRoutes from './routes/rfidPendingRoutes.js';

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/item-models', itemModelRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/rfid-pending', rfidPendingRoutes);

app.use(express.json());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-API-KEY'],
    credentials: true
}));
export default app;
