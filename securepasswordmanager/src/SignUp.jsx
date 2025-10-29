import { useState } from "react";
import './SignUp.css';
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

function SignUp() {
    const navigate = useNavigate();
    const [user, setUser] = useState({ name: "", email: "", password: "", secret_key: "" });

    const handleChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

    const handleSignUp = async () => {
        try {
            const response = await axios.post(`${API_URL}/signup`, user);
            alert(response.data.message); // Show success message
            navigate("/Login"); // Redirect to login page
        } catch (error) {
            alert(error.response?.data?.error || "Error signing up");
        }
    };

    return (
        <div className="SignUp">
            <h1>Secure Password Manager</h1>
            <h2>Sign Up</h2>
            <input type="text" name="name" placeholder="Full Name" onChange={handleChange} />
            <input type="email" name="email" placeholder="Email" onChange={handleChange} />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} />
            <input type="text" name="secret_key" placeholder="Secret Key" onChange={handleChange} />
            <button onClick={handleSignUp}>Sign Up</button>
            <p>Already have an account? <a href="/Login">Login here</a></p>
        </div>
    );
}

export default SignUp;
