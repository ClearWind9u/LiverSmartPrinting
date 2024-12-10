import React, { useState } from "react";

const StudentPaymentLog = () => {
    // Lịch sử thanh toán giả lập
    const [paymentLog] = useState([
        {
            id: "1",
            paperType: "A4",
            quantity: 100,
            totalPrice: "200,000 VNĐ",
            date: "2024-12-01",
        },
        {
            id: "2",
            paperType: "A3",
            quantity: 50,
            totalPrice: "150,000 VNĐ",
            date: "2024-12-03",
        },
    ]);

    return (
        <div className="pt-16 w-full h-fit">
            <div className="w-3/4 h-5/6 mx-auto mt-6 bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-center text-3xl font-bold mb-6 text-gray-800">
                    Your Payment Log
                </h2>
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
                            {paymentLog.length > 0 ? (
                                paymentLog.map((log) => (
                                    <tr
                                        key={log.id}
                                        className="hover:bg-gray-50 transition-colors duration-200"
                                    >
                                        <td className="py-3 px-6 border-b text-left">{log.id}</td>
                                        <td className="py-3 px-6 border-b text-left">
                                            {log.paperType}
                                        </td>
                                        <td className="py-3 px-6 border-b text-left">
                                            {log.quantity}
                                        </td>
                                        <td className="py-3 px-6 border-b text-left">
                                            {log.totalPrice}
                                        </td>
                                        <td className="py-3 px-6 border-b text-left">{log.date}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="py-3 px-6 border-b text-center text-gray-500"
                                    >
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
