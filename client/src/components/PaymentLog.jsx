import React from "react";

const PaymentLog = () => {
  const paymentLog = [
    {
      id: 1,
      paperType: "A4",
      quantity: 100,
      totalPrice: "$10.00",
      date: "2023-10-01",
    },
    {
      id: 2,
      paperType: "A3",
      quantity: 50,
      totalPrice: "$25.00",
      date: "2023-10-02",
    },
    {
      id: 3,
      paperType: "A2",
      quantity: 30,
      totalPrice: "$24.00",
      date: "2023-10-03",
    },
    {
      id: 4,
      paperType: "A1",
      quantity: 20,
      totalPrice: "$20.00",
      date: "2023-10-04",
    },
    {
      id: 5,
      paperType: "A5",
      quantity: 200,
      totalPrice: "$10.00",
      date: "2023-10-05",
    },
    // Add more payment log entries here
  ];

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
