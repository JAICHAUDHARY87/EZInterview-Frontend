import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from "react-router";

const ChatGptQuestion = () => {
  const [questions, setQuestions] = useState([]);
  const state = useLocation().state;
  const { skills } = state;
  console.log(skills)

  const handleGenerateQuestions = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/candidate/auto-generete', {
        question: `Ask 10 questions related to ${skills.join(', ')}`,
      });
      console.log(response.data.choices[0].message.content);
      setQuestions(response.data.choices[0].message.content);
     
    } catch (error) {
      console.error('Error generating questions:', error.message);
    }
  };

  return (
    <div>
      <h2>Prompt to Generate Questions</h2>
      <p>Ask 10 questions related to the skills: {skills?.join(', ')}</p>
      <button onClick={handleGenerateQuestions}>Generate Questions</button>
      <ul>
        {questions}
      </ul>
    </div>
  );
};

export default ChatGptQuestion;
