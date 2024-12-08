import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const PrinterForm = () => {
  const { id } = useParams();
  const [printer, setPrinter] = useState([]);
  const [file, setFile] = useState(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState(null);
  const [copies, setCopies] = useState(1);
  const [colorMode, setColorMode] = useState("As a printer");
  const [pageOrientation, setPageOrientation] = useState("As in document");
  const [pagesPerSheet, setPagesPerSheet] = useState(1);
  const [pageSize, setPageSize] = useState("A4");
  const [pageRange, setPageRange] = useState("All");
  const [printSides, setPrintSides] = useState("one");
  const [remainingPaper, setRemainingPaper] = useState(100); // Example remaining paper
  const user = useSelector((state) => state.auth.login?.currentUser);

  useEffect(() => {
    const fetchPrinter = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/printers/${id}`, {
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

  const handlePrint = async (e) => {
    e.preventDefault();

    try {
      // Giả sử bạn có userId (lấy từ session hoặc state)
      const userId = user._id; // Thay thế bằng userId thật

      const formData = new FormData();
      formData.append("file", file);

      // Gửi file để lấy URL trên server
      const uploadResponse = await axios.post("http://localhost:5000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const fileUrl = uploadResponse.data.fileUrl;

      // Tạo dữ liệu lịch sử in
      const printData = {
        fileUrl,
        noCopy: copies,
        orientation: pageOrientation,
        multiplePage: pagesPerSheet,
        size: pageSize,
        pageRange,
        userId,
        printerId: id,
      };

      // Gửi yêu cầu tạo lịch sử in
      const response = await axios.post("http://localhost:5000/histories/create", printData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        alert("Print job created successfully!");
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
      setFile(selectedFile);
      const previewUrl = URL.createObjectURL(selectedFile);
      setFilePreviewUrl(previewUrl); // Tạo URL xem trước file
    }
  };

  return (
    <form className="bg-gray-200 p-4 rounded shadow-lg w-3/4 mx-auto mt-4">
      <h2 className="text-lg font-semibold mb-2 text-center">{printer.name}</h2>

      {/* File Upload */}
      {!filePreviewUrl && (
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
      )}

      {/* File Preview */}
      {filePreviewUrl && (
        <div className="grid grid-cols-2 gap-2">
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
              <div className="mb-3">
                <label className="block font-medium mb-1">Number of copies:</label>
                <input
                  type="number"
                  value={copies}
                  onChange={(e) => setCopies(e.target.value)}
                  className="border rounded w-full p-2"
                />
              </div>

              <div className="mb-3">
                <label className="block font-medium mb-1">Color mode:</label>
                <select
                  value={colorMode}
                  onChange={(e) => setColorMode(e.target.value)}
                  className="border rounded w-full p-2"
                >
                  <option>As a printer</option>
                  <option>Black & White</option>
                  <option>Color</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="block font-medium mb-1">Page orientation:</label>
                <select
                  value={pageOrientation}
                  onChange={(e) => setPageOrientation(e.target.value)}
                  className="border rounded w-full p-2"
                >
                  <option>As in document</option>
                  <option>Portrait</option>
                  <option>Landscape</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="block font-medium mb-1">Multiple pages per sheet:</label>
                <select
                  value={pagesPerSheet}
                  onChange={(e) => setPagesPerSheet(e.target.value)}
                  className="border rounded w-full p-2"
                >
                  <option>1 page</option>
                  <option>2 pages</option>
                  <option>4 pages</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="block font-medium mb-1">Page size:</label>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(e.target.value)}
                  className="border rounded w-full p-2"
                >
                  <option>A4</option>
                  <option>A3</option>
                  <option>Letter</option>
                  <option>Legal</option>
                </select>
              </div>

              {/* Page Range and Slides*/}
              <div className="grid grid-cols-2 gap-1">
                <div>
                  <label className="block font-medium mb-3">Page range:</label>
                  <div className="flex items-center">
                    <label className="mr-2">
                      <input
                        type="radio"
                        name="pageRange"
                        value="All"
                        checked={pageRange === "All"}
                        onChange={() => setPageRange("All")}
                        className="mr-1"
                      />
                      All
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="pageRange"
                        value="Pages"
                        checked={pageRange === "Pages"}
                        onChange={() => setPageRange("Pages")}
                        className="mr-1"
                      />
                      Pages
                    </label>
                    {pageRange === "Pages" && (
                      <input
                        type="text"
                        placeholder="e.g., 1-5"
                        className="border rounded p-1 ml-2"
                      />
                    )}
                  </div>
                </div>

                <div>
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

              <div className="mb-3 flex items-center">
                <Link
                  to="/buy-paper"
                  className="px-4 py-2 bg-green-500 text-white rounded"
                >
                  Buy Paper
                </Link>
                <span className="ml-4">Remaining paper: {remainingPaper}</span>
              </div>
            </div>

          </div>
        </div>
      )}
      {/* Buttons */}
      <div className="flex justify-between mt-3">
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
    </form>
  )
};

export default PrinterForm;