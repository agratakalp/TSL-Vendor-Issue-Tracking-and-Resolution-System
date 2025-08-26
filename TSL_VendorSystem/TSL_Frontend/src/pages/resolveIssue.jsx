import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAllIssues, updateIssue } from '../services/procurement-issue-management/issueService';

const ResolveIssue = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [issue, setIssue] = useState(null);
  const [resolution, setResolution] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIssue = async () => {
      console.log('Fetching issue with ID:', id);
      try {
        const allIssues = await getAllIssues();
        console.log('All issues from backend:', allIssues);
        const foundIssue = allIssues.find((issue) => issue.issue_id === parseInt(id));
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
        navigate('/dashboard_resolver');
      }
    } catch (error) {
      console.error('Update failed with error:', error);
      alert('Failed to resolve issue.');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col">
      <button className="self-start mb-4 btn btn-blue px-4 py-2" onClick={() => navigate('/dashboard_resolver')}>
        Home
      </button>
      <div className="flex justify-center items-start flex-1">
        <div className="bg-white p-8 rounded shadow w-full" style={{ maxWidth: 720 }}>
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
            <textarea className="textarea" value={resolution} onChange={(e) => setResolution(e.target.value)} required></textarea>
          </div>
          <button className="btn btn-blue px-4 py-2" onClick={handleResolve}>Mark as Resolved</button>
        </div>
      </div>
    </div>
  );
};

export default ResolveIssue;