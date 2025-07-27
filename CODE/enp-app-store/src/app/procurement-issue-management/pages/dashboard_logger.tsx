// // pages/dashboard_logger.tsx
// import React from 'react';
// import { useNavigate } from 'react-router-dom';

// const DashboardLogger: React.FC = () => {
//   const navigate = useNavigate();

//   const handleLogNewIssue = () => {
//     navigate('/procurement-issue-management/log-issue');
//   };

//   const handleViewLoggedIssues = () => {
//     navigate('/procurement-issue-management/my-issues');
//   };

//   return (
//     <div className="w-screen min-h-screen bg-white bg-cover bg-center relative overflow-hidden px-4 sm:px-6" style={{ backgroundImage: "url('/images/tata-bg.jpg')" }}>
//       {/* Overlayed Tata Steel Logo
//       <img
//         src="/EnP-AppStore/images/bg Logo.png"
//         alt="Background Logo"
//         className="absolute inset-0 w-full h-full object-contain opacity-40 z-0 pointer-events-none"
//       /> */}

//       {/* Centered Cards */}
//       {/* <div className="relative z-10 flex justify-center items-center h-[calc(100vh-56px)]">
//         <div className="bg-[#5CB3FF] bg-opacity-80 rounded-3xl p-8 w-[90%] max-w-4xl flex flex-col sm:flex-row justify-center gap-6"> */}
//           {/* Log New Issue Card */}
//           <div
//             className="bg-white bg-opacity-70 rounded-2xl p-6 flex-1 text-center shadow hover:scale-105 transition cursor-pointer"
//             onClick={handleLogNewIssue}
//           >
//             <h2 className="text-xl font-semibold text-black">Log a New Issue</h2>
//           </div>

//           {/* View Logged Issues Card */}
//           <div
//             className="bg-white bg-opacity-70 rounded-2xl p-6 flex-1 text-center shadow hover:scale-105 transition cursor-pointer"
//             onClick={handleViewLoggedIssues}
//           >
//             <h2 className="text-xl font-semibold text-black">See My Logged Issues</h2>
//           </div>
//         </div>
//     //   </div>
//     // </div>
//   );
// };

// export default DashboardLogger;


// pages/dashboard_logger.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardLogger: React.FC = () => {
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
    navigate('/procurement-issue-management/log-issue');
  };

  const handleViewLoggedIssues = () => {
    navigate('/procurement-issue-management/logged-issues');
  };

  return (
    <div className="w-screen h-screen bg-white overflow-hidden flex flex-col">
      <button
        className="self-start m-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={() => navigate('/procurement-issue-management/login')}
      >
        Home
      </button>
      <div className="w-full flex justify-center items-start px-4 sm:px-6 mt-[150px] flex-1">
        <div className="bg-[#5CB3FF] bg-opacity-80 rounded-3xl p-8 w-[90%] max-w-2xl flex flex-col sm:flex-row justify-center gap-6">
          {/* Log New Issue Card */}
          <div
            className="bg-white bg-opacity-70 rounded-2xl p-6 flex-1 text-center shadow hover:scale-105 transition cursor-pointer"
            onClick={handleLogNewIssue}
          >
            <h2 className="text-xl font-semibold text-black">Log a New Issue</h2>
          </div>

          {/* View Logged Issues Card */}
          <div
            className="bg-white bg-opacity-70 rounded-2xl p-6 flex-1 text-center shadow hover:scale-105 transition cursor-pointer"
            onClick={handleViewLoggedIssues}
          >
            <h2 className="text-xl font-semibold text-black">See My Logged Issues</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLogger;
