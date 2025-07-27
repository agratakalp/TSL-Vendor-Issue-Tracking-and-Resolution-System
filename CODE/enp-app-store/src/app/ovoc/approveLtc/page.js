import { useState, useEffect } from "react";
import { useNavigate} from "react-router-dom";
import {
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import axios from "axios";

export default function ApproveLtc() {
  const navigate = useNavigate();
  const ADID = JSON.parse(sessionStorage.getItem("userData")).ADID;
  const [contracts, setContracts] = useState([]);
  const [contractSelect, setContractSelect] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let dataUri = process.env.REACT_APP_BACKEND_URL + "/get/approverContracts";
        const data = await axios.post(dataUri, {
            ADID: ADID
        })
        setContracts(data.data.data);
      } catch (error) {
        console.error("Failed to fetch options", error);
      }
    };
    fetchData();
  }, []);
  const contractsList = {
    options: contracts,
    getOptionLabel: (option)=> option.id,
  };

  const searchedContract = contracts.filter((option) => {
    if (contractSelect === undefined) return true;
    return option.id === contractSelect;
  });

  const handleViewCr = (value) => {
    navigate(`/ovoc/cr/${ADID}/${value}`);
  }

  return (
      <div className="flex-1 overflow-auto relative pt-16">
        <div className="bg-img absolute inset-0">
          <div className="absolute inset-0 bg-white opacity-85"></div>
          <div className="relative p-4 flex-col justify-between items-center">
          <div className="text-xl font-bold flex-grow text-center">Long Term Agreements on Commercial terms & conditions</div>
            <div className="retative mb-4 mt-1 w-1/4">
              <label className="relative before:content[' '] after:content[' '] pointer-events-none absolute left-4 top-2 flex h-full select-none text-[11px] font-medium leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-0 before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                Search
              </label>
              <Autocomplete
                className="relative peer h-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 cursor-pointer"
                {...contractsList}
                id="vendorCode"
                disableClearable
                onChange={(event, value) => {
                  setContractSelect(value.id);
                }}
                renderInput={(params) => (
                  <TextField
                  className="peer h-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 cursor-pointer"
                    {...params}
                    variant="standard"
                    fullWidth
                    style={{ width: "300px" }}
                  />
                )}
              />
            </div>
            <TableContainer component={Paper}>
              <Table>
                <TableHead className="bg-blue-100">
                  <TableRow>
                    <TableCell className="w-1/12 font-bold">Action</TableCell>
                    <TableCell className="w-2/12 font-bold">ID</TableCell>
                    <TableCell className="w-5/12 font-bold">Title</TableCell>
                    <TableCell className="w-2/12 font-bold">Creation date</TableCell>
                    <TableCell className="w-2/12 font-bold">Vendor code</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {searchedContract.map((option, index) => (
                    <TableRow key={index}>
                      <TableCell className="w-1/12">
                        <IconButton
                          onClick={(event) => {handleViewCr(option.id)}}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell className="items-center justify-between w-2/12">
                        {option.id}
                      </TableCell>
                      <TableCell className="items-center justify-between w-5/12">
                        {option.title}
                      </TableCell>
                      <TableCell className="items-center justify-between w-2/12">
                        {option.create_date.split("T")[0]}
                      </TableCell>
                      <TableCell className="items-center justify-between w-2/12">
                        {option.ven_code}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>
  );
}
