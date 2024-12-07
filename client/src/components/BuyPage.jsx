import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

const BuyPage = () => {
  const [paperType, setPaperType] = useState("A4");
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(100); // Example price per sheet
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.login?.currentUser);

  const handlePaperTypeChange = (e) => {
    const selectedType = e.target.value;
    setPaperType(selectedType);
    // Update price based on selected paper type
    const prices = {
      A1: 1000,
      A2: 500,
      A3: 250,
      A4: 100,
      A5: 50,
    };
    setPrice(prices[selectedType]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const totalPrice = price * quantity;

    try {
      // Sử dụng Axios để gửi yêu cầu POST
      const response = await axios.post("http://localhost:5000/pages/create", {
        type: paperType,
        quantity,
        totalPrice,
        userId: user._id,
      });

      if (response.data.success) {
      // Gửi yêu cầu PUT để cập nhật balancePage
      const balanceUpdateResponse = await axios.put(`http://localhost:5000/update-balance/${user._id}`, {
        addPage: Number(quantity),
      });
      if (balanceUpdateResponse.data.success) {
        alert("Purchase successful!");
      } else {
        alert(`Balance update failed: ${balanceUpdateResponse.data.message}`);
      }
      } else {
        alert(`Purchase failed: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while processing your request.");
    }
  };

  return (
    <div className="pt-16">
      <form className="bg-gray-200 p-8 rounded shadow-lg w-3/4 h-5/6 mx-auto mt-6" onSubmit={handleSubmit}>
        <h2 className="text-lg font-semibold mb-4 text-center">Buy Pages</h2>

        <div className="mb-4">
          <label className="block font-medium mb-1">Page type:</label>
          <select
            value={paperType}
            onChange={handlePaperTypeChange}
            className="border rounded w-full p-2"
          >
            <option>A1</option>
            <option>A2</option>
            <option>A3</option>
            <option>A4</option>
            <option>A5</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Quantity:</label>
          <input
            type="number"
            value={quantity}
            min="1"
            onChange={(e) => setQuantity(e.target.value)}
            className="border rounded w-full p-2"
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Price per sheet (VNĐ):</label>
          <input
            type="number"
            value={`${price}`}
            readOnly
            className="border rounded w-full p-2 bg-gray-100"
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Total price (VNĐ):</label>
          <input
            type="number"
            value={`${(price * quantity)}`}
            readOnly
            className="border rounded w-full p-2 bg-gray-100"
          />
        </div>

        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded">
            Buy
          </button>
        </div>
      </form>
    </div>
  );
};

export default BuyPage;
