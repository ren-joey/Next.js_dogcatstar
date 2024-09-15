import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/dbConnect';
import Order from '@/models/Order';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await dbConnect();

    if (req.method === 'GET') {
        try {
            const orders = await Order.find().populate('name', 'user', );
            res.status(200).json({ success: true, data: orders });
        } catch (error) {
            console.error('Error fetching orders:', error);

            res.status(500).json({ success: false, message: 'Failed to fetch orders', error });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
