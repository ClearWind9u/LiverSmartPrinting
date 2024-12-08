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
    const { type, price, balance } = req.body
    if (!type || !price)
        return res.status(400).json({ success: false, message: 'Type and price are required' })
    try {
        const newBalancePage = new BalancePage({ type, price, balance })
        await newBalancePage.save()
        res.status(200).json({ success: true, message: 'Create success', balancePage: newBalancePage })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
});

//Update a balancePage
router.put('/:id', async (req, res) => {
    const { type, price, balance } = req.body
    try {
        let updatedBalancePage = { type, price, balance };
        const postUpdateCondition = { _id: req.params.id };
        updatedBalancePage = await BalancePage.findOneAndUpdate(postUpdateCondition, updatedBalancePage, { new: true });
        //User not authorised to update printer
        if (!updatedBalancePage)
            return res.status(401).json({ success: false, message: 'Balance Page not found or user not authorise' })
        res.json({ success: true, message: 'Update successfull!', updatedBalancePage });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Internal server error' })
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