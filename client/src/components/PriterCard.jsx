import React, { useState } from "react";
import { Link } from "react-router-dom";

const PrinterCard = ({ printer, userRole }) => {
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);
  const handleInfoModalOpen = () => setIsInfoModalOpen(true);
  const handleInfoModalClose = () => setIsInfoModalOpen(false);
  const handleEditModalOpen = () => setIsEditModalOpen(true);
  const handleEditModalClose = () => setIsEditModalOpen(false);
  const handleToggle = () => setIsEnabled(!isEnabled);

  return (
    <div className="w-[300px] h-[320px] bg-white border-gray-300 border-2 rounded-xl flex flex-col items-center">
      <h3 className="text-[20px] font-semibold mt-4">{printer.name}</h3>
      <img
        src={printer.image}
        alt=""
        className="w-[300px] h-[200px] object-cover"
      />
      <div className="flex justify-between items-center w-5/6 pt-4">
        <Link
          to={`/printer/${printer._id}`}
          className="bg-[#f05258] text-white px-4 py-1 rounded-full w-[120px] text-center"
        >
          Select
        </Link>
        <button
          className="bg-[#1f89db] text-white px-4 py-1 rounded-full w-[120px] text-center"
          onClick={handleInfoModalOpen}
        >
          Information
        </button>
      </div>
      {isInfoModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-[400px] shadow-lg">
            <button
              className="float-right text-gray-500"
              onClick={handleInfoModalClose}
            >
              x
            </button>
            <h2 className="text-2xl font-bold mb-4">{printer.name}</h2>
            <p className="mb-4">
              {printer.information}
            </p>
            {userRole === "admin" && (
              <div className="flex justify-between items-center mt-4">
                <button
                  className="bg-[#1f89db] text-white px-4 py-1 rounded-full"
                  onClick={handleEditModalOpen}
                >
                  Edit
                </button>
                <button className="bg-[#f05258] text-white px-4 py-1 rounded-full">
                  Delete
                </button>
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={isEnabled}
                      onChange={handleToggle}
                    />
                    <div className={`block w-14 h-8 rounded-full ${isEnabled
                      ? "bg-green-500"
                      : "bg-gray-600"
                      }`}></div>
                    <div
                      className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${isEnabled
                        ? "transform translate-x-full bg-green-500"
                        : ""
                        }`}
                    ></div>
                  </div>
                  <div className="ml-3 text-gray-600 font-medium">
                    {isEnabled ? "Enabled" : "Disabled"}
                  </div>
                </label>
              </div>
            )}
          </div>
        </div>
      )}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-[400px] shadow-lg">
            <button
              className="float-right text-gray-500"
              onClick={handleEditModalClose}
            >
              x
            </button>
            <h2 className="text-2xl font-bold mb-4">Edit HP LaserJet Pro</h2>
            <form>
              <div className="mb-4">
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded"
                  defaultValue="HP LaserJet Pro"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Description</label>
                <textarea
                  className="w-full px-3 py-2 border rounded"
                  defaultValue="A high-quality laser printer suitable for office use."
                ></textarea>
              </div>
              <button className="bg-[#1f89db] text-white px-4 py-1 rounded-full">
                Save
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrinterCard;
