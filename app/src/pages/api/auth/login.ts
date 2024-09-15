import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '@/models/Users';
import dbConnect from '@/utils/dbConnect';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await dbConnect();

    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
        return res.status(400).json({ error: 'User does not exist.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({ error: 'Invalid password.' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });

    res.status(200).json({ message: 'Logged in successfully.', token });
}
