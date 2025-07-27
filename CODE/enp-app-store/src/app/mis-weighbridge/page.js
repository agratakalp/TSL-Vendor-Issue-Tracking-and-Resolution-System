import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import Loader from "../../components/loader";
import PopUp from "../../components/mis-weighbridge/PopUp/pop-up";
import PDFViewer from "../../components/mis-weighbridge/MyPDF/pdf-viewer";
import axios from "axios";

function MisWeighbridge() {
  const Filters = [
    { label: "Date", value: "Date" },
    { label: "Truck Number", value: "TruckNo" },
    { label: "Material Name", value: "MatName" },
    { label: "Customer Name", value: "CustName" },
    { label: "Supplier Name", value: "SupName" },
    { label: "Transporter Name", value: "TransporterName" },
    { label: "Order Number", value: "OrderNo" },
  ];

  const currDate = new Date();
  const endDay = currDate.getDate();
  const endMonth = currDate.getMonth() + 1;
  const endYear = currDate.getFullYear();
  const endDate = `${endYear}-${endMonth}-${endDay}`;
  const [load, setLoad] = useState(false);
  const [WeighBridges, getWeighbridge] = useState([]);
  const [selectedWeighBridge, setSelectedWeighBridge] = useState("");
  const [selectedValue, setSelectecValue] = useState("E");
  const [selectedFilter, setSelectedFilter] = useState("Date");
  const [filter, setFilter] = useState("");
  const [sDate, setSDate] = useState("2000-08-19");
  const [eDate, setEDate] = useState(endDate.toString());
  const [showOptions, setShowOptions] = useState(false);
  const [myData, setMyData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [label, setLabel] = useState("");
  const [buttonPopup, setButtonPopup] = useState(false);

  const formatDate = (date, time) => {
    var Time = time?.split("T")[1];
    return(`${date?.split("T")[0]} | ${Time?.split(".")[0]}`)
  }

  useEffect(() => {
    const fetchWeighbridges = async () => {
      try {
        const get_weighbridge = process.env.REACT_APP_BACKEND_URL + "/misWeighData/get_weighbridge";
        const resp = await axios.get(get_weighbridge);
        
        if (resp && resp.data && resp.data.FWB) {
          getWeighbridge(resp.data.FWB);
        } else {
          console.error('Invalid response format:', resp);
          toast.error("Failed to load weighbridges. Please try again.");
        }
      } catch (err) {
        console.error('Error fetching weighbridges:', err);
        toast.error(err?.response?.data?.message || "Failed to load weighbridges");
        getWeighbridge([]); // Set empty array as fallback
      }
    };

    fetchWeighbridges();
  }, []);

  useEffect(() => {
    if (selectedFilter === "Date") {
      setShowOptions(false);
    } else {
      setShowOptions(true);
      if (selectedWeighBridge === "" || selectedWeighBridge === "select") {
        toast.error("Please select a weighbridge");
        return;
      }
      
      const fetchFilterData = async () => {
        try {
          setLoad(true);
          const get_filtertype = process.env.REACT_APP_BACKEND_URL + "/misWeighData/get_filter";
          const resp = await axios.post(get_filtertype, {
            filtertype: selectedFilter,
            selectWeighbridge: selectedWeighBridge,
          });

          if (resp && resp.data && resp.data.data) {
            setMyData(resp.data.data);
          } else {
            console.error('Invalid filter data response:', resp);
            toast.error("Failed to load filter data");
            setMyData([]);
          }
        } catch (err) {
          console.error('Error fetching filter data:', err);
          toast.error(err?.response?.data?.message || "Failed to load filter data");
          setMyData([]);
        } finally {
          setLoad(false);
        }
      };

      fetchFilterData();
    }
  }, [selectedFilter, selectedWeighBridge]);

  useEffect(() => {
    if (selectedFilter === "TruckNo") {
      setLabel("Truck Number");
    } else if (selectedFilter === "MatName") {
      setLabel("Material Name");
    } else if (selectedFilter === "CustName") {
      setLabel("Customer Name");
    } else if (selectedFilter === "SupName") {
      setLabel("Supplier Name");
    } else if (selectedFilter === "TransporterName") {
      setLabel("Transporter Name");
    } else if (selectedFilter === "OrderNo") {
      setLabel("Order Number");
    }
  }, [selectedFilter]);

  const handleClick = async () => {
    try {
      if (selectedWeighBridge === "" || selectedWeighBridge === "select") {
        toast.error("Please select a weighbridge");
        return;
      }

      // Set default dates if empty
      const startDate = sDate || "2000-08-19";
      const endDate = eDate || endDate.toString();
      
      setLoad(true);
      const endpoint = selectedFilter !== "Date" 
        ? process.env.REACT_APP_BACKEND_URL + "/misWeighData/get_data"
        : process.env.REACT_APP_BACKEND_URL + "/misWeighData/get_udata";

      const payload = {
        selectValue: selectedValue,
        selectWeighbridge: selectedWeighBridge,
        SDate: startDate,
        EDate: endDate,
        ...(selectedFilter !== "Date" && {
          filtertype: selectedFilter,
          filter: filter,
        }),
      };

      const resp = await axios.post(endpoint, payload);

      if (resp && resp.data && resp.data.data) {
        setSearchData(resp.data.data);
      } else {
        console.error('Invalid search data response:', resp);
        toast.error("No data found for the selected criteria");
        setSearchData([]);
      }
    } catch (err) {
      console.error('Error fetching search data:', err);
      toast.error(err?.response?.data?.message || "Failed to fetch data");
      setSearchData([]);
    } finally {
      setLoad(false);
    }
  };

  const handleDownloadPDF = () => {
    setButtonPopup(true);
  };

  return (
    <>
      {load && <Loader />}
      <ToastContainer />
      <div className="flex-1 overflow-auto relative pt-16">
        <div className="bg-transparent absolute inset-0">
          <div className="absolute inset-0 bg-white opacity-85"></div>
          <div className="relative p-4 flex-col justify-between items-center">
            <div className="text-xl font-bold flex-grow text-center">
              TGS MIS Report for Weighbridge
            </div>

            <div className="relative w-1/5 pb-4 min-w-200px">
              <select
                className="peer h-full w-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 empty:!bg-gray-900 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                value={selectedWeighBridge}
                onChange={(e) => {
                  setSelectedWeighBridge(e.target.value);
                }}
              >
                <option value="select">Select</option>
                {WeighBridges.map((weighbridge, index) => (
                  <option key={index} value={weighbridge}>
                    {weighbridge}
                  </option>
                ))}
              </select>
              <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                Select a WeighBridge
              </label>
            </div>

            <div className="pb-4 pl-4 text-sm">
              <RadioGroup
                onChange={(event) => {
                  setSelectecValue(event.target.value);
                }}
                value={
                  selectedValue == "I" ? "I" : selectedValue == "E" ? "E" : ""
                }
                // value={deviationsLabel}
                row
              >
                <FormControlLabel
                  className="ml-4"
                  value="I"
                  control={<Radio size="small" />}
                  label="Internal"
                />
                <FormControlLabel
                  className="ml-4"
                  value="E"
                  control={<Radio size="small" />}
                  label="External"
                />
              </RadioGroup>
            </div>

            <div className="bg-white items-center justify-between w-full flex rounded-full shadow-lg p-3 px-6 border-gray-500 border">
              <div className="relative h-12 w-72 min-w-200px">
                <select
                  className="peer h-full w-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 empty:!bg-gray-900 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                  value={selectedFilter}
                  onChange={(e) => {
                    setSelectedFilter(e.target.value);
                  }}
                >
                  {Filters.map((filterType, index) => (
                    <option key={index} value={filterType.value}>
                      {filterType.label}
                    </option>
                  ))}
                </select>
                <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                  Select a filter
                </label>
              </div>
              <div className="relative h-12 w-52 min-w-[100px]">
                <input
                  className="peer h-full w-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 cursor-pointer"
                  type="date"
                  placeholder="Start Date"
                  onChange={(event) => setSDate(event.target.value.toString())}
                />
                <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                  Start Date
                </label>
              </div>
              <div className="relative h-12 w-52 min-w-[100px]">
                <input
                  className="peer h-full w-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 cursor-pointer"
                  type="date"
                  placeholder="End Date"
                  onChange={(event) => setEDate(event.target.value.toString())}
                />
                <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                  End Date
                </label>
              </div>
              {showOptions && (
                <div className="relative h-12 w-72 min-w-200px">
                  <select
                    onChange={(e) => {
                      setFilter(e.target.value);
                    }}
                    className="peer h-full w-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 empty:!bg-gray-900 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                  >
                    {myData.map((data, index) => (
                      <option key={index} value={data[selectedFilter]}>
                        {data[selectedFilter]}
                      </option>
                    ))}
                  </select>
                  <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                    {label}
                  </label>
                </div>
              )}
              <div className="search">
                <button
                  className="bg-gray-600 p-2 hover:bg-blue-600 cursor-pointer mx-2 rounded-full text-white "
                  onClick={handleClick}
                >
                  <svg
                    className="w-6 h-6"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex justify-end items-center">
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 rounded m-2"
                onClick={handleDownloadPDF}
              >
                <i class="fa-regular fa-file-pdf text-white mr-2"></i>
                PDF
              </button>
            </div>

            {searchData && searchData.length > 0 ? (
              <div class="mx-auto pt-10">
                <section class="relative overflow-x-auto mt-5 border rounded-md">
                  <table
                    class="w-full text-sm text-left rtl:text-right text-gray-500 shadow-2xl"
                    id="weighbridge-table"
                  >
                    <thead class="text-xs text-white uppercase bg-blue-600 rounded-md">
                      <tr>
                        <th scope="col" class="px-2 py-3 text-nowrap">
                          Sl.No.
                        </th>
                        <th scope="col" class="px-2 py-3 text-nowrap">
                          Truck No.
                        </th>
                        <th scope="col" class="px-2 py-3 text-nowrap">
                          First weigh date & time
                        </th>
                        <th scope="col" class="px-2 py-3 text-wrap">
                          First weigh shift
                        </th>
                        <th scope="col" class="px-2 py-3 text-nowrap">
                          First weigh type
                        </th>
                        <th scope="col" class="px-2 py-3 text-nowrap">
                          First weight
                        </th>
                        <th scope="col" class="px-2 py-3 text-nowrap">
                          Second weigh date & time
                        </th>
                        <th scope="col" class="px-2 py-3 text-wrap">
                          Second weigh shift
                        </th>
                        <th scope="col" class="px-2 py-3 text-nowrap">
                          Second weigh type
                        </th>
                        <th scope="col" class="px-2 py-3 text-nowrap">
                          Second weight
                        </th>
                        <th scope="col" class="px-2 py-3 text-nowrap">
                          Net weight
                        </th>
                        <th scope="col" class="px-2 py-3 text-nowrap">
                          Status
                        </th>
                        <th scope="col" class="px-2 py-3 text-nowrap">
                          Chalan No.
                        </th>
                        <th scope="col" class="px-2 py-3 text-nowrap">
                          Source
                        </th>
                        <th scope="col" class="px-2 py-3 text-nowrap">
                          Material Name
                        </th>
                        <th scope="col" class="px-2 py-3 text-nowrap">
                          Customer Name
                        </th>
                        <th scope="col" class="px-2 py-3 text-nowrap">
                          Supplier Name
                        </th>
                      </tr>
                    </thead>
                    <tbody class="px-4">
                      {searchData.map((obj) => {
                        return (
                          <tr class="bg-white">
                            <td
                              scope="col"
                              class="px-2 py-3 justify-between items-centre text-nowrap"
                            >
                              {obj.SlNo}
                            </td>
                            <td
                              scope="col"
                              class="px-2 py-3 justify-between items-centre text-nowrap"
                            >
                              {obj.TruckNo}
                            </td>
                            <td
                              scope="col"
                              class="px-2 py-3 justify-between items-centre text-nowrap"
                            >
                              {formatDate(obj.FDate,obj.FTime)}
                            </td>
                            <td
                              scope="col"
                              class="px-2 py-3 justify-between items-centre text-nowrap"
                            >
                              {obj.FShift}
                            </td>
                            <td
                              scope="col"
                              class="px-2 py-3 justify-between items-centre text-nowrap"
                            >
                              {obj.F == "T" ? "Tare Weight" : obj.F == "G" ? "Gross Weight" : ""}
                            </td>
                            <td
                              scope="col"
                              class="px-2 py-3 justify-between items-centre text-nowrap"
                            >
                              {Number(obj.FWeight).toFixed(3)}
                            </td>
                            <td
                              scope="col"
                              class="px-2 py-3 justify-between items-centre text-nowrap"
                            >
                              {formatDate(obj.SDate,obj.STime)}
                            </td>
                            <td
                              scope="col"
                              class="px-2 py-3 justify-between items-centre text-nowrap"
                            >
                              {obj.SShift}
                            </td>
                            <td
                              scope="col"
                              class="px-2 py-3 justify-between items-centre text-nowrap"
                            >
                              {obj.S == "T" ? "Tare Weight" : obj.S == "G" ? "Gross Weight" : ""}
                            </td>
                            <td
                              scope="col"
                              class="px-2 py-3 justify-between items-centre text-nowrap"
                            >
                              {Number(obj.SWeight).toFixed(3)}
                            </td>
                            <td
                              scope="col"
                              class="px-2 py-3 justify-between items-centre text-nowrap"
                            >
                              {Number(obj.NetWt).toFixed(3)}
                            </td>
                            <td
                              scope="col"
                              class="px-2 py-3 justify-between items-centre text-nowrap"
                            >
                              {obj.Status == "C" ? "Completed" : "Not Complete"}
                            </td>
                            <td
                              scope="col"
                              class="px-2 py-3 justify-between items-centre text-nowrap"
                            >
                              {obj.ChalanNo}
                            </td>
                            <td
                              scope="col"
                              class="px-2 py-3 justify-between items-centre text-nowrap"
                            >
                              {obj.Source}
                            </td>
                            <td
                              scope="col"
                              class="px-2 py-3 justify-between items-centre text-nowrap"
                            >
                              {obj.MatName}
                            </td>
                            <td
                              scope="col"
                              class="px-2 py-3 justify-between items-centre text-nowrap"
                            >
                              {obj.CustName}
                            </td>
                            <td
                              scope="col"
                              class="px-2 py-3 justify-between items-centre text-nowrap"
                            >
                              {obj.SupName}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </section>
                <PopUp trigger={buttonPopup} setTrigger={setButtonPopup}>
                  <PDFViewer invoice={searchData} weigh={selectedWeighBridge} />
                </PopUp>
              </div>
            ) : searchData ? (
              <div className="text-center mt-10 text-gray-600">
                No data found for the selected criteria. Please try different filters.
              </div>
            ) : (
              <div className="text-center mt-10 text-gray-600">
                Select a weighbridge and click search to view data.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default MisWeighbridge;
