import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import User, { IUser } from '@/models/Users';
import dbConnect from '@/utils/dbConnect';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await dbConnect();

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }

    const existingUser: IUser | null = await User.findOne({ username });
    if (existingUser) {
        return res.status(400).json({ error: 'User already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser: IUser = await User.create({ username, password: hashedPassword });

    res.status(201).json({ message: 'User created successfully.', user: newUser });
}
