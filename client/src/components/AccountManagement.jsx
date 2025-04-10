import axios from "axios";
import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import NotificationModal from "./NotificationModal"; // Import the new NotificationModal component

const AccountManagement = () => {
  const [accounts, setAccounts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [notification, setNotification] = useState(null); // State for notification
  const API_URL = process.env.REACT_APP_API_URL;

  // Load danh sách tài khoản từ backend
  const fetchAccounts = async () => {
    try {
      const response = await axios.get(`${API_URL}/users`);
      setAccounts(response.data.data);
    } catch (error) {
      console.error("Failed to fetch accounts", error);
    }
  };
  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    if (!isModalOpen) {
      fetchAccounts();
    }
  }, [isModalOpen]);

  // Xử lý thêm tài khoản
  const handleAddAccount = async (newAccount) => {
    try {
      const response = await axios.post(
        `${API_URL}/register`,
        newAccount
      );
      // setAccounts((prev) => [...prev, response.data.newUser]);
      fetchAccounts();
      setIsModalOpen(false);
      setNotification("Create account successfully!"); // Set notification message
    } catch (error) {
      console.error("Failed to add account", error);
      if (error.response.data) alert(error.response.data.message);
    }
  };

  // Xử lý cập nhật tài khoản
  const handleUpdateAccount = async (updatedAccount) => {
    try {
      const response = await axios.put(
        `${API_URL}/update/${selectedAccount._id}`,
        updatedAccount
      );
      setIsModalOpen(false);
      fetchAccounts();
      setNotification("Update account successfully!"); // Set notification message
    } catch (error) {
      console.error("Failed to update account", error);
      if (error.response.data) alert(error.response.data.message);
    }
  };

  // Xử lý xóa tài khoản
  const handleDeleteAccount = async () => {
    try {
      await axios.delete(`${API_URL}/delete/${selectedAccount._id}`);
      if (selectedAccount.role === "user") {
      // Gọi API xóa lịch sử in theo userId
      await axios.delete(`${API_URL}/histories/user/${selectedAccount._id}`);
      // Gọi API xóa lịch sử mua trang in theo userId
      await axios.delete(`${API_URL}/pages/user/${selectedAccount._id}`);
      };
      setAccounts((prev) =>
        prev.filter((acc) => acc._id !== selectedAccount._id)
      );
      setIsModalOpen(false);
      fetchAccounts();
      setNotification("Delete account successfully!"); // Set notification message
    } catch (error) {
      console.error("Failed to delete account and histories (print and buy page)", error);
      if (error.response && error.response.data) {
        alert(error.response.data.message);
      };
    }
  };

  const openModal = (content, account = null) => {
    setModalContent(content);
    setSelectedAccount(account);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
    setSelectedAccount(null);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-3 text-gray-700">
        Account Management
      </h2>
      <button
        className="px-4 py-2 bg-green-500 text-white rounded mb-3"
        onClick={() => openModal("add")}
      >
        Add Account
      </button>
      <div className="overflow-x-auto max-h-[300px]">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md text-center">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4">ID</th>
              <th className="py-2 px-4">Username</th>
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">Role</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account) => (
              <tr key={account._id} className="border-t">
                <td className="py-2 px-4">{account._id}</td>
                <td className="py-2 px-4">{account.username}</td>
                <td className="py-2 px-4">{account.email}</td>
                <td className="py-2 px-4">{account.role}</td>
                <td className="py-2 px-4">
                  <div className="flex justify-center space-x-2">
                    <button
                      className="px-2 py-1 mr-2 bg-blue-500 text-white rounded"
                      onClick={() => openModal("edit", account)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-2 py-1 bg-red-500 text-white rounded"
                      onClick={() => openModal("delete", account)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <Modal onClose={closeModal}>
          {modalContent === "add" && (
            <AddAccountForm onClose={closeModal} onSubmit={handleAddAccount} />
          )}
          {modalContent === "edit" && (
            <EditAccountForm
              account={selectedAccount}
              onClose={closeModal}
              onSubmit={handleUpdateAccount}
            />
          )}
          {modalContent === "delete" && (
            <DeleteAccountConfirmation
              account={selectedAccount}
              onClose={closeModal}
              onConfirm={handleDeleteAccount}
            />
          )}
        </Modal>
      )}
      {notification && (
        <NotificationModal
          message={notification}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};

const AddAccountForm = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    role: "user",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.role
    ) {
      alert("All fields are required!");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    onSubmit(formData);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Add Account</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-medium mb-1">Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="border rounded w-full p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-1">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="border rounded w-full p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-1">Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="border rounded w-full p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-1">Confirm Password:</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="border rounded w-full p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-1">Role:</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="border rounded w-full p-2"
          >
            <option value="admin">admin</option>
            <option value="user">user</option>
          </select>
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            className="px-4 py-2 bg-gray-300 rounded mr-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
};

const EditAccountForm = ({ account, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    username: account.username,
    email: account.email,
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email) {
      alert("All fields are required!");
      return;
    }
    if (formData.password && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    onSubmit({ ...formData });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Edit Account</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-medium mb-1">Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="border rounded w-full p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-1">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="border rounded w-full p-2"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            className="px-4 py-2 bg-gray-300 rounded mr-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

const DeleteAccountConfirmation = ({ account, onClose, onConfirm }) => (
  <div>
    <h2 className="text-xl font-semibold mb-4">Delete Account</h2>
    <p>Are you sure you want to delete the account for {account.username}?</p>
    <div className="flex justify-end mt-4">
      <button
        type="button"
        className="px-4 py-2 bg-gray-300 rounded mr-2"
        onClick={onClose}
      >
        Cancel
      </button>
      <button
        type="button"
        className="px-4 py-2 bg-red-500 text-white rounded"
        onClick={onConfirm}
      >
        Delete
      </button>
    </div>
  </div>
);

export default AccountManagement;
