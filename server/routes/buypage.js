import express from "express";
import BuyPage from "../models/buypage.js";

const router = express.Router();

//View all buypages
router.get('/', async (req, res) => {
    try {
        const buypages = await BuyPage.find();
        res.json({ success: true, buypages });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
});

// View buypage by userId
router.get('/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        // Tìm lịch sử theo userId
        const buypage = await BuyPage.find({ userId });
        // Nếu không có lịch sử, trả về thông báo
        if (!buypage || buypage.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No buypage found for this user',
            });
        }
        // Trả về dữ liệu lịch sử
        res.status(200).json({ success: true, buypage });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});

// Create a buypage
router.post('/create', async (req, res) => {
    const { type, quantity, totalPrice, userId } = req.body;

    try {
        // Kiểm tra các thông tin cần thiết
        if (!type || !quantity || !totalPrice || !userId) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: type, quantity, totalPerice, userId',
            });
        }

        // Tạo một đối tượng mới
        const newBuyPage = new BuyPage({
            type,
            quantity,
            totalPrice,
            time: Date.now(),
            userId,
        });

        // Lưu vào cơ sở dữ liệu
        await newBuyPage.save();

        res.status(200).json({
            success: true,
            message: 'Create success',
            history: newBuyPage,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});

export default router;