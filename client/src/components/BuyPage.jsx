import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { loginSuccess } from "../redux/userSlice";

const BuyPage = () => {
  const [paperType, setPaperType] = useState("A4");
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(100); // Example price per sheet
  const navigate = useNavigate();
  const [pagePrice, setPagePrice] = useState([]);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.login?.currentUser);

  useEffect(() => {
    const fetchPagePrice = async () => {
      try {
        const response = await axios.get("http://localhost:5000/balance");
        if (response.data.success) {
          // Ánh xạ dữ liệu từ API
          const pages = response.data.balancePages.map((page) => ({
            id: `${page._id}`, // Tạo ID duy nhất
            type: page.type,
            price: page.price,
          }));
          setPagePrice(pages);
        } else {
          setError("Failed to fetch payment logs");
        }
      } catch (err) {
        console.error(err);
        setError("An error occurred while fetching payment logs");
      }
    };

    fetchPagePrice();
  }, []);

  const handlePaperTypeChange = (e) => {
    const selectedType = e.target.value;
    setPaperType(selectedType);
    const page = pagePrice.find(page => page.type === selectedType);
    const price = page.price;
    setPrice(price);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Kiểm tra đầu vào
    if (!paperType) {
      alert("Please select a paper type.");
      return;
    }
    if (!quantity || quantity <= 0) {
      alert("Quantity must be greater than 0.");
      return;
    }
    const totalPrice = price * quantity;
    if (user.wallet < totalPrice) {
      alert('No');
      return;
    }
    try {
      // Gửi yêu cầu POST để tạo giao dịch mua
      const response = await axios.post("http://localhost:5000/pages/create", {
        type: paperType,
        quantity,
        totalPrice,
        userId: user._id,
      });

      if (response.data.success) {
        // Gửi yêu cầu PUT để cập nhật balancePage
        const balanceUpdateResponse = await axios.put(`http://localhost:5000/update-balance/${user._id}`, {
          pageSize: paperType, // Thêm loại giấy
          changePage: Number(quantity), // Thêm số lượng trang
        });
        const walletUpdateResponse = await axios.put(`http://localhost:5000/update-wallet/${user._id}`, { changeWallet: Number(totalPrice) * -1});
        if (balanceUpdateResponse.data.success && walletUpdateResponse.data.success) {
          const updateUser = {
            ...user,
            wallet: user.wallet - Number(totalPrice)
          }
          dispatch(loginSuccess(updateUser));
          alert("Purchase successful! Balance updated.");
        } else if (!walletUpdateResponse.data.success) {
          console.error("Wallet update error:", walletUpdateResponse.data.message);
          alert(`Purchase successful, but wallet update failed: ${walletUpdateResponse.data.message}`);
        } else {
          console.error("Balance update error:", balanceUpdateResponse.data.message);
          alert(`Purchase successful, but balance update failed: ${balanceUpdateResponse.data.message}`);
        }
      } else {
        console.error("Purchase error:", response.data.message);
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
            className="border rounded w-full p-2">
            {pagePrice
              .slice() // Tạo bản sao mảng để tránh thay đổi mảng gốc
              .sort((a, b) => a.type.localeCompare(b.type)) // Sắp xếp theo tên
              .map((page) => (
                <option key={page.id} value={page.type}>
                  {page.type}
                </option>
              ))}
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
