import { useState } from "react";
import './Login.css';
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Login() {
    const navigate = useNavigate();
    const [user, setUser] = useState({ email: "", password: "" });

    const handleChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

    const handleLogin = async () => {
        try {
            const response = await axios.post("http://localhost:3001/login", user);
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("userId", response.data.userId);
            localStorage.setItem("email", response.data.email);
            navigate("/MainPage");
        } catch (error) {
            alert("Invalid login credentials");
        }
    };

    return (
        <div className="Login">
            <h1>Secure Password Manager</h1>
            <h2>Login</h2>
            <input type="email" name="email" placeholder="Email" onChange={handleChange} />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} />
            <button onClick={handleLogin}>Login</button>
            <p>New user? <Link to="/SignUp">Create an account</Link></p>
        </div>
    );
}

export default Login;
