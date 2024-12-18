import express from "express";
import BalancePage from "../models/balance.js";

const router = express.Router();

//View balancePages 
router.get('/', async (req, res) => {
    try {
        const balancePages = await BalancePage.find();
        res.json({ success: true, balancePages });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
});

//Create a balancePage
router.post('/create', async (req, res) => {
    const { type, price, balance } = req.body;
    if (!type || !price)
        return res.status(400).json({ success: false, message: 'Type and price are required' });
    try {
        // Kiểm tra type đã tồn tại chưa
        const existingBalancePage = await BalancePage.findOne({ type });
        if (existingBalancePage)
            return res.status(400).json({ success: false, message: 'Type already exists' });

        const newBalancePage = new BalancePage({ type, price, balance });
        await newBalancePage.save();
        res.status(200).json({ success: true, message: 'Create success', balancePage: newBalancePage });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Update a balancePage
router.put('/:id', async (req, res) => {
    const { type, price, balance } = req.body;
    try {
        // Kiểm tra type có bị trùng với bản ghi khác hay không
        const existingBalancePage = await BalancePage.findOne({ type, _id: { $ne: req.params.id } });
        if (existingBalancePage) {
            return res.status(400).json({ success: false, message: 'Type already exists' });
        }

        // Cập nhật thông tin
        const updatedData = { type, price, balance };
        const postUpdateCondition = { _id: req.params.id };
        const updatedBalancePage = await BalancePage.findOneAndUpdate(
            postUpdateCondition,
            updatedData,
            { new: true } // Trả về dữ liệu mới sau khi cập nhật
        );
        if (!updatedBalancePage) {
            return res.status(404).json({ success: false, message: 'Balance Page not found or user not authorised' });
        }
        res.json({ success: true, message: 'Update successful!', updatedBalancePage });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

//Delete a balancePage
router.delete('/:id', async (req, res) => {
    try {
        const postDeleteCondition = { _id: req.params.id };
        const deletedBalancePage = await BalancePage.findOneAndDelete(postDeleteCondition);
        //User not authorised or printer not found
        if (!deletedBalancePage)
            return res.status(401).json({ success: false, message: 'Balance Page not found or user not authorise' })
        res.json({ success: true, balancePage: deletedBalancePage });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
});

export default router;