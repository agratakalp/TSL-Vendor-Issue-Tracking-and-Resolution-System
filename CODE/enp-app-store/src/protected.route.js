import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Loader from "./components/loader";

function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isDevelopment = process.env.NODE_ENV === 'development';

  useEffect(() => {
    try {
      const userData = JSON.parse(sessionStorage.getItem("userData"));
      
      // Allow development access with dev credentials
      if (isDevelopment && userData?.ADID === 'dev') {
        setIsAuthenticated(true);
        return;
      }

      const ADID = userData.ADID;
      const token = userData.token;
      const validationUrl =
        process.env.REACT_APP_BACKEND_URL + "/login/validate-token";
      axios
        .post(
          validationUrl,
          { ADID: ADID },
          {
            headers: {
              "auth-token": token,
            },
          }
        )
        .then(async (response) => {
          if (response.data.isValid) {
            if (location.pathname == "/app-dashboard") {
              setIsAuthenticated(true);
            } else {
              await fetchRole();
            }
          } else {
            setIsAuthenticated(false);
            sessionStorage.setItem("redirectAfterLogin", location.pathname);
            sessionStorage.removeItem("userData");
            toast.error(response.data.message);
            navigate("/home", { replace: true });
          }
        })
        .catch((err) => {
          console.error(err);
          sessionStorage.setItem("redirectAfterLogin", location.pathname);
          sessionStorage.removeItem("userData");
          setIsAuthenticated(false);
          navigate("/home", { replace: true });
        });
    } catch (err) {
      sessionStorage.setItem("redirectAfterLogin", location.pathname);
      sessionStorage.removeItem("userData");
      toast.error("Site not accessible for you.");
      setIsAuthenticated(false);
      navigate("/home", { replace: true });
    }
  }, [navigate, location]);

  const fetchRole = async () => {
    // Allow all access in development mode
    if (isDevelopment) {
      setIsAuthenticated(true);
      return;
    }

    const ADID = JSON.parse(sessionStorage.getItem("userData")).ADID;
    const roleUrl = process.env.REACT_APP_BACKEND_URL + "/login/valid-role";
    let validRole = false;
    await axios
      .post(roleUrl, {
        ADID: ADID,
      })
      .then((response) => {
        if (response.data.data) {
          for (const obj of response.data.data) {
            if (obj.PAGE == location.pathname) {
              setIsAuthenticated(true);
              validRole = true;
              break;
            }
          }
          if (validRole === false) {
            setIsAuthenticated(false);
            sessionStorage.setItem("errorToReflect", "Access not allowed");
            navigate("/app-dashboard", { replace: true });
          }
        } else {
          setIsAuthenticated(false);
          sessionStorage.setItem("redirectAfterLogin", location.pathname);
          sessionStorage.removeItem("userData");
          toast.error(response.data.message);
          navigate("/home", { replace: true });
        }
      })
      .catch((error) => {
        console.error(error);
        sessionStorage.setItem("redirectAfterLogin", location.pathname);
        sessionStorage.removeItem("userData");
        setIsAuthenticated(false);
        navigate("/home", { replace: true });
      });
  };

  if (isAuthenticated === null) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return isAuthenticated ? children : null;
}

export default ProtectedRoute;
