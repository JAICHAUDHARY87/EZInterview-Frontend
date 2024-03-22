import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './CandidateProfile.css'; 
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase";
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom';
import ChatGptQuestion from '../../Components/screening/ChatGptQuestion';

const CandidateProfile = () => {
  const { id } = useParams();
  const [candidate, setCandidate] = useState(null);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    imageUrls: [],
  });
  const [downloadURL, setDownloadURL] = useState(null); 
  const [showDropdown, setShowDropdown] = useState(false); 
  useEffect(() => {
    fetchData();
  }, [id,candidate?.pdf_url]);

  const fetchData = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/candidate/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch candidate data');
      }
      const data = await response.json();
      setCandidate(data);
      
    } catch (error) {
      console.error('Error fetching candidate data:', error.message);
    }
  };

  const handleImageSubmit = async (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then(async (urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
          setDownloadURL(urls[0]); 
          console.log(downloadURL);
          await savePDFURL();
          
        })
        .catch((err) => {
          setImageUploadError("Image upload failed (2 mb max per image)");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can only upload 6 images per listing");
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const savePDFURL = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/candidate/save-pdf-url', {
        pdf_url: downloadURL,
        candidateId: id
      });
      console.log(downloadURL)
      console.log('PDF URL saved successfully:', response.data);
    } catch (error) {
      console.error('Error saving PDF URL:', error.message);
    }
  };

  // Function to handle dropdown toggle
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  
  const createQuestionFromChatGPT = () => {
  
  navigate(`/candidates/${id}/auto-generate`, { 
    state: { 
      skills: candidate?.skills,
      role: candidate?.role
    }
  });
  
  
  
  
 
};

  // Function to handle creating a question manually
  const createQuestionManually = () => {
    // Implement your logic for creating a question manually here
    console.log('Creating question manually');
  };

  return (
    <div className="profile-container">
      {candidate ? (
        <div className="profile-card">
          <h2>{candidate.name}'s Profile</h2>
          <p>Email: {candidate.email}</p>
          <p>Role: {candidate.role}</p>
          <p>Status: {candidate.current_status}</p>
          {/* Add other candidate details as needed */}
          {!candidate?.pdf_url ? (
            <React.Fragment>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setFiles(e.target.files)}
              />
              <button type="button" disabled={uploading} onClick={handleImageSubmit}>
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </React.Fragment>
          ) : (
            <a href={candidate?.pdf_url} className="download-link" download>
              Download PDF
            </a>
          )}

          {/* Dropdown button */}
          <div className="dropdown">
            <button onClick={toggleDropdown} className="dropbtn">
              Create Question
            </button>
            {/* Dropdown content */}
            {showDropdown && (
              <div className="dropdown-content">
                <button onClick={createQuestionFromChatGPT}>From ChatGPT</button>
                <button onClick={createQuestionManually}>Manually</button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <p>Loading candidate data...</p>
      )}
    </div>
  );
};

export default CandidateProfile;
