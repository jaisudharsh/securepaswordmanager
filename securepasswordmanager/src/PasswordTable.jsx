import React, { useEffect, useState } from "react";
import axios from "axios";
import CryptoJS from "crypto-js";

const API_URL = "http://localhost:3001";

const PasswordTable = () => {
  const [passwords, setPasswords] = useState([]);

  useEffect(() => {
    const fetchPasswords = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await axios.get(`${API_URL}/passwords/${userId}`);
        setPasswords(response.data);
      } catch (error) {
        console.error("Error fetching passwords:", error);
      }
    };
    fetchPasswords();
  }, []);

  const decryptPassword = (encryptedPassword) => {
    const secretKey = prompt("Enter your secret key to decrypt the password:");
    if (!secretKey) {
      alert("Please enter your secret key first.");
      return;
    }
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedPassword, secretKey);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      alert(`Decrypted Password: ${decrypted}`);
    } catch (error) {
      alert("Decryption failed! Check your secret key.");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Stored Passwords</h1>

      <table className="w-full border-collapse border border-gray-400">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Service Name</th>
            <th className="border p-2">Encrypted Password</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {passwords.map((password) => (
            <tr key={password.id} className="text-center">
              <td className="border p-2">{password.service_name}</td>
              <td className="border p-2">{password.encrypted_password}</td>
              <td className="border p-2">
                <button
                  className="bg-blue-500 text-white p-2 rounded"
                  onClick={() => decryptPassword(password.encrypted_password)}
                >
                  Decrypt
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4">
        <a href="/add-password" className="p-2 bg-green-500 text-white rounded">
          Add New Password
        </a>
      </div>
    </div>
  );
};

export default PasswordTable;
