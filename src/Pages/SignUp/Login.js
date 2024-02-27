import React, { useState } from "react";
import "./SignUp.css";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const Navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
    if (!formData.email.includes("@")) {
      errors.push("Invalid email format");
    }
    if (formData.password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }
  
    if (errors.length > 0) {
      alert(errors[0]);
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: formData.email,
          pass: formData.password
        })
      });
      const data = await response.json();
      if (response.ok) {
        setSuccessMessage(data.success);
        Navigate('/meet', { state: { Email: formData.email } });
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
          <h1>Log In</h1>
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
            <button type="submit">Log In</button>
          </div>
          <div className="SignUpInput" style={{ textAlign: 'center' }}>
            <p>Dont't have an account? <a href="/login">Signup</a></p>
          </div>
        </form>
      </div>
    </div>
  );
}
