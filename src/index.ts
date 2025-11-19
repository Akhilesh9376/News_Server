import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/auth';
import newsRoutes from './routes/news';
import connectDb from './config/connection';
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

const whitelist = [
  'http://localhost:3000',
  'http://localhost:8080',
  'https://news-client-iota.vercel.app'
];
app.use((req, res, next) => {
  console.log('[DEBUG] Origin header received:', req.headers.origin);
  next();
});


const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: string | boolean) => void) => {
    if (!origin) return callback(null, true); // allow server-to-server/curl
    if (whitelist.includes(origin)) {
      console.log('[CORS] request origin:',origin) ;
      return callback(null, true); // allow
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
};

app.use(cors(corsOptions));
// app.options('*', cors(corsOptions)); // preflight handler


connectDb();
app.use(express.json());

// Routes
app.use('/api/auth/v1', authRoutes);
app.use('/api/news', newsRoutes);


app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.listen(port, () => {
  console.log(`[server]: Server is running on port ${port}`);
});


