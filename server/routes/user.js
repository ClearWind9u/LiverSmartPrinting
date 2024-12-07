import argon2 from "argon2";
import express from "express";
//import jwt from "jsonwebtoken";

import User from "../models/user.js";

const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password, username, role } = req.body;

  if (!email || !password || !username) {
    return res
      .status(400)
      .json({ success: false, message: 'Missing email, password and/or username' });
  }

  try {
    // Kiểm tra xem email đã tồn tại hay chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: 'Email already taken' });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await argon2.hash(password);
    const balancePage = [];
    const newUser = new User({ username, email, password: hashedPassword, role, balancePage });
    await newUser.save();
    res.json({ success: true, message: 'User created successfully', newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(200)
      .json({ success: false, message: 'Missing email and/or password' });
  }

  try {
    // Tìm người dùng theo email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({ success: false, message: 'Incorrect email' });
    }

    // Xác thực mật khẩu
    const passwordValid = await argon2.verify(user.password, password);
    if (!passwordValid) {
      return res.status(200).json({ success: false, message: 'Incorrect password' });
    }

    res.json({ success: true, message: 'User logged in successfully', user });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: 'Internal server error' });
  }
});

//Cập nhật thông tin người dùng
router.put('/update/:userId', async (req, res) => {
  const { email, username, role } = req.body;
  const userId = req.params.userId;

  try {
    // Tìm người dùng theo userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    // Kiểm tra xem email có bị trùng lặp với email của người dùng khác không
    const existingUserWithEmail = await User.findOne({ email });
    if (existingUserWithEmail && existingUserWithEmail._id.toString() !== userId) {
      return res.status(400).json({
        success: false,
        message: 'Email is already taken by another user',
      });
    }
    user.email = email;
    user.username = username;
    user.role = role;
    const updatedUser = await user.save();

    // Trả về phản hồi với thông báo và đối tượng người dùng đã cập nhật
    res.json({
      success: true,
      message: 'Excellent progress!',
      updatedHistory: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

//Cập nhật số dư trang của người dùng
router.put('/update-balance/:userId', async (req, res) => {
  const { addPage } = req.body;
  const userId = req.params.userId;

  // Kiểm tra dữ liệu đầu vào
  if (!userId || addPage === undefined) {
    return res.status(400).json({
      success: false,
      message: 'Missing userId and/or addPage',
    });
  }

  try {
    // Tìm người dùng theo userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    // Cập nhật balancePage
    user.balancePage += addPage;
    const updatedUser = await user.save(); 

    // Trả về phản hồi với thông báo và đối tượng người dùng đã cập nhật
    res.json({
      success: true,
      message: 'Excellent progress!',
      updatedHistory: updatedUser,
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