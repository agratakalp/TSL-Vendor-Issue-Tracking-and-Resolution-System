import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllIssues } from '../services/procurement-issue-management/issueService';

const Dashboard = () => {
  const [issues, setIssues] = useState([]);
  const [vendorFilter, setVendorFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const backendIssues = await getAllIssues();
        setIssues(backendIssues);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch issues:', error);
        setIssues([]);
        setLoading(false);
      }
    };
    fetchIssues();
  }, []);

  const filteredIssues = issues.filter(issue => {
    return (
      (vendorFilter === '' || issue.vendor === vendorFilter) &&
      (statusFilter === '' || issue.status === statusFilter) &&
      (dateFilter === '' || issue.date === dateFilter)
    );
  });

  const openCount = issues.filter(i => i.status === 'Open').length;
  const closedCount = issues.filter(i => i.status === 'Closed').length;

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col">
      <button className="self-start mb-4 btn btn-blue px-4 py-2" onClick={() => navigate('/login')}>
        Home
      </button>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Dashboard-Resolver</h1>
        <div className="grid grid-2 gap-4 mt-4">
          <div className="bg-white p-4 rounded shadow text-center">
            <div className="text-xl font-bold">{openCount}</div>
            <div className="text-gray-500">Open Issues</div>
          </div>
          <div className="bg-white p-4 rounded shadow text-center">
            <div className="text-xl font-bold">{closedCount}</div>
            <div className="text-gray-500">Closed Issues</div>
          </div>
        </div>
      </div>

      <div className="mb-4 grid grid-2 gap-4">
        <input type="text" placeholder="Filter by Vendor" className="input" value={vendorFilter} onChange={(e) => setVendorFilter(e.target.value)} />
        <select className="select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="Open">Open</option>
          <option value="Closed">Closed</option>
        </select>
        <input type="date" className="input" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
      </div>

      <div className="bg-white p-4 rounded shadow">
        {loading ? (
          <div className="text-center p-8">Loading issues...</div>
        ) : issues.length === 0 ? (
          <div className="text-center p-8 text-gray-500">No issues found.</div>
        ) : (
          <table className="table">
            <thead>
              <tr className="bg-gray-200">
                <th>Date</th>
                <th>Vendor</th>
                <th>Issue Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredIssues.map(issue => (
                <tr key={issue.issue_id} className="text-center cursor-pointer hover-blue-100" onClick={() => navigate(`/resolve-issue/${issue.issue_id}`)}>
                  <td>{issue.date}</td>
                  <td>{issue.vendor}</td>
                  <td>{issue.issueType}</td>
                  <td>{issue.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;