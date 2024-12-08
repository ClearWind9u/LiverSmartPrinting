import mongoose from "mongoose";

const Schema = mongoose.Schema;

const balancePageSchema = new Schema({
  type: {
      type: String,
      enum: ['A0', 'A1', 'A2', 'A3', 'A4', 'A5'],
      required: true,
  },
  price: {
      type: Number,
      required: true,
  },
  balance: {
      type: Number,
      default: 0,
  }
});

const BalancePage = mongoose.model('balancepages', balancePageSchema);

export default BalancePage;