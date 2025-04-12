import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AddPrinterForm = () => {
  const [printerName, setPrinterName] = useState('');
  const [type, setType] = useState('');
  const [price, setPrice] = useState('');
  const [information, setInformation] = useState('');
  const [file, setFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const API_URL = 'https://liver-smart-printing-bf56.vercel.app'; // or 'http://localhost:5000' for local

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileType = file.type;
      if (fileType === 'image/jpeg' || fileType === 'image/png') {
        setError('');
        const imageUrl = URL.createObjectURL(file);
        setSelectedImage(imageUrl);
        setFile(file);
      } else {
        setError('Please upload a valid JPG or PNG file.');
        setSelectedImage(null);
        setFile(null);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (selectedImage) {
        URL.revokeObjectURL(selectedImage);
      }
    };
  }, [selectedImage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!printerName || !type || !price || !information || !file) {
      setError('All fields are required, including an image.');
      setLoading(false);
      return;
    }

    const priceNum = Number(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      setError('Price must be a valid positive number.');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('name', printerName);
    formData.append('price', price);
    formData.append('type', type);
    formData.append('information', information);
    formData.append('image', file);

    try {
      const response = await axios.post(`${API_URL}/printers/create`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        alert('Printer added successfully!');
        setPrinterName('');
        setType('');
        setPrice('');
        setInformation('');
        setFile(null);
        setSelectedImage(null);
        setError('');
        navigate('/printers');
      } else {
        setError(response.data.message || 'Failed to add printer.');
      }
    } catch (err) {
      console.error('Error adding printer:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      setError(
        err.response?.data?.message ||
          'Failed to connect to the server. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-lg w-3/4 mx-auto"
        style={{ padding: '10px 20px' }}
        encType="multipart/form-data"
      >
        <h2 className="text-lg font-semibold mb-4 text-center">Add Printer</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="grid grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block font-medium mb-1">Name:</label>
            <input
              type="text"
              value={printerName}
              onChange={(e) => setPrinterName(e.target.value)}
              className="border rounded w-full p-2"
              disabled={loading}
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-1">Type:</label>
            <input
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="border rounded w-full p-2"
              disabled={loading}
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-1">Price:</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="border rounded w-full p-2"
              min="0"
              step="0.01"
              disabled={loading}
            />
          </div>
          <div className="mb-4 col-span-2">
            <label className="block font-medium mb-1">Information:</label>
            <textarea
              value={information}
              onChange={(e) => setInformation(e.target.value)}
              className="border rounded w-full p-2"
              disabled={loading}
            ></textarea>
          </div>
          <div className="mb-2 col-span-2">
            <label className="block font-medium mb-2">Picture of Printer:</label>
            <div className="border border-dashed border-gray-400 rounded flex justify-center items-center p-2">
              <input
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={handleImageChange}
                className="cursor-pointer text-black"
                disabled={loading}
              />
              {selectedImage && (
                <div>
                  <p className="text-blue-500">Image preview:</p>
                  <img
                    src={selectedImage}
                    alt="Preview"
                    style={{ width: 'auto', height: '240px' }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-between mt-2">
          <Link
            to="/printers"
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className={`px-4 py-2 text-white rounded ${
              loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-red-500'
            }`}
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPrinterForm;