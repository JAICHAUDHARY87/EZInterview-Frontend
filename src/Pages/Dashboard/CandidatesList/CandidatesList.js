import React, { useState } from 'react';
import './CandidatesList.css'; // Import your CSS file (if any)

const Candidates = () => {
    const [Tab, setTab] = useState('all');
  // Sample data for candidates (you can replace this with actual data)
  const candidateData = [
    {
      name: 'Helen Ibarra',
      email: 'helenibarra@gmail.com',
      role: 'Web Dev Intern',
      status: 'Active',
    },
    {
      name: 'Helen Ibarra',
      email: 'helenibarra@gmail.com',
      role: 'Web Dev Intern',
      status: 'Active',
    },
    {
      name: 'Helen Ibarra',
      email: 'helenibarra@gmail.com',
      role: 'Web Dev Intern',
      status: 'Active',
    },
    {
      name: 'Helen Ibarra',
      email: 'helenibarra@gmail.com',
      role: 'Web Dev Intern',
      status: 'Active',
    },
    {
      name: 'Helen Ibarra',
      email: 'helenibarra@gmail.com',
      role: 'Web Dev Intern',
      status: 'Active',
    },
    {
      name: 'Helen Ibarra',
      email: 'helenibarra@gmail.com',
      role: 'Web Dev Intern',
      status: 'Active',
    },
    {
      name: 'Helen Ibarra',
      email: 'helenibarra@gmail.com',
      role: 'Web Dev Intern',
      status: 'Active',
    },
    {
      name: 'Helen Ibarra',
      email: 'helenibarra@gmail.com',
      role: 'Web Dev Intern',
      status: 'Active',
    },
    {
      name: 'Helen Ibarra',
      email: 'helenibarra@gmail.com',
      role: 'Web Dev Intern',
      status: 'Active',
    },
    {
      name: 'Helen Ibarra',
      email: 'helenibarra@gmail.com',
      role: 'Web Dev Intern',
      status: 'Active',
    },
    // ... other candidate entries
  ];

  return (
    <div className="candidates-container">
      <h1>Candidates</h1>
      <input type="text" placeholder="Search candidates..." />

      <div className="tabs">
        <button className={`${Tab === 'all'?("Active"):("")}`} onClick={() => setTab('all')}>All</button>
        <button className={`${Tab === 'active'?("Active"):("")}`} onClick={() => setTab('active')}>Active</button>
        <button className={`${Tab === 'archived'?("Active"):("")}`} onClick={() => setTab('archived')}>Archived</button>
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
              <td>{candidate.name}</td>
              <td>{candidate.email}</td>
              <td>{candidate.role}</td>
              <td className="active-status">{candidate.status}</td>
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