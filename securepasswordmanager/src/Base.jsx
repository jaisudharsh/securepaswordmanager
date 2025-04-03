import React from "react";
import { useNavigate } from "react-router-dom";
import "./Base.css";

const Base = () => {
  const navigate = useNavigate();

  return (
    <div className="base-containers">
      {/* Navbar */}
      <nav className="navbar">
        <div className="brand">Secure Password Manager</div>
        <div className="nav-buttons">
          <button onClick={() => navigate("/Login")}>Login</button>
          <button onClick={() => navigate("/SignUp")}>Sign Up</button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero">
        <h1>SECURE PASSWORD MANAGER USING CLOUD</h1>
        <p>Store, encrypt, and manage your passwords securely with cloud technology.</p>
      </header>

      {/* Features Section */}
      <section className="features">
        <h2>Key Features</h2>
        <ul>
          <li>🔒 AES-256 Encryption for Secure Password Storage</li>
          <li>☁️ Cloud-Based Access Anytime, Anywhere</li>
          <li>🔑 Unique Secret Key for Each User</li>
          <li>📊 Easy-to-Use Web Interface</li>
          <li>🛡️ Secure Authentication with JWT</li>
        </ul>
      </section>

      {/* Technologies Used */}
      <section className="services">
        <h2>Technologies Used</h2>
        <div className="tech-grid">
          <div className="tech-card">React.js ⚛️</div>
          <div className="tech-card">Node.js 🚀</div>
          <div className="tech-card">Express.js 🖥️</div>
          <div className="tech-card">AWS RDS ☁️</div>
          <div className="tech-card">MySQL 🛢️</div>
          <div className="tech-card">CryptoJS 🔐</div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        Developed by Students of KL University
      </footer>
    </div>
  );
};

export default Base;
