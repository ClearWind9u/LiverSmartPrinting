import express from "express";
import Printer from "../models/printer.js";
import VerifyToken from "../middleware/auth.js";

const router = express.Router();

//View printers
router.get('/', async (req, res) => {
    try {
        const printers = await Printer.find();
        res.json({ success: true, printers });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
});

//View printer with id
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const printer = await Printer.findById(id);
        res.json({ success: true, printer });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
});

//Create a printer
router.post('/create', async (req, res) => {
    const { name, price, type, image, information } = req.body
    if (!name)
        return res.status(400).json({ success: false, message: 'Name is required' })
    try {
        const newPrinter = new Printer({ name, price, type, image, information })
        await newPrinter.save()
        res.status(200).json({ success: true, message: 'Create success', printer: newPrinter })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
});

//Update a printer
router.put('/:id', async (req, res) => {
    const { name, price, type, image, information } = req.body
    try {
        let updatedPrinter = { name, price, type, image, information };
        const postUpdateCondition = { _id: req.params.id };
        updatedPrinter = await Printer.findOneAndUpdate(postUpdateCondition, updatedPrinter, { new: true });
        //User not authorised to update printer
        if (!updatedPrinter)
            return res.status(401).json({ success: false, message: 'Printer not found or user not authorise' })
        res.json({ success: true, message: 'Excellent progress!', updatedPrinter });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
});

//Delete a printer
router.delete('/:id', async (req, res) => {
    try {
        const postDeleteCondition = { _id: req.params.id };
        const deletedPrinter = await Printer.findOneAndDelete(postDeleteCondition);
        //User not authorised or printer not found
        if (!deletedPrinter)
            return res.status(401).json({ success: false, message: 'Printer not found or user not authorise' })
        res.json({ success: true, printer: deletedPrinter });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
});

export default router;

