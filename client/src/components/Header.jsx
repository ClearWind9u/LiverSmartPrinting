import * as React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/userSlice";

import Logo from "../../assets/Logo.png";
import HomeIcon from "@mui/icons-material/Home";
import PrintIcon from "@mui/icons-material/Print";
import ArticleIcon from "@mui/icons-material/Article";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import AssessmentIcon from "@mui/icons-material/Assessment";

const Header = ({ role }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false); // State để mở modal nạp tiền
  const [step, setStep] = useState(1); // Bước 1: Nhập số tiền, Bước 2: Hiển thị mã QR
  const [amount, setAmount] = useState(""); // Số tiền người dùng nhập
  const dispatch = useDispatch();

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleNextStep = () => {
    if (!amount || isNaN(amount.replace(/\./g, "")) || parseInt(amount.replace(/\./g, "")) <= 0) {
      alert("Please enter number.");
      return;
    }
    setStep(2); // Chuyển sang bước hiển thị mã QR
  };

  const handleBack = () => {
    setStep(1); // Quay lại bước nhập số tiền
  };

  // Hàm định dạng số tiền
  const formatAmount = (value) => {
    // Loại bỏ các ký tự không phải số
    const numericValue = value.replace(/\D/g, "");
    // Thêm dấu chấm sau mỗi 3 chữ số
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleAmountChange = (e) => {
    setAmount(formatAmount(e.target.value));
  };

  const blue = "#1f89db";
  const red = "#f05258";
  const bgColor = role === "admin" ? red : blue;

  return (
    <>
      <header
        style={{ backgroundColor: bgColor }}
        className="w-full h-[60px] flex items-center text-[18px] text-white font-semibold"
      >
        <div className="w-full flex flex-wrap justify-between mx-auto max-w-screen-xl">
          {/* Logo */}
          <div className="justify-start pl-4 flex items-center">
            <img
              src={Logo}
              alt="Smart Printer Logo"
              className="max-h-[80px] max-w-[80px] logo"
            />
          </div>

          {/* Navigation Links */}
          <ul className="flex flex-row gap-16 items-center justify-center w-9/12">
            <li>
              <Link to="/" className="flex items-center gap-2 hover:text-gray-700">
                <HomeIcon className="h-6 w-6" />
                <span>Home</span>
              </Link>
            </li>
            {role === "admin" ? (
              <>
                <li>
                  <Link to="/printers" className="flex items-center gap-2 hover:text-gray-700">
                    <PrintIcon className="h-6 w-6" />
                    <span>Manage Printers</span>
                  </Link>
                </li>
                <li>
                  <Link to="/configuration" className="flex items-center gap-2 hover:text-gray-700">
                    <SettingsIcon className="h-6 w-6" />
                    <span>Configuration</span>
                  </Link>
                </li>
                <li>
                  <Link to="/report" className="flex items-center gap-2 hover:text-gray-700">
                    <AssessmentIcon className="h-6 w-6" />
                    <span>Report</span>
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/printers" className="flex items-center gap-2 hover:text-gray-700">
                    <PrintIcon className="h-6 w-6" />
                    <span>View Printers</span>
                  </Link>
                </li>
                <li>
                  <Link to="/pages" className="flex items-center gap-2 hover:text-gray-700">
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
              <span className="mr-2">+ 100₫</span>
            </button>

            {/* Profile Button */}
            <button onClick={toggleDropdown} className="focus:outline-none hover:text-gray-700">
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
            {step === 1 ? (
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
                  onClick={handleNextStep}
                  className="w-full bg-green-500 text-white py-2 rounded font-bold hover:bg-green-600"
                >
                  Confirm
                </button>
              </div>
            ) : (
              <div className="text-center">
                <h2 className="text-xl font-bold mb-4 text-center">
                  Scan QR to complete transaction
                </h2>
                <img
                  src="/path/to/your/qr-code.png"
                  alt="QR Code"
                  className="mx-auto w-40 h-40 mb-4"
                />
                <p className="text-gray-600">
                  Amount: <strong>{amount} VND</strong>
                </p>
                <button
                  onClick={handleBack}
                  className="w-full mt-4 bg-blue-500 text-white py-2 rounded font-bold hover:bg-blue-600"
                >
                  Back
                </button>
              </div>
            )}
            <button
              className="w-full mt-4 bg-gray-300 text-black py-2 rounded font-bold hover:bg-gray-400"
              onClick={() => setModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
