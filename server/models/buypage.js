import mongoose from "mongoose";

const Schema = mongoose.Schema;

const BuyPageSchema = new Schema({
    type: {
        type: String,
        enum: ['A1', 'A2', 'A3', 'A4', 'A5'],
        default: 'A4',
    },
    quantity: {
        type: Number, 
        default: 1,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    time: {
        type: Date, // Thời gian yêu cầu mua
        default: Date.now,
    },
    userId: {
        type: String,
        required: true, 
    }
});

const BuyPage = mongoose.model('buypages', BuyPageSchema);

export default BuyPage;