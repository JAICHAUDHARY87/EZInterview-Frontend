import React from 'react';
import { useSelector } from 'react-redux'; 
import "./InterviewerProfile.css"

const InterviewerProfile = () => {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className="interviewer-profile-container">
      {currentUser ? (
        <div className="profile-details">
          <h2>Interviewer Profile</h2>
          <div className="profile-info">
            <p>Username: {currentUser.username}</p>
            <p>Email: {currentUser.email}</p>
            <img src={currentUser.avatar} alt="Avatar" className="avatar" />
          </div>
        </div>
      ) : (
        <p>No user found.</p>
      )}
    </div>
  );
}

export default InterviewerProfile;
