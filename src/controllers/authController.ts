import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Employee from '../models/Employee';
import { tokenBlocklist } from '../utils/tokenBlocklist';
import { signToken } from '../utils/jwt';

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        let employee = await Employee.findOne({ email });
        if (employee) {
            return res.status(400).json({ message: 'Employee already exists' });
        }

        employee = new Employee({
            name,
            email,
            password,
        });

        const salt = await bcrypt.genSalt(10);
        employee.password = await bcrypt.hash(password, salt);

        await employee.save();

        const payload = {
            employee: {
                id: employee.id,
            },
        };

        try {
            const token = signToken(payload);
            res.json({
                token,
                user: {
                    id: employee.id,
                    email: employee.email,
                    name: employee.name,
                    role: 'employee',
                },
            });
        } catch (err) {
            console.error('JWT sign failed:', err);
            return res.status(500).json({ message: 'Token generation failed' });
        }
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        let employee = await Employee.findOne({ email });
        if (!employee) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, employee.password);
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
            const token = signToken(payload);
            res.json({
                token,
                user: {
                    id: employee.id,
                    email: employee.email,
                    name: employee.name,
                    role: 'employee',
                },
            });
        } catch (err) {
            console.error('JWT sign failed:', err);
            return res.status(500).json({ message: 'Token generation failed' });
        }
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Logout employee
export const logout = (req: Request, res: Response) => {
    const token = req.header('x-auth-token');
    if (token) {
        tokenBlocklist.add(token);
    }
    res.json({ message: 'Logged out successfully' });
};

// Change password for logged-in employee
export const changePassword = async (req: any, res: Response) => {
    try {
        const employeeId = req.employee?.id;
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

        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        const isMatch = await bcrypt.compare(currentPassword, employee.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(newPassword, salt);
        employee.password = hashed;
        await employee.save();

        return res.json({ message: 'Password updated successfully' });
    } catch (err) {
        console.error('Change password error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};