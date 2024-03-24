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
  const [downloadURL, setDownloadURL] = useState(null); // State to store the download URL
  const [showDropdown, setShowDropdown] = useState(false); // State to control dropdown visibility

  useEffect(() => {
    console.log("changes");
    fetchData();
  }, [candidate?.pdf_url,id ]);

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
    if (files.length > 0 && files.length + formData.imageUrls.length < 2) {
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
          const downloadURL = urls[0]; 
          console.log(downloadURL);
          await savePDFURL(downloadURL); // Pass the download URL to the savePDFURL function
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

  const savePDFURL = async (downloadURL1) => {
    try {
      const response = await axios.post('http://localhost:8080/api/candidate/save-pdf-url', {
        pdf_url: downloadURL1,
        candidateId: id
      });
      console.log(downloadURL)
      console.log('PDF URL saved successfully:', response.data);
      await fetchData();
    } catch (error) {
      console.error('Error saving PDF URL:', error.message);
    }
  };

  const deletePDFURL = async () => {
    try {
      // Send a request to your API to delete the PDF URL
      const response = await axios.post('http://localhost:8080/api/candidate/save-pdf-url', {
        pdf_url : null,
        candidateId: id
        
      });
      await fetchData();
      console.log('PDF URL deleted successfully');
      // Set downloadURL state to null
      setDownloadURL(null);
    } catch (error) {
      console.error('Error deleting PDF URL:', error.message);
    }
  };

  // Function to handle dropdown toggle
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // Function to handle creating a question from ChatGPT
  const createQuestionFromChatGPT = () => {
  // Implement your logic for creating a question from ChatGPT here
  console.log('Creating question from ChatGPT');
  console.log(candidate.skills);
  navigate(`/candidates/${id}/auto-generate`, { state: { skills: candidate?.skills } });
  
  
  
 
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
          <p>Contact: {candidate.contact}</p>
          <p>Skills: {candidate.skills.join(', ')}</p>
          {/* Conditional rendering based on the presence of PDF URL */}
          {candidate.pdf_url ? (
            <div>
              <a href={candidate.pdf_url} className="download-link" download>
                Download PDF
              </a>
              <button onClick={deletePDFURL}>Delete PDF URL</button>
            </div>
          ) : (
            <div>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setFiles(e.target.files)}
              />
              <button type="button" disabled={uploading} onClick={handleImageSubmit}>
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
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
