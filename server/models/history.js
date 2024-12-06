import mongoose from "mongoose";

const Schema = mongoose.Schema;

const printInfoSchema = new Schema({
    fileUrl: {
        type: String, // Đường dẫn tới file cần in
        required: true,
    },
    noCopy: {
        type: Number, // Số lượng bản sao
        required: true,
        min: 1, // Giá trị tối thiểu là 1
    },
    orientation: {
        type: String, // Hướng giấy in: theo tài liệu hoặc ngang (landscape) hoặc dọc (portrait)
        enum: ['as in document', 'portrait', 'landscape'],
        default: 'as in document',
    },
    multiplePage: {
        type: Number, // Số lượng trang in trên một tờ giấy
        default: 1,
    },
    size: {
        type: String, // Kích thước giấy in: A4, A3, Letter, v.v.
        enum: ['A4', 'A3', 'Letter', 'Legal'],
        default: 'A4',
    },
    pageRange: {
        type: String, // Phạm vi trang in, ví dụ: "1-5", "2,4,6"
        default: 'all', // Nếu không chỉ định, in tất cả các trang
    },
    time: {
        type: Date, // Thời gian yêu cầu in
        default: Date.now,
    },
});

const HistorySchema = new Schema({
    printInfo: {
        type: [printInfoSchema],
        default: []
    },
    userId: {
        type: String,
        required: true, 
    },
    printerId: {
        type: String,
        required: true, 
    }
});

const History = mongoose.model('histories', HistorySchema);

export default History;