import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/dbConnect';
import Order from '@/models/Order';
import authMiddleware from '@/middleware/auth';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    await dbConnect();

    if (req.method === 'PUT') {
        try {
            const { orderId, name, price } = req.body;
            if (!orderId || (!name && !price)) {
                return res.status(400).json({ success: false, message: 'Order ID and at least one field to update are required' });
            }

            const user = (req as any).user;

            const order = await Order.findById(orderId);

            if (!order) {
                return res.status(404).json({ success: false, message: 'Order not found' });
            }
            if (order.user.toString() !== user.userId) {
                return res.status(403).json({ success: false, message: 'You do not have permission to update this order' });
            }

            if (name) order.name = name;
            if (price) order.price = price;

            await order.save();

            res.status(200).json({ success: true, data: order });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Failed to update order', error });
        }
    } else {
        res.setHeader('Allow', ['PUT']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};

export default authMiddleware(handler);
