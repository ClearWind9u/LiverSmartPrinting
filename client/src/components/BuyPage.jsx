import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const BuyPage = () => {
  const [paperType, setPaperType] = useState("A4");
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0.1); // Example price per sheet
  const navigate = useNavigate();

  const handlePaperTypeChange = (e) => {
    const selectedType = e.target.value;
    setPaperType(selectedType);
    // Update price based on selected paper type
    const prices = {
      A1: 1.0,
      A2: 0.8,
      A3: 0.5,
      A4: 0.1,
      A5: 0.05,
    };
    setPrice(prices[selectedType]);
  };

  return (
    <div className="pt-16">
      <form className="bg-gray-200 p-8 rounded shadow-lg w-3/4 h-5/6 mx-auto mt-6">
        <h2 className="text-lg font-semibold mb-4 text-center">Buy Paper</h2>

        <div className="mb-4">
          <label className="block font-medium mb-1">Paper type:</label>
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
            onChange={(e) => setQuantity(e.target.value)}
            className="border rounded w-full p-2"
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Price per sheet:</label>
          <input
            type="text"
            value={`$${price}`}
            readOnly
            className="border rounded w-full p-2 bg-gray-100"
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Total price:</label>
          <input
            type="text"
            value={`$${(price * quantity).toFixed(2)}`}
            readOnly
            className="border rounded w-full p-2 bg-gray-100"
          />
        </div>

        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Buy
          </button>
        </div>
      </form>
    </div>
  );
};

export default BuyPage;
