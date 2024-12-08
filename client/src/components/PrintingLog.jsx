import React, { useEffect, useState } from "react";
import axios from "axios";

const PrintingLog = () => {
  const [printingLog, setPrintingLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrintingLogs = async () => {
      try {
        const response = await axios.get("http://localhost:5000/histories");
        if (response.data.success) {
          // Duyệt qua từng lịch sử in và ánh xạ dữ liệu cần thiết
          const logs = response.data.histories.flatMap((history) =>
            history.printInfo.map((info, index) => ({
              id: `${history._id}`,
              fileName: info.fileName,
              copies: info.noCopy,
              date: new Date(info.time).toLocaleDateString(), // Định dạng ngày tháng
            }))
          );
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