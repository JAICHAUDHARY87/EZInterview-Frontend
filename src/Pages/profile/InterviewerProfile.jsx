import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserFailure, updateUserSuccess, updateUserStart } from '../../redux/user/userSlice'; 
import "./InterviewerProfile.css";

const InterviewerProfile = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  console.log(currentUser._id);
  const [formData, setFormData] = useState({
    username: currentUser?.username || "",
    email: currentUser?.email || "",
    avatar: currentUser?.avatar || ""
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Make a PUT request to the backend endpoint with updated user data
      dispatch(updateUserStart());
      const response = await fetch(`http://localhost:8080/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      // Dispatch action to update user data in the Redux store
      const data = await response.json();
      dispatch(updateUserSuccess(data));
    } catch (error) {
      // Handle error if the PUT request fails
      console.error('Error updating user:', error);
      // Dispatch action to handle failure
      dispatch(updateUserFailure(error.message));
    }
  };

  return (
    <div className="interviewer-profile-container">
      <div className="profile-details">
        <h2>Interviewer Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="profile-info">
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Username"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
            />
            <input
              type="text"
              name="avatar"
              value={formData.avatar}
              onChange={handleInputChange}
              placeholder="Avatar URL"
            />
            <button type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InterviewerProfile;
