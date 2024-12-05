import React from "react";

const PrintingLog = () => {
  const printingLog = [
    { id: 1, fileName: "Document1.pdf", copies: 2, date: "2023-10-01" },
    { id: 2, fileName: "Document2.pdf", copies: 1, date: "2023-10-02" },
    { id: 3, fileName: "Document3.pdf", copies: 3, date: "2023-10-03" },
    { id: 4, fileName: "Document4.pdf", copies: 4, date: "2023-10-04" },
    { id: 5, fileName: "Document5.pdf", copies: 5, date: "2023-10-05" },
    // Add more printing log entries here
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">
        Printing Log
      </h2>
      <div className="overflow-x-auto max-h-96">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-3 px-6 border-b text-left">ID</th>
              <th className="py-3 px-6 border-b text-left">File Name</th>
              <th className="py-3 px-6 border-b text-left">Copies</th>
              <th className="py-3 px-6 border-b text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {printingLog.map((log) => (
              <tr
                key={log.id}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="py-3 px-6 border-b text-left">{log.id}</td>
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
