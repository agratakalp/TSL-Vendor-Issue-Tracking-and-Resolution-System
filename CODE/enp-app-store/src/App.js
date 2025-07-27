import React from "react";
import Home from "./app/home/page";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import ProtectedRoute from "./protected.route";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "./components/loader";
import TitleBar from "./components/titlebar";
import SystemsList from "./app/file-manager/systems-list/page";
import Layout from "./app/procurement-issue-management/layout/page";
const Role = React.lazy(() => import("./app/role/page"));
const LTC = React.lazy(() => import("./app/ovoc/ltc/page"));
const OvocMis = React.lazy(() => import("./app/ovoc/mis/page"));
const ApproveLtc = React.lazy(() => import("./app/ovoc/approveLtc/page"));
const Cr = React.lazy(() => import("./app/ovoc/cr/page"));
const Dashboard = React.lazy(() => import("./app/dashboard/page"));
const MisWeighbridge = React.lazy(() => import("./app/mis-weighbridge/page"));
const OvocFiles = React.lazy(() =>
  import("./app/file-manager/ovoc-files/page")
);
const ProcDashboard = React.lazy(() =>
  import("./app/procurement-issue-management/procurement-pages/dashboard")
);
const DefectsIssues = React.lazy(() =>
  import("./app/procurement-issue-management/procurement-pages/defectsIssues")
);
const ProcurementApp = React.lazy(() =>
  import("./app/procurement-issue-management/pages/app")
);

export default function App() {
  const location = useLocation();
  return (
    <div className="min-h-screen flex flex-col">
      <ToastContainer />
      <TitleBar />
      <Routes>
        <Route
          path="/procurement-issue-management/*"
          element={
            <React.Suspense fallback={<Loader />}>
              <ProcurementApp />
            </React.Suspense>
          }
        />
        <Route path="" element={<Navigate to="/home" />} />
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/files" element={<SystemsList />} />
        <Route
          path="/role"
          element={
            <ProtectedRoute>
              <React.Suspense fallback={<Loader></Loader>}>
                <Role />
              </React.Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/mis-weighbridge"
          element={
            <ProtectedRoute>
              <React.Suspense fallback={<Loader></Loader>}>
                <MisWeighbridge />
              </React.Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/app-dashboard"
          element={
            <ProtectedRoute>
              <React.Suspense fallback={<Loader></Loader>}>
                <Dashboard />
              </React.Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/ovoc/ltcForm"
          element={
            <ProtectedRoute>
              <React.Suspense fallback={<Loader></Loader>}>
                <LTC />
              </React.Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/ovoc/approveLtc"
          element={
            <ProtectedRoute>
              <React.Suspense fallback={<Loader></Loader>}>
                <ApproveLtc />
              </React.Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/ovoc/mis"
          element={
            <ProtectedRoute>
              <React.Suspense fallback={<Loader></Loader>}>
                <OvocMis />
              </React.Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/ovoc/cr/:param1/:param2"
          element={
            <ProtectedRoute>
              <React.Suspense fallback={<Loader></Loader>}>
                <Cr />
              </React.Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/files/ovoc-files"
          element={
            <ProtectedRoute>
              <React.Suspense fallback={<Loader></Loader>}>
                <OvocFiles />
              </React.Suspense>
            </ProtectedRoute>
          }
        />
        {/* <Route path='/*' Component={Login}/> */}
      </Routes>
    </div>
  );
}
