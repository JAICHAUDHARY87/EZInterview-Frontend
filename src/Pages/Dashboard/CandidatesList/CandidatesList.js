import React, { useState ,useEffect} from 'react';
import './CandidatesList.css'; // Import your CSS file (if any)
import CreateCandidate from '../CreateCandidate';
import { Link } from 'react-router-dom';
import axios from 'axios'; 

const Candidates = ({ setProgress }) => {
    const [Tab, setTab] = useState('all');
  // Sample data for candidates (you can replace this with actual data)
  const [candidateData, setCandidateData] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
      fetchData();
  }, [setCandidateData]);

  const fetchData = async () => {
      try {
        setProgress(25);
          const response = await axios.get(`http://localhost:8080/api/candidate/get-all`,  { withCredentials: true });
          setProgress(75);
          const data = await response.data;
          setCandidateData(data);
          setProgress(100);
      } catch (error) {
          console.error('Error fetching data:', error.message);
      }
  };

  return (
    <div className="candidates-container">
      <h1>Candidates</h1>
      <input type="text" placeholder="Search candidates..." />

      <div className="tabs">
        <div className="flex flex-row">
        <button className={`${Tab === 'all'?("Active"):("")}`} onClick={() => setTab('all')}>All</button>
        <button className={`${Tab === 'active'?("Active"):("")}`} onClick={() => setTab('active')}>Active</button>
        <button className={`${Tab === 'archived'?("Active"):("")}`} onClick={() => setTab('archived')}>Archived</button>
        </div>
        
        <button  className= "create-candidate"onClick={() => setOpen(!open)}>Create Candidate</button>
        {open && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setOpen(false)}>&times;</span>
            <CreateCandidate open = {setOpen}/>
          </div>
        </div>
      )}
      </div>

      <table className="candidates-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {candidateData.map((candidate, index) => (
            <tr key={index}>
               <td>
                <Link to={`/candidates/${candidate._id}`}>{candidate.name}</Link>
              </td>
              <td>{candidate.email}</td>
              <td>{candidate.role}</td>
              <td className="active-status">{candidate.current_status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        {/* Add pagination controls here */}
        {/* Example: <button>Previous</button> <button>Next</button> */}
      </div>
    </div>
  );
};

export default Candidates;