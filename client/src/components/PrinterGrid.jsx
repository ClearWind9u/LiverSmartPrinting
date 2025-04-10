import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import PrinterCard from "./PrinterCard";

const PrinterGrid = ({ role }) => {
  const [printers, setPrinters] = useState([]);
  const user = useSelector((state) => state.auth.login?.currentUser);
  const API_URL = process.env.REACT_APP_API_URL;

  const fetchPrinters = async () => {
    try {
      const response = await axios.get(`${API_URL}/printers`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setPrinters(response.data.printers);
    } catch (error) {
      console.error("Error fetching printers:", error);
    }
  };
  useEffect(() => {
    fetchPrinters();
  }, []);
  useEffect(() => {
    fetchPrinters();
  }, [printers]);

  return (
    <div className="w-3/4 pt-20 mx-auto">
      {user.role === "admin" && (
        <div className="mb-4">
          <Link
            to="/add-printer"
            className="bg-[#f05258] text-white px-4 py-2 rounded-full">
            Add Printer
          </Link>
        </div>
      )}
      <div className="grid grid-cols-4 gap-32">
        {printers.map((printer, index) => (
          <PrinterCard key={index} printer={printer} userRole={user.role} />
        ))}
      </div>
    </div>
  );
};

export default PrinterGrid;
