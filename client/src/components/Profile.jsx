import React from "react";

const Profile = () => {
    const user = {
        id: "1111111",
        name: "Tran Truong Tuan P",
        role: "Student",
        email: "pt@hcmut.edu.vn",
        balance: {
            a4: 50,
            a3: 20,
            a2: 10,
            a1: 4,
        },
        createdDate: "09/12/2023, 23:20:33",
    };

    return (
        <div className="pt-[190px] h-full w-full" style={{ height: "650px" }}>
            <div className="w-3/4 h-5/6 mx-auto mt-6 bg-white p-8 rounded-lg shadow-lg flex">
                <div className="w-1/2 pr-4">
                    <h1 className="text-left text-3xl font-bold mb-8 text-gray-700">User Profile</h1>

                    {/* User Details Section */}
                    <div className="text-2xl">
                        <div className="border-t border-gray-300 py-3 flex">
                            <div className="text-gray-700 font-bold">Student ID:</div>
                            <div className="text-gray-900 ml-auto">{user.id}</div>
                        </div>
                        <div className="border-t border-gray-300 py-3 flex">
                            <div className="text-gray-700 font-bold">Name:</div>
                            <div className="text-gray-900 ml-auto">{user.name}</div>
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
                            <div className="text-gray-900 ml-auto">{user.createdDate}</div>
                        </div>
                    </div>
                </div>

                <div className="w-1/2 pl-4">
                    <h2 className="text-center text-3xl font-bold mb-8 text-gray-700">Page Balance</h2>
                    <table className="w-full border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="py-2 px-4 border-b text-2xl text-left text-gray-700">Type</th>
                                <th className="py-2 px-4 border-b  text-2xl text-left text-gray-700">Number</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="py-3 px-4 border-b text-2xl font-bold text-gray-700">A4</td>
                                <td className="py-3 px-4 border-b text-2xl text-gray-900">{user.balance.a4}</td>
                            </tr>
                            <tr>
                                <td className="py-2 px-4 border-b text-2xl font-bold text-gray-700">A3</td>
                                <td className="py-3 px-4 border-b text-2xl text-gray-900">{user.balance.a3}</td>
                            </tr>
                            <tr>
                                <td className="py-3 px-4 border-b text-2xl font-bold text-gray-700">A2</td>
                                <td className="py-3 px-4 border-b text-2xl text-gray-900">{user.balance.a2}</td>
                            </tr>
                            <tr>
                                <td className="py-3 px-4 border-b text-2xl font-bold text-gray-700">A1</td>
                                <td className="py-3 px-4 border-b text-2xl text-gray-900">{user.balance.a1}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Profile;
