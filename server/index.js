import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Tạo __filename và __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

import userRouter from "./routes/user.js";
import printerRouter from "./routes/printer.js";
import historyRouter from "./routes/history.js";
import buyPageRouter from "./routes/buypage.js";
import balancePageRouter from "./routes/balance.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_URL}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            tlsAllowInvalidCertificates: true,
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
}

connectDB();

app.use('/', userRouter);
app.use('/printers', printerRouter);
app.use('/histories', historyRouter);
app.use('/pages', buyPageRouter);
app.use('/balance', balancePageRouter);
// app.use("/public", express.static(path.join(__dirname, "public")));

const PORT = 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))