import React, { useState } from "react";
import "./SignUp.css";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const Navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errorMessages, setErrorMessages] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Client-side validation
    const errors = [];
    if (formData.username.length < 3) {
      errors.push("Username must be at least 3 characters long");
    }
    if (!formData.email.includes("@")) {
      errors.push("Invalid email format");
    }
    if (formData.password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }
    if (formData.password !== formData.confirmPassword) {
      errors.push("Passwords do not match");
    }
  
    if (errors.length > 0) {
      alert(errors[0]);
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5000/auth/SignUp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: formData.username,
          email: formData.email,
          pass: formData.password
        })
      });
      const data = await response.json();
      if (response.ok) {
        setSuccessMessage(data.success);
        Navigate('/OTP', { state: { Email: formData.email } });
      } else {
        setErrorMessages(Object.values(data));
        alert("Error: " + data.error);
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessages(["Internal Server Error"]);
    }
  };
  

  return (
    <div className="SignUpMain">
      <div className="SignUpContainer">
        <div className="SignUpImage">
          <img src="./Images/SignUpImage.png" alt="Sign Up" />
        </div>
        <form onSubmit={handleSubmit} className="SignUpForm">
          <h1>Sign Up</h1>
          <div className="SignUpInput">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div className="SignUpInput">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="SignUpInput">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="SignUpInput">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
          <div className="SignUpInput">
            <button type="submit">Sign Up</button>
          </div>
          <div className="SignUpInput" style={{ textAlign: 'center' }}>
            <p>Already have an account? <a href="/login">Login</a></p>
          </div>
        </form>
      </div>
    </div>
  );
}
