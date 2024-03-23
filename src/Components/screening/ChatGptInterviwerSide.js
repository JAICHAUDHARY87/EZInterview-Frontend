import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from "react-router";

const ChatGptInterviwerSide = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false); 
  const [email, setEmail] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [showCandidates, setShowCandidates] = useState(false); // State to control candidate list visibility
  const state = useLocation().state;
  const { skills } = state;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/api/candidate/get-all');
      setCandidates(response.data);
      setLoading(false); 
    } catch (error) {
      setLoading(false); 
      console.error('Error fetching candidates:', error.message);
    }
  };

  const handleGenerateQuestions = async () => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:8080/api/candidate/auto-generate', {
        question: `Ask 10 questions related to ${skills.join(', ')}`,
      });
      setQuestions(response.data.questions);
      setLoading(false); 
    } catch (error) {
      setLoading(false); 
      console.error('Error generating questions:', error.message);
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
      <h1>Generated Questions</h1>
      {loading ? (
        <p>Loading...</p>
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
          <div>
            
            <button disabled={!questions.length} onClick={handleSendEmail}>Send Test Link via Email</button>
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
        <button onClick={handleGenerateQuestions} style={generateButtonStyle}>Generate Questions</button>
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
