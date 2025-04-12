import express from "express";
import Printer from "../models/printer.js";
import multer from "multer";
import path from "path";

const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Store files in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // e.g., 1631234567890-123456789.jpg
  },
});

// File filter to accept only JPG and PNG
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Only JPG and PNG files are allowed"));
  }
};

// Initialize multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit to 5MB
});

// View printers
router.get("/", async (req, res) => {
  try {
    const printers = await Printer.find();
    res.json({ success: true, printers });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// View printer by printerId
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const printer = await Printer.findById(id);
    if (!printer) {
      return res.status(404).json({
        success: false,
        message: "Printer not found",
      });
    }
    res.json({ success: true, printer });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Add a printer
router.post("/create", upload.single("image"), async (req, res) => {
  const { name, price, type, information } = req.body;

  // Validate required fields
  if (!name || !price || !type || !information) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  // Check if file was uploaded
  if (!req.file) {
    return res.status(400).json({ success: false, message: "Image is required" });
  }

  try {
    const newPrinter = new Printer({
      name,
      price,
      type,
      image: `/uploads/${req.file.filename}`, // Store relative path
      status: "Enable",
      information,
    });
    await newPrinter.save();
    res.status(200).json({ success: true, message: "Create success", printer: newPrinter });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Update a printer
router.put("/:id", upload.single("image"), async (req, res) => {
  const { name, price, type, information, status } = req.body;
  const { id } = req.params;

  // Validate required fields
  if (!name || !price || !type || !information) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    let updatedPrinter = {
      name,
      price,
      type,
      information,
    };

    // If a new image is uploaded, update the image path
    if (req.file) {
      updatedPrinter.image = `/uploads/${req.file.filename}`;
    }

    // If status is provided, update it
    if (status !== undefined) {
      updatedPrinter.status = status;
    }

    const postUpdateCondition = { _id: id };
    const printer = await Printer.findOneAndUpdate(postUpdateCondition, updatedPrinter, {
      new: true,
    });

    // If printer not found
    if (!printer) {
      return res.status(404).json({
        success: false,
        message: "Printer not found",
      });
    }

    res.json({ success: true, message: "Update successful!", updatedPrinter: printer });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Delete a printer
router.delete("/:id", async (req, res) => {
  try {
    const postDeleteCondition = { _id: req.params.id };
    const deletedPrinter = await Printer.findOneAndDelete(postDeleteCondition);
    // User not authorised or printer not found
    if (!deletedPrinter) {
      return res.status(401).json({
        success: false,
        message: "Printer not found or user not authorised",
      });
    }
    res.json({ success: true, printer: deletedPrinter });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

export default router;