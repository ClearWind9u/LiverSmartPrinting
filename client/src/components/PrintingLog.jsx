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
          const printInfo = response.data.histories.flatMap((history) =>
            history.printInfo.map((info, index) => ({
              id: `${history._id}`,
              fileName: info.fileName,
              copies: info.noCopy,
              date: new Date(info.time).toLocaleDateString(), // Định dạng ngày tháng
            }))
          );
          const userId = response.data.histories.map(
            (history) => history.userId
          );

          const users = await Promise.all(
            userId.map(async (id) => {
              const response = await axios.get(
                "http://localhost:5000/user/" + id
              );
              return response.data;
            })
          );

          console.log(users);

          const printerId = response.data.histories.map(
            (history) => history.printerId
          );

          const logs = printInfo.map((info, index) => ({
            id: info.id,
            userName: users[index].data.username,
            userEmail: users[index].data.email,
            printerId: printerId[index],
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
              <th className="py-3 px-6 border-b text-left">User Name</th>
              <th className="py-3 px-6 border-b text-left">User Email</th>
              <th className="py-3 px-6 border-b text-left">Printer Id</th>
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
                <td className="py-3 px-6 border-b text-left">{log.userName}</td>
                <td className="py-3 px-6 border-b text-left">
                  {log.userEmail}
                </td>
                <td className="py-3 px-6 border-b text-left">
                  {log.printerId}
                </td>
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
