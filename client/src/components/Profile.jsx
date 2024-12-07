import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "./utils/cropImage"; // Helper function for cropping

const Profile = () => {
    const user = {
        id: "1111111",
        name: "Tran Truong Tuan P",
        role: "Student",
        email: "pt@hcmut.edu.vn",
        balance: 84,
        lastLogin: "09/12/2023, 23:20:33",
    };

    const [avatar, setAvatar] = useState(null); // Display cropped avatar
    const [selectedImage, setSelectedImage] = useState(null); // Store the uploaded image
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [showCropper, setShowCropper] = useState(false);

    const handleAvatarUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setSelectedImage(reader.result);
                setShowCropper(true); // Show cropper after selecting image
            };
            reader.readAsDataURL(file);
        }
    };

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleCrop = async () => {
        try {
            const croppedImage = await getCroppedImg(selectedImage, croppedAreaPixels);
            setAvatar(croppedImage); // Set the cropped image as avatar
            setShowCropper(false); // Hide cropper
        } catch (err) {
            console.error("Error cropping image:", err);
        }
    };

    const handleCancel = () => {
        setSelectedImage(null);
        setShowCropper(false); // Close the cropper modal
    };

    return (
        <div className="pt-16 h-full w-full">
            <div className="w-3/4 h-5/6 mx-auto mt-6 bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-center text-3xl font-bold mb-8 text-gray-700">User Profile</h1>

                <div className="ml-8 flex-grow">
                    <div className="flex flex-col items-center mb-8">
                        <div className="relative">
                            <div className="w-48 h-48 rounded-full overflow-hidden bg-gray-200 border border-gray-300 flex items-center justify-center mb-3">
                                {avatar ? (
                                    <img
                                        src={avatar}
                                        alt="User Avatar"
                                        className="object-cover"
                                        style={{ width: "100%", height: "100%" }}
                                    />
                                ) : (
                                    <span className="mx-2 text-gray-500 text-xl flex items-center justify-center">
                                        No Avatar
                                    </span>
                                )}
                            </div>
                            <label
                                htmlFor="avatarUpload"
                                className="mx-2 absolute bottom-0 right-2 bg-blue-500 text-white px-3 py-1 rounded-full cursor-pointer text-sm flex items-center justify-center"
                            >
                                Upload
                            </label>
                            <input
                                type="file"
                                id="avatarUpload"
                                className="hidden"
                                accept="image/*"
                                onChange={handleAvatarUpload}
                            />
                        </div>
                    </div>

                    {/* Cropper Modal */}
                    {showCropper && (
                        <div className="cropper-modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                                <h2 className="text-xl font-bold mb-4 text-gray-700 text-center">
                                    Adjust and Crop Image
                                </h2>
                                <div className="cropper-container relative w-full h-64">
                                    <Cropper
                                        image={selectedImage}
                                        crop={crop}
                                        zoom={zoom}
                                        aspect={4 / 3} // Aspect ratio
                                        onCropChange={setCrop}
                                        onZoomChange={setZoom}
                                        onCropComplete={onCropComplete}
                                    />
                                </div>
                                <div className="flex justify-end mt-4 gap-4">
                                    <button
                                        className="bg-green-500 text-white px-4 py-2 rounded"
                                        onClick={handleCrop}
                                    >
                                        Accept
                                    </button>
                                    <button
                                        className="bg-red-500 text-white px-4 py-2 rounded"
                                        onClick={handleCancel}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* User Details Section */}
                    <div className="grid grid-cols-2 gap-4 text-3xl">
                        <div className="border-t border-gray-300 py-3 flex items-center gap-x-1">
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
                            <div className="text-gray-700 font-bold">Page balance:</div>
                            <div className="text-gray-900 ml-auto">{user.balance}</div>
                        </div>
                        <div className="border-t border-gray-300 py-3 flex">
                            <div className="text-gray-700 font-bold">Last login:</div>
                            <div className="text-gray-900 ml-auto">{user.lastLogin}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
