import ArticleIcon from "@mui/icons-material/Article";
import AssessmentIcon from "@mui/icons-material/Assessment";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import PrintIcon from "@mui/icons-material/Print";
import SettingsIcon from "@mui/icons-material/Settings";
import axios from "axios";
import * as React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { loginSuccess } from "../redux/userSlice";
import NotificationModal from "./NotificationModal"; // Import the new NotificationModal component

const Header = ({ role }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false); // State để mở modal nạp tiền
  const [step, setStep] = useState(1); // Bước 1: Nhập số tiền, Bước 2: Hiển thị mã QR
  const [amount, setAmount] = useState(""); // Số tiền người dùng nhập
  const dispatch = useDispatch();
  const [notification, setNotification] = useState(null); // State for notification
  const user = useSelector((state) => state.auth.login?.currentUser);
  const API_URL = process.env.REACT_APP_API_URL;

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleBack = () => {
    setStep(1); // Quay lại bước nhập số tiền
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };
  if (!/^\d*\.?\d*$/.test(amount)) { // Kiểm tra xem giá trị có phải là số hợp lệ
    alert("Please enter a valid number.");
    setAmount("");
  }
  const handleAddBalance = async () => {
    try {
      const response = await axios.put(
        `${API_URL}let/${user._id}`,
        { changeWallet: Number(amount) }
      );
      if (response.data.success) {
        const updateUser = {
          ...user,
          wallet: user.wallet + Number(amount),
        };
        dispatch(loginSuccess(updateUser));
        setNotification(`Add ${amount} VNĐ successfully!`);
        setAmount("");
      }
    } catch (error) {
      console.error();
    }
  };

  const blue = "#1f89db";
  const red = "#f05258";
  const bgColor = role === "admin" ? red : blue;

  return (
    <>
      <header
        style={{ backgroundColor: bgColor }}
        className="w-full h-[60px] flex items-center text-[18px] text-white font-semibold fixed top-0 left-0 right-0 z-50"
      >
        <div className="w-full flex flex-wrap justify-between mx-auto max-w-screen-xl">
          {/* Logo */}
          <div className="justify-start pl-4 flex items-center">
            <h1 className="max-h-[150px] max-w-[150px] text-bold text-2xl">L.S.P</h1>
          </div>

          {/* Navigation Links */}
          <ul className="flex flex-row gap-16 items-center justify-center w-9/12">
            <li>
              <Link
                to="/"
                className="flex items-center gap-2 hover:text-gray-700 active:text-yellow-500 focus:text-yellow-500"
              >
                <HomeIcon className="h-6 w-6" />
                <span>Home</span>
              </Link>
            </li>
            {role === "admin" ? (
              <>
                <li>
                  <Link
                    to="/printers"
                    className="flex items-center gap-2 hover:text-gray-700 active:text-yellow-500 focus:text-yellow-500"
                  >
                    <PrintIcon className="h-6 w-6" />
                    <span>Manage Printers</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/configuration"
                    className="flex items-center gap-2 hover:text-gray-700 active:text-yellow-500 focus:text-yellow-500"
                  >
                    <SettingsIcon className="h-6 w-6" />
                    <span>Configuration</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/report"
                    className="flex items-center gap-2 hover:text-gray-700 active:text-yellow-500 focus:text-yellow-500"
                  >
                    <AssessmentIcon className="h-6 w-6" />
                    <span>Report</span>
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/printers"
                    className="flex items-center gap-2 hover:text-gray-700 active:text-yellow-500 focus:text-yellow-500"
                  >
                    <PrintIcon className="h-6 w-6" />
                    <span>View Printers</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/pages"
                    className="flex items-center gap-2 hover:text-gray-700 active:text-yellow-500 focus:text-yellow-500"
                  >
                    <ArticleIcon className="h-6 w-6" />
                    <span>Buy Pages</span>
                  </Link>
                </li>
              </>
            )}
          </ul>

          {/* Profile & Recharge Button */}
          <div className="relative flex justify-end gap-8 items-center pr-4">
            {/* Recharge Button */}
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center px-1 py-1 rounded-full text-white hover:text-gray-700"
            >
              {user.role !== "admin" && (
                <span className="mr-2">+ {user.wallet} VNĐ</span>
              )}
            </button>

            {/* Profile Button */}
            <button
              onClick={toggleDropdown}
              className="focus:outline-none hover:text-gray-700"
            >
              <PersonIcon className="h-6 w-6" />
            </button>
            {dropdownOpen && (
              <div
                className="absolute right-0 mt-0 bg-white text-black shadow-lg rounded-lg"
                style={{ top: "90%" }}
              >
                <div className="flex flex-col">
                  <div className="px-4 py-2 hover:bg-gray-100">
                    <Link to="/profile">Profile</Link>
                  </div>
                  {role !== "admin" && (
                    <>
                      {/* Printing Log option for non-admin users */}
                      <div className="px-4 py-2 hover:bg-gray-100">
                        <Link to="/printinglog">Printing Log</Link>
                      </div>
                      <div className="px-4 py-2 hover:bg-gray-100">
                        <Link to="/paymentlog">Payment Log</Link>
                      </div>

                    </>
                  )}
                  <div
                    className="px-4 py-2 hover:bg-gray-100"
                    onClick={() => dispatch(loginSuccess(null))}
                  >
                    <Link to="/">Logout</Link>

                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Recharge Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-96 shadow-lg p-6">
            <div>
              <h2 className="text-xl font-bold mb-4 text-center">
                Enter the number to deposit
              </h2>
              <input
                type="text"
                placeholder="Number to deposit (VND)"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:border-blue-300 mb-4"
                value={amount}
                onChange={handleAmountChange} // Định dạng số tiền tại đây
              />
              <button
                onClick={() => handleAddBalance()}
                className="w-full bg-green-500 text-white py-2 rounded font-bold hover:bg-green-600"
              >
                Confirm
              </button>
            </div>
            <button
              className="w-full mt-4 bg-gray-300 text-black py-2 rounded font-bold hover:bg-gray-400"
              onClick={() => setModalOpen(false)}
            >
              Close
            </button>
          </div>
          {notification && (
            <NotificationModal
              message={notification}
              onClose={() => setNotification(null)}
            />
          )}
        </div>
      )}
    </>
  );
};

export default Header;
