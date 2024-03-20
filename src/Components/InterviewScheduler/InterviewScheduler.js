import React, { useEffect, useState } from "react";
import "./InterviewScheduler.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const InterviewScheduler = ({ open }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    candidate_id: "",
    candidate_name: "",
    candidate_role: "",
    scheduled_time: "",
    room_id: "",
    company_id: currentUser?._id,
  });
  const [candidateData, setCandidateData] = useState([]);

  useEffect(() => {
    fetchData();
  }, [setCandidateData]);

  const fetchData = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/candidate/get-all"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setCandidateData(data);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === "candidate_id") {
      const selectedCandidate = candidateData.find(candidate => candidate._id === value);
      if (selectedCandidate) {
        setFormData(prevState => ({
          ...prevState,
          candidate_name: selectedCandidate.name,
          candidate_role: selectedCandidate.role,
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:8080/api/interview/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      console.log(formData);

      if (!response.ok) {
        throw new Error("Failed to create Interview");
      }

      setFormData({
        candidate_id: "",
        candidate_name: "",
        candidate_role: "",
        scheduled_time: "",
        room_id: "",
        company_id: currentUser?._id,
      });

      console.log("Interview created successfully");
      open(false);
    } catch (error) {
      console.error("Error creating candidate:", error.message);

    }
  };

  return (
    <div className="create-candidate-container ">
      <h2>Create Candidate</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="candidate_id">Candidate ID</label>

          <select
            name="candidate_id"
            value={formData.candidate_id}
            onChange={handleChange}
            required
          >
            <option value="">Select Candidate</option>
            {candidateData.map((candidate, index) => (
              <option key={index} value={candidate._id}>
                {candidate.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="scheduled_time">Scheduled Time</label>
          <input
            type="datetime-local"
            className="form-control"
            id="scheduled_time"
            name="scheduled_time"
            value={formData.scheduled_time}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="room_id">Room ID</label>
          <input
            type="text"
            className="form-control"
            id="room_id"
            name="room_id"
            value={formData.room_id}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Create
        </button>
      </form>
    </div>
  );
};

export default InterviewScheduler;
