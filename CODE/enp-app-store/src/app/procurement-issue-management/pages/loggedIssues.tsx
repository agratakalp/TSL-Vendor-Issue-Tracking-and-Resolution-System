import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllIssues } from '../../../services/procurement-issue-management/issueService';

interface Issue {
  date: string;
  vendor: string;
  issueType: string;
  description?: string;
  status: string;
}

const LoggedIssues: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
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
      <button
        className="self-start mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={() => navigate('/procurement-issue-management/dashboard_logger')}
      >
        Home
      </button>
      <div className="flex justify-center items-start flex-1">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-2xl">
          <h2 className="text-2xl font-bold mb-6 text-center">My Logged Issues</h2>
          {issues.length === 0 ? (
            <div className="text-center text-gray-500">No issues logged yet.</div>
          ) : (
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="text-left px-2 py-1">Date</th>
                  <th className="text-left px-2 py-1">Vendor</th>
                  <th className="text-left px-2 py-1">Issue Type</th>
                  <th className="text-left px-2 py-1">Description</th>
                  <th className="text-left px-2 py-1">Status</th>
                </tr>
              </thead>
              <tbody>
                {issues.map((issue, idx) => (
                  <tr key={idx}>
                    <td className="border px-2 py-1">{issue.date}</td>
                    <td className="border px-2 py-1">{issue.vendor}</td>
                    <td className="border px-2 py-1">{issue.issueType}</td>
                    <td className="border px-2 py-1">{issue.description}</td>
                    <td className="border px-2 py-1">{issue.status}</td>
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