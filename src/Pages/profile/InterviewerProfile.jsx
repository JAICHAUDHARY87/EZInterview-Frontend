import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateUserFailure,
  updateUserSuccess,
  updateUserStart,
} from "../../redux/user/userSlice";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import axios from 'axios'; 
import { app } from "../../firebase";
import "./InterviewerProfile.css";

const InterviewerProfile = ({ setProgress }) => {
  const dispatch = useDispatch();
  setProgress(0);
  const { currentUser } = useSelector((state) => state.user);
  console.log(currentUser._id);
  const [formData, setFormData] = useState({
    username: currentUser?.username || "",
    email: currentUser?.email || "",
  });
  const [file, setFile] = useState(null);

  const handleImageChange = (e) => {
    setFile(e.target.files[0]);
    console.log(file);
  };

  const handleImageSubmit = async () => {
    try {
      setProgress(0);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
          setProgress(progress);
        },
        (error) => {
          console.error(error);
          setProgress(100);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            dispatch(updateUserStart());
            console.log('File available at', downloadURL);
            const response = await axios.post(`http://localhost:8080/api/user/update/${currentUser._id}`, { avatar: downloadURL }, { withCredentials: true });
            console.log('Image link uploaded successfully:', response.data);
            dispatch(updateUserSuccess(response.data));

          } catch (error) {
            console.error(error);
          }
        }
      );
    } catch (error) {
      console.error(error);
    }
  };
  

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const response = await axios.post(`http://localhost:8080/api/user/update/${currentUser._id}`, formData);
      dispatch(updateUserSuccess(response.data));
    } catch (error) {
      console.error('Error updating user:', error);
      dispatch(updateUserFailure(error.message));
    }
  };

  return (
    <div className="interviewer-profile-container">
      <div className="profile-details">
        <h2>Interviewer Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="profile-info">
            <div className="flex" style={{ justifyContent: "center" }}>
              <img
                src={file ? URL.createObjectURL(file):currentUser?.avatar}
                style={{
                  height: "100px",
                  width: "auto",
                  objectFit: "contain",
                  marginBottom: "18px",
                  borderRadius: "140px",
                }}
                alt="Avatar"
              />
            </div>
            <div className="input-with-icon">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              <button type="button" onClick={handleImageSubmit}>Upload Image</button>
            </div>
            <div className="input-with-icon">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
              />
            </div>
            <div className="input-with-icon">
              <input
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Username"
              />
            </div>
            <button type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InterviewerProfile;
