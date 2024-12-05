import * as React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/userSlice";

const Header = ({ role }) => {
  const blue = "#1f89db";
  const red = "#f05258";
  const bgColor = role === "admin" ? red : blue;
  const dispatch = useDispatch();
  return (
    <header
      className={`bg-[${bgColor}] w-full h-[60px] flex flex-row text-[18px] text-white font-semibold`}
    >
      <h1 className="text-[30px] font-extrabold pt-2 text-black w-2/12 pl-8">
        LSP
      </h1>
      <ul className="flex flex-row gap-16 items-center w-9/12">
        <li>
          <Link to="/">Home</Link>
        </li>
        {role === "admin" ? (
          <>
            <li>
              <Link to="/printers">Manage Printers</Link>
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
              <Link to="/printers">View Printers</Link>
            </li>
            <li>
              <Link to="/pages">Buy Pages</Link>
            </li>
          </>
        )}
      </ul>

      <div className="flex justify-end gap-16 items-center"
      onClick={() => dispatch(loginSuccess(null))}>
        <Link to="/">Log out</Link>
      </div>
    </header>
  );
};

export default Header;
