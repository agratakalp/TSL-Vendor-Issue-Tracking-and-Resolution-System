import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardLogger = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  const handleLogNewIssue = () => {
    navigate('/log-issue');
  };

  const handleViewLoggedIssues = () => {
    navigate('/logged-issues');
  };

  return (
    <div className="screen bg-white overflow-hidden flex flex-col">
      <button className="self-start m-4 btn btn-blue px-4 py-2" onClick={() => navigate('/login')}>
        Home
      </button>
      <div className="w-full flex justify-center items-start p-6 mt-150 flex-1">
        <div className="bg-white rounded-3xl p-8 w-full" style={{ maxWidth: 720, background: '#e0f2ff' }}>
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-2xl p-6 text-center shadow cursor-pointer" onClick={handleLogNewIssue}>
              <h2 className="text-xl font-semibold text-black">Log a New Issue</h2>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center shadow cursor-pointer" onClick={handleViewLoggedIssues}>
              <h2 className="text-xl font-semibold text-black">See My Logged Issues</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLogger;