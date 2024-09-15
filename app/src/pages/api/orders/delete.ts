import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/dbConnect';
import Order from '@/models/Order';
import authMiddleware from '@/middleware/auth';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    await dbConnect();

    if (req.method === 'DELETE') {
        try {
            const { orderId } = req.body;
            if (!orderId) {
                return res.status(400).json({ success: false, message: 'Order ID is required' });
            }

            const user = (req as any).user;

            const order = await Order.findById(orderId);

            if (!order) {
                return res.status(404).json({ success: false, message: 'Order not found' });
            }
            if (order.user.toString() !== user.userId) {
                return res.status(403).json({ success: false, message: 'You do not have permission to delete this order' });
            }

            await Order.findByIdAndDelete(orderId);

            res.status(200).json({ success: true, message: 'Order deleted successfully' });
        } catch (error) {
            console.error('Failed to delete order:', error);

            res.status(500).json({ success: false, message: 'Failed to delete order', error });
        }
    } else {
        res.setHeader('Allow', ['DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};

export default authMiddleware(handler);