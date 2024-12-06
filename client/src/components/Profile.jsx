import React from "react";

const Profile = () => {
    const user = {
        id: "1111111",
        name: "Mai Đức T",
        role: "Giảng viên",
        email: "t.mai@hcmut.edu.vn",
        balance: 84,
        lastLogin: "09/12/2023, 23:20:33",
    };

    return (
        <div className="h-screen w-full ">
            <div className="mx-auto mt-8 px-4">
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <div className="flex items-center">
                        {/* Avatar */}
                        <div className="flex-shrink-0 w-1/2 h-full bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-gray-500 text-6xl">&#128100;</span>
                        </div>

                        {/* User Info */}
                        <div className="ml-8 flex-grow">
                            <h1 className="text-2xl font-bold mb-4">Thông tin người dùng</h1>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-gray-700 font-medium">Mã số sinh viên:</div>
                                <div className="text-gray-900">{user.id}</div>

                                <div className="text-gray-700 font-medium">Họ và tên:</div>
                                <div className="text-gray-900">{user.name}</div>

                                <div className="text-gray-700 font-medium">Đối tượng:</div>
                                <div className="text-gray-900">{user.role}</div>

                                <div className="text-gray-700 font-medium">Email:</div>
                                <div className="text-gray-900">{user.email}</div>

                                <div className="text-gray-700 font-medium">Số dư (trang A4):</div>
                                <div className="text-gray-900">{user.balance}</div>

                                <div className="text-gray-700 font-medium">Lần đăng nhập gần nhất:</div>
                                <div className="text-gray-900">{user.lastLogin}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default Profile;