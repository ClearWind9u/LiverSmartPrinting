import React, { useEffect, useState } from "react";
import PrinterCard from "./PriterCard";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

const PrinterGrid = ({ role }) => {
  const [printers, setPrinters] = useState([]);
  const user = useSelector((state) => state.auth.login?.currentUser);

  useEffect(() => {
    const fetchPrinters = async () => {
      try {
        const response = await axios.get('http://localhost:5000/printers', {  
          headers: {
            "Content-Type": "application/json",
          },
        });
        setPrinters(response.data.printers);
      } catch (error) {
        console.error("Error fetching printers:", error);
      }
    };

    fetchPrinters();
  }, []);

  return (
    <div className="w-full px-10 pt-20">
      {user.role === "admin" && (
        <div className="mb-4">
          <Link
            to="/add-printer"
            className="bg-[#f05258] text-white px-4 py-2 rounded-full">
            Add Printer
          </Link>
        </div>
      )}
      <div className="grid grid-cols-4 gap-2">
        {printers.map((printer, index) => (
          <PrinterCard key={index} printer={printer} userRole={user.role} />
        ))}
      </div>
    </div>
  );
};

export default PrinterGrid;
