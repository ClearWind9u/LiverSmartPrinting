import React from "react";

const AddAccountForm = ({ onClose }) => (
  <div>
    <h2 className="text-xl font-semibold mb-4">Add Account</h2>
    <form>
      <div className="mb-4">
        <label className="block font-medium mb-1">Username:</label>
        <input type="text" className="border rounded w-full p-2" />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">Password:</label>
        <input type="password" className="border rounded w-full p-2" />
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

export default AddAccountForm;
