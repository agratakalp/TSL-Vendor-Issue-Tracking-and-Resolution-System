import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllIssues } from '../services/procurement-issue-management/issueService';

const LoggedIssues = () => {
  const [issues, setIssues] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const backendIssues = await getAllIssues();
        setIssues(backendIssues);
      } catch (error) {
        setIssues([]);
        console.error('Failed to fetch issues:', error);
      }
    };
    fetchIssues();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col">
      <button className="self-start mb-4 btn btn-blue px-4 py-2" onClick={() => navigate('/dashboard_logger')}>
        Home
      </button>
      <div className="flex justify-center items-start flex-1">
        <div className="bg-white p-8 rounded shadow w-full" style={{ maxWidth: 720 }}>
          <h2 className="text-2xl font-bold mb-6 text-center">My Logged Issues</h2>
          {issues.length === 0 ? (
            <div className="text-center text-gray-500">No issues logged yet.</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th className="text-left">Date</th>
                  <th className="text-left">Vendor</th>
                  <th className="text-left">Issue Type</th>
                  <th className="text-left">Description</th>
                  <th className="text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {issues.map((issue, idx) => (
                  <tr key={idx}>
                    <td>{issue.date}</td>
                    <td>{issue.vendor}</td>
                    <td>{issue.issueType}</td>
                    <td>{issue.description}</td>
                    <td>{issue.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoggedIssues;