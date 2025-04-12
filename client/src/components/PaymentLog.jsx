import SwapVertIcon from "@mui/icons-material/SwapVert";
import axios from "axios";
import React, { useEffect, useState } from "react";

const PaymentLog = () => {
  const [paymentLog, setPaymentLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const API_URL = "https://liver-smart-printing-bf56.vercel.app";

  useEffect(() => {
    const fetchPaymentLogs = async () => {
      try {
        const response = await axios.get(`${API_URL}/pages`);
        if (response.data.success) {
          const buyData = response.data.buypages.map((log, index) => ({
            id: `${log._id}`,
            userId: log.userId,
            paperType: log.type,
            quantity: log.quantity,
            totalPriceNum: log.totalPrice, // Store as number for sorting
            totalPrice: `${log.totalPrice} VNĐ`, // Display with suffix
            date: new Date(log.time).toLocaleDateString(),
          }));

          const userIds = buyData.map((log) => log.userId);

          const users = await Promise.all(
            userIds.map(async (id) => {
              const response = await axios.get(`${API_URL}/user/${id}`);
              return response.data;
            })
          );

          const logs = buyData.map((log, index) => ({
            id: log.id,
            userName: users[index].data?.username || "Unknown",
            paperType: log.paperType,
            quantity: log.quantity,
            totalPriceNum: log.totalPriceNum,
            totalPrice: log.totalPrice,
            date: log.date,
          }));

          setPaymentLog(logs);
        } else {
          setError("Failed to fetch payment logs");
        }
      } catch (err) {
        console.error("Error fetching payment logs:", err);
        setError("An error occurred while fetching payment logs");
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentLogs();
  }, []);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedData = [...paymentLog].sort((a, b) => {
      let aValue = a[key];
      let bValue = b[key];

      // Handle numerical sorting for totalPrice
      if (key === "totalPrice") {
        aValue = a.totalPriceNum;
        bValue = b.totalPriceNum;
      }

      // Handle numerical columns (quantity, totalPriceNum)
      if (typeof aValue === "number" && typeof bValue === "number") {
        return direction === "asc" ? aValue - bValue : bValue - aValue;
      }

      // Handle string columns (id, userName, paperType, date)
      aValue = aValue?.toString().toLowerCase() || "";
      bValue = bValue?.toString().toLowerCase() || "";
      if (aValue < bValue) return direction === "asc" ? -1 : 1;
      if (aValue > bValue) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setPaymentLog(sortedData);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Payment Log</h2>
      <div className="overflow-x-auto max-h-96">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100">
              {["ID", "User Name", "Paper Type", "Quantity", "Total Price", "Date"].map((col) => {
                const convertKey = (str) => {
                  const words = str.split(" ");
                  return words
                    .map((word, idx) =>
                      idx === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1)
                    )
                    .join("");
                };
                const key = convertKey(col);
                return (
                  <th
                    key={key}
                    className="py-3 px-6 border-b text-left cursor-pointer"
                    onClick={() => handleSort(key)}
                  >
                    {col} <SwapVertIcon />
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {paymentLog.map((log) => (
              <tr
                key={log.id}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="py-3 px-6 border-b text-left">{log.id}</td>
                <td className="py-3 px-6 border-b text-left">{log.userName}</td>
                <td className="py-3 px-6 border-b text-left">{log.paperType}</td>
                <td className="py-3 px-6 border-b text-left">{log.quantity}</td>
                <td className="py-3 px-6 border-b text-left">{log.totalPrice}</td>
                <td className="py-3 px-6 border-b text-left">{log.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentLog;