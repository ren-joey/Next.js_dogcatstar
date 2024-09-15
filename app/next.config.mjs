/** @type {import('next').NextConfig} */
import 'dotenv/config';

const nextConfig = {
    env: {
        JWT_SECRET: process.env.JWT_SECRET,
        MONGODB_URI: process.env.MONGODB_URI,
    }
};

export default nextConfig;
