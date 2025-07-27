import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function OvocFiles() {
  const [filters, setFilters] = useState({
    file: "",
  });
  const [fetchData, setFetchData] = useState("fetch");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const fetchFilesList = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/attachments/getOVOCVendorFiles`
        );
        if (response) {
          setData(response.data.data);
          setFilteredData(response.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (fetchData === "fetch") {
      fetchFilesList();
      setFetchData("do not fetch");
    }
  }, [fetchData]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  useEffect(() => {
    const filtered = data?.filter((row) => {
      return Object.keys(filters).every((key) => {
        return String(row[key])
          .toLowerCase()
          .includes(filters[key].toLowerCase());
      });
    });
    setFilteredData(filtered);
  }, [filters, data]);

  const handleFetchFile = async (id) => {
    if (!id) {
      toast.error("No file found");
      return;
    }
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/attachments/getAttachments/${id}`,
        {
          responseType: "blob",
        }
      );
      if (response) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", id);
        document.body.appendChild(link);
        link.click();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error fetching file.");
      console.log(`Error fetching file: ${error.message}`);
    }
  };


  return (
    <div className="overflow-x-auto px-4">
      {/* Container to enable horizontal scroll */}
      <table className="min-w-full bg-white rounded-lg">
        <thead className="text-xs">
          <tr className="bg-blue-200 border border-black">
            <th className="p-2">File ID</th>
          </tr>
          <tr>
            <th className="border border-black p-2">
              <input
                className="p-2 border border-black"
                type="text"
                name="file"
                value={filters.file}
                onChange={handleFilterChange}
                placeholder="Filter by file name"
              />
            </th>
          </tr>
        </thead>
        <tbody className="text-xs">
          {filteredData?.map((row, index) => (
            <tr key={index}>
              <td className="flex justify-between border border-black p-2">
                <div>{row.file}</div>
                <div className="bg-transparent flex justify-end space-x-8">
                <button
                  className="bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-bold py-0.5 px-1.5 rounded shadow-lg transform hover:-translate-y-1 hover:shadow-xl active:translate-y-0.5"
                  onClick={() => {
                    const id = row.file;
                    handleFetchFile(id);
                  }}
                >
                  Download
                </button>
                {/* <button className="bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-bold py-0.5 px-1.5 rounded shadow-lg transform hover:-translate-y-1 hover:shadow-xl active:translate-y-0.5">
                  Cancel
                </button> */}
              </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OvocFiles;
