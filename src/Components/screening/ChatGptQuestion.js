import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useLocation } from "react-router";
import "./ChatGptQuestion.css";

const ChatGptQuestion = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const [loading, setLoading] = useState(false);
  const { id, testId } = useParams();
  const candidateId = id;

  useEffect(() => {
    let timer;
    if (quizStarted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [quizStarted, timeLeft]);

  const handleGenerateQuestions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8080/api/test/get-question/${testId}`,
        {}
      );
      setQuestions(response.data[0].questions);
      console.log(response);
      setQuizStarted(true);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error generating questions:", error.message);
    }
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
  };

  const handleSaveAnswer = (answer) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [currentQuestionIndex]: answer,
    }));
  };

  const handleSubmitQuiz = () => {
    let totalScore = 0;
    questions.forEach((question, index) => {
      if (
        answers[index] &&
        answers[index].startsWith(question.correct_option)
      ) {
        console.log("correct");
        console.log(candidateId);
        totalScore++;
      }
    });
    setScore(totalScore);
    axios
      .post("http://localhost:8080/api/submission/", {
        test_id: testId,
        candidate_id: candidateId,
        answers: answers,
        test_score: totalScore,
        time_taken: 300 - timeLeft,
      })
      .then((response) => {
        console.log("Submission successful:", response);
      })
      .catch((error) => {
        console.error("Error submitting quiz:", error.message);
      });
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="container">
      <div className="content">
        <h2>This is just small test for checking your mentioned skills : </h2>

        {!quizStarted && !loading && (
          <button className="blue-button" onClick={handleGenerateQuestions}>
            Start Test
          </button>
        )}
        {loading && <p>Loading...</p>}
        {quizStarted && !loading && (
          <div>
            <div className="timer">Time Left: {formatTime(timeLeft)}</div>
            {questions && questions.length > 0 && (
              <div>
                <h3>Question {currentQuestionIndex + 1}</h3>
                <p>{questions[currentQuestionIndex].question}</p>
                <ul>
                  {questions[currentQuestionIndex].options.map(
                    (option, optionIndex) => (
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
                    )
                  )}
                </ul>
                <div>
                  {currentQuestionIndex > 0 && (
                    <button onClick={handlePreviousQuestion}>Previous</button>
                  )}
                  {currentQuestionIndex < questions.length - 1 && (
                    <button onClick={handleNextQuestion}>Next</button>
                  )}
                  {currentQuestionIndex === questions.length - 1 && (
                    <button className="blue-button" onClick={handleSubmitQuiz}>
                      Submit
                    </button>
                  )}
                </div>
              </div>
            )}
            {score != null && (
              <p>
                Your score: {score} / {questions.length}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatGptQuestion;
