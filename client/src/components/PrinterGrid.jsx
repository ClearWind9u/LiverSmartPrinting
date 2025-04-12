import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import PrinterCard from "./PrinterCard";

const PrinterGrid = ({ role }) => {
  const [printers, setPrinters] = useState([]);
  const [error, setError] = useState("");
  const user = useSelector((state) => state.auth.login?.currentUser);
  const API_URL = "https://liver-smart-printing-bf56.vercel.app";

  const fetchPrinters = async () => {
    try {
      const response = await axios.get(`${API_URL}/printers`);
      console.log("Fetched printers:", response.data); // Debug
      setPrinters(response.data.printers || []);
      setError("");
    } catch (error) {
      console.error("Error fetching printers:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      setError("Failed to load printers. Please try again.");
    }
  };

  useEffect(() => {
    fetchPrinters();
  }, []);

  return (
    <div className="w-3/4 pt-20 mx-auto">
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {user?.role === "admin" && (
        <div className="mb-4">
          <Link
            to="/add-printer"
            className="bg-[#f05258] text-white px-4 py-2 rounded-full"
          >
            Add Printer
          </Link>
        </div>
      )}
      <div className="grid grid-cols-4 gap-32">
        {printers.length > 0 ? (
          printers.map((printer) => (
            <PrinterCard
              key={printer._id}
              printer={printer}
              userRole={user?.role || role}
            />
          ))
        ) : (
          <p>No printers available.</p>
        )}
      </div>
    </div>
  );
};

export default PrinterGrid;