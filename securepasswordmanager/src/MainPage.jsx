import React from "react";
import './MainPage.css'
import { Routes, Route, Link } from "react-router-dom";
import PasswordTable from "./PasswordTable";
import AddPasswordForm from "./AddPasswordForm";

const Home = () => (
  <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
    <h1 className="text-2xl font-bold mb-4">Welcome to Secure Password Manager</h1>
    <Link to="/passwords" className="p-2 bg-blue-500 text-white rounded mb-2">
      View Stored Passwords
    </Link>
    <Link to="/add-password" className="p-2 bg-green-500 text-white rounded">
      Add New Password
    </Link>
  </div>
);

const MainPage = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/passwords" element={<PasswordTable />} />
      <Route path="/add-password" element={<AddPasswordForm />} />
    </Routes>
  );
};

export default MainPage;
