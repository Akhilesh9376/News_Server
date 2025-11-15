"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const auth_1 = __importDefault(require("./routes/auth"));
const news_1 = __importDefault(require("./routes/news"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
const corsOptions = {
    origin: 'http://localhost:8080', // exact origin (no wildcard)
    credentials: true, // <- allows Access-Control-Allow-Credentials: true
    // allowedHeaders: ['Content-Type','Authorization'] // optional
};
app.use((0, cors_1.default)(corsOptions));
// handle preflight for all routes (optional but safe)
// app.options('*', cors(corsOptions));
app.use(express_1.default.json());
// Define Routes
app.use('/api/auth/v1', auth_1.default);
app.use('/api/news', news_1.default);
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/news-app';
mongoose_1.default.connect(MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));
app.get('/', (req, res) => {
    res.send('Express + TypeScript Server');
});
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
