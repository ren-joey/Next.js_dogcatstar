import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/dbConnect';
import Order from '@/models/Order';
import authMiddleware from '@/middleware/auth';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    await dbConnect();

    if (req.method === 'POST') {
        try {
            const { name, price } = req.body;
            if (!name || !price) {
                return res.status(400).json({ success: false, message: 'Name and price are required' });
            }

            const user = (req as any).user;

            const newOrder = await Order.create({
                name,
                price,
                user: user.userId,
            });

            res.status(201).json({ success: true, data: newOrder });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to create order', error });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};

export default authMiddleware(handler);
