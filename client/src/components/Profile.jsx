import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Profile = () => {
    const currentUser = useSelector((state) => state.auth.login?.currentUser);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get(`${API_URL}/user/${currentUser._id}`);
                if (response.data.success) {
                    setUser(response.data.data);
                } else {
                    setError("Failed to fetch user profile");
                }
            } catch (err) {
                console.error(err);
                setError("An error occurred while fetching user profile");
            } finally {
                setLoading(false);
            }
        };

        if (currentUser?._id) {
            fetchUserProfile();
        }
    }, [currentUser]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    // Sắp xếp balancePage theo type
    const sortedBalancePage = user.balancePage?.sort((a, b) => {
        if (a.type < b.type) return -1;
        if (a.type > b.type) return 1;
        return 0;
    });

    return (
        <div className="pt-[110px] h-full w-full" style={{ height: "750px" }}>
            <div className="w-3/4 h-5/6 mx-auto mt-6 bg-white p-8 rounded-lg shadow-lg flex">
                <div className="w-1/2 pr-4">
                    <h1 className="text-left text-3xl font-bold mb-8 text-gray-700">User Profile</h1>

                    {/* User Details Section */}
                    <div className="text-2xl">
                        <div className="border-t border-gray-300 py-3 flex">
                            <div className="text-gray-700 font-bold">Student ID:</div>
                            <div className="text-gray-900 ml-auto">{user._id}</div>
                        </div>
                        <div className="border-t border-gray-300 py-3 flex">
                            <div className="text-gray-700 font-bold">Name:</div>
                            <div className="text-gray-900 ml-auto">{user.username}</div>
                        </div>
                        <div className="border-t border-gray-300 py-3 flex">
                            <div className="text-gray-700 font-bold">Role:</div>
                            <div className="text-gray-900 ml-auto">{user.role}</div>
                        </div>
                        <div className="border-t border-gray-300 py-3 flex">
                            <div className="text-gray-700 font-bold">Email:</div>
                            <div className="text-gray-900 ml-auto">{user.email}</div>
                        </div>
                        <div className="border-t border-gray-300 py-3 flex">
                            <div className="text-gray-700 font-bold">Created Date:</div>
                            <div className="text-gray-900 ml-auto">{user.createdAt}</div>
                        </div>
                    </div>
                </div>

                <div className="w-1/2 pl-4">
                    <h2 className="text-left text-3xl font-bold mb-8 text-gray-700">Page Balance</h2>
                    <table className="w-full border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="py-2 px-4 border-b text-2xl text-left text-gray-700">Type</th>
                                <th className="py-2 px-4 border-b text-2xl text-left text-gray-700">Number</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedBalancePage?.map((balance, index) => (
                                <tr key={index}>
                                    <td className="py-3 px-4 border-b text-2xl font-bold text-gray-700">{balance.type}</td>
                                    <td className="py-3 px-4 border-b text-2xl text-gray-900">{balance.balance}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Profile;