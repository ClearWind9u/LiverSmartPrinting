import mongoose from "mongoose";

const Schema = mongoose.Schema;

const PrinterSchema = new Schema ({
    name: {
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
    status: {
        type: String,
        enum: ['Enable', 'Disable'],
        default: 'Enable',
    },
    information: {
        type: String,
        required: false,
    },
});

const Printer = mongoose.model('printers', PrinterSchema);

export default Printer;