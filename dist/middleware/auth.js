"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const tokenBlocklist_1 = require("../utils/tokenBlocklist");
function default_1(req, res, next) {
    // Support both x-auth-token and Authorization: Bearer <token>
    let token = req.header('x-auth-token');
    const authHeader = req.header('authorization') || req.header('Authorization');
    if (!token && authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
    }
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }
    if (tokenBlocklist_1.tokenBlocklist.has(token)) {
        return res.status(401).json({ message: 'Token is invalid. Please log in again.' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.employee = decoded.employee;
        next();
    }
    catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
}
exports.default = default_1;
