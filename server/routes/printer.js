import express from "express";
import Printer from "../models/printer.js";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer memory storage (no disk storage needed)
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(file.originalname.toLowerCase().split('.').pop());
    const mimetype = fileTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG and PNG files are allowed"));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Upload to Cloudinary
const uploadToCloudinary = async (file) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "printers" }, // Store in 'printers' folder in Cloudinary
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.secure_url); // Return the public URL
        }
      }
    );
    stream.end(file.buffer);
  });
};

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
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid printer ID" });
    }
    const printer = await Printer.findById(id);
    if (!printer) {
      return res.status(404).json({ success: false, message: "Printer not found" });
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

  if (!name || !price || !type || !information) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  if (!req.file) {
    return res.status(400).json({ success: false, message: "Image is required" });
  }

  const priceNum = Number(price);
  if (isNaN(priceNum) || priceNum <= 0) {
    return res.status(400).json({ success: false, message: "Price must be a valid positive number" });
  }

  try {
    const imageUrl = await uploadToCloudinary(req.file);
    const newPrinter = new Printer({
      name,
      price: priceNum,
      type,
      image: imageUrl,
      status: "Enable",
      information,
    });
    await newPrinter.save();
    res.status(200).json({ success: true, message: "Create success", printer: newPrinter });
  } catch (error) {
    if (error instanceof multer.MulterError) {
      return res.status(400).json({ success: false, message: error.message });
    }
    if (error.message === "Only JPG and PNG files are allowed") {
      return res.status(400).json({ success: false, message: error.message });
    }
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Update a printer
router.put("/:id", upload.single("image"), async (req, res) => {
  const { name, price, type, information, status } = req.body;
  const { id } = req.params;

  if (!name || !price || !type || !information) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ success: false, message: "Invalid printer ID" });
  }

  const priceNum = Number(price);
  if (isNaN(priceNum) || priceNum <= 0) {
    return res.status(400).json({ success: false, message: "Price must be a valid positive number" });
  }

  try {
    let updatedPrinter = {
      name,
      price: priceNum,
      type,
      information,
    };

    if (req.file) {
      const oldPrinter = await Printer.findById(id);
      if (oldPrinter && oldPrinter.image) {
        const publicId = oldPrinter.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`printers/${publicId}`);
      }
      updatedPrinter.image = await uploadToCloudinary(req.file);
    }

    if (status !== undefined) {
      updatedPrinter.status = status;
    }

    const printer = await Printer.findOneAndUpdate({ _id: id }, updatedPrinter, {
      new: true,
    });

    if (!printer) {
      return res.status(404).json({ success: false, message: "Printer not found" });
    }

    res.json({ success: true, message: "Update successful!", updatedPrinter: printer });
  } catch (error) {
    if (error instanceof multer.MulterError) {
      return res.status(400).json({ success: false, message: error.message });
    }
    if (error.message === "Only JPG and PNG files are allowed") {
      return res.status(400).json({ success: false, message: error.message });
    }
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Delete a printer
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid printer ID" });
    }
    const deletedPrinter = await Printer.findOneAndDelete({ _id: id });
    if (!deletedPrinter) {
      return res.status(404).json({ success: false, message: "Printer not found" });
    }
    if (deletedPrinter.image) {
      const publicId = deletedPrinter.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`printers/${publicId}`);
    }
    res.json({ success: true, printer: deletedPrinter });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

export default router;