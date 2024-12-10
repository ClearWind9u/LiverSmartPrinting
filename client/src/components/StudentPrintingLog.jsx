import React, { useState } from "react";
import { useSelector } from "react-redux";

const StudentPrintingLog = () => {
    const user = useSelector((state) => state.auth.login?.currentUser);

    // Lịch sử in giả lập chỉ cho cá nhân người dùng
    const [printingLog] = useState([
        {
            id: "1",
            printerId: "Canon",
            fileName: "document1.pdf",
            copies: 2,
            date: "2024-12-01",
        },
    ]);

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
                                <th className="py-3 px-6 border-b text-left">ID</th>
                                <th className="py-3 px-6 border-b text-left">Printer Id</th>
                                <th className="py-3 px-6 border-b text-left">File Name</th>
                                <th className="py-3 px-6 border-b text-left">Copies</th>
                                <th className="py-3 px-6 border-b text-left">Date</th>
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
                                        <td className="py-3 px-6 border-b text-left">
                                            {log.printerId}
                                        </td>
                                        <td className="py-3 px-6 border-b text-left">
                                            {log.fileName}
                                        </td>
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
