import mongoose from 'mongoose';

const MONGODB_URI: string = process.env.MONGODB_URI || 'your_mongodb_connection_string';

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable.');
}

let cached = (global as any).mongoose;

if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
            return mongoose;
        });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}

export default dbConnect;
