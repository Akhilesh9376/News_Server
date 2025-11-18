import { Router } from 'express';
import {
    register,
    login,
    logout,
    changePassword
} from '../controllers/authController';
import auth from '../middleware/auth';

const router = Router();
router.post('/register', register);
// @route   POST api/auth/login
// @desc    Login employee
// @access  Public
router.post('/login', login);

// @route   POST api/auth/logout
// @desc    Logout employee
// @access  Private
router.post('/logout', auth, logout);

// @route   POST api/auth/v1/change-password
// @desc    Change password when logged in
// @access  Private
router.post('/change-password', auth, changePassword);

export default router;