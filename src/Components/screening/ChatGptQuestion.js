import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from "react-router";
import './ChatGptQuestion.css';

const ChatGptQuestion = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); 
  const [loading, setLoading] = useState(false); 
  const state = useLocation().state;
  const { skills } = state;

  useEffect(() => {
    let timer;
    if (quizStarted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prevTimeLeft => prevTimeLeft - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [quizStarted, timeLeft]);

  const handleGenerateQuestions = async () => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:8080/api/candidate/auto-generate', {
        question: `Ask 10 questions related to ${skills.join(', ')}`,
      });
      setQuestions(response.data.questions);
      setQuizStarted(true);
      setLoading(false); 
    } catch (error) {
      setLoading(false); 
      console.error('Error generating questions:', error.message);
    }
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex(prevIndex => prevIndex + 1);
  };

  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex(prevIndex => prevIndex - 1);
  };

  const handleSaveAnswer = (answer) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [currentQuestionIndex]: answer,
    }));
  };

  const handleSubmitQuiz = () => {
    let totalScore = 0;
    questions.forEach((question, index) => {
      if (answers[index] === question.correct_option) {
        totalScore++;
      }
    });
    setScore(totalScore);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="container">
      <div className="content">
        <h2>Prompt to Generate Questions</h2>
        <p>Ask 10 questions related to the skills: {skills?.join(', ')}</p>
        {!quizStarted && !loading && ( 
          <button className="blue-button" onClick={handleGenerateQuestions}>Start Test</button>
        )}
        {loading && ( 
          <p>Loading...</p>
        )}
        {quizStarted && !loading && (
          <div>
            <div className="timer">Time Left: {formatTime(timeLeft)}</div>
            {questions.length > 0 && (
              <div>
                <h3>Question {currentQuestionIndex + 1}</h3>
                <p>{questions[currentQuestionIndex].question}</p>
                <ul>
                  {questions[currentQuestionIndex].options.map((option, optionIndex) => (
                    <li key={optionIndex}>
                      <label>
                        <input
                          type="radio"
                          value={option}
                          checked={answers[currentQuestionIndex] === option}
                          onChange={() => handleSaveAnswer(option)}
                        />
                        {option}
                      </label>
                    </li>
                  ))}
                </ul>
                <div>
                  {currentQuestionIndex > 0 && (
                    <button onClick={handlePreviousQuestion}>Previous</button>
                  )}
                  {currentQuestionIndex < questions.length - 1 && (
                    <button onClick={handleNextQuestion}>Next</button>
                  )}
                  {currentQuestionIndex === questions.length - 1 && (
                    <button className="blue-button" onClick={handleSubmitQuiz}>Submit</button>
                  )}
                </div>
              </div>
            )}
            {score > 0 && (
              <p>Your score: {score} / {questions.length}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatGptQuestion;
