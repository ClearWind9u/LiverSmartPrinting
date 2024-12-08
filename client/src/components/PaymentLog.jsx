import React, { useEffect, useState } from "react";
import axios from "axios";

const PaymentLog = () => {
  const [paymentLog, setPaymentLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPaymentLogs = async () => {
      try {
        const response = await axios.get("http://localhost:5000/pages");
        if (response.data.success) {
          // Ánh xạ dữ liệu từ API
          const logs = response.data.buypages.map((log, index) => ({
            id: `${log._id}`, // Tạo ID duy nhất
            paperType: log.type,
            quantity: log.quantity,
            totalPrice: `${log.totalPrice} VNĐ`, // Định dạng giá
            date: new Date(log.time).toLocaleDateString(), // Định dạng ngày
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
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Payment Log</h2>
      <div className="overflow-x-auto max-h-96">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-3 px-6 border-b text-left">ID</th>
              <th className="py-3 px-6 border-b text-left">Paper Type</th>
              <th className="py-3 px-6 border-b text-left">Quantity</th>
              <th className="py-3 px-6 border-b text-left">Total Price</th>
              <th className="py-3 px-6 border-b text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {paymentLog.map((log) => (
              <tr
                key={log.id}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="py-3 px-6 border-b text-left">{log.id}</td>
                <td className="py-3 px-6 border-b text-left">
                  {log.paperType}
                </td>
                <td className="py-3 px-6 border-b text-left">{log.quantity}</td>
                <td className="py-3 px-6 border-b text-left">
                  {log.totalPrice}
                </td>
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
