/** @type {import('next').NextConfig} */
require('dotenv').config(); // eslint-disable-line

const nextConfig = {
    env: {
        JWT_SECRET: process.env.JWT_SECRET,
        MONGODB_URI: process.env.MONGODB_URI,
    }
};

export default nextConfig;
