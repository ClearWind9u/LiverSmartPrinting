import mongoose from "mongoose";

const Schema = mongoose.Schema;

const balanceSchema = new Schema({
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

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please use a valid email address',
    ],
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  balancePage: {
      type: [balanceSchema],
      default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('users', UserSchema);

export default User;
