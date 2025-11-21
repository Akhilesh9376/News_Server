"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJwtSecret = getJwtSecret;
exports.getJwtExpiresIn = getJwtExpiresIn;
exports.signToken = signToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function getJwtSecret() {
    const raw = (process.env.JWT_SECRET || 'your_jwt_secret').trim();
    if (!raw) {
        throw new Error('JWT_SECRET is missing or empty');
    }
    return raw;
}
// Basic validator for expiresIn; falls back to '1h' if invalid
function getJwtExpiresIn() {
    const raw = (process.env.JWT_EXPIRES_IN || '3600').trim();
    // numeric seconds
    if (/^\d+$/.test(raw)) {
        return parseInt(raw, 10);
    }
    // ms-style string values: 60s, 30m, 1h, 2d, or with space like '60 s'
    if (/^\d+\s*[smhd]$/.test(raw) || /^(\d+)\s*(seconds?|minutes?|hours?|days?)$/.test(raw)) {
        return raw;
    }
    // fallback to 1 hour
    return 3600;
}
function signToken(payload, options = {}) {
    const secret = getJwtSecret();
    const expiresIn = getJwtExpiresIn();
    return jsonwebtoken_1.default.sign(payload, secret, Object.assign({ expiresIn }, options));
}
