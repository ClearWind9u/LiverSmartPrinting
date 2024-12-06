import argon2 from "argon2";
import express from "express";
import jwt from "jsonwebtoken";

import User from "../models/user.js";

const router = express.Router();

router.post('/register', async (req, res) => {
    const { email, password, role } = req.body;
  
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: 'Missing email and/or password' });
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
      const newUser = new User({ email, password: hashedPassword, role });
      await newUser.save();
      res.json({ success: true, message: 'User created successfully' });
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
  

export default router;

