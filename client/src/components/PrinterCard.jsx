import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const PrinterCard = ({ printer, userRole }) => {
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State để kiểm soát modal xác nhận xóa
  const [isEnabled, setIsEnabled] = useState(true);
  const [printerName, setPrinterName] = useState(printer.name);
  const [type, setType] = useState(printer.type || "");
  const [price, setPrice] = useState(printer.price || "");
  const [information, setInformation] = useState(printer.information || "");
  const [selectedImage, setSelectedImage] = useState(printer.image || null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const handleInfoModalOpen = () => setIsInfoModalOpen(true);
  const handleInfoModalClose = () => setIsInfoModalOpen(false);
  const handleEditModalOpen = () => setIsEditModalOpen(true);
  const handleEditModalClose = () => setIsEditModalOpen(false);
  const handleToggle = () => setIsEnabled(!isEnabled);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileType = file.type;
      if (fileType === "image/jpeg" || fileType === "image/png") {
        setError(""); // Clear any previous error
        setSelectedImage(`../public/${file.name}`); // Store the relative image path
        setFile(file); // Save the file for later use
      } else {
        setError("Please upload a valid JPG or PNG file.");
      }
    }
  };

  const updatePrinter = async (e) => {
    e.preventDefault();
    if (!printerName || !price || !type || !information) {
      alert("All fields are required!");
      return;
    }

    try {
      const updatedData = {
        name: printerName,
        price,
        type,
        image: file ? `../public/${file.name}` : printer.image, // Use the new image or keep the old one
        information,
      };

      const response = await axios.put(`http://localhost:5000/printers/${printer._id}`, updatedData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        alert("Printer updated successfully!");
        handleEditModalClose();
      } else {
        alert(response.data.message || "Failed to update printer.");
      }
    } catch (error) {
      console.error("Error updating printer:", error);
      alert(error.response?.data?.message || "An error occurred. Please try again.");
    }
  };

  const deletePrinter = async () => {
    try {
      const response = await axios.delete(`http://localhost:5000/printers/${printer._id}`);
      if (response.status === 200) {
        alert("Printer deleted successfully!");
        setIsDeleteModalOpen(false); // Close the delete modal
      } else {
        alert(response.data.message || "Failed to delete printer.");
      }
    } catch (error) {
      console.error("Error deleting printer:", error);
      alert(error.response?.data?.message || "An error occurred while deleting.");
    }
  };

  const handleDeleteModalOpen = () => setIsDeleteModalOpen(true);
  const handleDeleteModalClose = () => setIsDeleteModalOpen(false);

  useEffect(() => {
    return () => {
      if (selectedImage && selectedImage.startsWith("blob:")) {
        URL.revokeObjectURL(selectedImage);
      }
    };
  }, [selectedImage]);

  return (
    <div className="w-[300px] h-[320px] bg-white border-gray-300 border-2 rounded-xl flex flex-col items-center">
      <h3 className="text-[20px] font-semibold mt-4">{printer.name}</h3>
      <img
        src={selectedImage || printer.image} // Use the selected image or fallback to the default printer image
        alt="Printer"
        className="w-[300px] h-[200px] object-cover"
      />
      {userRole === "user" && (
        <div className="flex justify-between items-center w-5/6 pt-4">
          <Link
            to={`/printer/${printer._id}`}
            className="bg-[#f05258] text-white text-center px-4 py-1 rounded-full w-[120px]"
          >
            Select
          </Link>
          <button
            className="bg-[#1f89db] text-white text-center px-4 py-1 rounded-full w-[120px]"
            onClick={handleInfoModalOpen}
          >
            Information
          </button>
        </div>
      )}
      {userRole === "admin" && (
        <div className="flex justify-between items-center pt-4">
          <button
            className="bg-[#1f89db] text-white px-4 py-1 rounded-full w-[120px]"
            onClick={handleInfoModalOpen}
          >
            Information
          </button>
        </div>
      )}

      {/* Information Modal */}
      {isInfoModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[400px] shadow-lg">
            <button
              className="text-bold absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={handleInfoModalClose}
            >
              x
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center">{printer.name}</h2>
            <p className="mb-4">{printer.information}</p>
            {userRole === "admin" && (
              <div className="flex justify-between items-center mt-4">
                <button
                  className="bg-[#1f89db] text-white px-4 py-1 rounded-full"
                  onClick={handleEditModalOpen}
                >
                  Edit
                </button>
                <button
                  className="bg-[#f05258] text-white px-4 py-1 rounded-full"
                  onClick={handleDeleteModalOpen} // Mở modal xác nhận xóa
                >
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
                    <div
                      className={`block w-14 h-6 rounded-full ${isEnabled ? "bg-green-500" : "bg-gray-600"
                        }`} style={{ height: "35px" }}
                    ></div>
                    <div
                      className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${isEnabled ? "transform translate-x-full bg-green-500" : ""
                        }`}
                    />
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

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg mx-4 shadow-lg w-[900px]" style={{ maxHeight: "700px", overflowY: "auto" }}>
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={handleEditModalClose}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center">Edit Printer Information</h2>
            <form>
              <div className="grid grid-cols-2 gap-4">
                {/* Name */}
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-1">Name:</label>
                  <input
                    type="text"
                    value={printerName}
                    onChange={(e) => setPrinterName(e.target.value)}
                    className="border rounded w-full px-3 py-2"
                  />
                </div>

                {/* Type */}
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-1">Type:</label>
                  <input
                    type="text"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="border rounded w-full px-3 py-2"
                  />
                </div>

                {/* Price */}
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-1">Price:</label>
                  <input
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="border rounded w-full px-3 py-2"
                  />
                </div>

                {/* Information */}
                <div className="mb-4 col-span-2">
                  <label className="block text-gray-700 font-medium mb-1">Information:</label>
                  <textarea
                    value={information}
                    onChange={(e) => setInformation(e.target.value)}
                    className="border rounded w-full px-3 py-2"
                  ></textarea>
                </div>

                {/* Picture */}
                <div className="mb-4 col-span-2">
                  <label className="block text-gray-700 font-medium mb-2">
                    Picture of Printer:
                  </label>
                  <div className="border border-dashed border-gray-400 rounded flex justify-center items-center p-4">
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      onChange={handleImageChange}
                      className="cursor-pointer text-black"
                    />
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                    {selectedImage && (
                      <div>
                        <p className="text-blue-500 mt-2">Image preview:</p>
                        <img
                          src={selectedImage}
                          alt="Preview"
                          style={{ width: "auto", height: "240px" }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={handleEditModalClose}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={updatePrinter}
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[400px] shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-center">Are you sure you want to delete this printer?</h2>
            <div className="flex justify-between mt-4">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded"
                onClick={handleDeleteModalClose}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded"
                onClick={deletePrinter} // Xóa máy in
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrinterCard;