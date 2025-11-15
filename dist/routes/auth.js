"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const auth_1 = __importDefault(require("../middleware/auth"));
const router = (0, express_1.Router)();
router.post('/register', authController_1.register);
// @desc    Login employee
// @access  Public
router.post('/login', authController_1.login);
// @route   POST api/auth/logout
// @desc    Logout employee
// @access  Private
router.post('/logout', auth_1.default, authController_1.logout);
// @route   POST api/auth/v1/change-password
// @desc    Change password when logged in
// @access  Private
router.post('/change-password', auth_1.default, authController_1.changePassword);
exports.default = router;
