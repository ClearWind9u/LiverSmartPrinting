import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const API_URL = 'https://liver-smart-printing-bf56.vercel.app';

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Reset error message
        setErrorMessage("");

        // Basic validations
        if (!username || !email || !password || !confirmPassword) {
            setErrorMessage("All fields are required.");
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match.");
            return;
        }

        // Prepare data to send
        const userData = {
            username,
            email,
            password
        };

        try {
            const response = await axios.post(`${API_URL}/register`, userData);
            const data = response.data;

            if (data.success) {
                alert("Registration successful! Please log in.");
                navigate("/login"); // Redirect to login page
            } else {
                setErrorMessage(data.message || "Registration failed.");
            }
        } catch (error) {
            console.error("Error:", error.response?.data || error.message);
            setErrorMessage(error.response?.data.message || error.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-red-300 to-blue-300">
            <div className="flex w-[900px] bg-white shadow-lg rounded-lg overflow-hidden">
                {/* Left Section */}
                <div className="w-1/2 bg-gradient-to-r from-red-300 to-blue-300 p-8 flex flex-col justify-center">
                    <h1 className="text-4xl font-bold text-white mb-4">Liver Smart Printing</h1>
                    <p className="text-white text-lg mb-6">Create an account to get started</p>
                    <div className="text-white mt-auto text-sm">hcmut.edu.vn</div>
                </div>

                {/* Right Section */}
                <div className="w-1/2 p-8 flex flex-col justify-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Sign Up</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Username Input */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-600 mb-1">
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                placeholder="Enter your username"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-800"
                            />
                        </div>

                        {/* Email Input */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">
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
                            <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-1">
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

                        {/* Confirm Password Input */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-600 mb-1">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                placeholder="Confirm your password"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-800"
                            />
                        </div>

                        {errorMessage && (
                            <div className="text-red-500 text-sm text-center">{errorMessage}</div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-red-300 to-blue-300 text-white py-2 px-4 rounded-lg font-bold hover:opacity-90"
                        >
                            Sign Up
                        </button>
                    </form>

                    {/* Redirect to Login */}
                    <div className="mt-4 text-center text-sm text-gray-600">
                        Already have an account?{" "}
                        <Link to="/login" className="text-blue-600 hover:underline">
                            Log in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
