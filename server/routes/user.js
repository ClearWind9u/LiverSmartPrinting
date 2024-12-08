import argon2 from "argon2";
import express from "express";
//import jwt from "jsonwebtoken";

import User from "../models/user.js";
import BalancePage from "../models/balance.js";

const router = express.Router();

//Create (Register) a user 
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
    const balancePages = await BalancePage.find();

    // Tạo danh sách balancePage cho người dùng
    const userBalancePage = role === 'admin'
      ? [] // Admin có balancePage rỗng
      : balancePages.map((page) => ({
        type: page.type,
        balance: page.balance,
      }));
    let wallet = 0; 

    const newUser = new User({ username, email, password: hashedPassword, role, balancePage: userBalancePage, wallet });
    await newUser.save();
    res.json({ success: true, message: 'User created successfully', newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

//Đăng nhập (email và password)
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

// Xem thông tin chi tiết của người dùng
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Tìm người dùng theo userId
    const user = await User.findById(userId).select('-password'); // Không trả về trường password
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Trả về thông tin người dùng
    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

//Cập nhật thông tin người dùng
router.put('/update/:userId', async (req, res) => {
  const { email, username } = req.body;
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
    const updatedUser = await user.save();

    // Trả về phản hồi với thông báo và đối tượng người dùng đã cập nhật
    res.json({
      success: true,
      message: 'Update successful!',
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

// Xóa người dùng theo userId
router.delete('/delete/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Tìm và xóa người dùng
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully',
      deletedUser, // Trả về thông tin người dùng đã bị xóa
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

//Xem số dư trang theo loại giấy của người dùng
router.get('/balance/:type/:userId', async (req, res) => {
  const { type, userId } = req.params;

  try {
    // Truy vấn người dùng theo ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Tìm kiếm loại giấy trong balancePage
    let balanceInfo = user.balancePage.find((item) => item.type === type);

    // Nếu loại giấy không tồn tại, thêm loại giấy mới với balance = 0
    if (!balanceInfo) {
      balanceInfo = { type: type, balance: 0 };
      user.balancePage.push(balanceInfo);
      await user.save(); // Cập nhật người dùng trong cơ sở dữ liệu
    }

    // Trả về số dư của loại giấy
    res.json({
      success: true,
      data: {
        type: balanceInfo.type,
        balance: balanceInfo.balance,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

//Cập nhật số dư trang của người dùng
router.put('/update-balance/:userId', async (req, res) => {
  const { pageSize, changePage } = req.body;
  const userId = req.params.userId;

  // Kiểm tra dữ liệu đầu vào
  if (!userId || !pageSize || changePage === undefined) {
    return res.status(400).json({
      success: false,
      message: 'Missing userId, pageSize and/or changePage',
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

    // Tìm loại giấy trong balancePage
    let balanceInfo = user.balancePage.find((item) => item.type === pageSize);

    // Nếu loại giấy không tồn tại, thêm mới với số dư = 0
    if (!balanceInfo) {
      if (changePage < 0) {
        return res.status(400).json({
          success: false,
          message: `Insufficient balance for paper size ${pageSize}`,
        });
      }

      balanceInfo = { type: pageSize, balance: 0 };
      user.balancePage.push(balanceInfo);
    }

    // Kiểm tra và cập nhật số dư
    if (changePage < 0 && balanceInfo.balance + changePage < 0) {
      return res.status(400).json({
        success: false,
        message: `Insufficient balance for paper size ${pageSize}`,
      });
    }

    balanceInfo.balance += changePage;

    // Lưu cập nhật vào cơ sở dữ liệu
    await user.save();

    res.json({
      success: true,
      message: 'Balance updated successfully',
      updatedBalance: balanceInfo,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// Cập nhật wallet của người dùng
router.put('/update-wallet/:userId', async (req, res) => {
  const { changeWallet } = req.body;
  const userId = req.params.userId;

  // Kiểm tra dữ liệu đầu vào
  if (!userId || changeWallet === undefined) {
    return res.status(400).json({
      success: false,
      message: 'Missing userId and/or changeWallet',
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

    // Kiểm tra và cập nhật wallet
    if (changeWallet < 0 && user.wallet + changeWallet < 0) {
      return res.status(400).json({
        success: false,
        message: `Insufficient wallet balance`,
      });
    }

    user.wallet += changeWallet;

    // Lưu cập nhật vào cơ sở dữ liệu
    await user.save();

    res.json({
      success: true,
      message: 'Wallet updated successfully',
      updatedWallet: user.wallet,
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