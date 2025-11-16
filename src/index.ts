import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/auth';
import newsRoutes from './routes/news';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

// whitelist (dev + prod)
const whitelist = [
  'http://localhost:3000',
  'http://localhost:8080',
  'https://news-client-iota.vercel.app' // note: NO trailing slash
];

// function-origin cors options (safer for credentials)
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // allow requests with no origin (curl, Postman, server-to-server)
    if (!origin) return callback(null, true);
    if (whitelist.indexOf(origin) !== -1) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Content-Length']
};

// IMPORTANT: apply CORS BEFORE routes and handle preflight early
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // preflight handler

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/news-app';

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.listen(port, () => {
  console.log(`[server]: Server is running on port ${port}`);
});
