import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import userRouter from "./routes/user.js";
import printerRouter from "./routes/printer.js";
import historyRouter from "./routes/history.js";
import buyPageRouter from "./routes/buypage.js";
import balancePageRouter from "./routes/balance.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URL}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

connectDB();

// Routes
app.use("/", userRouter);
app.use("/printers", printerRouter);
app.use("/histories", historyRouter);
app.use("/pages", buyPageRouter);
app.use("/balance", balancePageRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal server error" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));