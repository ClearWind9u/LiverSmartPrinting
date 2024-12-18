import express from "express";
import History from "../models/history.js";

const router = express.Router();

//View all histories
router.get('/', async (req, res) => {
    try {
        const histories = await History.find();
        res.json({ success: true, histories });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
});

// View history by userId
router.get('/user/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        // Tìm lịch sử theo userId
        const history = await History.find({ userId });
        // Nếu không có lịch sử, trả về thông báo
        if (!history || history.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No history found for this user',
            });
        }
        // Trả về dữ liệu lịch sử
        res.status(200).json({ success: true, history });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});

// View history by printerId
router.get('/printer/:printerId', async (req, res) => {
    const printerId = req.params.printerId;

    try {
        // Tìm lịch sử theo printerId
        const history = await History.find({ printerId });
        // Nếu không có lịch sử, trả về thông báo
        if (!history || history.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No history found for this printer',
            });
        }
        // Trả về dữ liệu lịch sử
        res.status(200).json({ success: true, history });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});

// Create a history
router.post('/create', async (req, res) => {
    const { fileName, noCopy, colorMode, orientation, multiplePage, size, pageRange, side, userId, printerId } = req.body;

    try {
        // Kiểm tra các thông tin cần thiết
        if (!fileName || !noCopy || !colorMode || !orientation || !size || !userId || !printerId) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: fileName, noCopy, colorMode, orientation, size, userId, printerId',
            });
        }

        // Tạo đối tượng printInfo dựa trên dữ liệu đầu vào
        const printInfo = {
            fileName,
            noCopy,
            colorMode,
            orientation,
            multiplePage,
            size,
            pageRange, 
            side,
            time: Date.now(), 
        };

        // Tạo một đối tượng lịch sử mới
        const newHistory = new History({
            printInfo: [printInfo], 
            userId, 
            printerId,
        });

        // Lưu vào cơ sở dữ liệu
        await newHistory.save();

        res.status(200).json({
            success: true,
            message: 'Create success',
            history: newHistory,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});

//Delete a history
router.delete('/:id', async (req, res) => {
    try {
        const postDeleteCondition = { _id: req.params.id };
        const deletedHistory = await History.findOneAndDelete(postDeleteCondition);
        //User not authorised or history not found
        if (!deletedHistory)
            return res.status(401).json({ success: false, message: 'History not found or user not authorise' })
        res.json({ success: true, history: deletedHistory });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
});

// Delete histories by printerId
router.delete('/printer/:printerId', async (req, res) => {
    const printerId = req.params.printerId;
    try {
        // Xóa tất cả lịch sử có printerId trùng khớp
        const deletedHistories = await History.deleteMany({ printerId });

        // Kiểm tra nếu không có lịch sử nào bị xóa
        if (deletedHistories.deletedCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'No histories found for this printer to delete',
            });
        }

        res.json({
            success: true,
            message: 'Histories associated with printer deleted successfully',
            deletedCount: deletedHistories.deletedCount,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});

// Delete histories by userId
router.delete('/user/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        // Xóa tất cả lịch sử có userId trùng khớp
        const deletedHistories = await History.deleteMany({ userId });

        // Kiểm tra nếu không có lịch sử nào bị xóa
        if (deletedHistories.deletedCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'No histories found for this user to delete',
            });
        }
        res.json({
            success: true,
            message: 'Histories associated with user deleted successfully',
            deletedCount: deletedHistories.deletedCount,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});

export default router;