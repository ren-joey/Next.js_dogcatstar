import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

const authMiddleware = (handler: any) => async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ success: false, message: 'Authentication token is missing' });
        }

        // Validate JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        (req as any).user = decoded;

        return handler(req, res);
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Invalid or expired token', error });
    }
};

export default authMiddleware;
