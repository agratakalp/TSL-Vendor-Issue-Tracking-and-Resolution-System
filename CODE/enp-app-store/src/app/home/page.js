import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../components/loader";
import { PublicClientApplication } from "@azure/msal-browser";

export default function Home() {
  const failAudUrl = process.env.PUBLIC_URL + "/error-call.mp3";
  const [showLogin, setShowLogin] = useState(false);
  const [load, setLoad] = useState(false);
  const [ADID, setADID] = useState("");
  const [PASS, setPASS] = useState("");
  const navigate = useNavigate();
  const logoUri = process.env.PUBLIC_URL + "/logo.png";
  const truckUri = process.env.PUBLIC_URL + "/truck.png";
  const boxUri = process.env.PUBLIC_URL + "/box.png";
  const ssoConfig = {
    auth: {
      clientId: process.env.REACT_APP_CLIENT_ID,
      authority: process.env.REACT_APP_AUTHORITY,
      redirectUri: process.env.REACT_APP_REDIRECT_URI,
      clientSecret: process.env.REACT_APP_CLIENT_SECRET,
    },
  };

  console.log(
    process.env.REACT_APP_CLIENT_ID,
    process.env.REACT_APP_AUTHORITY,
    process.env.REACT_APP_REDIRECT_URI,
    process.env.REACT_APP_CLIENT_SECRET,
    ssoConfig
  );

  const [errorAudio] = useState(new Audio(failAudUrl));
  
  // Function to play error sound after user interaction
  const playErrorSound = () => {
    errorAudio.play().catch(err => console.log('Audio playback failed:', err));
  };

  // Development mode check
  const isDevelopment = process.env.NODE_ENV === 'development';

  const handleSso = async () => {
    //await axios.get('https://tslnodeapidev.corp.tatasteel.com:5001/api/login/sso', {withCredentials :  true}).then((response) => {console.log(response.data)}).catch((err) => {console.log(err);});
    const msalInstance = await new PublicClientApplication(ssoConfig);
    await msalInstance.initialize();
    msalInstance
      .loginPopup({
        scopes: ["user.read"],
      })
      .then(async (response) => {
        const res = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/login/sso`,
          {
            Name: response.account.name,
            UserName: response.account.username,
          }
        );
        const redirectAfterLogin =
          sessionStorage.getItem("redirectAfterLogin") || "/app-dashboard";
        sessionStorage.clear();
        sessionStorage.setItem("userData", JSON.stringify(res.data));
        // sessionStorage.removeItem("redirectAfterLogin");
        navigate(redirectAfterLogin, { replace: true });
        window.location.reload();
        console.log(response.account.name, response.account.username);
      })
      .catch((error) => {
        console.log("404 User Not Found!", error);
        toast.error("Invalid Login!");
      });
  };

  useEffect(() => {
    if (isDevelopment) {
      setShowLogin(true);
      return;
    }

    const timer = setTimeout(() => {
      setShowLogin(true);
      handleSso();
    }, 12000);
    const handleKeyPress = () => {
      if(showLogin == false){
        handleSso();
      } 
      setShowLogin(true);
      clearTimeout(timer); // Stop the timer if a key is pressed
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [showLogin]);

  const handleLogin = async () => {
    setLoad(true);
    try {
      // For development mode, allow direct access with test credentials
      if (isDevelopment && ADID === 'dev' && PASS === 'dev123') {
        const mockUserData = {
          ADID: 'dev',
          token: 'dev-token',
          allow_login: true,
          // Add any other required user data fields
        };
        sessionStorage.setItem("userData", JSON.stringify(mockUserData));
        navigate("/app-dashboard", { replace: true });
        window.location.reload();
        setLoad(false);
        return;
      }

      // Regular login flow for production
      const loginUri = process.env.REACT_APP_BACKEND_URL + "/login/auth";
      console.log(loginUri);
      const res = await axios.post(loginUri, {
        ADID: ADID,
        PASS: PASS,
      });
      if (!res) {
        console.log("404 User Not Found!");
        toast.error("Invalid Login!");
        setLoad(false);
        return;
      } else if (res.data.allow_login === true) {
        sessionStorage.setItem("userData", JSON.stringify(res.data));
        const redirectAfterLogin =
          sessionStorage.getItem("redirectAfterLogin") || "/app-dashboard";
        sessionStorage.removeItem("redirectAfterLogin");
        navigate(redirectAfterLogin, { replace: true });
        window.location.reload();
        setLoad(false);
      }
    } catch (error) {
      console.log("500 Invalid Request!");
      toast.error("Invalid Request!");
      setLoad(false);
      return;
    }

    // return; // comment on enabling
  };

  return (
    <div>
      {load && <Loader />}
      {showLogin === false && (
        <>
          <div className="loginBody2"></div>
          <div className={showLogin ? "fade-out" : ""}>
            <div className="fixed top-0 w-full flex items-center justify-center">
              <h1 className="overflow-hidden justify-self-center text-5xl text-black font-bold">
                E&P React app store
              </h1>
            </div>
            <div className="fixed bottom-72 w-full flex items-center justify-center">
              <div className="w-max flex items-center justify-center">
                <h1 className="animate-typing overflow-hidden whitespace-nowrap border-r-4 border-r-slate-500 pr-5 text-5xl text-slate-500 font-bold">
                  Welcome!
                </h1>
              </div>
            </div>
            <div className="branding fixed bottom-4 right-4 bg-transparent text-slate-500 text-sm font-bold p-2 rounded-md flex items-center space-x-2">
              <span className="wave-hand">👋</span>
              <span>Hello User!</span>
            </div>
          </div>
          <div class="wrap">
            <img class="factory-image-bga truck-img" src={truckUri} alt="" />
            <img class="factory-image-bga box-img" src={boxUri} alt="" />
          </div>
        </>
      )}

      {showLogin && (
        <>
          <div className="homeBg">
            <ul className="shapes">
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
            </ul>
          </div>
          <div className="absolute inset-0 flex items-end justify-center p-8 pb-32">
            <div className="bg-black bg-opacity-40 rounded-lg text-white p-8 max-w-md w-full">
              <div className="bg-white w-full">
                <img
                  src={logoUri}
                  alt="Logo"
                  className="mx-auto mb-4 h-32 w-41 bg-white"
                />
              </div>
              <h2 className="text-2xl font-bold mb-2">Login</h2>
              <input
                type="text"
                value={ADID}
                onChange={(e) => setADID(e.target.value)}
                disabled={false}
                placeholder="ADID"
                className="p-2 rounded bg-transparent border border-white w-full mb-4"
              />
              <input
                type="password"
                value={PASS}
                onChange={(e) => setPASS(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleLogin();
                  }
                }}
                disabled={false}
                placeholder="Password"
                className="p-2 rounded bg-transparent border border-white w-full mb-4"
              />
              <button
                className="w-full p-2 bg-blue-500 rounded"
                onClick={handleLogin}
              >
                Sign In
              </button>
              <p className="mt-4">
                <Link
                  href="/"
                  className="text-blue-300"
                  onClick={(e) => {
                    setShowLogin(false);
                  }}
                >
                  Back to Home
                </Link>
              </p>
            </div>
          </div>
          <div className="branding fixed bottom-4 right-4 bg-transparent text-white text-sm font-bold p-2 rounded-md flex items-center space-x-2">
            <span className="wave-hand">👋</span>
            <span>Hello from KSR!</span>
          </div>
        </>
      )}
    </div>
  );
}
