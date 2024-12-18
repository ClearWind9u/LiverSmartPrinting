import React, { useState, useEffect } from "react";
import axios from "axios";
import NotificationModal from "./NotificationModal"; // Import the new NotificationModal component

const ConfigPage = () => {
  const [editingIndex, setEditingIndex] = useState(null);
  const [paperTypes, setPaperTypes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPaper, setNewPaper] = useState({ type: "", price: "1", balance: "0" });
  const [originalPaper, setOriginalPaper] = useState(null);
  const [notification, setNotification] = useState(null); // State for notification
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false); // Modal xác nhận xóa
  const [paperToDelete, setPaperToDelete] = useState(null); // Loại giấy cần xóa

  // Lấy danh sách từ API
  const fetchPaperTypes = async () => {
    try {
      const response = await axios.get("http://localhost:5000/balance");
      if (response.data.success) {
        setPaperTypes(response.data.balancePages);
      }
    } catch (error) {
      console.error("Error fetching balance pages:", error);
    }
  };

  useEffect(() => {
    fetchPaperTypes();
  }, []);

  // Tạo mới
  const handleAddPaperType = async () => {
    try {
      if (!newPaper.type || !newPaper.price) {
        alert("Please fill in all fields.");
        return;
      }
      const response = await axios.post("http://localhost:5000/balance/create", newPaper);
      if (response.data.success) {
        setPaperTypes([...paperTypes, response.data.balancePage]);
        setNewPaper({ type: "", price: "1", balance: "0" });
        setIsModalOpen(false);
        setNotification("Paper type added successfully!");
      } else {
        alert(response.data.message || "Failed to add paper type.");
      }
    } catch (error) {
      console.error("Error adding paper type:", error);
      alert(error.response?.data?.message || "An error occurred while adding paper type.");
    }
  };  

  // Cập nhật
  const handleSave = async (index) => {
    const currentRow = paperTypes[index];
    try {
      if (!currentRow.type || !currentRow.price) {
        alert("Please fill in all fields before saving.");
        return;
      }
      const response = await axios.put(`http://localhost:5000/balance/${currentRow._id}`, currentRow);
      if (response.data.success) {
        setEditingIndex(null);
        setOriginalPaper(null);
        setNotification("Paper type updated successfully!");
      } else {
        alert(response.data.message || "Failed to update paper type.");
      }
    } catch (error) {
      console.error("Error updating paper type:", error);
      alert(error.response?.data?.message || "An error occurred while updating paper type.");
    }
  };  

  // Chỉnh sửa trạng thái
  const handleEditToggle = (index) => {
    if (editingIndex === index) {
      setEditingIndex(null);
      setOriginalPaper(null);  // Xóa giá trị gốc khi hủy chỉnh sửa
    } else {
      setEditingIndex(index);
      setOriginalPaper({ ...paperTypes[index] });  // Lưu giá trị gốc khi bắt đầu chỉnh sửa
    }
  };

  // Xóa (Chỉ thực hiện sau khi xác nhận)
  const handleDeletePaperType = async () => {
    try {
      const response = await axios.delete(`http://localhost:5000/balance/${paperToDelete._id}`);
      if (response.data.success) {
        setPaperTypes(paperTypes.filter((paper) => paper._id !== paperToDelete._id));
        setConfirmDeleteModal(false);
        setPaperToDelete(null);
        setNotification("Paper type deleted successfully!");
      } else {
        alert(response.data.message || "Failed to delete paper type.");
      }
    } catch (error) {
      console.error("Error deleting paper type:", error);
      alert(error.response?.data?.message || "An error occurred while deleting paper type.");
    }
  };  

  // Đóng modal xác nhận
  const closeConfirmDeleteModal = () => {
    setConfirmDeleteModal(false);
    setPaperToDelete(null); // Reset khi đóng modal
  };

  // Cập nhật giá trị từng ô
  const handlePaperTypeChange = (index, field, value) => {
    const updatedPaperTypes = [...paperTypes];
    updatedPaperTypes[index][field] = value;
    setPaperTypes(updatedPaperTypes);
  };

  return (
    <div className="pt-16 w-full h-full">
      <div className="w-3/4 mx-auto mt-6 bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-center text-3xl font-bold mb-6 text-gray-800">Configuration Page</h1>
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Pages Config</h2>
        <div className="overflow-y-auto" style={{ maxHeight: "300px" }}>
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-6 border-b text-left">Type</th>
                <th className="py-3 px-6 border-b text-left">Price</th>
                <th className="py-3 px-6 border-b text-left">Quantity</th>
                <th className="py-3 px-6 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paperTypes.map((paper, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="py-3 px-6 border-b text-left">
                    <input
                      type="text"
                      value={paper.type}
                      onChange={(e) => handlePaperTypeChange(index, "type", e.target.value)}
                      disabled={editingIndex !== index}
                      className={`border rounded w-full p-2 ${editingIndex !== index && "bg-gray-100 cursor-not-allowed"}`}
                    />
                  </td>
                  <td className="py-3 px-6 border-b text-left">
                    <input
                      type="number"
                      value={paper.price}
                      onChange={(e) => handlePaperTypeChange(index, "price", e.target.value)}
                      disabled={editingIndex !== index}
                      className={`border rounded w-full p-2 ${editingIndex !== index && "bg-gray-100 cursor-not-allowed"}`}
                    />
                  </td>
                  <td className="py-3 px-6 border-b text-left">
                    <input
                      type="number"
                      min="0"
                      value={paper.balance}
                      onChange={(e) => handlePaperTypeChange(index, "balance", e.target.value)}
                      disabled={editingIndex !== index}
                      className={`border rounded w-full p-2 ${editingIndex !== index && "bg-gray-100 cursor-not-allowed"}`}
                    />
                  </td>
                  <td className="py-3 px-6 border-b text-left">
                    <div className="flex gap-2 ml-2">
                      {editingIndex === index ? (
                        <>
                          <button
                            className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                            onClick={() => handleSave(index)}
                          >
                            Save
                          </button>
                          <button
                            className="px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                            onClick={() => {
                              // Khôi phục dữ liệu từ originalPaper
                              const updatedPaperTypes = [...paperTypes];
                              updatedPaperTypes[editingIndex] = originalPaper; // Khôi phục dữ liệu gốc
                              setPaperTypes(updatedPaperTypes);
                              setEditingIndex(null); // Thoát chế độ chỉnh sửa
                              setOriginalPaper(null); // Xóa giá trị gốc đã lưu
                            }}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                            onClick={() => handleEditToggle(index)}
                          >
                            Edit
                          </button>
                          <button
                            className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                            onClick={() => {
                              setPaperToDelete(paper); // Lưu loại giấy cần xóa
                              setConfirmDeleteModal(true); // Mở modal xác nhận
                            }}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4">
          <button
            className="px-4 py-2 bg-green-500 text-white rounded"
            onClick={() => setIsModalOpen(true)}
          >
            Add Paper Type
          </button>
        </div>
      </div>

      {/* Modal xác nhận xóa */}
      {confirmDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-96 shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Are you sure you want to delete this paper type?</h2>
            <div className="flex justify-end gap-2">
              <button
                onClick={handleDeletePaperType}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                Delete
              </button>
              <button
                onClick={closeConfirmDeleteModal}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-600">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal thêm loại giấy */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-96 shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Paper Type</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                x
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Type"
                value={newPaper.type}
                onChange={(e) => setNewPaper({ ...newPaper, type: e.target.value })}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:border-blue-300"
              />
              <input
                type="number"
                placeholder="Price"
                min="1"
                value={newPaper.price}
                onChange={(e) => setNewPaper({ ...newPaper, price: e.target.value })}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:border-blue-300"
              />
              <input
                type="number"
                placeholder="Quantity"
                min="0"
                value={newPaper.balance}
                onChange={(e) => setNewPaper({ ...newPaper, balance: e.target.value })}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleAddPaperType}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
      {notification && (
        <NotificationModal
          message={notification}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};

export default ConfigPage;
