import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

const OTP = () => {
  const state = useLocation().state;
  const { Email } = state;
  const authtoken = localStorage.getItem("EI-auth-token");
  const [otp, setotp] = useState("");
  const [Loading, setLoading] = useState(false);
  const baseURL = "http://localhost:5000/";
  const Navigate = useNavigate();
  useEffect(() => {
    if (authtoken) {
      Navigate("/");
    }
  }, []);
  const otpOnChange = (event) => {
    setotp(event.target.value);
  };
  const SignUpHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!otp) {
      alert("Please enter all Details");
      setLoading(false);
    } else {
      const data = {
        otp: otp,
        email: Email,
      };
      const url = `${baseURL}auth/VerifyOTP`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const jsonData = await response.json();
      console.log(jsonData);
      setLoading(false);

      if (jsonData.error) {
        alert(jsonData.error);
      } else if (jsonData.authtoken) {
        localStorage.setItem("EI-auth-token", jsonData.authtoken);
        Navigate("/meet");
      } else {
        alert("An issue occured, Pls report");
        setLoading(false);
      }
    }
  };
  return (
    <>
      <div
        className={`SignUPMain container-fluid d-flex align-items-center justify-content-center ${
          Loading ? "" : "Collapsed"
        }`}
      >
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      <div className="SignUpMain" onSubmit={SignUpHandler}>
        <div className="SignUpContainer">
          <div className="SignUpImage">
            <img src="./Images/SignUpImage.png" alt="Sign Up" />
          </div>
          <form className="SignUpForm">
            <h1>OTP Verification</h1>
            <div className="SignUpInput">
              <label htmlFor="OTP">Password</label>
              <input
                type="OTP"
                name="OTP"
                id="OTP"
                value={otp}
                onChange={otpOnChange}
              />
            </div>
            <div className="SignUpInput">
              <button type="submit" >Verify OTP</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default OTP;
