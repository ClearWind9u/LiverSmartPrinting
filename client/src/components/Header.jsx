import * as React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/userSlice";

import Logo from "../../assets/Logo.png"; // Đường dẫn tương đối tới tệp PNG
import HomeIcon from '@mui/icons-material/Home';
import PrintIcon from '@mui/icons-material/Print';
import ArticleIcon from '@mui/icons-material/Article';
import PersonIcon from '@mui/icons-material/Person';


const Header = ({ role }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dispatch = useDispatch();

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const blue = "#1f89db";
  const red = "#f05258";
  const bgColor = role === "admin" ? red : blue;

  return (
    <header
      style={{ backgroundColor: bgColor }}
      className="w-full h-[60px] flex items-center text-[18px] text-white font-semibold"
    >
      <div className="w-full flex flex-wrap justify-between mx-auto max-w-screen-xl">
        <div className="justify-start w-1/10 h-8 pl-4 flex items-center logo-container">
          <img
            src={Logo}
            alt="Smart Printer Logo"
            className="max-h-[40px] max-w-[40px] logo"
          />
        </div>

        <ul className="flex flex-row gap-16 items-center w-9/12 justify-center">
          <li>
            <Link to="/">
              <HomeIcon className="mr-2" /> Home
            </Link>
          </li>
          {role === "admin" ? (
            <>
              <li>
                <Link to="/printers">
                  <PrintIcon className="mr-2" /> Manage Printers
                </Link>
              </li>
              <li>
                <Link to="/configuration">Configuration</Link>
              </li>
              <li>
                <Link to="/report">Report</Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/printers">
                  <PrintIcon className="mr-2" /> View Printers
                </Link>
              </li>
              <li>
                <Link to="/pages">
                  <ArticleIcon className="mr-2" /> Buy Pages
                </Link>
              </li>
            </>
          )}
        </ul>

        <div className="relative flex justify-end gap-16 items-center w-1/12 pr-4 mb-1">
          <button onClick={toggleDropdown} className="focus:outline-none">
            <PersonIcon />
          </button>
          {dropdownOpen && (
            <div className="absolute top-0 right-0 bg-white text-black rounded shadow-lg">
              <ul className="flex flex-col py-2">

                <div className="px-4 py-2 hover:bg-gray-100">
                  <Link to="/profile">Profile</Link>
                </div>

                <div className="px-4 py-2 hover:bg-gray-100"
                  onClick={() => dispatch(loginSuccess(null))}>
                  <Link to="/">Log out</Link>
                </div>
              </ul>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Header;
