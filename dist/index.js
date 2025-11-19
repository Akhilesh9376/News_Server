"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const auth_1 = __importDefault(require("./routes/auth"));
const news_1 = __importDefault(require("./routes/news"));
const connection_1 = __importDefault(require("./config/connection"));
dotenv_1.default.config();
const app = (0, express_1.default)();
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
    origin: (origin, callback) => {
        if (!origin)
            return callback(null, true); // allow server-to-server/curl
        if (whitelist.includes(origin)) {
            console.log('[CORS] request origin:', origin);
            return callback(null, true); // allow
        }
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.options('*', (0, cors_1.default)(corsOptions)); // preflight handler
(0, connection_1.default)();
app.use(express_1.default.json());
// Routes
app.use('/api/auth/v1', auth_1.default);
app.use('/api/news', news_1.default);
app.get('/', (req, res) => {
    res.send('Express + TypeScript Server');
});
app.listen(port, () => {
    console.log(`[server]: Server is running on port ${port}`);
});
