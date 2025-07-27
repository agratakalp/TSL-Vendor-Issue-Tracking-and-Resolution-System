import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleViewDashboard = () => {
    navigate("/app-dashboard", { replace: true });
  };

  const onLogout = () => {
    sessionStorage.removeItem("userData");
    navigate("/home", { replace: true });
    window.location.reload();
  };

  return (
    <div className="flex items-center justify-between bg-blue-950 text-white px-4 py-1 mx-2 my-2 rounded-full">
      <div>
        <button
          onClick={toggleDropdown}
          className={`p-2 rounded-md font-bold text-white transition-colors duration-150 ${
            isOpen
              ? "bg-blue-400 hover:bg-gray-500"
              : "bg-blue-950 hover:bg-blue-400"
          }`}
        >
          Menu
        </button>
        <button
          onClick={handleViewDashboard}
          className="p-2 ml-2 rounded-md font-bold text-white transition-colors duration-150 bg-blue-950 hover:bg-blue-400"
        >
          Store
        </button>
        {isOpen && (
          <div className="absolute flex-col mt-1 w-48 bg-gray-300 text-black rounded shadow-lg z-50">
            <SimpleTreeView
              style={{}}
              onItemSelectionToggle={(event, itemId, isSelected) => {
                if (isSelected && itemId !== "ovoc") {
                  setIsOpen(false);
                  navigate(`${itemId}`, { replace: true });
                  console.log(event.target.value);
                }
              }}
            >
              <TreeItem itemId="ovoc" label="One-Vendor-One-Contract">
                <TreeItem
                  className=" hover:bg-orange-200 cursor-pointer"
                  itemId="ovoc/ltcForm"
                  label="LTC form"
                />
                <TreeItem
                  className=" hover:bg-orange-200 cursor-pointer"
                  itemId="ovoc/approveLtc"
                  label="Pending for approval"
                />
                <TreeItem
                  className=" hover:bg-orange-200 cursor-pointer"
                  itemId="ovoc/mis"
                  label="MIS"
                />
              </TreeItem>
              <TreeItem
                className=" hover:bg-orange-200 cursor-pointer"
                itemId="role"
                label="Role management"
              ></TreeItem>
              <TreeItem
                className=" hover:bg-orange-200 cursor-pointer"
                itemId="files"
                label="File System"
              ></TreeItem>
            </SimpleTreeView>
          </div>
        )}
      </div>
      <button
        className="mr-2 px-1 py-1 text-white rounded-md hover:bg-gray-400"
        onClick={onLogout}
      >
        <svg
          fill="#fa0000"
          height="25px"
          width="25px"
          version="1.1"
          id="Capa_1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="-47.12 -47.12 565.44 565.44"
          stroke="#fa0000"
        >
          <g id="SVGRepo_bgCarrier" stroke-width="0" />

          <g
            id="SVGRepo_tracerCarrier"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke="#030202"
            stroke-width="29.2144"
          >
            {" "}
            <g>
              {" "}
              <g>
                {" "}
                <path d="M227.619,444.2h-122.9c-33.4,0-60.5-27.2-60.5-60.5V87.5c0-33.4,27.2-60.5,60.5-60.5h124.9c7.5,0,13.5-6,13.5-13.5 s-6-13.5-13.5-13.5h-124.9c-48.3,0-87.5,39.3-87.5,87.5v296.2c0,48.3,39.3,87.5,87.5,87.5h122.9c7.5,0,13.5-6,13.5-13.5 S235.019,444.2,227.619,444.2z" />{" "}
                <path d="M450.019,226.1l-85.8-85.8c-5.3-5.3-13.8-5.3-19.1,0c-5.3,5.3-5.3,13.8,0,19.1l62.8,62.8h-273.9c-7.5,0-13.5,6-13.5,13.5 s6,13.5,13.5,13.5h273.9l-62.8,62.8c-5.3,5.3-5.3,13.8,0,19.1c2.6,2.6,6.1,4,9.5,4s6.9-1.3,9.5-4l85.8-85.8 C455.319,239.9,455.319,231.3,450.019,226.1z" />{" "}
              </g>{" "}
            </g>{" "}
          </g>

          <g id="SVGRepo_iconCarrier">
            {" "}
            <g>
              {" "}
              <g>
                {" "}
                <path d="M227.619,444.2h-122.9c-33.4,0-60.5-27.2-60.5-60.5V87.5c0-33.4,27.2-60.5,60.5-60.5h124.9c7.5,0,13.5-6,13.5-13.5 s-6-13.5-13.5-13.5h-124.9c-48.3,0-87.5,39.3-87.5,87.5v296.2c0,48.3,39.3,87.5,87.5,87.5h122.9c7.5,0,13.5-6,13.5-13.5 S235.019,444.2,227.619,444.2z" />{" "}
                <path d="M450.019,226.1l-85.8-85.8c-5.3-5.3-13.8-5.3-19.1,0c-5.3,5.3-5.3,13.8,0,19.1l62.8,62.8h-273.9c-7.5,0-13.5,6-13.5,13.5 s6,13.5,13.5,13.5h273.9l-62.8,62.8c-5.3,5.3-5.3,13.8,0,19.1c2.6,2.6,6.1,4,9.5,4s6.9-1.3,9.5-4l85.8-85.8 C455.319,239.9,455.319,231.3,450.019,226.1z" />{" "}
              </g>{" "}
            </g>{" "}
          </g>
        </svg>
      </button>
    </div>
  );
}

export default Navbar;
