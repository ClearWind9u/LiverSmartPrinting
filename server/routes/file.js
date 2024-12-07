import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { PDFDocument, rgb } from "pdf-lib";
import fs from "fs";
import fetch from "node-fetch";
import FileModel from "../models/file.js"; // Model File trong MongoDB

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname, "../uploads")); // Thư mục lưu trữ
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed."), false);
    }
  },
});

// Endpoint nhận file và lưu vào cơ sở dữ liệu
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ success: false, message: "No file uploaded." });
    }

    // Lưu thông tin file vào database
    const fileData = {
      originalName: file.originalname,
      path: `/uploads/${file.filename}`,
      size: file.size,
      mimetype: file.mimetype,
    };

    const savedFile = await FileModel.create(fileData);

    // Trả về thông tin file sau khi lưu
    res.status(200).json({
      success: true,
      file: savedFile,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ success: false, message: "Error uploading file." });
  }
});

router.post("/update", async (req, res) => {
  try {
    const { fileUrl, settings } = req.body;

    // Tải file từ fileUrl
    const fileResponse = await fetch(fileUrl);
    if (!fileResponse.ok) {
      throw new Error("Failed to fetch the file.");
    }
    const pdfBuffer = await fileResponse.arrayBuffer();

    // Tạo tài liệu PDF từ buffer
    const pdfDoc = await PDFDocument.load(pdfBuffer);

    // Áp dụng các cài đặt (ví dụ: số bản sao, trang, ...)
    const { copies, colorMode, pageOrientation, pagesPerSheet, pageSize, pageRange, printSides } = settings;

    // Xử lý ví dụ: Cắt trang, thay đổi kích thước hoặc các tính năng khác
    // Ở đây bạn cần tùy chỉnh xử lý dựa trên thư viện pdf-lib
    if (pageRange !== "All") {
      const pageRanges = pageRange.split("-").map(Number);
      const pagesToKeep = Array.from(
        { length: pageRanges[1] - pageRanges[0] + 1 },
        (_, i) => pageRanges[0] + i - 1
      );
      pdfDoc.reorderPages(pagesToKeep);
    }

    // Xuất file PDF đã chỉnh sửa
    const updatedPdfBuffer = await pdfDoc.save();

    // Lưu file mới
    const updatedFilePath = `/uploads/updated-file-${Date.now()}.pdf`;
    const absolutePath = path.join(__dirname, "../public", updatedFilePath);
    fs.writeFileSync(absolutePath, updatedPdfBuffer);

    res.status(200).json({ success: true, updatedFilePath });
  } catch (error) {
    console.error("Error updating file:", error);
    res.status(500).json({ success: false, message: "Failed to update the file." });
  }
});

export default router;
