import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { tokenBlocklist } from '../utils/tokenBlocklist';

export default function (req: any, res: Response, next: NextFunction) {
    // Support both x-auth-token and Authorization: Bearer <token>
    let token = req.header('x-auth-token');
    const authHeader = req.header('authorization') || req.header('Authorization');
    if (!token && authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
    }

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    if (tokenBlocklist.has(token)) {
        return res.status(401).json({ message: 'Token is invalid. Please log in again.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET! as string) as { employee: { id: string } };
        req.employee = decoded.employee;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
}