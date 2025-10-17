import express from 'express';
import cors from 'cors';
import { configDotenv } from 'dotenv';

const app = express();

configDotenv();

app.use(express.json());
app.use(cors());

export default app;
