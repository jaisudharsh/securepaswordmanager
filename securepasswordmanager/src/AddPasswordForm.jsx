import React, { useState } from "react";
import axios from "axios";
import CryptoJS from "crypto-js";

const API_URL = import.meta.env.VITE_API_URL;

const AddPasswordForm = () => {
  const [serviceName, setServiceName] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const email = localStorage.getItem("email");
    const userId = localStorage.getItem("userId");
    const secretKey = localStorage.getItem("secret_key"); // Retrieve stored secret key
    const password_hash = localStorage.getItem("password_hash");
    if (!email || !secretKey) {
      alert("User not authenticated. Please log in again.");
      return;
    }
  
    const encryptedPassword = CryptoJS.AES.encrypt(password, secretKey).toString();
  
    try {
      await axios.post(`${API_URL}/add-password`, {
        userId : userId,
        service_name: serviceName,
        encrypted_password: encryptedPassword,
        secret_key: secretKey,
        email: email,
        password_hash: password_hash,
      });
  
      alert("Password added successfully!");
      setServiceName("");
      setPassword("");
    } catch (error) {
      console.error("Error adding password:", error);
      alert("Failed to add password.");
    }
  };
  

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Add New Password</h1>

      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <input
          type="text"
          placeholder="Service Name"
          className="p-2 border rounded"
          value={serviceName}
          onChange={(e) => setServiceName(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Enter Password"
          className="p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">
          Encrypt & Store Password
        </button>
      </form>

      <div className="mt-4">
        <a href="/passwords" className="p-2 bg-gray-500 text-white rounded">
          View Passwords
        </a>
      </div>
    </div>
  );
};

export default AddPasswordForm;
