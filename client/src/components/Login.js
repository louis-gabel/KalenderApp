import React, { useState } from "react";
import { loginUser } from "../api";
import "../assets/auth_login.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await loginUser({ email, password });
      const { token, role, id } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("id", id);

      if (role === "Admin") {
        navigate("/admin");
      } else if (role === "Dozent") {
        navigate("/dozent");
      } else {
        navigate("/calendar");
      }
    } catch (err) {
      setError("Ungültige E-Mail oder Passwort.");
    }
  };

  return (
    <div className="container">
      <h2>Anmelden</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="E-Mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Passwort"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Anmelden</button>
      </form>
      {error && <p className="error">{error}</p>}
      <button onClick={() => navigate("/register")}>Registrieren</button>
    </div>
  );
};

export default Login;
