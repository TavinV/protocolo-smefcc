import express from 'express';
import cors from 'cors';
import bodyParser from "body-parser";
import { configDotenv } from 'dotenv';

const app = express();

configDotenv();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

import userRoutes from './routes/userRoutes.js';

app.use('/api/users', userRoutes);

app.use(express.json());
app.use(cors());

export default app;
