import React, { useState } from "react";

const ConfigPage = () => {
  const [editingIndex, setEditingIndex] = useState(null); // Index của hàng đang chỉnh sửa
  const [paperTypes, setPaperTypes] = useState([
    { type: "A4", price: 0.1, quantity: 100 },
    { type: "A3", price: 0.5, quantity: 50 },
    { type: "A2", price: 0.8, quantity: 50 },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Trạng thái mở modal
  const [newPaper, setNewPaper] = useState({ type: "", price: "", quantity: "" }); // Dữ liệu hàng mới

  const handleAddPaperType = () => {
    // Mở modal
    setIsModalOpen(true);
  };

  const handlePaperTypeChange = (index, field, value) => {
    const newPaperTypes = [...paperTypes];
    newPaperTypes[index][field] = value;
    setPaperTypes(newPaperTypes);
  };

  const handleDeletePaperType = (index) => {
    const newPaperTypes = paperTypes.filter((_, i) => i !== index);
    setPaperTypes(newPaperTypes);
  };

  const handleSave = (index) => {
    const currentRow = paperTypes[index];
    // Kiểm tra nếu tất cả các trường đã được nhập
    if (!currentRow.type || !currentRow.price || !currentRow.quantity) {
      alert("Please fill in all fields before saving.");
      return;
    }
    setEditingIndex(null); // Kết thúc chỉnh sửa
  };

  const handleEditToggle = (index) => {
    setEditingIndex(index); // Bắt đầu chỉnh sửa hàng khác
  };

  const handleAddNewPaper = () => {
    // Kiểm tra nếu tất cả các trường đã được nhập
    if (!newPaper.type || !newPaper.price || !newPaper.quantity) {
      alert("Please fill in all fields.");
      return;
    }
    setPaperTypes([...paperTypes, newPaper]);
    setNewPaper({ type: "", price: "", quantity: "" }); // Reset dữ liệu hàng mới
    setIsModalOpen(false); // Đóng modal
  };

  return (
    <div className="pt-16 w-full h-full">
      <div className="w-3/4 mx-auto mt-6 bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-center text-3xl font-bold mb-6 text-gray-800">
          Configuration Page
        </h1>
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          Paper Config
        </h2>
        <div
          className="overflow-y-auto"
          style={{
            maxHeight: "300px",
          }}
        >
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
                <tr
                  key={index}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="py-3 px-6 border-b text-left">
                    <input
                      type="text"
                      value={paper.type}
                      onChange={(e) =>
                        handlePaperTypeChange(index, "type", e.target.value)
                      }
                      disabled={editingIndex !== index}
                      className={`border rounded w-full p-2 ${editingIndex !== index && "bg-gray-100 cursor-not-allowed"
                        }`}
                    />
                  </td>
                  <td className="py-3 px-6 border-b text-left">
                    <input
                      type="number"
                      value={paper.price}
                      onChange={(e) =>
                        handlePaperTypeChange(index, "price", e.target.value)
                      }
                      disabled={editingIndex !== index}
                      className={`border rounded w-full p-2 ${editingIndex !== index && "bg-gray-100 cursor-not-allowed"
                        }`}
                    />
                  </td>
                  <td className="py-3 px-6 border-b text-left">
                    <input
                      type="number"
                      value={paper.quantity}
                      onChange={(e) =>
                        handlePaperTypeChange(
                          index,
                          "quantity",
                          e.target.value
                        )
                      }
                      disabled={editingIndex !== index}
                      className={`border rounded w-full p-2 ${editingIndex !== index && "bg-gray-100 cursor-not-allowed"
                        }`}
                    />
                  </td>
                  <td className="py-3 px-6 border-b text-left">
                    <div className="flex gap-2 ml-2">
                      {editingIndex === index ? (
                        <button
                          className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                          onClick={() => handleSave(index)}
                        >
                          Save
                        </button>
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
                            onClick={() => handleDeletePaperType(index)}
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
            onClick={handleAddPaperType}
          >
            Add Paper Type
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-96 shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Paper Type</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Type"
                value={newPaper.type}
                onChange={(e) =>
                  setNewPaper({ ...newPaper, type: e.target.value })
                }
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:border-blue-300"
              />
              <input
                type="number"
                placeholder="Price"
                value={newPaper.price}
                onChange={(e) =>
                  setNewPaper({ ...newPaper, price: e.target.value })
                }
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:border-blue-300"
              />
              <input
                type="number"
                placeholder="Quantity"
                value={newPaper.quantity}
                onChange={(e) =>
                  setNewPaper({ ...newPaper, quantity: e.target.value })
                }
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleAddNewPaper}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfigPage;
