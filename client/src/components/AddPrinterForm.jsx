import React, { useState } from "react";
import { Link } from "react-router-dom";

const AddPrinterForm = () => {
  const [printerName, setPrinterName] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [yearOfManufacture, setYearOfManufacture] = useState("");
  const [placeOfManufacture, setPlaceOfManufacture] = useState("");
  const [location, setLocation] = useState("");
  const [specifications, setSpecifications] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic
    const printerData = {
      printerName,
      manufacturer,
      yearOfManufacture,
      placeOfManufacture,
      location,
      specifications,
      file,
    };
    console.log("Printer added:", printerData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded shadow-lg w-3/4 mx-auto mt-6"
    >
      <h2 className="text-lg font-semibold mb-4 text-center">Add Printer</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="mb-4">
          <label className="block font-medium mb-1">Name:</label>
          <input
            type="text"
            value={printerName}
            onChange={(e) => setPrinterName(e.target.value)}
            className="border rounded w-full p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-1">Manufacturer:</label>
          <input
            type="text"
            value={manufacturer}
            onChange={(e) => setManufacturer(e.target.value)}
            className="border rounded w-full p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-1">Year of manufacture:</label>
          <input
            type="text"
            value={yearOfManufacture}
            onChange={(e) => setYearOfManufacture(e.target.value)}
            className="border rounded w-full p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-1">
            Place of manufacture:
          </label>
          <input
            type="text"
            value={placeOfManufacture}
            onChange={(e) => setPlaceOfManufacture(e.target.value)}
            className="border rounded w-full p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-1">Location:</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="border rounded w-full p-2"
          />
        </div>
        <div className="mb-4 col-span-2">
          <label className="block font-medium mb-1">Specifications:</label>
          <textarea
            value={specifications}
            onChange={(e) => setSpecifications(e.target.value)}
            className="border rounded w-full p-2"
          ></textarea>
        </div>
        <div className="mb-4 col-span-2">
          <label className="block font-medium mb-2">Picture of Printer:</label>
          <div className="border border-dashed border-gray-400 rounded flex justify-center items-center p-4">
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="hidden"
              id="fileInput"
            />
            <label htmlFor="fileInput" className="cursor-pointer text-blue-500">
              Select file or <span className="underline">Drag file here</span>
            </label>
          </div>
        </div>
      </div>
      <div className="flex justify-between mt-6">
        <Link
          to="/printers"
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded"
        >
          Cancel
        </Link>
        <button
          type="submit"
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Add
        </button>
      </div>
    </form>
  );
};

export default AddPrinterForm;
