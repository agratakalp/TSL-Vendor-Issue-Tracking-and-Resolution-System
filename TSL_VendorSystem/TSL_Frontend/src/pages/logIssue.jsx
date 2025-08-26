import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createIssue } from '../services/procurement-issue-management/issueService';

const LogIssue = () => {
  const [vendor, setVendor] = useState('');
  const [issueType, setIssueType] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createIssue({
        title: issueType,
        description,
        date,
        vendor,
        issueType,
        status: 'Open',
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
      <button className="self-start mb-4 btn btn-blue px-4 py-2" onClick={() => navigate('/dashboard_logger')}>
        Home
      </button>
      <div className="flex justify-center items-start flex-1">
        <div className="bg-white p-8 rounded shadow w-full" style={{ maxWidth: 720 }}>
          <h2 className="text-2xl font-bold mb-6 text-center">Log New Issue</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block mb-1 font-medium">Date</label>
              <input
                type="date"
                className="input"
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
                className="input"
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
                className="input"
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
                className="textarea"
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
            <button type="submit" className="btn btn-green w-full py-2">Submit Issue</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LogIssue;