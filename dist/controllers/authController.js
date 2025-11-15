"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.logout = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const Employee_1 = __importDefault(require("../models/Employee"));
const tokenBlocklist_1 = require("../utils/tokenBlocklist");
const jwt_1 = require("../utils/jwt");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        let employee = yield Employee_1.default.findOne({ email });
        if (employee) {
            return res.status(400).json({ message: 'Employee already exists' });
        }
        employee = new Employee_1.default({
            name,
            email,
            password,
        });
        const salt = yield bcryptjs_1.default.genSalt(10);
        employee.password = yield bcryptjs_1.default.hash(password, salt);
        yield employee.save();
        const payload = {
            employee: {
                id: employee.id,
            },
        };
        try {
            const token = (0, jwt_1.signToken)(payload);
            res.json({
                token,
                user: {
                    id: employee.id,
                    email: employee.email,
                    name: employee.name,
                    role: 'employee',
                },
            });
        }
        catch (err) {
            console.error('JWT sign failed:', err);
            return res.status(500).json({ message: 'Token generation failed' });
        }
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        let employee = yield Employee_1.default.findOne({ email });
        if (!employee) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = yield bcryptjs_1.default.compare(password, employee.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const payload = {
            employee: {
                id: employee.id,
                name: employee.name,
                email: employee.email,
                role: "employee",
            },
        };
        try {
            const token = (0, jwt_1.signToken)(payload);
            res.json({
                token,
                user: {
                    id: employee.id,
                    email: employee.email,
                    name: employee.name,
                    role: 'employee',
                },
            });
        }
        catch (err) {
            console.error('JWT sign failed:', err);
            return res.status(500).json({ message: 'Token generation failed' });
        }
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});
exports.login = login;
// Logout employee
const logout = (req, res) => {
    const token = req.header('x-auth-token');
    if (token) {
        tokenBlocklist_1.tokenBlocklist.add(token);
    }
    res.json({ message: 'Logged out successfully' });
};
exports.logout = logout;
// Change password for logged-in employee
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const employeeId = (_a = req.employee) === null || _a === void 0 ? void 0 : _a.id;
        const { currentPassword, newPassword } = req.body || {};
        if (!employeeId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Current and new password are required' });
        }
        if (typeof newPassword !== 'string' || newPassword.length < 8) {
            return res.status(400).json({ message: 'New password must be at least 8 characters' });
        }
        // Optional: enforce complexity (uppercase, lowercase, number)
        const complexity = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
        if (!complexity.test(newPassword)) {
            return res.status(400).json({ message: 'New password must contain uppercase, lowercase, and a number' });
        }
        const employee = yield Employee_1.default.findById(employeeId);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        const isMatch = yield bcryptjs_1.default.compare(currentPassword, employee.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashed = yield bcryptjs_1.default.hash(newPassword, salt);
        employee.password = hashed;
        yield employee.save();
        return res.json({ message: 'Password updated successfully' });
    }
    catch (err) {
        console.error('Change password error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
});
exports.changePassword = changePassword;
