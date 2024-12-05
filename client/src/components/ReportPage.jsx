import React, { useState } from "react";
import PrintingLog from "./PrintingLog";
import PaymentLog from "./PaymentLog";
import AccountManagement from "./AccountManagement";

const ReportPage = () => {
  const [activeTab, setActiveTab] = useState("printing");

  return (
    <div className="pt-16 w-full h-full">
      <div className="w-3/4 h-5/6 mx-auto mt-6 bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-center text-3xl font-bold mb-6 text-gray-800">
          Report Page
        </h1>
        <div className="flex justify-center mb-8">
          <button
            className={`px-6 py-3 mx-2 transition-colors duration-300 ${
              activeTab === "printing"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800"
            } rounded-full shadow-md hover:bg-blue-500`}
            onClick={() => setActiveTab("printing")}
          >
            Printing Log
          </button>
          <button
            className={`px-6 py-3 mx-2 transition-colors duration-300 ${
              activeTab === "payment"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800"
            } rounded-full shadow-md hover:bg-blue-500`}
            onClick={() => setActiveTab("payment")}
          >
            Payment Log
          </button>
          <button
            className={`px-6 py-3 mx-2 transition-colors duration-300 ${
              activeTab === "account"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800"
            } rounded-full shadow-md hover:bg-blue-500`}
            onClick={() => setActiveTab("account")}
          >
            Account Management
          </button>
        </div>
        {activeTab === "printing" && <PrintingLog />}
        {activeTab === "payment" && <PaymentLog />}
        {activeTab === "account" && <AccountManagement />}
      </div>
    </div>
  );
};

export default ReportPage;
