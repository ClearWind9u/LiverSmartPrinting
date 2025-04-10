import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom"; // Import Link
import { loginSuccess } from "../redux/userSlice";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();
  const API_URL = 'https://liver-smart-printing-bf56.vercel.app';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });

      const data = response.data;

      if (data.success) {
        dispatch(loginSuccess(data.user));
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      alert("An error occurred.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-red-300 to-blue-300">
      <div className="flex w-[900px] bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Left Section */}
        <div className="w-1/2 bg-gradient-to-r from-red-300 to-blue-300 p-8 flex flex-col justify-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Liver Smart Printing
          </h1>
          <p className="text-white text-lg mb-6">Sign in to continue access</p>
          <div className="text-white mt-auto text-sm">hcmut.edu.vn</div>
        </div>

        {/* Right Section */}
        <div className="w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Sign In
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-800"
              />
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-800"
              />
            </div>

            {errorMessage && (
              <div className="text-red-500 text-sm">{errorMessage}</div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-red-300 to-blue-300 text-white py-2 px-4 rounded-lg font-bold hover:opacity-90"
            >
              Continue
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Sign up for free
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
