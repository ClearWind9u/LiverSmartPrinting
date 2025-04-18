import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";

const PrinterForm = () => {
  const { id } = useParams();
  const [printer, setPrinter] = useState([]);
  const [file, setFile] = useState(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState(null);
  const [copies, setCopies] = useState(1);
  const [colorMode, setColorMode] = useState("as-a-printer");
  const [pageOrientation, setPageOrientation] = useState("as-in-document");
  const [pagesPerSheet, setPagesPerSheet] = useState(1);
  const [pageSize, setPageSize] = useState("A4");
  const [pageRange, setPageRange] = useState("all");
  const [printSides, setPrintSides] = useState("one");
  const [balancePage, setBalancePage] = useState(0);
  const user = useSelector((state) => state.auth.login?.currentUser);
  const navigate = useNavigate();
  const API_URL = 'https://liver-smart-printing-bf56.vercel.app';

  useEffect(() => {
    const fetchPrinter = async () => {
      try {
        const response = await axios.get(`${API_URL}/printers/${id}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        setPrinter(response.data.printer);
      } catch (error) {
        console.error("Error fetching printers:", error);
      }
    };

    fetchPrinter();
  }, []);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        // Gọi API lấy số dư
        const response = await axios.get(`${API_URL}/balance/${pageSize}/${user._id}`);

        if (response.data.success) {
          setBalancePage(response.data.data.balance || 0);
        } else {
          setBalancePage(0); // Nếu không tìm thấy loại giấy, đặt số dư về 0
        }
      } catch (error) {
        console.error("Error fetching balance:", error);
        setBalancePage(-1); // Trường hợp lỗi
      }
    };
    if (user?._id) {
      fetchBalance();
    }
  }, [pageSize, user]);

  const handlePrint = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("No file selected. Please upload a file before printing.");
      return;
    }
    
    if (copies <= 0) {
      alert("Number of copies must be greater than 0.");
      return;
    }
    
    if (balancePage < copies) {
      alert(`Insufficient balance for ${pageSize} paper. Please add more pages.`);
      return;
    }
    
    try {
      // Gửi yêu cầu trừ số dư trang
      const updateBalanceResponse = await axios.put(`${API_URL}/update-balance/${user._id}`, {
        pageSize,
        changePage: -copies, // Số trang cần trừ
      });
      
      if (!updateBalanceResponse.data.success) {
        alert("Failed to update page balance. Please try again.");
        return;
      }
      
      // Tạo dữ liệu in
      const printData = {
        fileName: file.name,
        noCopy: copies,
        colorMode: colorMode,
        orientation: pageOrientation,
        multiplePage: pagesPerSheet,
        size: pageSize,
        pageRange,
        userId: user._id,
        printerId: id,
      };
      
      const response = await axios.post(`${API_URL}/histories/create`, printData, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.data.success) {
        alert("Print job created successfully!");
        navigate("/printers");
      } else {
        alert("Failed to create print job.");
      }
    } catch (error) {
      console.error("Error during print:", error);
      alert("An error occurred while processing the print job.");
    }
  };
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Kiểm tra loại file (chỉ cho phép file PDF hoặc các định dạng hình ảnh)
      const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/gif"];
      if (!allowedTypes.includes(selectedFile.type)) {
        alert("Invalid file type. Please upload a PDF or an image file.");
        return; // Không xử lý tiếp nếu file không hợp lệ
      }
  
      setFile(selectedFile);
      setFilePreviewUrl(URL.createObjectURL(selectedFile)); // Tạo URL xem trước file
    }
  };  

  return (
    <form className="bg-gray-200 p-4 rounded shadow-lg w-3/4 mx-auto mt-4"
      style={{ marginTop: '80px' }}
      onSubmit={handlePrint}>
      <h2 className="text-lg font-semibold mb-2 text-center">{printer.name}</h2>

      {/* File Upload */}
      {
        !filePreviewUrl && (
          <div className="mb-3">
            <label className="block font-medium mb-2">Upload file to print:</label>
            <div className="border border-dashed border-gray-400 rounded flex justify-center items-center p-4">
              <input
                type="file"
                onChange={handleFileChange}
                accept="application/pdf" // Chỉ chấp nhận file PDF (hoặc mở rộng nếu cần)
                className="hidden"
                id="fileInput"
              />
              <label htmlFor="fileInput" className="cursor-pointer text-blue-500">
                Select file or <span className="underline">Drag file here</span>
              </label>
            </div>
          </div>
        )
      }

      {/* File Preview */}
      {
        filePreviewUrl && (
          <div className="grid grid-cols-2 gap-2" style={{ height: '630px' }}>
            {/* File Preview */}
            <div className="mb-3">
              <label className="block font-medium mb-1">Preview:</label>
              <div className="border border-gray-400 rounded overflow-hidden">
                <iframe
                  src={filePreviewUrl}
                  className="w-full h-full"
                  style={{ height: '590px' }}
                  title="File Preview"
                ></iframe>
              </div>
            </div>

            {/* Settings */}
            <div>
              <div className="grid grid-cols-1 gap-4">
                <div className="mb-2">
                  <label className="block font-medium mb-1">Number of copies:</label>
                  <input
                    type="number"
                    value={copies}
                    onChange={(e) => setCopies(e.target.value)}
                    className="border rounded w-full p-2"
                    min="1"
                  />
                </div>

                <div className="mb-2">
                  <label className="block font-medium mb-1">Color mode:</label>
                  <select
                    value={colorMode}
                    onChange={(e) => setColorMode(e.target.value)}
                    className="border rounded w-full p-2">
                    <option value="as-a-printer">As a printer</option>
                    <option value="black-white">Black & White</option>
                    <option value="color">Color</option>
                  </select>
                </div>

                <div className="mb-2">
                  <label className="block font-medium mb-1">Page orientation:</label>
                  <select
                    value={pageOrientation}
                    onChange={(e) => setPageOrientation(e.target.value)}
                    className="border rounded w-full p-2"
                  >
                    <option value="as-in-document">As in document</option>
                    <option value="portrait">Portrait</option>
                    <option value="landscape">Landscape</option>
                  </select>
                </div>

                <div className="mb-2">
                  <label className="block font-medium mb-1">Multiple pages per sheet:</label>
                  <select
                    value={pagesPerSheet}
                    onChange={(e) => setPagesPerSheet(e.target.value)}
                    className="border rounded w-full p-2"
                  >
                    <option value="1">1 page</option>
                    <option value="2">2 pages</option>
                    <option value="4">4 pages</option>
                  </select>
                </div>

                <div className="mb-2">
                  <label className="block font-medium mb-1">Page size:</label>
                  <select
                    value={pageSize}
                    onChange={(e) => setPageSize(e.target.value)}
                    className="border rounded w-full p-2"
                  >
                    <option>A0</option>
                    <option>A1</option>
                    <option>A2</option>
                    <option>A3</option>
                    <option>A4</option>
                    <option>A5</option>
                  </select>
                </div>

                <div className="mb-1">
                  <label className="block font-medium mb-1">Page range:</label>
                  <div className="flex items-center">
                    <label className="mr-2">
                      <input
                        type="radio"
                        name="pageRange"
                        value="All"
                        checked={pageRange === "all"}
                        onChange={() => setPageRange("all")}
                        className="mr-1"
                      />
                      All
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="pageRange"
                        value="Pages"
                        checked={pageRange !== "all"}
                        onChange={() => setPageRange(null)}
                        className="mr-1"
                      />
                      Pages
                    </label>
                    {pageRange !== "all" && (
                      <input
                        type="text"
                        placeholder="e.g., 1-5"
                        onChange={(e) => setPageRange(e.target.value)}
                        className="border rounded ml-3"
                      />
                    )}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="block font-medium mb-1">Sides:</label>
                  <div className="flex items-center">
                    <label className="mr-2">
                      <input
                        type="radio"
                        name="printSides"
                        value="one"
                        checked={printSides === "one"}
                        onChange={() => setPrintSides("one")}
                        className="mr-1"
                      />
                      Print one sided
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="printSides"
                        value="both"
                        checked={printSides === "both"}
                        onChange={() => setPrintSides("both")}
                        className="mr-1"
                      />
                      Print on both sides
                    </label>
                  </div>
                </div>
              </div>

              <div className="mb-2 flex items-center">
                <Link
                  to="/buy-paper"
                  className="px-4 py-2 bg-green-500 text-white rounded">
                  Buy Pages
                </Link>
                <span className="ml-4">Balance Pages: {balancePage}</span>
              </div>
            </div>
          </div>
        )
      }
      {/* Buttons */}
      <div className="flex justify-between mt-2">
        <Link to="/printers" className="px-4 py-2 bg-gray-300 rounded">
          Cancel
        </Link>
        <button type="submit" className={`px-4 py-2 rounded ${filePreviewUrl
          ? "bg-blue-500 text-white"
          : "bg-gray-600 text-white cursor-not-allowed"
          }`} disabled={!filePreviewUrl}>
          Print
        </button>
      </div>
    </form >
  )
};

export default PrinterForm;