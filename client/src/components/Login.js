import React, { useState } from "react";
import { loginUser } from "../api";
import "../assets/auth_login.css";
import { useNavigate } from "react-router-dom";

/*
User Login Process:
Frontend (React): 
  The user enters their email and password into a login form.
API Call: 
  When the user submits the form, an API call is made to the Node.js backend with the login credentials.
Backend Authentication:
  The backend receives the credentials and queries MariaDB to verify the user's email and password.
  If the credentials are valid, the backend generates a token (e.g., JWT) and sends it back to the frontend along with the user's role.
Frontend Handling:
  The frontend stores the token and role in localStorage.
  The user is then redirected to a protected route (e.g., a calendar view).
*/

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Function to handle the login process
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevents the default form submission behavior

    try {
      // Calls the loginUser function with email and password to authenticate the user
      const response = await loginUser({ email, password });
      const { token, role } = response.data; // Destructures the token and role from the response

      // Stores the token and role in localStorage for future authenticated requests
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      // Redirects the user based on their role
      if (role === "Admin") {
        navigate("/admin"); // Redirects the admin to the admin dahboard upon successful login
      } else {
        navigate("/calendar"); // Redirects the user to the calendar view upon successful login
      }
    } catch (err) {
      // Sets an error message if the login fails
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      {error && <p className="error">{error}</p>}
      <button onClick={() => navigate("/register")}>Register</button>
    </div>
  );
};

export default Login;
