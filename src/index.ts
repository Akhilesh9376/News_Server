import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/auth';
import newsRoutes from './routes/news';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;
const corsOptions = {
    origin: ['http://localhost:8080',
            'https://news-client-iota.vercel.app/'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,               // <- allows Access-Control-Allow-Credentials: true
  allowedHeaders: ['Content-Type','Authorization'] // optional
};
app.use(cors(corsOptions));
// handle preflight for all routes (optional but safe)
// app.options('*', cors(corsOptions));
app.use(express.json());

// Define Routes
app.use('/api/auth/v1', authRoutes);
app.use('/api/news', newsRoutes);

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/news-app';

mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});