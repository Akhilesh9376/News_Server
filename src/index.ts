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


// function-origin cors options (safer for credentials)
// const corsOptions = {
//   origin: (origin: string | undefined, callback: (err: Error | null, allow?: string | boolean) => void) => {
//     // allow requests with no origin (curl, Postman, server-to-server)
//     if (!origin) {
//       console.log('[CORS] no origin (server-to-server or curl). Allowing.');
//       return callback(null, true);
//     }
//     // debug log so you can see what the browser is sending
//     console.log(`[CORS] request origin: ${origin}`);
//     if (whitelist.indexOf(origin) !== -1) {
//       // IMPORTANT: return the origin string here (not boolean true) so the header is the exact origin
//       return callback(null, origin);
//     }
//     console.warn(`[CORS] blocked origin: ${origin}`);
//     return callback(new Error('Not allowed by CORS'));
//   },
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   credentials: true,
//   allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
//   exposedHeaders: ['Content-Length']
// };
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: string | boolean) => void) => {
    if (!origin) return callback(null, true); // allow server-to-server/curl
    if (whitelist.includes(origin)) {
      return callback(null, true); // allow
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
};



app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // preflight handler

// ----------------- add a small fallback header setter (optional but useful) -----------------
app.use((req, res, next) => {
  const origin = req.header('Origin') || '';
  if (!origin) return next();
  if (whitelist.includes(origin)) {
    // echo origin explicitly (must not be '*')
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
  }
  // fast-return for preflight
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// // IMPORTANT: apply CORS BEFORE routes and handle preflight early
// app.use(cors(corsOptions));
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


