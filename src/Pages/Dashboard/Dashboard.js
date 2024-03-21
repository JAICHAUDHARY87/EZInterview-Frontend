import React, { useState } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import Candidates from "./CandidatesList/CandidatesList";
import CalendarComponent from "../../Components/Calendar/Calendar";
import { Route, Routes, useLocation } from "react-router-dom";
import InterviewerProfile from "../profile/InterviewerProfile";
import LoadingBar from 'react-top-loading-bar';

export default function Dashboard() {
  const location = useLocation();
  const [loading, setProgress] = useState(0); 

  return (
    <>
    <LoadingBar color='#007bff' progress={loading} height={3} /> {/* Render LoadingBar component */}
    <div style={{ display: "flex", flexDirection: "row" }}>
      <Navbar />
      {location.pathname === "/candidate" ? (
        <Candidates setProgress={setProgress} />
      ) : location.pathname === "/interviews" ? (
        <CalendarComponent setProgress={setProgress} /> 
      ) : location.pathname === "/profile" ? (
        <InterviewerProfile setProgress={setProgress} />
      ) : null}
    </div></>
  );
}
