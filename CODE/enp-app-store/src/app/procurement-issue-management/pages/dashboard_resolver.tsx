// 7. pages/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllIssues } from '../../../services/procurement-issue-management/issueService';

interface Issue {
  issue_id: number;
  date: string;
  vendor: string;
  issueType: string;
  status: string;
}

const Dashboard: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
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
      <button
        className="self-start mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={() => navigate('/procurement-issue-management/login')}
      >
        Home
      </button>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Dashboard-Resolver</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="bg-white p-4 rounded shadow text-center">
            <div className="text-xl font-bold">{openCount}</div>
            <div className="text-sm text-gray-600">Open Issues</div>
          </div>
          <div className="bg-white p-4 rounded shadow text-center">
            <div className="text-xl font-bold">{closedCount}</div>
            <div className="text-sm text-gray-600">Closed Issues</div>
          </div>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Filter by Vendor"
          className="px-3 py-2 rounded border"
          value={vendorFilter}
          onChange={(e) => setVendorFilter(e.target.value)}
        />
        <select
          className="px-3 py-2 rounded border"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="Open">Open</option>
          <option value="Closed">Closed</option>
        </select>
        <input
          type="date"
          className="px-3 py-2 rounded border"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
      </div>

      <div className="bg-white p-4 rounded shadow">
        {loading ? (
          <div className="text-center py-8">
            <div className="text-lg">Loading issues...</div>
          </div>
        ) : issues.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-lg text-gray-500">No issues found.</div>
          </div>
        ) : (
          <table className="w-full table-auto border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-2 py-1">Date</th>
                <th className="border px-2 py-1">Vendor</th>
                <th className="border px-2 py-1">Issue Type</th>
                <th className="border px-2 py-1">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredIssues.map(issue => (
                <tr
                  key={issue.issue_id}
                  className="text-center cursor-pointer hover:bg-blue-100"
                  onClick={() => navigate(`/procurement-issue-management/resolve-issue/${issue.issue_id}`)}
                >
                  <td className="border px-2 py-1">{issue.date}</td>
                  <td className="border px-2 py-1">{issue.vendor}</td>
                  <td className="border px-2 py-1">{issue.issueType}</td>
                  <td className="border px-2 py-1">{issue.status}</td>
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