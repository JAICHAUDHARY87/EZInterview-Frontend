import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from "react-router";
import { useSelector } from 'react-redux';

const ChatGptInterviwerSide = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false); 
  const [email, setEmail] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [showCandidates, setShowCandidates] = useState(false); // State to control candidate list visibility
  const state = useLocation().state;
  const { skills ,role } = state;
  
  
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    fetchData();
  }, []);
  function randomID(len) {
    let result = "";
    if (result) return result;
    var chars =
        "12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP",
      maxPos = chars.length,
      i;
    len = len || 5;
    for (i = 0; i < len; i++) {
      result += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return result;
  }
  const testId = randomID(10);
  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/candidate/get-all', { withCredentials: true });
      const data = await response.data;
      setCandidates(data);
    } catch (error) {
      console.error('Error fetching candidates:', error.message);
    }
  };
   
  const handleGenerateQuestions = async () => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:8080/api/test/auto-generate', {
        question: `Ask 10 questions related to ${skills.join(', ')} and ${role}`,
        user : currentUser._id,
        testId : testId
      });
      setQuestions(response.data.questions);
    } catch (error) {
      console.error('Error generating questions:', error.message);
    } finally {
      setLoading(false);
    }
  };
 

  const handleSendEmail = () => {
    // Send email logic here
    // Get email addresses of selected candidates
    const selectedEmails = selectedCandidates.map(candidateId => {
      const selectedCandidate = candidates.find(candidate => candidate._id === candidateId);
      return selectedCandidate ? selectedCandidate.email : '';
    });

    // Send email to selectedEmails
    // send this link 
    console.log('Sending emails to:', selectedEmails);
  };

  const handleCandidateSelection = (e) => {
    const candidateId = e.target.value;
    const isChecked = e.target.checked;

    if (isChecked) {
      setSelectedCandidates(prevSelected => [...prevSelected, candidateId]);
    } else {
      setSelectedCandidates(prevSelected => prevSelected.filter(id => id !== candidateId));
    }
  };

  return (
    <div>
      <h1>We generate questions based on the candidate's specified skills and role.</h1>
      {loading ? (
        <p>we are building your test question...</p>
      ) : (
        <div>
          {questions.map((questionData, index) => (
            <div key={questionData.id} style={{ marginBottom: '20px' }}>
              <h3>Question {questionData.id}:</h3>
              <p>{questionData.question}</p>
              <ul>
                {questionData.options.map((option, optionIndex) => (
                  <li key={optionIndex}>{option}</li>
                ))}
              </ul>
              <p>Correct Option: {questionData.correct_option}</p>
            </div>
          ))}
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <button disabled={!questions.length} onClick={handleSendEmail} style={generateButtonStyle}>Send Test Link via Email</button>
          </div>
        </div>
      )}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button onClick={() => setShowCandidates(!showCandidates)} style={toggleButtonStyle}>
          {showCandidates ? "Hide Candidates" : "Select Candidates for Test"}
        </button>
      </div>
      {showCandidates && (
        <div>
          <h2>Select Candidates for Test:</h2>
          {candidates.map(candidate => (
            <div key={candidate._id}>
              <input 
                type="checkbox" 
                value={candidate._id} 
                onChange={handleCandidateSelection} 
                checked={selectedCandidates.includes(candidate._id)} 
              />
              <label>{candidate.name}</label>
            </div>
          ))}
        </div>
      )}
      
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button onClick={handleGenerateQuestions} style={generateButtonStyle}>Generate New Questions</button>
      </div>
    </div>
  );
};

// CSS Style for the Toggle Button
const toggleButtonStyle = {
  backgroundColor: '#007bff', // Blue color
  color: 'white',
  padding: '10px 20px',
  fontSize: '16px',
  borderRadius: '5px',
  border: 'none',
  cursor: 'pointer',
  outline: 'none',
};

// CSS Style for the Generate Questions button
const generateButtonStyle = {
  backgroundColor: '#007bff', // Blue color
  color: 'white',
  padding: '10px 20px',
  fontSize: '16px',
  borderRadius: '5px',
  border: 'none',
  cursor: 'pointer',
  outline: 'none',
};

export default ChatGptInterviwerSide;
