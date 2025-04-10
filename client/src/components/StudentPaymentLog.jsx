import SwapVertIcon from "@mui/icons-material/SwapVert";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const StudentPaymentLog = ({ userId }) => {
  const [paymentLog, setPaymentLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const user = useSelector((state) => state.auth.login?.currentUser);
  const API_URL = 'https://liver-smart-printing-bf56.vercel.app';

  useEffect(() => {
    const fetchPaymentLogs = async () => {
      try {
        const response = await axios.get(`${API_URL}/pages/user/${user._id}`);
        if (response.data.success) {
          // Map dữ liệu API thành dữ liệu hiển thị
          const logs = response.data.buypage.map((log) => ({
            id: log._id,
            paperType: log.type,
            quantity: log.quantity,
            totalPrice: `${log.totalPrice} VNĐ`,
            date: new Date(log.time).toLocaleDateString(),
          }));
          setPaymentLog(logs);
        } else {
          setError("Failed to fetch payment logs");
        }
      } catch (err) {
        console.error(err);
        setError("An error occurred while fetching payment logs");
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentLogs();
  }, [user._id]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedData = [...paymentLog].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setPaymentLog(sortedData);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="pt-16 w-full h-fit">
      <div className="w-3/4 h-5/6 mx-auto mt-6 bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-center text-3xl font-bold mb-6 text-gray-800">Your Payment Log</h2>
        <div className="overflow-x-auto max-h-96">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-100">
                {["ID", "Paper Type", "Quantity", "Total Price", "Date"].map((col, index) => {
                  // Hàm chuyển đổi tiêu đề sang định dạng yêu cầu
                  const convertKey = (str) => {
                    const words = str.split(" ");
                    return words
                      .map((word, idx) => idx === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1))
                      .join("");
                  };
                  const key = convertKey(col);
                  return (
                    <th
                      key={index}
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
              {paymentLog.length > 0 ? (
                paymentLog.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="py-3 px-6 border-b text-left">{log.id}</td>
                    <td className="py-3 px-6 border-b text-left">{log.paperType}</td>
                    <td className="py-3 px-6 border-b text-left">{log.quantity}</td>
                    <td className="py-3 px-6 border-b text-left">{log.totalPrice}</td>
                    <td className="py-3 px-6 border-b text-left">{log.date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-3 px-6 border-b text-center text-gray-500">
                    No payment history found.
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

export default StudentPaymentLog;