import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './Users';

export interface IOrder extends Document {
  name: string;
  price: number;
  user: IUser['_id'];
}

const OrderSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
