import SwapVertIcon from '@mui/icons-material/SwapVert';
import axios from "axios";
import React, { useEffect, useState } from "react";

const PrintingLog = () => {
  const [printingLog, setPrintingLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const API_URL = 'https://liver-smart-printing-bf56.vercel.app';

  useEffect(() => {
    const fetchPrintingLogs = async () => {
      try {
        const response = await axios.get(`${API_URL}/histories`);
        if (response.data.success) {
          const printInfo = response.data.histories.flatMap((history) =>
            history.printInfo.map((info, index) => ({
              id: `${history._id}`,
              fileName: info.fileName,
              copies: info.noCopy,
              date: new Date(info.time).toLocaleDateString(),
            }))
          );
          const userId = response.data.histories.map(
            (history) => history.userId
          );

          const users = await Promise.all(
            userId.map(async (id) => {
              const response = await axios.get(
                `${API_URL}/user/` + id
              );
              return response.data;
            })
          );

          const printerId = response.data.histories.map(
            (history) => history.printerId
          );

          const printers = await Promise.all(
            printerId.map(async (id) => {
              const response = await axios.get(
                `${API_URL}/printers/` + id
              );
              return response.data;
            })
          );
          const logs = printInfo.map((info, index) => ({
            id: info.id,
            userName: users[index].data.username,
            printerName: printers[index].printer.name,
            fileName: info.fileName,
            copies: info.copies,
            date: info.date,
          }));
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
  }, []);

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
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">
        Printing Log
      </h2>
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
                onClick={() => handleSort("userName")}
              >
                User Name <SwapVertIcon />
              </th>
              <th
                className="py-3 px-6 border-b text-left cursor-pointer"
                onClick={() => handleSort("printerName")}
              >
                Printer Name <SwapVertIcon />
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
            {printingLog.map((log) => (
              <tr
                key={log.id}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="py-3 px-6 border-b text-left">{log.id}</td>
                <td className="py-3 px-6 border-b text-left">{log.userName}</td>
                <td className="py-3 px-7 border-b text-left">{log.printerName}</td>
                <td className="py-3 px-6 border-b text-left">{log.fileName}</td>
                <td className="py-3 px-6 border-b text-left">{log.copies}</td>
                <td className="py-3 px-6 border-b text-left">{log.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PrintingLog;
