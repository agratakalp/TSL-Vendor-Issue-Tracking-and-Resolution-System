import { useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function Dashboard() {
  const ImgWeighbridge = process.env.PUBLIC_URL + "/Weighbridge.png";
  const ImgOvoc = process.env.PUBLIC_URL + "/OVOC.png";
  const ImgRole = process.env.PUBLIC_URL + "/Role.png";
  const ImgFileSys = process.env.PUBLIC_URL + "/FileSys.png";

  useEffect(() => {
    if (sessionStorage.getItem("errorToReflect") !== null) {
      toast.error(sessionStorage.getItem("errorToReflect"));
      sessionStorage.removeItem("errorToReflect");
    }
  }, [sessionStorage.getItem("errorToReflect") !== null]);

  return (
    <div className="employee-container flex-col overflow-auto">
      <div className="flex px-4 mx-20 justify-between">
        <div className="employee border-2 border-blue-950 md:h-[300px]">
          <div className="employee-image md:h-[300px]">
            <img src={ImgOvoc} alt="employee-image" />
          </div>
          <div className="text-white text-center items-start text-xl">
            <div>One vendor one contract.</div>
            <div>
              <Link
                to="/ovoc/ltcForm"
                className="text-yellow-400 hover:text-blue-300 text-base"
              >
                One-Vendor-One-Contract
              </Link>
            </div>
          </div>
        </div>

        <div className="employee border-2 border-blue-950 md:h-[300px]">
          <div className="employee-image md:h-[300px]">
            <img
              src={ImgWeighbridge}
              className="img-fluid d-block m-auto"
              alt="employee-image"
            />
          </div>
          <div className="text-white text-center items-start text-xl">
            <div>Management Information System for weighbridge data.</div>
            <div>
              <Link
                to="/mis-weighbridge"
                className="text-yellow-400 hover:text-blue-300 text-base"
              >
                MIS Weighbridge
              </Link>
            </div>
          </div>
        </div>

        <div className="employee border-2 border-blue-950 md:h-[300px]">
          <div className="employee-image md:h-[300px]">
            <img
              src={ImgRole}
              className="img-fluid d-block m-auto"
              alt="employee-image"
            />
          </div>
          <div className="text-white text-center items-start text-xl">
            <div>Role assigning for systems.</div>
            <div>
              <Link
                to="/role"
                className="text-yellow-400 hover:text-blue-300 text-base"
              >
                Role Management
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="flex px-4 mx-20 justify-between">
        <div className="employee border-2 border-blue-950 md:h-[300px]">
          <div className="employee-image md:h-[300px]">
            <img src={ImgFileSys} alt="employee-image" className="ml-6"/>
          </div>
          <div className="text-white text-center items-start text-xl">
            <div>File management system.</div>
            <div>
              <Link
                to="/files"
                className="text-yellow-400 hover:text-blue-300 text-base"
              >
                File System
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
