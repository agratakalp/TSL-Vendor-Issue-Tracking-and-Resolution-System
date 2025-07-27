// 8. pages/ResolveIssue.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAllIssues, updateIssue } from '../../../services/procurement-issue-management/issueService';

interface Issue {
  issue_id: number;
  date: string;
  vendor: string;
  issueType: string;
  description?: string;
  status: string;
}

const ResolveIssue: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [resolution, setResolution] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIssue = async () => {
      console.log('Fetching issue with ID:', id);
      try {
        const allIssues = await getAllIssues();
        console.log('All issues from backend:', allIssues);
        const foundIssue = allIssues.find((issue: Issue) => issue.issue_id === parseInt(id!));
        console.log('Found issue:', foundIssue);
        if (foundIssue) {
          setIssue(foundIssue);
        } else {
          setError('Issue not found');
        }
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch issue:', err);
        setError('Failed to load issue details');
        setLoading(false);
      }
    };

    if (id) {
      fetchIssue();
    }
  }, [id]);

  if (loading) return <div className="p-6">Loading issue details...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!issue) return <div className="p-6">Issue not found</div>;

  const handleResolve = async () => {
    try {
      if (issue && id) {
        console.log('Attempting to update issue:', id);
        console.log('Update data:', { status: 'Closed', resolution: resolution });
        
        await updateIssue(parseInt(id), {
          status: 'Closed',
          resolution: resolution
        });
        
        console.log('Update successful');
        alert('Issue marked as resolved successfully!');
        navigate('/procurement-issue-management/dashboard_resolver');
      }
    } catch (error) {
      console.error('Update failed with error:', error);
      alert('Failed to resolve issue.');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col">
      <button
        className="self-start mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={() => navigate('/procurement-issue-management/dashboard_resolver')}
      >
        Home
      </button>
      <div className="flex justify-center items-start flex-1">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-2xl">
          <h2 className="text-2xl font-bold mb-4">Resolve Issue</h2>
          <div className="mb-4">
            <strong>Date:</strong> {issue.date}
          </div>
          <div className="mb-4">
            <strong>Vendor:</strong> {issue.vendor}
          </div>
          <div className="mb-4">
            <strong>Issue Type:</strong> {issue.issueType}
          </div>
          <div className="mb-4">
            <strong>Description:</strong> {issue.description}
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-1">Resolution Note</label>
            <textarea
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              required
            ></textarea>
          </div>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={handleResolve}
          >
            Mark as Resolved
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResolveIssue;
