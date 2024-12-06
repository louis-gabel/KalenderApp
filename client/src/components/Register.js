import React, { useState } from "react";
import { registerUser } from "../api";
import "../assets/auth_login.css";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    titel: "",
    prename: "",
    surname: "",
    role: "Student",
    password: "",
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await registerUser(formData);
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000); // Nach 2 Sekunden zur Login-Seite
    } catch (err) {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="container">
      <h2>Registrieren</h2>
      <form onSubmit={handleRegister}>
        <select name="titel" value={formData.titel} onChange={handleChange}>
          <option value="">-</option>
          <option value="Dr.">Dr.</option>
          <option value="Prof.">Prof.</option>
        </select>
        <input
          type="text"
          name="prename"
          placeholder="Vorname"
          value={formData.prename}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="surname"
          placeholder="Nachname"
          value={formData.surname}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="E-Mail"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Passwort"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
        >
          <option value="Student">Student</option>
          <option value="Dozent">Dozent</option>
        </select>
        <button type="submit">Registrieren</button>
      </form>
      {success && <p className="success">{success}</p>}
      {error && <p className="error">{error}</p>}
      <button onClick={() => navigate("/login")}>Zurück zum Login</button>
    </div>
  );
};

export default Register;
