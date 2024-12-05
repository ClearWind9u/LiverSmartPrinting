import React, { useState } from "react";
import Modal from "./Modal";

const AccountManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);

  const accountLog = [
    { id: 1, username: "user1", role: "admin", dateCreated: "2023-01-01" },
    { id: 2, username: "user2", role: "user", dateCreated: "2023-02-01" },
    { id: 3, username: "user3", role: "user", dateCreated: "2023-03-01" },
    // Add more account log entries here
  ];

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
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">
        Account Management
      </h2>
      <div className="mb-4">
        <button
          className="px-4 py-2 bg-green-500 text-white rounded"
          onClick={() => openModal("add")}
        >
          Add Account
        </button>
      </div>
      <div className="overflow-x-auto max-h-96">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-3 px-6 border-b text-left">ID</th>
              <th className="py-3 px-6 border-b text-left">Username</th>
              <th className="py-3 px-6 border-b text-left">Role</th>
              <th className="py-3 px-6 border-b text-left">Date Created</th>
              <th className="py-3 px-6 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {accountLog.map((log) => (
              <tr
                key={log.id}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="py-3 px-6 border-b text-left">{log.id}</td>
                <td className="py-3 px-6 border-b text-left">{log.username}</td>
                <td className="py-3 px-6 border-b text-left">{log.role}</td>
                <td className="py-3 px-6 border-b text-left">
                  {log.dateCreated}
                </td>
                <td className="py-3 px-6 border-b text-left">
                  <button
                    className="px-2 py-1 bg-blue-500 text-white rounded mr-2"
                    onClick={() => openModal("edit", log)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-2 py-1 bg-red-500 text-white rounded"
                    onClick={() => openModal("delete", log)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <Modal onClose={closeModal}>
          {modalContent === "add" && <AddAccountForm onClose={closeModal} />}
          {modalContent === "edit" && (
            <EditAccountForm account={selectedAccount} onClose={closeModal} />
          )}
          {modalContent === "delete" && (
            <DeleteAccountConfirmation
              account={selectedAccount}
              onClose={closeModal}
            />
          )}
        </Modal>
      )}
    </div>
  );
};

const AddAccountForm = ({ onClose }) => (
  <div>
    <h2 className="text-xl font-semibold mb-4">Add Account</h2>
    <form>
      <div className="mb-4">
        <label className="block font-medium mb-1">Username:</label>
        <input type="text" className="border rounded w-full p-2" />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">Role:</label>
        <select className="border rounded w-full p-2">
          <option>admin</option>
          <option>user</option>
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

const EditAccountForm = ({ account, onClose }) => (
  <div>
    <h2 className="text-xl font-semibold mb-4">Edit Account</h2>
    <form>
      <div className="mb-4">
        <label className="block font-medium mb-1">Username:</label>
        <input
          type="text"
          defaultValue={account.username}
          className="border rounded w-full p-2"
        />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">Role:</label>
        <select
          defaultValue={account.role}
          className="border rounded w-full p-2"
        >
          <option>admin</option>
          <option>user</option>
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
          Save
        </button>
      </div>
    </form>
  </div>
);

const DeleteAccountConfirmation = ({ account, onClose }) => (
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
      <button type="button" className="px-4 py-2 bg-red-500 text-white rounded">
        Delete
      </button>
    </div>
  </div>
);

export default AccountManagement;
