import SwapVertIcon from '@mui/icons-material/SwapVert';
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const StudentPrintingLog = () => {
  const user = useSelector((state) => state.auth.login?.currentUser);
  const [printingLog, setPrintingLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const API_URL = 'https://liver-smart-printing-bf56.vercel.app';

  useEffect(() => {
    const fetchPrintingLogs = async () => {
      try {
        const response = await axios.get(`${API_URL}/histories/user/${user._id}`);
        if (response.data.success) {
            const logs = response.data.history.map((log) => ({
                id: log._id,
                printerId: log.printerId,
                fileName: log.printInfo[0]?.fileName || "Unknown", // Default to 'Unknown' if no file name
                copies: log.printInfo[0]?.noCopy || 0,
                date: new Date(log.printInfo[0]?.time || 'Invalid Date').toLocaleDateString(),
            }));
        console.log(logs);
          setPrintingLog(logs);
        } else {
          setError("Failed to fetch printing logs");
        }
      } catch (err) {
        console.error(err);
        setError("An error occurred while fetching printing logs");
      } finally {
        setLoading(false);
      }
    };

    fetchPrintingLogs();
  }, [user._id]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedData = [...printingLog].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === "asc" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });
    setPrintingLog(sortedData);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="pt-16 w-full h-fit">
      <div className="w-3/4 h-5/6 mx-auto mt-6 bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-center text-3xl font-bold mb-6 text-gray-800">
          Your Printing Log
        </h1>
        <div className="overflow-x-auto max-h-96">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-100">
                <th
                  className="py-3 px-6 border-b text-left cursor-pointer"
                  onClick={() => handleSort("id")}
                >
                  ID <SwapVertIcon />
                </th>
                <th
                  className="py-3 px-6 border-b text-left cursor-pointer"
                  onClick={() => handleSort("printerId")}
                >
                  Printer ID <SwapVertIcon />
                </th>
                <th
                  className="py-3 px-6 border-b text-left cursor-pointer"
                  onClick={() => handleSort("fileName")}
                >
                  File Name <SwapVertIcon />
                </th>
                <th
                  className="py-3 px-6 border-b text-left cursor-pointer"
                  onClick={() => handleSort("copies")}
                >
                  Copies <SwapVertIcon />
                </th>
                <th
                  className="py-3 px-6 border-b text-left cursor-pointer"
                  onClick={() => handleSort("date")}
                >
                  Date <SwapVertIcon />
                </th>
              </tr>
            </thead>
            <tbody>
              {printingLog.length > 0 ? (
                printingLog.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="py-3 px-6 border-b text-left">{log.id}</td>
                    <td className="py-3 px-6 border-b text-left">{log.printerId}</td>
                    <td className="py-3 px-6 border-b text-left">{log.fileName}</td>
                    <td className="py-3 px-6 border-b text-left">{log.copies}</td>
                    <td className="py-3 px-6 border-b text-left">{log.date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="py-3 px-6 border-b text-center text-gray-500"
                  >
                    No printing history found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentPrintingLog;
