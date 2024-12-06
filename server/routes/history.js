import express from "express";
import History from "../models/history.js";

const router = express.Router();

//View histories
router.get('/', async (req, res) => {
    try {
        const historys = await History.find();
        res.json({ success: true, historys });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
});

//View history with id
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const history = await History.findById(id);
        res.json({ success: true, history });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
});

// Create a history
router.post('/create', async (req, res) => {
    const { fileUrl, noCopy, orientation, multiplePage, size, pageRange, userId, printerId } = req.body;

    try {
        // Kiểm tra các thông tin cần thiết
        if (!fileUrl || !noCopy || !orientation || !size || !userId || !printerId) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: fileUrl, noCopy, orientation, size, userId, printerId',
            });
        }

        // Tạo đối tượng printInfo dựa trên dữ liệu đầu vào
        const printInfo = {
            fileUrl,
            noCopy,
            orientation,
            multiplePage,
            size,
            pageRange, 
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

//Update a history
router.put('/:id', async (req, res) => {
    const { name, price, type, image, information } = req.body
    try {
        let updatedHistory = { name, price, type, image, information };
        const postUpdateCondition = { _id: req.params.id };
        updatedHistory = await History.findOneAndUpdate(postUpdateCondition, updatedHistory, { new: true });
        //User not authorised to update history
        if (!updatedHistory)
            return res.status(401).json({ success: false, message: 'History not found or user not authorise' })
        res.json({ success: true, message: 'Excellent progress!', updatedHistory });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Internal server error' })
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

export default router;

