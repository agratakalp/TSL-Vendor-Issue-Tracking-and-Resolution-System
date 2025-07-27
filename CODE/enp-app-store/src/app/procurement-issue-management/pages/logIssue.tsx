// 6. pages/LogIssue.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createIssue } from '../../../services/procurement-issue-management/issueService';

const LogIssue: React.FC = () => {
  const [vendor, setVendor] = useState('');
  const [issueType, setIssueType] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createIssue({ 
        title: issueType, 
        description, 
        date, 
        vendor, 
        issueType, 
        status: 'Open' 
      });
      alert('Issue submitted!');
      setVendor('');
      setIssueType('');
      setDescription('');
      setFile(null);
    } catch (error) {
      alert('Failed to submit issue.');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col">
      <button
        className="self-start mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={() => navigate('/procurement-issue-management/dashboard_logger')}
      >
        Home
      </button>
      <div className="flex justify-center items-start flex-1 relative z-10">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-2xl relative">
          <h2 className="text-2xl font-bold mb-6 text-center">Log New Issue</h2>
          <form onSubmit={handleSubmit} className="space-y-4 relative">
            <div>
              <label className="block mb-1 font-medium">Date</label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={date}
                onChange={(e) => {
                  console.log('Date changed:', e.target.value);
                  setDate(e.target.value);
                }}
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Vendor</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={vendor}
                onChange={(e) => {
                  console.log('Vendor changed:', e.target.value);
                  setVendor(e.target.value);
                }}
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Issue Type</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={issueType}
                onChange={(e) => {
                  console.log('Issue Type changed:', e.target.value);
                  setIssueType(e.target.value);
                }}
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Description</label>
              <textarea
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={description}
                onChange={(e) => {
                  console.log('Description changed:', e.target.value);
                  setDescription(e.target.value);
                }}
                required
              ></textarea>
            </div>
            <div>
              <label className="block mb-1 font-medium">Upload Evidence</label>
              <input
                type="file"
                className="w-full"
                onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              Submit Issue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LogIssue;
