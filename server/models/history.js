import mongoose from "mongoose";

const Schema = mongoose.Schema;

const HistorySchema = new Schema ({
    printInfo: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    information: {
        type: String,
        required: false,
    },
});

const Printer = mongoose.model('printers', PrinterSchema);

export default Printer;