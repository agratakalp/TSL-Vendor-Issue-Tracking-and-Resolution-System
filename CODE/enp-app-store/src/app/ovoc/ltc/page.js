import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import {
  Paper,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  Dialog,
  Button,
} from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";
import JSZip from "jszip";
import Loader from "../../../components/loader";
import AlertDialog from "../../../components/alertDialog";

function LTC() {
  const [load, setLoad] = useState(false);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const ADID = JSON.parse(sessionStorage.getItem("userData")).ADID;
  const currentDay = new Date().getDate();
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const currentDate = `${currentYear}-${currentMonth}-${currentDay}`;
  const [vendorCodes, setVendorCodes] = useState([]);
  const [vendorSelect, setVendorSelect] = useState("");
  const [vendorName, setVendorName] = useState();
  const [vendorAddress, setVendorAddress] = useState();
  const [vendorEmail, setVendorEmail] = useState();
  const [vendorMobile, setVendorMobile] = useState();
  const [conCategory, setConCategory] = useState();
  const [mode, setMode] = useState("N");
  const [warn, setWarn] = useState();
  const [head, setHead] = useState();
  const [types, setTypes] = useState();
  const [prevTypes, setPrevTypes] = useState();
  const [message, setMessage] = useState("don't exist");
  const [yearsSelect, setYearsSelect] = useState(0);
  const [monthsSelect, setMonthsSelect] = useState(0);
  const implementationDate = new Date("2024-03-25");
  const [ltaAfterImp, setLtaAfterImp] = useState();
  const [prevLtaAfterImp, setPrevLtaAfterImp] = useState();
  const [selectedLtc, setSelectedLtc] = useState();
  const [arcContractDetails, setArcContractDetails] = useState();
  const [scope, setScope] = useState();
  const [intro, setIntro] = useState();
  const [deviationsLabel, setDeviationsLabel] = useState();
  const [prevDeviationsLabel, setPrevDeviationsLabel] = useState();
  const [ltcVersion, setLtcVersion] = useState();
  const [ready, setReady] = useState(false);
  const [chkList, setChkList] = useState([]);
  const [otc, setOtc] = useState("");
  const [osc, setOsc] = useState("");
  const [deviationsFiles, setDeviationsFiles] = useState([]);
  const [disableDeviationsFiles, setDisableDeviationsFiles] = useState(true);
  const [vendorSignedFiles, setVendorSignedFiles] = useState([]);
  const [disableVendorSignedFiles, setDisableVendorSignedFiles] =
    useState(true);
  const [vendorSharedFiles, setVendorSharedFiles] = useState([]);
  const [disableVendorSharedFiles, setDisableVendorSharedFiles] =
    useState(true);
  const [appDet, setAppDet] = useState();
  const [appArcDet, setAppArcDet] = useState();
  const [employeesP, setEmployeesP] = useState([]);
  const [employeesAP, setEmployeesAP] = useState([]);
  const [employeesV, setEmployeesV] = useState([]);
  const [employeesR1, setEmployeesR1] = useState([]);
  const [employeesR2, setEmployeesR2] = useState([]);
  const [employeesA, setEmployeesA] = useState([]);
  const [employeesANd, setEmployeesANd] = useState([]);
  const [approverMat, setApproverMat] = useState({
    proposer: "",
    proposerRole: "",
    PEmail: "",
    addproposer: "",
    addproposerRole: "",
    APEmail: "",
    verifier: "",
    verifierRole: "",
    VEmail: "",
    recommender1: "",
    recommender1Role: "",
    R1Email: "",
    recommender2: "",
    recommender2Role: "",
    R2Email: "",
    approver: "",
    approverRole: "",
    AEmail: "",
  });
  const [sucFlag, setSucFlag] = useState(false);
  const [sucVsFFlag, setSucVsFFlag] = useState();
  const [vsFFlag, setVsFFlag] = useState();
  const [sucVsgFFlag, setSucVsgFFlag] = useState();
  const [vsgFFlag, setVsgFFlag] = useState();
  const [sucDFFlag, setSucDFFlag] = useState();
  const [dFFlag, setDFFlag] = useState();
  const [toastMessage, setToastMessage] = useState();
  const [errors, setErrors] = useState({});
  const [checkChkListFlags, setCheckChkListFlags] = useState(false);
  const toastId = React.useRef(null);
  const [open, setOpen] = useState();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toString().substring(0, 15);
  };

  useEffect(() => {
    const fetchUser = async () => {
      setLoad(true);
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/get/empDet`,
          {
            ADID: ADID,
          }
        );
        setName(response.data.data.USERNAME);
        setEmail(response.data.data.EMAIL);
      } catch (error) {
        console.error("Failed to fetch User:", error);
      }
      setLoad(false);
    };
    fetchUser();
  }, [ADID]);

  useEffect(() => {
    // Function to fetch vendor codes from the backend
    const fetchVendorCodes = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/get/vCode`
        );
        setVendorCodes(response.data.data);
      } catch (error) {
        console.error("Failed to fetch vendor codes:", error);
      }
    };
    fetchVendorCodes();
  }, []);
  const defaultProps = {
    options: vendorCodes,
    getOptionLabel: (option) => option.INV_VENDOR_CODE,
  };

  const handleVendorClick = async () => {
    setLoad(true);
    try {
      let vDetailsUrl = process.env.REACT_APP_BACKEND_URL + "/get/vDetails";
      const response = await axios.post(vDetailsUrl, {
        vCode: vendorSelect,
      });
      setVendorName(response.data.data[0].INV_NAME);
      setVendorAddress(response.data.data[0].VM_ADDRESS);
      setVendorEmail(response.data.data[0].inv_ven_email);
      setVendorMobile(response.data.data[0].INS_MOBILE_NO);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch vendor details");
    }
    setLoad(false);
  };

  const handleConCategory = (event) => {
    setTypes([]);
    setLtaAfterImp(true);
    setMode("N");
    setDisableDeviationsFiles(true);
    setDisableVendorSharedFiles(true);
    setDisableVendorSignedFiles(true);
    setSelectedLtc();
    setScope();
    setIntro();
    setDeviationsLabel();
    setLtcVersion();
    setReady(false);
    setChkList([]);
    setCheckChkListFlags(false);
    setOtc("");
    setOsc("");
    setDeviationsFiles([]);
    setVendorSharedFiles([]);
    setVendorSignedFiles([]);
    setApproverMat({
      proposer: "",
      proposerRole: "",
      PEmail: "",
      addproposer: "",
      addproposerRole: "",
      APEmail: "",
      verifier: "",
      verifierRole: "",
      VEmail: "",
      recommender1: "",
      recommender1Role: "",
      R1Email: "",
      recommender2: "",
      recommender2Role: "",
      R2Email: "",
      approver: "",
      approverRole: "",
      AEmail: "",
    });
    setAppArcDet();
    setConCategory(event.target.value);
  };

  useEffect(() => {
    const fetchTypes = async () => {
      setLoad(true);
      try {
        let rowsUri = process.env.REACT_APP_BACKEND_URL + "/get/availContracts";
        const response = await axios.post(rowsUri, {
          Category: conCategory,
          VCode: vendorSelect,
        });
        if (response.data.data.length > 0) {
          setMessage("exist");
          setTypes(response.data.data);
          setPrevTypes(response.data.data);
        } else if (conCategory === "Standard") {
          setMessage("don't exist");
          setTypes([
            {
              checked: false,
              cc_con_sub_cat: "Supply",
              cc_flag: 0,
              cc_con_t_years: 0,
              cc_con_t_months: 0,
              cc_con_s_date: null,
              cc_con_e_date: null,
            },
            {
              checked: false,
              cc_con_sub_cat: "Engg",
              cc_flag: 0,
              cc_con_t_years: 0,
              cc_con_t_months: 0,
              cc_con_s_date: null,
              cc_con_e_date: null,
            },
            {
              checked: false,
              cc_con_sub_cat: "Works",
              cc_flag: 0,
              cc_con_t_years: 0,
              cc_con_t_months: 0,
              cc_con_s_date: null,
              cc_con_e_date: null,
            },
            {
              checked: false,
              cc_con_sub_cat: "Erec",
              cc_flag: 0,
              cc_con_t_years: 0,
              cc_con_t_months: 0,
              cc_con_s_date: null,
              cc_con_e_date: null,
            },
            {
              checked: false,
              cc_con_sub_cat: "Supervision",
              cc_flag: 0,
              cc_con_t_years: 0,
              cc_con_t_months: 0,
              cc_con_s_date: null,
              cc_con_e_date: null,
            },
            {
              checked: false,
              cc_con_sub_cat: "PMC",
              cc_flag: 0,
              cc_con_t_years: 0,
              cc_con_t_months: 0,
              cc_con_s_date: null,
              cc_con_e_date: null,
            },
            {
              checked: false,
              cc_con_sub_cat: "EPC",
              cc_flag: 0,
              cc_con_t_years: 0,
              cc_con_t_months: 0,
              cc_con_s_date: null,
              cc_con_e_date: null,
            },
          ]);
        } else if (conCategory === "Small") {
          setMessage("don't exist");
          setTypes([
            {
              checked: false,
              cc_con_sub_cat: "Supply",
              cc_flag: 0,
              cc_con_t_years: 0,
              cc_con_t_months: 0,
              cc_con_s_date: null,
              cc_con_e_date: null,
            },
            {
              checked: false,
              cc_con_sub_cat: "Service",
              cc_flag: 0,
              cc_con_t_years: 0,
              cc_con_t_months: 0,
              cc_con_s_date: null,
              cc_con_e_date: null,
            },
            {
              checked: false,
              cc_con_sub_cat: "Manpower",
              cc_flag: 0,
              cc_con_t_years: 0,
              cc_con_t_months: 0,
              cc_con_s_date: null,
              cc_con_e_date: null,
            },
          ]);
        }
      } catch (error) {
        console.log("Failed to fetch types", error);
      }
      setLoad(false);
    };
    fetchTypes();
  }, [conCategory, vendorSelect]);

  const handleInputChange = (rowIndex, type, value) => {
    const newRows = [...types];
    if (
      type === "checked" ||
      type === "cc_con_t_years" ||
      type === "cc_con_t_months" ||
      type === "cc_con_s_date" ||
      type === "cc_con_e_date"
    ) {
      newRows[rowIndex][type] = value;
      if (
        newRows[rowIndex].checked == 1 &&
        (newRows[rowIndex].cc_con_t_years > 0 ||
          newRows[rowIndex].cc_con_t_months > 0) &&
        newRows[rowIndex].cc_con_s_date !== "null" &&
        newRows[rowIndex].cc_con_s_date !== null &&
        newRows[rowIndex].cc_con_s_date !== "" &&
        newRows[rowIndex].cc_con_e_date !== "null" &&
        newRows[rowIndex].cc_con_e_date !== null &&
        newRows[rowIndex].cc_con_e_date !== ""
      ) {
        newRows[rowIndex]["cc_flag"] = 1;
      } else {
        newRows[rowIndex]["cc_flag"] = 0;
        if (newRows[rowIndex].checked == 0) {
          newRows[rowIndex]["cc_con_t_years"] = 0;
          newRows[rowIndex]["cc_con_t_months"] = 0;
          newRows[rowIndex]["cc_con_s_date"] = null;
          newRows[rowIndex]["cc_con_e_date"] = null;
        }
      }
    }
    setTypes(newRows);
  };

  const handleDates = async (index, sDate, years, months) => {
    handleInputChange(index, "cc_con_s_date", sDate);
    let date = typeof sDate === "string" ? new Date(sDate) : sDate;
    for (var obj of types) {
      if (obj.cc_con_s_date != null) {
        let dateObj = new Date(obj?.cc_con_s_date);
        if (dateObj < implementationDate) {
          setLtaAfterImp(false);
          // setHead("LTC prior implementation");
          // setWarn(`LTC will be executed prior to implementation date and approval matrix captured will reduce to 3 level.

          // Do you wish to proceed?`);
          break;
        }
        if (dateObj >= implementationDate) {
          setLtaAfterImp(true);
        }
      }
    }
    // Add the years and months to the date
    date.setFullYear(date.getFullYear() + years);
    date.setMonth(date.getMonth() + months);
    let eDate = date.toISOString().split("T")[0]; // Return the end date in ISO format (YYYY-MM-DD)
    handleInputChange(index, "cc_con_e_date", eDate);
  };

  useEffect(() => {
    const updateChildParams = async () => {
      setLoad(true);
      if (types[0]?.con_status === 1) {
        setMode("R");
        setDisableDeviationsFiles(true);
        setDisableVendorSharedFiles(true);
        setDisableVendorSignedFiles(true);
        setHead("Returned LTC");
        setWarn(`
        LTC against vendor already exist under selected category and is returned by one of approvers.
        
        Do you wish to edit?`);
      } else if (types[0]?.con_status === 2) {
        setMode("A");
        setDisableDeviationsFiles(true);
        setDisableVendorSharedFiles(true);
        setDisableVendorSignedFiles(true);
        setHead("Change in Existing LTC?");
        setWarn(`
        This action will overwrite existing LTC Form initiated by ${types[0]?.con_modify_by} for the vendor partner. Please submit LTC Form for all prevalent long term agreements with the vendor partner along with the date of their respective validity.
        
        Do you wish to proceed?`);
      } else if (types[0]?.con_status === 0) {
        setMode("UA");
        setDisableDeviationsFiles(true);
        setDisableVendorSharedFiles(true);
        setDisableVendorSignedFiles(true);
        setHead("LTC under approval");
        setWarn(`
        LTC against vendor already exist under selected category and is under approval. Initiated by ${types[0]?.con_modify_by}.
        
        Click "No" to move back.`);
      } else {
        setMode("N");
        setDisableDeviationsFiles(true);
        setDisableVendorSharedFiles(true);
        setDisableVendorSignedFiles(true);
      }
      const fetchArcContract = async () => {
        try {
          const responseArcConDet = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/get/arcContractDetails`,
            {
              ContractId: types[0]?.cc_con_id,
            }
          );
          if (responseArcConDet?.length > 0) {
            setArcContractDetails(responseArcConDet.data.data);
          }
        } catch (error) {
          console.log("No previous details found to approve", error);
        }
      };
      fetchArcContract();
      setLoad(false);
    };

    if (types?.length > 0) {
      if (message === "exist") {
        updateChildParams();
        setSelectedLtc(types[0]?.cc_con_id);
        setLtaAfterImp(types[0]?.con_ltaAfImp);
        setPrevLtaAfterImp(types[0]?.con_ltaAfImp);
        setLtcVersion(types[0]?.con_version);
        setDeviationsLabel(types[0]?.con_l_dev_flag);
        setPrevDeviationsLabel(types[0]?.con_l_dev_flag);
        setIntro(types[0]?.con_intro);
        setScope(types[0]?.con_scope);
        setOtc(types[0]?.con_otc);
        setOsc(types[0]?.con_osc);
      } else {
        setMode("N");
        setDisableDeviationsFiles(true);
        setDisableVendorSharedFiles(true);
        setDisableVendorSignedFiles(true);
        setSelectedLtc();
        setLtcVersion();
        setDeviationsLabel();
        setIntro();
        setScope();
        setOtc("");
        setOsc("");
        return;
      }
    }
  }, [message]);

  useEffect(() => {
    const assignReady = () => {
      for (const obj of types) {
        if (obj.cc_flag == 1 || obj.cc_flag == true) {
          setReady(true);
          break;
        } else {
          setReady(false);
        }
      }
    };
    if (types?.length > 0) {
      assignReady();
    }
  }, [types]);

  function autoResize(event) {
    event.target.style.height = "auto";
    event.target.style.height = event.target.scrollHeight + "px";
  }

  useEffect(() => {
    const fetchChkList = async () => {
      setLoad(true);
      try {
        let rowsUri = process.env.REACT_APP_BACKEND_URL + "/get/rows";
        const response = await axios.post(rowsUri, {
          Category: conCategory,
          ConId:
            selectedLtc !== undefined &&
            mode == "A" &&
            deviationsLabel == prevDeviationsLabel
              ? selectedLtc
              : selectedLtc !== undefined &&
                mode == "R" &&
                deviationsLabel == prevDeviationsLabel
              ? selectedLtc
              : 0,
        });
        setChkList(response.data.data);
      } catch (error) {
        console.log("Failed to fetch rows", error);
      }
      setLoad(false);
    };
    fetchChkList();
  }, [conCategory, selectedLtc, deviationsLabel]);

  const handleChkInputChange = (rowIndex, type, value) => {
    const newRows = [...chkList];
    if (type === "document" || type === "flag" || type === "remarks") {
      newRows[rowIndex][type] = value;
    }
    setChkList(newRows);
  };

  const checkForChildRow = (rowIndex) => {
    if (
      rowIndex + 1 < chkList.length &&
      chkList[rowIndex].lv1 === chkList[rowIndex + 1].lv1
    ) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    const fetchAppDet = async () => {
      try {
        const responseAppDet = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/get/contractApprovers`,
          {
            ContractId: selectedLtc !== undefined ? selectedLtc : 0,
          }
        );
        if (responseAppDet) {
          setAppDet(responseAppDet.data.data);
        }
      } catch (error) {
        console.log("No details found to approve", error);
      }
    };
    const fetchAppArcDet = async () => {
      try {
        const responseAppDet = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/get/contractApproversA`,
          {
            ContractId: selectedLtc !== undefined ? selectedLtc : 0,
          }
        );
        if (responseAppDet) {
          setAppArcDet(responseAppDet.data.data);
          //console.log(responseAppDet.data.data);
        }
      } catch (error) {
        console.log("No details found to approve", error);
      }
    };
    if (selectedLtc !== undefined && mode === "R") {
      setLoad(true);
      fetchAppDet();
      fetchAppArcDet();
      setLoad(false);
    }
  }, [selectedLtc, mode]);

  useEffect(() => {
    if (
      deviationsLabel === prevDeviationsLabel &&
      ltaAfterImp === prevLtaAfterImp
    ) {
      appDet?.forEach((obj) => {
        if (obj.cam_role === "Proposer") {
          setApproverMat((prevState) => ({
            ...prevState,
            proposer: obj.cam_approver,
            proposerRole: obj.cam_app_role,
            PEmail: obj.cam_app_email,
          }));
        }
        if (obj.cam_role === "Additional Proposer") {
          setApproverMat((prevState) => ({
            ...prevState,
            addproposer: obj.cam_approver,
            addproposerRole: obj.cam_app_role,
            APEmail: obj.cam_app_email,
          }));
        }
        if (obj.cam_role === "Verifier") {
          setApproverMat((prevState) => ({
            ...prevState,
            verifier: obj.cam_approver,
            verifierRole: obj.cam_app_role,
            VEmail: obj.cam_app_email,
          }));
        }
        if (obj.cam_role === "Recommender #1") {
          setApproverMat((prevState) => ({
            ...prevState,
            recommender1: obj.cam_approver,
            recommender1Role: obj.cam_app_role,
            R1Email: obj.cam_app_email,
          }));
        }
        if (obj.cam_role === "Recommender #2") {
          setApproverMat((prevState) => ({
            ...prevState,
            recommender2: obj.cam_approver,
            recommender2Role: obj.cam_app_role,
            R2Email: obj.cam_app_email,
          }));
        }
        if (obj.cam_role === "Approver") {
          setApproverMat((prevState) => ({
            ...prevState,
            approver: obj.cam_approver,
            approverRole: obj.cam_app_role,
            AEmail: obj.cam_app_email,
          }));
        }
      });
    } else {
      appDet?.forEach((obj) => {
        if (obj.cam_role === "Proposer") {
          setApproverMat((prevState) => ({
            ...prevState,
            proposer: "",
            proposerRole: "",
            PEmail: "",
          }));
        }
        if (obj.cam_role === "Additional Proposer") {
          setApproverMat((prevState) => ({
            ...prevState,
            addproposer: "",
            addproposerRole: "",
            APEmail: "",
          }));
        }
        if (obj.cam_role === "Verifier") {
          setApproverMat((prevState) => ({
            ...prevState,
            verifier: "",
            verifierRole: "",
            VEmail: "",
          }));
        }
        if (obj.cam_role === "Recommender #1") {
          setApproverMat((prevState) => ({
            ...prevState,
            recommender1: "",
            recommender1Role: "",
            R1Email: "",
          }));
        }
        if (obj.cam_role === "Recommender #2") {
          setApproverMat((prevState) => ({
            ...prevState,
            recommender2: "",
            recommender2Role: "",
            R2Email: "",
          }));
        }
        if (obj.cam_role === "Approver") {
          setApproverMat((prevState) => ({
            ...prevState,
            approver: "",
            approverRole: "",
            AEmail: "",
          }));
        }
      });
    }
  }, [appDet, deviationsLabel, ltaAfterImp]);

  useEffect(() => {
    const fetchEmployeesP = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/get/empAll`
        );
        setEmployeesP(response.data.data);
      } catch (error) {
        console.log("Contract id can't be generated", error);
      }
    };
    // const fetchEmployeesAP = async () => {
    //   try {
    //     const response = await axios.post(
    //       `${process.env.REACT_APP_BACKEND_URL}/get/empAllLv`,
    //       {
    //         level1: 3,
    //         level2: 0,
    //       }
    //     );
    //     setEmployeesAP(response.data.data);
    //   } catch (error) {
    //     console.log("Contract id can't be generated", error);
    //   }
    // };
    const fetchEmployeesV = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/get/empCon`,
          {
            level1: 3,
            level2: 4,
          }
        );
        setEmployeesV(response.data.data);
      } catch (error) {
        console.log("Contract id can't be generated", error);
      }
    };
    const fetchEmployeesR1 = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/get/empCom`,
          {
            level1: 2,
            level2: 3,
          }
        );
        setEmployeesR1(response.data.data);
      } catch (error) {
        console.log("Contract id can't be generated", error);
      }
    };
    const fetchEmployeesR2 = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/get/empCon`,
          {
            level1: 1,
            level2: 2,
          }
        );
        setEmployeesR2(response.data.data);
      } catch (error) {
        console.log("Contract id can't be generated", error);
      }
    };
    const fetchEmployeesA = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/get/empCom`,
          {
            level1: 1,
            level2: 2,
          }
        );
        setEmployeesA(response.data.data);
      } catch (error) {
        console.log("Contract id can't be generated", error);
      }
    };
    const fetchEmployeesANd = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/get/empCom`,
          {
            level1: 3,
            level2: 0,
          }
        );
        setEmployeesAP(response.data.data);
        setEmployeesANd(response.data.data);
      } catch (error) {
        console.log("Contract id can't be generated", error);
      }
    };
    if (mode === "A" || mode === "N") {
      setLoad(true);
      fetchEmployeesP();
      //fetchEmployeesAP();
      fetchEmployeesV();
      fetchEmployeesR1();
      fetchEmployeesR2();
      fetchEmployeesA();
      fetchEmployeesANd();
      setLoad(false);
    }
  }, [mode]);
  const defaultEmployeesP = {
    options: employeesP,
    getOptionLabel: (option) => option.EMPLOYEE,
  };
  const defaultEmployeesAP = {
    options: employeesAP,
    getOptionLabel: (option) => option.EMPLOYEE,
  };
  const defaultEmployeesV = {
    options: employeesV,
    getOptionLabel: (option) => option.EMPLOYEE,
  };
  const defaultEmployeesR1 = {
    options: employeesR1,
    getOptionLabel: (option) => option.EMPLOYEE,
  };
  const defaultEmployeesR2 = {
    options: employeesR2,
    getOptionLabel: (option) => option.EMPLOYEE,
  };
  const defaultEmployeesA = {
    options: employeesA,
    getOptionLabel: (option) => option.EMPLOYEE,
  };
  const defaultEmployeesANd = {
    options: employeesANd,
    getOptionLabel: (option) => option.EMPLOYEE,
  };

  const handleApprovalMat = async (type, value, role, mail) => {
    if (
      type === "proposer" ||
      type === "addproposer" ||
      type === "verifier" ||
      type === "recommender1" ||
      type === "recommender2" ||
      type === "approver"
    ) {
      await setApproverMat((prevState) => ({
        ...prevState,
        [type]: value,
      }));
    }
    if (type === "proposer") {
      setApproverMat((prevState) => ({
        ...prevState,
        proposerRole: role,
        PEmail: mail,
      }));
    }
    if (type === "addproposer") {
      setApproverMat((prevState) => ({
        ...prevState,
        addproposerRole: role,
        APEmail: mail,
      }));
    }
    if (type === "verifier") {
      setApproverMat((prevState) => ({
        ...prevState,
        verifierRole: role,
        VEmail: mail,
      }));
    }
    if (type === "recommender1") {
      setApproverMat((prevState) => ({
        ...prevState,
        recommender1Role: role,
        R1Email: mail,
      }));
    }
    if (type === "recommender2") {
      setApproverMat((prevState) => ({
        ...prevState,
        recommender2Role: role,
        R2Email: mail,
      }));
    }
    if (type === "approver") {
      setApproverMat((prevState) => ({
        ...prevState,
        approverRole: role,
        AEmail: mail,
      }));
    }
  };

  const handleVendorSharedFilesChange = (event) => {
    const files = Array.from(event.target.files);
    const docxFiles = files.filter(
      (file) =>
        file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    if (docxFiles.length !== files.length) {
      console.log("Only docx files are allowed!");
      toast.error("Only docx files are allowed");
      event.target.value(null);
    } else {
      setVendorSharedFiles(docxFiles);
    }
  };

  const handleVendorSignedFilesChange = (event) => {
    const files = Array.from(event.target.files);
    const pdfFiles = files.filter((file) => file.type === "application/pdf");
    if (pdfFiles.length !== files.length) {
      console.log("Only pdf files are allowed!");
      toast.error("Only pdf files are allowed");
      event.target.value(null);
    } else {
      setVendorSignedFiles(pdfFiles);
    }
  };

  const handleDeviationsFileChange = (event) => {
    const files = Array.from(event.target.files);
    const pdfFiles = files.filter((file) => file.type === "application/pdf");
    if (pdfFiles.length !== files.length && files.length === 1) {
      console.log("Only one pdf file are allowed!");
      toast.error("Only one pdf file are allowed");
      event.target.value(null);
    } else {
      setDeviationsFiles(pdfFiles);
    }
  };

  const zipFiles = async (files) => {
    const zip = new JSZip();
    Array.from(files).forEach((file, index) => {
      zip.file(file.name, file);
    });
    const content = await zip.generateAsync({ type: "blob" });
    return content;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setOpen(false);
    let tempErrors = {};
    let k = 0;
    if (intro == undefined || intro == "") {
      tempErrors["intro"] = "Introduction is required";
    }
    if (scope == undefined || scope == "") {
      tempErrors["scope"] = "Scope is required";
    }
    setCheckChkListFlags(true);
    for (var obj of chkList) {
      let sl = obj.cl_sl;
      if (intro == undefined || intro == "") {
        toast.error("Missing mandatory field");
        k = 1;
        break;
      } else if (scope == undefined || scope == "") {
        toast.error("Missing mandatory field");
        k = 1;
        break;
      } else if (
        deviationsLabel == "Y" &&
        ((obj.lv2 != "null" && obj.lv2 != null) ||
          ((obj.lv2 == "null" || obj.lv2 == null) &&
            checkForChildRow(chkList.findIndex((obj) => obj.cl_sl === sl)) ===
              false)) &&
        (obj.flag == undefined || obj.flag == "" || obj.flag == null)
      ) {
        toast.error("Missing mandatory field");
        k = 1;
        break;
      } else if (
        deviationsLabel == "N" &&
        obj.edit &&
        ((obj.lv2 != "null" && obj.lv2 != null) ||
          ((obj.lv2 == "null" || obj.lv2 == null) &&
            checkForChildRow(chkList.findIndex((obj) => obj.cl_sl === sl)) ===
              false)) &&
        (obj.flag == undefined || obj.flag == "" || obj.flag == null)
      ) {
        toast.error("Missing mandatory field");
        k = 1;
        break;
      } else if (
        deviationsLabel == "Y" &&
        obj.flag == "N" &&
        ((obj.lv2 != "null" && obj.lv2 != null) ||
          ((obj.lv2 == "null" || obj.lv2 == null) &&
            checkForChildRow(chkList.findIndex((obj) => obj.cl_sl === sl)) ===
              false)) &&
        (obj.remarks == "null" ||
          obj.remarks == null ||
          obj.remarks == undefined ||
          obj.remarks == "")
      ) {
        toast.error("Missing mandatory field");
        k = 1;
        break;
      } else if (
        deviationsLabel == "N" &&
        obj.edit &&
        obj.flag == "N" &&
        ((obj.lv2 != "null" && obj.lv2 != null) ||
          ((obj.lv2 == "null" || obj.lv2 == null) &&
            checkForChildRow(chkList.findIndex((obj) => obj.cl_sl === sl)) ===
              false)) &&
        (obj.remarks == "null" ||
          obj.remarks == null ||
          obj.remarks == undefined ||
          obj.remarks == "")
      ) {
        toast.error("Missing mandatory field");
        k = 1;
        break;
      } else {
        k = 0;
      }
    }
    if (k === 1) {
      setErrors(tempErrors);
      return;
    } else if (ready == false) {
      toast.error("Missing mandatory type");
      return;
    } else {
      let uploadFlag =
        vendorSharedFiles.length !== 0 &&
        vendorSignedFiles.length !== 0 &&
        deviationsFiles.length !== 0;
      if (
        (mode !== "R" && uploadFlag == false) ||
        (mode === "R" &&
          disableVendorSharedFiles == false &&
          vendorSharedFiles.length === 0) ||
        (mode === "R" &&
          disableVendorSignedFiles == false &&
          vendorSignedFiles.length === 0) ||
        (mode === "R" &&
          disableDeviationsFiles == false &&
          deviationsFiles.length === 0)
      ) {
        toast.error("Attachments missing!");
        return;
      } else if (
        deviationsLabel === "N" &&
        (approverMat.proposer == "" ||
          approverMat.proposer == undefined ||
          approverMat.approver == "" ||
          approverMat.approver == undefined)
      ) {
        toast.error("Approval matrix incomplete!");
        return;
      } else if (
        deviationsLabel === "Y" &&
        ltaAfterImp &&
        (approverMat.proposer == "" ||
          approverMat.proposer == undefined ||
          approverMat.verifier == "" ||
          approverMat.verifier == undefined ||
          approverMat.recommender1 == "" ||
          approverMat.recommender1 == undefined ||
          approverMat.recommender2 == "" ||
          approverMat.recommender2 == undefined ||
          approverMat.approver == "" ||
          approverMat.approver == undefined)
      ) {
        toast.error("Approval matrix incomplete!");
        return;
      } else if (
        deviationsLabel === "Y" &&
        ltaAfterImp == false &&
        (approverMat.proposer == "" ||
          approverMat.proposer == undefined ||
          approverMat.verifier == "" ||
          approverMat.verifier == undefined ||
          approverMat.approver == "" ||
          approverMat.approver == undefined)
      ) {
        toast.error("Approval matrix incomplete!");
        return;
      } else {
        setLoad(true);
        setCheckChkListFlags(false);
        try {
          let createCrUri = process.env.REACT_APP_BACKEND_URL + "/put/createCr";
          let editCrUri = process.env.REACT_APP_BACKEND_URL + "/put/editRCr";
          let usedBy = `${ADID}|${name}`.substring(0, 20);
          if (mode === "N") {
            const response = await axios.post(createCrUri, {
              Category: conCategory,
              SubCategory: types,
              CreateDate: currentDate,
              Intro: intro,
              Scope: scope,
              CreateBy: usedBy,
              CreateEmail: email,
              VendorCode: vendorSelect,
              Version: 1,
              Deviation: deviationsLabel,
              LtaAfterImp: ltaAfterImp ? 1 : 0,
              Otc: otc,
              Osc: osc,
              Rows: chkList,
              lv: 1,
              Approvers: approverMat,
            });
            console.log(response.data.message);
            setToastMessage(response.data.message);
            setSelectedLtc(response.data.data.NewContractId);
            setSucFlag(true);
          }
          if (mode === "A" || mode === "R") {
            console.log("hello");
            const response = await axios.post(editCrUri, {
              ContractId: selectedLtc,
              Category: conCategory,
              SubCategory: types,
              ModifyDate: currentDate,
              ModifyBy: usedBy,
              ModifyEmail: email,
              Intro: intro,
              Scope: scope,
              VendorCode: vendorSelect,
              Ver: ltcVersion + 1,
              mode: mode,
              Deviation: deviationsLabel,
              LtaAfterImp: ltaAfterImp ? 1 : 0,
              Otc: otc,
              Osc: osc,
              Rows: chkList,
              lv: 1,
              Approvers: approverMat,
            });
            console.log(response.data.message);
            setToastMessage(response.data.message);
            setSucFlag(true);
          }
        } catch (error) {
          console.log(error);
          if (mode === "N") {
            toast.error("LTC Failed from server, mandatory field missing!");
          }
          if (mode === "A" || mode === "R") {
            toast.error("Modification in LTC failed from server!");
          }
          setLoad(false);
        }
      }
    }
  };

  useEffect(() => {
    setLoad(true);
    const uploadAttachments = async () => {
      const zipVsFiles = await zipFiles(vendorSharedFiles);
      const zipVsgFiles = await zipFiles(vendorSignedFiles);
      const zipDFile = await zipFiles(deviationsFiles);

      if (vendorSharedFiles.length !== 0) {
        const readerVsF = new FileReader();
        readerVsF.readAsDataURL(zipVsFiles);
        readerVsF.onload = async () => {
          const base64VsFile = readerVsF.result.split(",")[1];
          try {
            const responseVs = await axios.post(
              `${process.env.REACT_APP_BACKEND_URL}/attachments/uploadAttachments`,
              {
                VendorCode: vendorSelect,
                Version: mode === "N" ? 1 : ltcVersion + 1,
                uid: selectedLtc,
                file: base64VsFile,
                fileName: "Vendor Shared.zip",
              }
            );
            if (responseVs.status == 200) {
              console.log(responseVs.data.message);
              setSucVsFFlag(true);
            } else {
              setVsFFlag("fail");
              setSucVsFFlag(false);
              console.log(responseVs.data.message);
            }
          } catch (error) {
            setVsFFlag("fail");
            setSucVsFFlag(false);
            console.log("Error uploading file", error.message);
          }
        };
      }
      if (vendorSharedFiles.length === 0 && mode === "R") {
        setSucVsFFlag(true);
      }

      if (vendorSignedFiles.length !== 0) {
        const readerVsgF = new FileReader();
        readerVsgF.readAsDataURL(zipVsgFiles);
        readerVsgF.onload = async () => {
          const base64VsgFile = readerVsgF.result.split(",")[1];
          try {
            const responseVsg = await axios.post(
              `${process.env.REACT_APP_BACKEND_URL}/attachments/uploadAttachments`,
              {
                VendorCode: vendorSelect,
                Version: mode === "N" ? 1 : ltcVersion + 1,
                uid: selectedLtc,
                file: base64VsgFile,
                fileName: "Vendor Signed.zip",
              }
            );
            if (responseVsg.status == 200) {
              console.log(responseVsg.data.message);
              setSucVsgFFlag(true);
            } else {
              setVsgFFlag("fail");
              setSucVsgFFlag(false);
              console.log(responseVsg.data.message);
            }
          } catch (error) {
            setVsgFFlag("fail");
            setSucVsgFFlag(false);
            console.log("Error uploading file", error.message);
          }
        };
      }
      if (vendorSignedFiles.length === 0 && mode === "R") {
        setSucVsgFFlag(true);
      }

      if (deviationsFiles.length !== 0) {
        const readerDF = new FileReader();
        readerDF.readAsDataURL(zipDFile);
        readerDF.onload = async () => {
          const base64DFile = readerDF.result.split(",")[1];
          try {
            const responseDf = await axios.post(
              `${process.env.REACT_APP_BACKEND_URL}/attachments/uploadAttachments`,
              {
                VendorCode: vendorSelect,
                Version: mode === "N" ? 1 : ltcVersion + 1,
                uid: selectedLtc,
                file: base64DFile,
                fileName: "Final Deviations List.zip",
              }
            );
            if (responseDf.status == 200) {
              console.log(responseDf.data.message);
              setSucDFFlag(true);
            } else {
              setDFFlag("fail");
              setSucDFFlag(false);
              console.log(responseDf.data.message);
            }
          } catch (error) {
            setDFFlag("fail");
            setSucDFFlag(false);
            setLoad(false);
            console.log("Error uploading file", error.message);
          }
        };
      }
      if (deviationsFiles.length === 0 && mode === "R") {
        setSucDFFlag(true);
      }
    };
    if (
      selectedLtc != undefined &&
      sucFlag != false &&
      sucVsFFlag != true &&
      sucVsgFFlag != true &&
      sucDFFlag != true
    ) {
      uploadAttachments();
    }
  }, [selectedLtc, sucFlag]);

  useEffect(() => {
    const sendEmail = async () => {
      setLoad(true);
      try {
        let to = "";
        let id = 0;
        if (approverMat.proposer !== "" && approverMat.proposer !== undefined) {
          to = `${approverMat.PEmail}`;
          id = approverMat.proposer.split("|")[0];
        } else if (
          approverMat.addproposer !== "" &&
          approverMat.addproposer !== undefined
        ) {
          to = `${approverMat.APEmail}`;
          id = approverMat.addproposer.split("|")[0];
        } else if (
          approverMat.verifier !== "" &&
          approverMat.verifier !== undefined
        ) {
          to = `${approverMat.VEmail}`;
          id = approverMat.verifier.split("|")[0];
        } else if (
          approverMat.recommender1 !== "" &&
          approverMat.recommender1 !== undefined
        ) {
          to = `${approverMat.R1Email}`;
          id = approverMat.recommender1.split("|")[0];
        } else if (
          approverMat.recommender2 !== "" &&
          approverMat.recommender2 !== undefined
        ) {
          to = `${approverMat.R2Email}`;
          id = approverMat.recommender2.split("|")[0];
        } else {
          to = `${approverMat.AEmail}`;
          id = approverMat.approver.split("|")[0];
        }
        var subCatString = "";
        types.forEach((type) => {
          if (type.cc_flag == 1) {
            subCatString = subCatString + type.cc_con_sub_cat + ", ";
          }
        });
        if (mode === "N") {
          const response = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/send/genEmail`,
            {
              ADID: `${process.env.REACT_APP_ID}`,
              PASS: `${process.env.REACT_APP_PASS}`,
              TO: to,
              SUB: `LTC Form (New) - Request is awaiting your approval for ${vendorName}`,
              TXT: `
              Dear Sir/Ma'am,

              Please find below details
              LTC ID :  ${selectedLtc}/V1
              Registered By	:  ${name} (${ADID})
              Registered Date	:  ${formatDate(currentDate)}
              Vendor Name :  ${vendorName} (${vendorSelect})
              Category of contract :  ${conCategory}
              LTC Sub category :  ${subCatString}
              Current Status	:  Pending for approval with (${id})

              Click/Copy the below url to your browser
              ${process.env.REACT_APP_FRONTEND_URL}/ovoc/cr/${id}/${selectedLtc}
              
              Regards,
              IPMS Team
              
              ****This is a system generated mail****`,
            }
          );
          if (response.message == "Mail sent") {
            console.log(response.message);
            window.location.reload();
            setLoad(false);
          } else {
            console.log(response.message);
            window.location.reload();
            setLoad(false);
          }
        }
        if (mode === "A") {
          const response1 = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/send/genEmail`,
            {
              ADID: `${process.env.REACT_APP_ID}`,
              PASS: `${process.env.REACT_APP_PASS}`,
              TO: to,
              SUB: `LTC Form (Modification) - Request is awaiting your approval for ${vendorName}`,
              TXT: `
              Dear Sir/Ma'am,

              Please find below details
              Last approved Request ID :  ${selectedLtc}/V${ltcVersion}
              Last registered by :  ${types[0]?.con_modify_by}
              Last registered date :  ${formatDate(types[0]?.con_modify_date.split("T")[0])}
              New Request ID :  ${selectedLtc}/V${ltcVersion + 1}
              Registered By	:  ${name} (${ADID})
              Registered Date	:  ${formatDate(currentDate)}
              Vendor Name :  ${vendorName} (${vendorSelect})
              Category of contract :  ${conCategory}
              LTC Sub category :  ${subCatString}
              Current Status	:  Pending for approval with (${id})

              Click/Copy the below url to your browser
              ${process.env.REACT_APP_FRONTEND_URL}/ovoc/cr/${id}/${selectedLtc}
              
              Regards,
              IPMS Team
              
              ****This is a system generated mail****`,
            }
          );
          const response2 = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/send/genEmail`,
            {
              ADID: `${process.env.REACT_APP_ID}`,
              PASS: `${process.env.REACT_APP_PASS}`,
              TO: types[0]?.con_modify_email,
              SUB: `LTC Form (Modification) - Request is modified for ${vendorName}`,
              TXT: `
              Dear Sir/Ma'am,

              Please find below details
              Below mentioned request ID is initiated for modification in existing LTC Form for ${vendorName}, this is for your information.
              Last approved Request ID :  ${selectedLtc}/V${ltcVersion}
              Last registered by :  ${types[0]?.con_modify_by}
              Last registered date :  ${formatDate(types[0]?.con_modify_date.split("T")[0])}
              New Request ID :  ${selectedLtc}/V${ltcVersion + 1}
              Registered By	:  ${name} (${ADID})
              Registered Date	:  ${formatDate(currentDate)}
              Vendor Name :  ${vendorName} (${vendorSelect})
              Category of contract :  ${conCategory}
              LTC Sub category :  ${subCatString}
              Current Status	:  Pending for approval with (${id})
              
              Regards,
              IPMS Team
              
              ****This is a system generated mail****`,
            }
          );
          if (
            response1.message == "Mail sent" &&
            response2.message == "Mail sent"
          ) {
            console.log(response1.message);
            window.location.reload();
            setLoad(false);
          } else {
            console.log(response1.message);
            window.location.reload();
            setLoad(false);
          }
        }
        if (mode === "R") {
          var response = "";
          if (arcContractDetails == "undefined" || arcContractDetails == "") {
            response = await axios.post(
              `${process.env.REACT_APP_BACKEND_URL}/send/genEmail`,
              {
                ADID: `${process.env.REACT_APP_ID}`,
                PASS: `${process.env.REACT_APP_PASS}`,
                TO: to,
                SUB: `LTC Form (New) - Request is awaiting your approval for ${vendorName}`,
                TXT: `
                Dear Sir/Ma'am,
  
                Please find below details
                LTC ID :  ${selectedLtc}/V${ltcVersion + 1}
                Registered By	:  ${name} (${ADID})
                Registered Date	:  ${formatDate(currentDate)}
                Vendor Name :  ${vendorName} (${vendorSelect})
                Category of contract :  ${conCategory}
                LTC Sub category :  ${subCatString}
                Current Status	:  Pending for approval with (${id})
  
                Click/Copy the below url to your browser
                ${
                  process.env.REACT_APP_FRONTEND_URL
                }/ovoc/cr/${id}/${selectedLtc}
                
                Regards,
                IPMS Team
                
                ****This is a system generated mail****`,
              }
            );
          } else {
            response = await axios.post(
              `${process.env.REACT_APP_BACKEND_URL}/send/genEmail`,
              {
                ADID: `${process.env.REACT_APP_ID}`,
                PASS: `${process.env.REACT_APP_PASS}`,
                TO: to,
                SUB: `LTC Form (Modification) - Request is awaiting your approval for ${vendorName}`,
                TXT: `
                Dear Sir/Ma'am,
  
                Please find below details
                Last approved Request ID :  ${selectedLtc}/V${
                  arcContractDetails[0]?.con_version
                }
                Last registered by :  ${arcContractDetails[0]?.con_modify_by}
                Last registered date :  ${
                  formatDate(arcContractDetails[0]?.con_modify_date.split("T")[0])
                }
                New Request ID :  ${selectedLtc}/V${ltcVersion + 1}
                Registered By	:  ${name} (${ADID})
                Registered Date	:  ${formatDate(currentDate)}
                Vendor Name :  ${vendorName} (${vendorSelect})
                Category of contract :  ${conCategory}
                LTC Sub category :  ${subCatString}
                Current Status	:  Pending for approval with (${id})
  
                Click/Copy the below url to your browser
                ${
                  process.env.REACT_APP_FRONTEND_URL
                }/ovoc/cr/${id}/${selectedLtc}
                
                Regards,
                IPMS Team
                
                ****This is a system generated mail****`,
              }
            );
          }
          if (response.message == "Mail sent") {
            console.log(response.message);
            window.location.reload();
            setLoad(false);
          } else {
            console.log(response.message);
            window.location.reload();
            setLoad(false);
          }
        }
      } catch (error) {
        console.log("Error in mail Sending", error);
        setTimeout(() => {
          window.location.reload();
          setLoad(false);
        }, 12000);
      }
    };
    if (
      selectedLtc != undefined &&
      sucFlag != false &&
      sucVsFFlag != undefined &&
      sucVsgFFlag != undefined &&
      sucDFFlag != undefined
    ) {
      if (sucFlag && sucVsFFlag && sucVsgFFlag && sucDFFlag) {
        toast.success(toastMessage);
        sendEmail();
        // setTimeout(() => {
        //   window.location.reload();
        //   setLoad(false);
        // }, 12000);
      } else if (
        sucFlag &&
        (vsFFlag == "fail" || vsgFFlag == "fail" || dFFlag == "fail")
      ) {
        axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/delete/newTransaction`,
          {
            ContractId: selectedLtc,
          }
        );
        setLoad(false);
      } else {
        toast.error("CR operation Failed!");
      }
    }
  }, [
    selectedLtc,
    sucFlag,
    sucVsFFlag,
    sucVsgFFlag,
    sucDFFlag,
    vsFFlag,
    vsgFFlag,
    dFFlag,
  ]);

  const handleTypeLock = async (index) => {
    debugger;
    let lock = 0;
    prevTypes.forEach((item, ind) => {
      if (ind == index && item.checked) {
        lock = 1;
      }
    });
    if (lock === 1) {
      return true;
    } else {
      return false;
    }
  };

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

  useEffect(() => {
    if (deviationsLabel === "N" && !toast.isActive(toastId.current)) {
      toastId.current = toast.info(
        "LTC effective prior to implementation of online LTC portal and No Deviation OR Deviation in Terms of payment and / or delivery schedule only. 2 Level approval matrix selected."
      );
    } else if (
      deviationsLabel === "Y" &&
      ltaAfterImp == false &&
      !toast.isActive(toastId.current)
    ) {
      toastId.current = toast.info(
        "LTC effective prior to implementation of online LTC portal and Any other deviation except Terms of Payment / Delivery Schedule. 3 Level approval matrix selected."
      );
    } else if (
      deviationsLabel === "Y" &&
      ltaAfterImp &&
      !toast.isActive(toastId.current)
    ) {
      toastId.current = toast.info(
        "LTC effective after implementation of online LTC portal and Any other deviation except Terms of Payment / Delivery Schedule. Approval matrix selected as per SOP."
      );
    }
  }, [deviationsLabel, ltaAfterImp]);

  return (
    <>
      {load && <Loader />}
      <ToastContainer position="top-center" className="mt-60" />
      <div className="flex-1 overflow-auto relative pt-16">
        <div className="bg-img absolute inset-0">
          <div className="absolute inset-0 bg-white opacity-85"></div>
          <div className="relative p-4 flex-col justify-between items-center">
            <div className="text-xl font-bold flex-grow text-center">
              Long Term Agreement on Commercial terms & conditions (LTC)
              Form&nbsp;
              {mode == "N" ? "(New Form)" : "(Modification in existing LTC)"}
            </div>
            <div className="flex justify-end w-full">
              {/* Created by Span */}
              <div className="relative mr-0.5 flex-col justify-between items-center">
                {/* Created by Span */}
                <div className="flex items-center">
                  <span className="text-black font-small">User:</span>
                  <span className="ml-2 text-black">
                    {name} ({ADID})
                  </span>
                </div>

                {/* Created on Span */}
                <div className="flex items-center">
                  <span className="text-black font-small">Date:</span>
                  <span className="ml-2 text-black">
                    {formatDate(currentDate)}
                  </span>
                </div>
              </div>
            </div>

            {/* Vendor Code textbox */}
            <div className="w-full md:flex mb-2 mt-4">
              <div className="md:w-1/3">
                <label
                  htmlFor="vendorCode"
                  className="ml-2 text-black font-small"
                >
                  Vendor Code<span className="text-red-500">*</span>
                </label>
              </div>
              <div class="md:2/3 flex items-center">
                <Autocomplete
                  className="p-0 rounded bg-white border border-gray-400 flex-grow"
                  {...defaultProps}
                  id="vendorCode"
                  disableClearable
                  onChange={(event, value) => {
                    setTypes([]);
                    setLtaAfterImp(true);
                    setMode("N");
                    setDisableVendorSharedFiles(true);
                    setDisableVendorSignedFiles(true);
                    setDisableDeviationsFiles(true);
                    setSelectedLtc();
                    setScope();
                    setIntro();
                    setDeviationsLabel();
                    setLtcVersion();
                    setReady(false);
                    setChkList([]);
                    setCheckChkListFlags(false);
                    setOtc("");
                    setOsc("");
                    setDeviationsFiles([]);
                    setVendorSharedFiles([]);
                    setVendorSignedFiles([]);
                    setApproverMat({
                      proposer: "",
                      proposerRole: "",
                      PEmail: "",
                      addproposer: "",
                      addproposerRole: "",
                      APEmail: "",
                      verifier: "",
                      verifierRole: "",
                      VEmail: "",
                      recommender1: "",
                      recommender1Role: "",
                      R1Email: "",
                      recommender2: "",
                      recommender2Role: "",
                      R2Email: "",
                      approver: "",
                      approverRole: "",
                      AEmail: "",
                    });
                    setAppArcDet();
                    setVendorName();
                    setVendorAddress();
                    setVendorEmail("");
                    setVendorMobile();
                    setConCategory();
                    setVendorSelect(value.INV_VENDOR_CODE.split("|")[0]);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      fullWidth
                      required
                      style={{ width: "300px" }}
                    />
                  )}
                />
                <button
                  className="ml-2 p-1 rounded bg-gray-300 hover:bg-orange-200"
                  onClick={handleVendorClick}
                >
                  Search
                </button>
              </div>
            </div>

            {/* Vendor Name display */}
            <div className="relative w-full md:flex mb-2">
              <div className="md:w-1/3">
                <label
                  htmlFor="vendorName"
                  className="ml-2 text-black font-small"
                >
                  Vendor Name
                </label>
              </div>
              <div className="md:w-2/3">
                <input
                  type="text"
                  id="vendorName"
                  value={vendorName}
                  placeholder="Vendor Name"
                  className="p-0 rounded w-full bg-gray-200 border border-gray-400"
                  disabled
                />
              </div>
            </div>

            {/* Vendor Address display */}
            <div className="relative w-full md:flex mb-2">
              <div className="md:w-1/3">
                <label
                  htmlFor="vendorAdd"
                  className="ml-2 text-black font-small"
                >
                  Vendor Address
                </label>
              </div>
              <div className="md:w-2/3">
                <input
                  type="text"
                  id="vendorAdd"
                  value={vendorAddress}
                  placeholder="Vendor Address"
                  className="p-0 rounded w-full bg-gray-200 border border-gray-400"
                  disabled
                />
              </div>
            </div>

            {/* Vendor Contact display */}
            <div className="relative w-full md:flex mb-2">
              <div className="md:w-1/3">
                <label
                  htmlFor="vendorEmail"
                  className="ml-2 text-black font-small"
                >
                  Vendor Email
                </label>
              </div>
              <div className="md:w-2/3">
                <input
                  type="text"
                  id="vendorEmail"
                  value={vendorEmail}
                  placeholder="Vendor Email"
                  className="p-0 rounded w-full bg-gray-200 border border-gray-400"
                  disabled
                />
              </div>
            </div>
            <div className="relative w-full md:flex mb-2">
              <div className="md:w-1/3">
                <label
                  htmlFor="vendorCon"
                  className="ml-2 text-black font-small"
                >
                  Vendor Contact
                </label>
              </div>
              <div className="md:w-2/3">
                <input
                  type="text"
                  id="vendorCon"
                  value={vendorMobile}
                  placeholder="Vendor Contact"
                  className="p-0 rounded w-full bg-gray-200 border border-gray-400"
                  disabled
                />
              </div>
            </div>

            <div className="relative w-full md:flex mb-2">
              <div className="md:w-1/3">
                <label
                  htmlFor="categoryOfCon"
                  className="ml-2 text-black font-small"
                >
                  Category of contract<span className="text-red-500">*</span>
                </label>
              </div>
              <div className="md:w-2/3">
                <RadioGroup
                  row
                  onChange={handleConCategory}
                  value={conCategory == undefined ? "" : conCategory}
                  required
                >
                  <FormControlLabel
                    className="ml-4"
                    value="Standard"
                    control={<Radio />}
                    label="Standard"
                  />
                  <FormControlLabel
                    className="ml-4"
                    value="Small"
                    control={<Radio />}
                    label="General Order"
                  />
                </RadioGroup>
              </div>
            </div>

            {/* Contract Sub Categories */}
            <AlertDialog Mode={mode} Head={head} Warn={warn} />
            <div className="relative w-full md:flex mb-2">
              <div className="md:w-1/3">
                <label className="ml-2 text-black font-small">
                  LTC Sub-Category<span className="text-red-500">*</span>
                </label>
              </div>
              <div className="md:w-2/3">
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead className="py-2 bg-blue-100">
                      <TableRow>
                        <TableCell
                          style={{
                            color: "black",
                            width: "10%",
                            fontWeight: "bold",
                            textAlign: "center",
                          }}
                        >
                          Add
                        </TableCell>
                        <TableCell
                          style={{
                            color: "black",
                            width: "20%",
                            fontWeight: "bold",
                            textAlign: "center",
                          }}
                        >
                          Type
                        </TableCell>
                        <TableCell
                          style={{
                            color: "black",
                            width: "10%",
                            fontWeight: "bold",
                            textAlign: "center",
                          }}
                        >
                          Years<span className="text-red-500">*</span>
                        </TableCell>
                        <TableCell
                          style={{
                            color: "black",
                            width: "10%",
                            fontWeight: "bold",
                            textAlign: "center",
                          }}
                        >
                          Months<span className="text-red-500">*</span>
                        </TableCell>
                        <TableCell
                          style={{
                            color: "black",
                            width: "25%",
                            fontWeight: "bold",
                            textAlign: "center",
                          }}
                        >
                          Start Date<span className="text-red-500">*</span>
                        </TableCell>
                        <TableCell
                          style={{
                            color: "black",
                            width: "25%",
                            fontWeight: "bold",
                            textAlign: "center",
                          }}
                        >
                          End Date<span className="text-red-500">*</span>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {types?.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell
                            style={{
                              color: "black",
                              width: "10%",
                              textAlign: "center",
                            }}
                          >
                            <Checkbox
                              checked={row.checked}
                              // disabled={
                              //   mode === "A" ? handleTypeLock(index) : false
                              // }
                              onChange={(e) => {
                                handleInputChange(
                                  index,
                                  "checked",
                                  e.target.checked
                                );
                              }}
                            />
                          </TableCell>
                          <TableCell
                            className="py-2 items-center justify-between w-2/12"
                            style={
                              row.cc_flag
                                ? {
                                    color: "green",
                                    width: "20%",
                                    textAlign: "center",
                                  }
                                : {
                                    color: "red",
                                    width: "20%",
                                    textAlign: "center",
                                  }
                            }
                          >
                            {row.cc_con_sub_cat}
                          </TableCell>
                          <TableCell
                            style={{
                              color: "black",
                              width: "20%",
                              textAlign: "center",
                            }}
                          >
                            <Autocomplete
                              id="tenureYears"
                              value={row.cc_con_t_years}
                              required
                              disabled={
                                mode === "UA" ||
                                ((mode === "N" ||
                                  mode === "A" ||
                                  mode === "R") &&
                                  row.checked == false)
                              }
                              options={[1, 2, 3, 4, 5]}
                              getOptionLabel={(option) => option.toString()}
                              onChange={(event, value) => {
                                setYearsSelect(value);
                                handleInputChange(
                                  index,
                                  "cc_con_t_years",
                                  value
                                );
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  variant="standard"
                                  fullWidth
                                  disabled={
                                    mode === "UA" ||
                                    ((mode === "N" ||
                                      mode === "A" ||
                                      mode === "R") &&
                                      row.checked == false)
                                  }
                                  required
                                />
                              )}
                            />
                          </TableCell>
                          <TableCell
                            style={{
                              color: "black",
                              width: "20%",
                              textAlign: "center",
                            }}
                          >
                            <Autocomplete
                              id="tenureMonths"
                              value={row.cc_con_t_months}
                              required
                              disabled={
                                mode === "UA" ||
                                ((mode === "N" ||
                                  mode === "A" ||
                                  mode === "R") &&
                                  row.checked == false)
                              }
                              options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]}
                              getOptionLabel={(option) => option.toString()}
                              onChange={(event, value) => {
                                setMonthsSelect(value);
                                handleInputChange(
                                  index,
                                  "cc_con_t_months",
                                  value
                                );
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  variant="standard"
                                  fullWidth
                                  disabled={
                                    mode === "UA" ||
                                    ((mode === "N" ||
                                      mode === "A" ||
                                      mode === "R") &&
                                      row.checked == false)
                                  }
                                  required
                                />
                              )}
                            />
                          </TableCell>
                          <TableCell
                            style={{
                              color: "black",
                              width: "25%",
                              textAlign: "center",
                            }}
                          >
                            <input
                              className="peer h-full w-full rounded-[7px] border border-blue-gray-200 bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 cursor-pointer"
                              type="date"
                              max={new Date().toISOString().split("T")[0]}
                              value={row.cc_con_s_date?.split("T")[0]}
                              placeholder="Start Date"
                              required
                              disabled={
                                mode === "UA" ||
                                ((mode === "N" ||
                                  mode === "A" ||
                                  mode === "R") &&
                                  row.checked == false)
                              }
                              onChange={(event) =>
                                handleDates(
                                  index,
                                  event.target.value,
                                  yearsSelect,
                                  monthsSelect
                                )
                              }
                            />
                          </TableCell>
                          <TableCell
                            style={{
                              color: "black",
                              width: "25%",
                              textAlign: "center",
                            }}
                          >
                            <input
                              className="peer h-full w-full rounded-[7px] border border-blue-gray-200 bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 cursor-pointer"
                              type="date"
                              value={row.cc_con_e_date?.split("T")[0]}
                              disabled={true}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </div>

            <div className="bg-transparent relative w-full md:flex mb-2">
              <div className="md:w-1/3">
                <label className="ml-2 text-black font-small">
                  Introduction<span className="text-red-500">*</span>
                </label>
              </div>
              <div className="md:w-2/3">
                <TextField
                  className="w-full p-1 bg-blue-50 rounded shadow-inner"
                  style={{ minHeight: "30px" }}
                  value={intro != undefined ? intro : ""}
                  required
                  multiline
                  error={!!errors.intro}
                  helperText={errors.intro}
                  onChange={(e) => {
                    setIntro(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="bg-transparent relative w-full md:flex mb-2">
              <div className="md:w-1/3">
                <label className="ml-2 text-black font-small">
                  Scope<span className="text-red-500">*</span>
                </label>
              </div>
              <div className="md:w-2/3">
                <TextField
                  className="w-full p-1 bg-blue-50 rounded shadow-inner"
                  value={scope != undefined ? scope : ""}
                  required
                  multiline
                  style={{ minHeight: "30px" }}
                  error={!!errors.scope}
                  helperText={errors.scope}
                  onChange={(e) => {
                    setScope(e.target.value);
                  }}
                />
              </div>
            </div>

            <div className="relative w-full md:flex mb-2">
              <div className="md:w-1/3">
                <label className="ml-2 text-black font-small">
                  Deviations<span className="text-red-500">*</span>
                </label>
              </div>
              <div className="md:w-2/3 flex-col">
                <RadioGroup
                  onChange={(event) => {
                    if (mode == "N") {
                      setChkList([]);
                    }
                    setCheckChkListFlags(false);
                    if (mode == "N" || mode == "A") {
                      setApproverMat({
                        proposer: "",
                        proposerRole: "",
                        PEmail: "",
                        addproposer: "",
                        addproposerRole: "",
                        APEmail: "",
                        verifier: "",
                        verifierRole: "",
                        VEmail: "",
                        recommender1: "",
                        recommender1Role: "",
                        R1Email: "",
                        recommender2: "",
                        recommender2Role: "",
                        R2Email: "",
                        approver: "",
                        approverRole: "",
                        AEmail: "",
                      });
                    }
                    // reset
                    setDeviationsLabel(event.target.value);
                    //             setHead("Approval matrix!!");
                    //             setWarn(`Approval matrix captured will reduce to 2 level.

                    // Do you wish to proceed?`);
                  }}
                  value={
                    deviationsLabel === "Y"
                      ? "Y"
                      : deviationsLabel === "N"
                      ? "N"
                      : ""
                  }
                  // value={deviationsLabel}
                  required
                >
                  <FormControlLabel
                    className="ml-4"
                    value="Y"
                    control={<Radio />}
                    label="Any other deviation except Terms of Payment / Delivery Schedule"
                  />
                  <FormControlLabel
                    className="ml-4"
                    value="N"
                    control={<Radio />}
                    label="No Deviation OR Deviation in Terms of payment and / or delivery schedule only"
                  />
                </RadioGroup>
              </div>
            </div>

            {/* check list */}
            <div className="relative w-full md:flex mb-2">
              <TableContainer component={Paper}>
                <Table>
                  <TableHead className="py-2 bg-blue-100">
                    <TableRow>
                      <TableCell
                        style={{
                          color: "blue",
                          width: "25%",
                          fontWeight: "bolder",
                          textAlign: "center",
                        }}
                      >
                        Clauses
                      </TableCell>
                      <TableCell
                        style={{
                          color: "blue",
                          width: "25%",
                          fontWeight: "bolder",
                          textAlign: "center",
                        }}
                      >
                        Tendor Documents
                      </TableCell>
                      <TableCell
                        style={{
                          color: "blue",
                          width: "50%",
                          fontWeight: "bolder",
                          textAlign: "center",
                        }}
                      >
                        Flags<span className="text-red-500">*</span>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {chkList?.map((row, rowIndex) => (
                      <TableRow key={rowIndex}>
                        <TableCell
                          style={{
                            width: "25%",
                            textWrap: "wrap",
                            fontWeight: row.lv2 === null ? "bolder" : "",
                            textAlign: "left",
                          }}
                        >
                          {row.lv2 === null ? row.lv1 + ". " : "  "}
                          {row.Clause}
                        </TableCell>
                        <TableCell style={{ width: "25%", textAlign: "left" }}>
                          {((deviationsLabel === "Y" && row.edit_dev) ||
                            (deviationsLabel === "N" && row.edit)) &&
                          false ? (
                            <textarea
                              className="w-full p-1 bg-blue-50 rounded shadow-md"
                              type="text"
                              style={{ minHeight: "30px" }}
                              value={
                                row.document === "null" ? "" : row.document
                              }
                              onChange={(e) =>
                                handleChkInputChange(
                                  rowIndex,
                                  "document",
                                  e.target.value
                                )
                              }
                              onInput={autoResize}
                            />
                          ) : (
                            <p>{row.document === "null" ? "" : row.document}</p>
                          )}
                        </TableCell>
                        <TableCell style={{ width: "50%" }}>
                          {(row.lv2 == "null" || row.lv2 == null) &&
                          checkForChildRow(rowIndex) ? (
                            ""
                          ) : (
                            <>
                              {checkChkListFlags &&
                                ((deviationsLabel == "Y" &&
                                  (row.flag == undefined || row.flag == "")) ||
                                  (deviationsLabel == "N" &&
                                    row.edit &&
                                    (row.flag == undefined ||
                                      row.flag == "")) ||
                                  (deviationsLabel == "Y" &&
                                    row.flag == "N" &&
                                    (row.remarks == "null" ||
                                      row.remarks == null ||
                                      row.remarks == undefined ||
                                      row.remarks == "")) ||
                                  (deviationsLabel == "N" &&
                                    row.edit &&
                                    row.flag == "N" &&
                                    (row.remarks == "null" ||
                                      row.remarks == null ||
                                      row.remarks == undefined ||
                                      row.remarks == ""))) && (
                                  <text className="text-red-500 text-xs">
                                    Required field missing!
                                  </text>
                                )}
                              <RadioGroup
                                row
                                value={
                                  deviationsLabel === "N" && row.edit == false
                                    ? "Y"
                                    : row.flag
                                }
                                onChange={(event) =>
                                  handleChkInputChange(
                                    rowIndex,
                                    "flag",
                                    event.target.value
                                  )
                                }
                                required
                              >
                                <FormControlLabel
                                  value="Y"
                                  control={<Radio />}
                                  label="Yes"
                                />
                                <FormControlLabel
                                  disabled={
                                    deviationsLabel === "N" && row.edit == false
                                  }
                                  value="N"
                                  control={<Radio />}
                                  label="No"
                                />
                                {row.na && (
                                  <FormControlLabel
                                    disabled={
                                      deviationsLabel === "N" &&
                                      row.edit == false
                                    }
                                    value="NA"
                                    control={<Radio />}
                                    label="NA"
                                  />
                                )}
                              </RadioGroup>
                              {(row.flag === "N" || row.flag === "NA") && (
                                <textarea
                                  className="w-full p-1 bg-blue-50 rounded shadow-md"
                                  type="text"
                                  value={
                                    row.remarks == "null" || row.remarks == null
                                      ? ""
                                      : row.remarks
                                  }
                                  disabled={
                                    deviationsLabel === "N" && row.edit == false
                                  }
                                  required={row.flag === "N" ? true : false}
                                  placeholder={
                                    row.flag === "N"
                                      ? "Remarks required"
                                      : "Remarks optional"
                                  }
                                  onChange={(e) =>
                                    handleChkInputChange(
                                      rowIndex,
                                      "remarks",
                                      e.target.value
                                    )
                                  }
                                  onInput={autoResize}
                                />
                              )}
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>

            <div className="relative w-full md:flex mb-2">
              <div className="md:w-1/3">
                <label className="ml-2 text-black font-small">
                  Other Commercial Conditions
                </label>
              </div>
              <div className="md:w-2/3">
                <textarea
                  className="w-full p-1 bg-blue-50 rounded shadow-inner"
                  type="text"
                  value={otc == "" ? "" : otc}
                  required
                  style={{ minHeight: "30px" }}
                  onInput={autoResize}
                  onChange={(e) => {
                    setOtc(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="relative w-full md:flex mb-2">
              <div className="md:w-1/3">
                <label className="ml-2 text-black font-small">
                  Commercial Recommendation
                </label>
              </div>
              <div className="md:w-2/3">
                <textarea
                  className="w-full p-1 bg-blue-50 rounded shadow-inner"
                  type="text"
                  value={osc == "" ? "" : osc}
                  required
                  style={{ minHeight: "30px" }}
                  onInput={autoResize}
                  onChange={(e) => {
                    setOsc(e.target.value);
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex-col bg-blue-50 rounded-xl">
                <div className="bg-blue-300 px-2 justify-start rounded-t-xl text-xl font-bold">
                  Attachments
                </div>
                {(mode === "N" || mode === "A" || mode === "R") && (
                  <>
                    <div className="bg-transparent relative w-full md:flex mb-2">
                      <div className="md:w-1/3">
                        <label className="ml-2 text-black font-small">
                          Contract shared with vendor
                          <span className="text-red-500">*</span>
                          <span className="mr-0.5 text-xs">
                            (Multiple docx, doc)
                          </span>
                        </label>
                      </div>
                      <div className="flex md:w-2/3">
                        <div className="md:w-1/2">
                          <input
                            type="file"
                            onChange={handleVendorSharedFilesChange}
                            accept="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            multiple
                            disabled={mode === "R" && disableVendorSharedFiles}
                          />
                        </div>
                        {(mode === "A" ||
                          (mode === "R" && disableVendorSharedFiles)) && (
                          <div className="flex md:w-1/2 items-center text-sm italic">
                            {mode === "R" && disableVendorSharedFiles && (
                              <button
                                className="mr-2"
                                onClick={() => {
                                  setDisableVendorSharedFiles(false);
                                }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 32 32"
                                  width="32px"
                                  height="32px"
                                  fill-rule="evenodd"
                                  clip-rule="evenodd"
                                  baseProfile="basic"
                                >
                                  <path
                                    fill="#e41e2f"
                                    fill-rule="evenodd"
                                    d="M16.997,18.997v2h2v2h2	v2h2v2h2v-2h2v-2h-2v-2h-2v-2h-2v-2h-2v-2h2v-2h2v-2h2v-2h2v-2h-2v-2h-2v2h-2v2h-2v2h-2v2h-2v-2h-2v-2h-2v-2h-2v-2h-2v2h-2v2h2v2h2	v2h2v2h2v2h-2v2h-2v2h-2v2h-2v2h2v2h2v-2h2v-2h2v-2h2v-2H16.997z"
                                    clip-rule="evenodd"
                                  />
                                </svg>
                              </button>
                            )}
                            Last Upload: &nbsp;
                            <button
                              onClick={() => {
                                const id = types[0].con_VSF;
                                handleFetchFile(id);
                              }}
                              className="text-blue-700 underline"
                            >
                              {types[0].con_VSF}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="bg-transparent relative w-full md:flex mb-2">
                      <div className="md:w-1/3">
                        <label className="ml-2 text-black font-small">
                          Vendor Signed Contract
                          <span className="text-red-500">*</span>
                          <span className="mr-0.5 text-xs">
                            (Multiple PDFs)
                          </span>
                        </label>
                      </div>
                      <div className="flex md:w-2/3">
                        <div className="md:w-1/2">
                          <input
                            type="file"
                            onChange={handleVendorSignedFilesChange}
                            accept="application/pdf"
                            multiple
                            disabled={mode === "R" && disableVendorSignedFiles}
                          />
                        </div>
                        {(mode === "A" ||
                          (mode === "R" && disableVendorSignedFiles)) && (
                          <div className="flex md:w-1/2 items-center text-sm italic">
                            {mode === "R" && disableVendorSignedFiles && (
                              <button
                                className="mr-2"
                                onClick={() => {
                                  setDisableVendorSignedFiles(false);
                                }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 32 32"
                                  width="32px"
                                  height="32px"
                                  fill-rule="evenodd"
                                  clip-rule="evenodd"
                                  baseProfile="basic"
                                >
                                  <path
                                    fill="#e41e2f"
                                    fill-rule="evenodd"
                                    d="M16.997,18.997v2h2v2h2	v2h2v2h2v-2h2v-2h-2v-2h-2v-2h-2v-2h-2v-2h2v-2h2v-2h2v-2h2v-2h-2v-2h-2v2h-2v2h-2v2h-2v2h-2v-2h-2v-2h-2v-2h-2v-2h-2v2h-2v2h2v2h2	v2h2v2h2v2h-2v2h-2v2h-2v2h-2v2h2v2h2v-2h2v-2h2v-2h2v-2H16.997z"
                                    clip-rule="evenodd"
                                  />
                                </svg>
                              </button>
                            )}
                            Last Upload: &nbsp;
                            <button
                              onClick={() => {
                                const id = types[0].con_VSgF;
                                handleFetchFile(id);
                              }}
                              className="text-blue-700 underline"
                            >
                              {types[0].con_VSgF}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="bg-transparent relative w-full md:flex mb-2">
                      <div className="md:w-1/3">
                        <label className="ml-2 text-black font-small">
                          Final Deviations list
                          <span className="text-red-500">*</span>
                          <span className="mr-0.5 text-xs">
                            (Multiple PDFs)
                          </span>
                        </label>
                      </div>
                      <div className="flex md:w-2/3">
                        <div className="md:w-1/2">
                          <input
                            type="file"
                            onChange={handleDeviationsFileChange}
                            accept="application/pdf"
                            multiple
                            disabled={mode === "R" && disableDeviationsFiles}
                          />
                        </div>
                        {(mode === "A" ||
                          (mode === "R" && disableDeviationsFiles)) && (
                          <div className="flex md:w-1/2 items-center text-sm italic">
                            {mode === "R" && disableDeviationsFiles && (
                              <button
                                className="mr-2"
                                onClick={() => {
                                  setDisableDeviationsFiles(false);
                                }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 32 32"
                                  width="32px"
                                  height="32px"
                                  fill-rule="evenodd"
                                  clip-rule="evenodd"
                                  baseProfile="basic"
                                >
                                  <path
                                    fill="#e41e2f"
                                    fill-rule="evenodd"
                                    d="M16.997,18.997v2h2v2h2	v2h2v2h2v-2h2v-2h-2v-2h-2v-2h-2v-2h-2v-2h2v-2h2v-2h2v-2h2v-2h-2v-2h-2v2h-2v2h-2v2h-2v2h-2v-2h-2v-2h-2v-2h-2v-2h-2v2h-2v2h2v2h2	v2h2v2h2v2h-2v2h-2v2h-2v2h-2v2h2v2h2v-2h2v-2h2v-2h2v-2H16.997z"
                                    clip-rule="evenodd"
                                  />
                                </svg>
                              </button>
                            )}
                            Last Upload: &nbsp;
                            <button
                              onClick={() => {
                                const id = types[0].con_DF;
                                handleFetchFile(id);
                              }}
                              className="text-blue-700 underline"
                            >
                              {types[0].con_DF}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* approval matrix */}
            <div className="flex-col bg-blue-50 rounded-xl">
              <div className="bg-blue-300 px-2 justify-start rounded-t-xl text-xl font-bold">
                Approval Matrix
              </div>
              {(mode === "A" || mode === "N" || mode === "R") && (
                <>
                  <div className="w-full md:flex mb-2 mt-4">
                    <div className="md:w-1/6">
                      <label
                        htmlFor="proposer"
                        className="ml-2 text-black font-small"
                      >
                        Proposer<span className="text-red-500">*</span>
                      </label>
                    </div>
                    <div className="md:w-3/6 flex items-start">
                      <div className="md:w-1/2 text-sm">Buyer</div>
                      <div className="md:w-1/2">
                        <Autocomplete
                          {...defaultEmployeesP}
                          id="proposer"
                          disableClearable
                          value={{
                            EMPLOYEE: approverMat.proposer,
                            EMAIL: approverMat.PEmail,
                          }}
                          onChange={(event, value) => {
                            handleApprovalMat(
                              "proposer",
                              value.EMPLOYEE,
                              "Buyer",
                              value.EMAIL
                            );
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="standard"
                              fullWidth
                              required
                              style={{ width: "220px" }}
                            />
                          )}
                        />
                      </div>
                    </div>
                    <div className="md:w-2/6 italic text-sm">
                      {appArcDet?.map((appArc, appArcIndex) => (
                        <div
                          key={appArcIndex}
                          className="md:w-full flex items-start bg-transparent text-black text-xs"
                        >
                          {appArc.cam_role === "Proposer" && (
                            <>
                              <div className="md:w-3/12">
                                Version: {appArc.cam_app_version}
                              </div>
                              <div className="md:w-6/12 max-h-10 overflow-y-auto break-words">
                                Remarks: {appArc.cam_app_remarks}
                              </div>
                              <div className="md:w-3/12">
                                {appArc.cam_app_status ? (
                                  <span>Approved</span>
                                ) : (
                                  <span>Returned</span>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {deviationsLabel === "Y" && ltaAfterImp && (
                    <div className="w-full md:flex mb-2 mt-4">
                      <div className="md:w-1/6">
                        <label
                          htmlFor="addproposer"
                          className="ml-2 text-black font-small"
                        >
                          Additional Proposer
                        </label>
                      </div>
                      <div class="md:w-3/6 flex items-start">
                        <div className="md:w-1/2 text-sm">IL3 (Commercial)</div>
                        <div className="md:w-1/2">
                          <Autocomplete
                            {...defaultEmployeesAP}
                            id="addproposer"
                            disableClearable
                            value={{
                              EMPLOYEE: approverMat.addproposer,
                              EMAIL: approverMat.APEmail,
                            }}
                            onChange={(event, value) =>
                              handleApprovalMat(
                                "addproposer",
                                value.EMPLOYEE,
                                "IL3 (Commercial)",
                                value.EMAIL
                              )
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                variant="standard"
                                fullWidth
                                style={{ width: "220px" }}
                              />
                            )}
                          />
                        </div>
                      </div>
                      <div className="md:w-2/6 italic text-sm">
                        {appArcDet?.map((appArc, appArcIndex) => (
                          <div
                            key={appArcIndex}
                            className="md:w-full flex items-start bg-transparent text-black text-xs"
                          >
                            {appArc.cam_role === "Additional Proposer" && (
                              <>
                                <div className="md:w-3/12">
                                  Version: {appArc.cam_app_version}
                                </div>
                                <div className="md:w-6/12 max-h-10 overflow-y-auto break-words">
                                  Remarks: {appArc.cam_app_remarks}
                                </div>
                                <div className="md:w-3/12">
                                  {appArc.cam_app_status ? (
                                    <span>Approved</span>
                                  ) : (
                                    <span>Returned</span>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {deviationsLabel === "Y" && (
                    <div className="w-full md:flex mb-2 mt-4">
                      <div className="md:w-1/6">
                        <label
                          htmlFor="verifier"
                          className="ml-2 text-black font-small"
                        >
                          Verifier<span className="text-red-500">*</span>
                        </label>
                      </div>
                      <div class="md:w-3/6 flex items-start">
                        <div className="md:w-1/2 text-sm">
                          IL4/IL3 Contract Management
                        </div>
                        <div className="md:w-1/2">
                          <Autocomplete
                            {...defaultEmployeesV}
                            id="verifier"
                            disableClearable
                            value={{
                              EMPLOYEE: approverMat.verifier,
                              EMAIL: approverMat.VEmail,
                            }}
                            onChange={(event, value) =>
                              handleApprovalMat(
                                "verifier",
                                value.EMPLOYEE,
                                "IL4/IL3 Contract Management",
                                value.EMAIL
                              )
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                variant="standard"
                                fullWidth
                                required
                                style={{ width: "220px" }}
                              />
                            )}
                          />
                        </div>
                      </div>
                      <div className="md:w-2/6 italic text-sm">
                        {appArcDet?.map((appArc, appArcIndex) => (
                          <div
                            key={appArcIndex}
                            className="md:w-full flex items-start bg-transparent text-black text-xs"
                          >
                            {appArc.cam_role === "Verifier" && (
                              <>
                                <div className="md:w-3/12">
                                  Version: {appArc.cam_app_version}
                                </div>
                                <div className="md:w-6/12 max-h-10 overflow-y-auto break-words">
                                  Remarks: {appArc.cam_app_remarks}
                                </div>
                                <div className="md:w-3/12">
                                  {appArc.cam_app_status ? (
                                    <span>Approved</span>
                                  ) : (
                                    <span>Returned</span>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {deviationsLabel === "Y" && ltaAfterImp && (
                    <div className="w-full md:flex mb-2 mt-4">
                      <div className="md:w-1/6">
                        <label
                          htmlFor="recommender1"
                          className="ml-2 text-black font-small"
                        >
                          Recommender #1<span className="text-red-500">*</span>
                        </label>
                      </div>
                      <div className="md:w-3/6 flex items-start">
                        <div className="md:w-1/2 text-sm">
                          IL2/IL3 directly reporting to Chief Commercial (E&P)
                        </div>
                        <div className="md:w-1/2">
                          <Autocomplete
                            {...defaultEmployeesR1}
                            id="recommender1"
                            disableClearable
                            value={{
                              EMPLOYEE: approverMat.recommender1,
                              EMAIL: approverMat.R1Email,
                            }}
                            onChange={(event, value) =>
                              handleApprovalMat(
                                "recommender1",
                                value.EMPLOYEE,
                                "IL2/IL3 directly reporting to Chief Commercial (E&P)",
                                value.EMAIL
                              )
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                variant="standard"
                                fullWidth
                                required
                                style={{ width: "220px" }}
                              />
                            )}
                          />
                        </div>
                      </div>
                      <div className="md:w-2/6 italic text-sm">
                        {appArcDet?.map((appArc, appArcIndex) => (
                          <div
                            key={appArcIndex}
                            className="md:w-full flex items-start bg-transparent text-black text-xs"
                          >
                            {appArc.cam_role === "Recommender #1" && (
                              <>
                                <div className="md:w-3/12">
                                  Version: {appArc.cam_app_version}
                                </div>
                                <div className="md:w-6/12 max-h-10 overflow-y-auto break-words">
                                  Remarks: {appArc.cam_app_remarks}
                                </div>
                                <div className="md:w-3/12">
                                  {appArc.cam_app_status ? (
                                    <span>Approved</span>
                                  ) : (
                                    <span>Returned</span>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {deviationsLabel === "Y" && ltaAfterImp && (
                    <div className="w-full md:flex mb-2 mt-4">
                      <div className="md:w-1/6">
                        <label
                          htmlFor="recommender2"
                          className="ml-2 text-black font-small"
                        >
                          Recommender #2<span className="text-red-500">*</span>
                        </label>
                      </div>
                      <div className="md:w-3/6 flex items-start">
                        <div className="md:w-1/2 text-sm">
                          Chief Contract Management
                        </div>
                        <div className="md:w-1/2">
                          <Autocomplete
                            {...defaultEmployeesR2}
                            id="recommender2"
                            disableClearable
                            value={{
                              EMPLOYEE: approverMat.recommender2,
                              EMAIL: approverMat.R2Email,
                            }}
                            onChange={(event, value) =>
                              handleApprovalMat(
                                "recommender2",
                                value.EMPLOYEE,
                                "Chief Contract Management",
                                value.EMAIL
                              )
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                variant="standard"
                                fullWidth
                                required
                                style={{ width: "220px" }}
                              />
                            )}
                          />
                        </div>
                      </div>
                      <div className="md:w-2/6 italic text-sm">
                        {appArcDet?.map((appArc, appArcIndex) => (
                          <div
                            key={appArcIndex}
                            className="md:w-full flex items-start bg-transparent text-black text-xs"
                          >
                            {appArc.cam_role === "Recommender #2" && (
                              <>
                                <div className="md:w-3/12">
                                  Version: {appArc.cam_app_version}
                                </div>
                                <div className="md:w-6/12 max-h-10 overflow-y-auto break-words">
                                  Remarks: {appArc.cam_app_remarks}
                                </div>
                                <div className="md:w-3/12">
                                  {appArc.cam_app_status ? (
                                    <span>Approved</span>
                                  ) : (
                                    <span>Returned</span>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {deviationsLabel === "Y" && ltaAfterImp && (
                    <div className="w-full md:flex mb-2 mt-4">
                      <div className="md:w-1/6">
                        <label
                          htmlFor="approver"
                          className="ml-2 text-black font-small"
                        >
                          Approver<span className="text-red-500">*</span>
                        </label>
                      </div>
                      <div className="md:w-3/6 flex items-start">
                        <div className="md:w-1/2 text-sm">Chief Commercial</div>
                        <div className="md:w-1/2">
                          <Autocomplete
                            {...defaultEmployeesA}
                            id="approver"
                            disableClearable
                            value={{
                              EMPLOYEE: approverMat.approver,
                              EMAIL: approverMat.AEmail,
                            }}
                            onChange={(event, value) =>
                              handleApprovalMat(
                                "approver",
                                value.EMPLOYEE,
                                "Chief Commercial",
                                value.EMAIL
                              )
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                variant="standard"
                                fullWidth
                                required
                                style={{ width: "220px" }}
                              />
                            )}
                          />
                        </div>
                      </div>
                      <div className="md:w-2/6 italic text-sm">
                        {appArcDet?.map((appArc, appArcIndex) => (
                          <div
                            key={appArcIndex}
                            className="md:w-full flex items-start bg-transparent text-black text-xs"
                          >
                            {appArc.cam_role === "Approver" && (
                              <>
                                <div className="md:w-3/12">
                                  Version: {appArc.cam_app_version}
                                </div>
                                <div className="md:w-6/12 max-h-10 overflow-y-auto break-words">
                                  Remarks: {appArc.cam_app_remarks}
                                </div>
                                <div className="md:w-3/12">
                                  {appArc.cam_app_status ? (
                                    <div>Approved</div>
                                  ) : (
                                    <div>Returned</div>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {deviationsLabel === "N" && (
                    <div className="w-full md:flex mb-2 mt-4">
                      <div className="md:w-1/6">
                        <label
                          htmlFor="approver"
                          className="ml-2 text-black font-small"
                        >
                          Approver<span className="text-red-500">*</span>
                        </label>
                      </div>
                      <div className="md:w-3/6 flex items-start">
                        <div className="md:w-1/2 text-sm">IL3 (Commercial)</div>
                        <div className="md:w-1/2">
                          <Autocomplete
                            {...defaultEmployeesANd}
                            id="approver"
                            disableClearable
                            value={{
                              EMPLOYEE: approverMat.approver,
                              EMAIL: approverMat.AEmail,
                            }}
                            onChange={(event, value) =>
                              handleApprovalMat(
                                "approver",
                                value.EMPLOYEE,
                                "IL3 (Commercial)",
                                value.EMAIL
                              )
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                variant="standard"
                                fullWidth
                                required
                                style={{ width: "220px" }}
                              />
                            )}
                          />
                        </div>
                      </div>
                      <div className="md:w-2/6 italic text-sm">
                        {appArcDet?.map((appArc, appArcIndex) => (
                          <div
                            key={appArcIndex}
                            className="md:w-full flex items-start bg-transparent text-black text-xs"
                          >
                            {appArc.cam_role === "Approver" && (
                              <>
                                <div className="md:w-3/12">
                                  Version: {appArc.cam_app_version}
                                </div>
                                <div className="md:w-6/12 max-h-10 overflow-y-auto break-words">
                                  Remarks: {appArc.cam_app_remarks}
                                </div>
                                <div className="md:w-3/12">
                                  {appArc.cam_app_status ? (
                                    <div>Approved</div>
                                  ) : (
                                    <div>Returned</div>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {deviationsLabel === "Y" && ltaAfterImp == false && (
                    <div className="w-full md:flex mb-2 mt-4">
                      <div className="md:w-1/6">
                        <label
                          htmlFor="approver"
                          className="ml-2 text-black font-small"
                        >
                          Approver<span className="text-red-500">*</span>
                        </label>
                      </div>
                      <div className="md:w-3/6 flex items-start">
                        <div className="md:w-1/2 text-sm">IL2 (Commercial)</div>
                        <div className="md:w-1/2">
                          <Autocomplete
                            {...defaultEmployeesA}
                            id="approver"
                            disableClearable
                            value={{
                              EMPLOYEE: approverMat.approver,
                              EMAIL: approverMat.AEmail,
                            }}
                            onChange={(event, value) =>
                              handleApprovalMat(
                                "approver",
                                value.EMPLOYEE,
                                "IL2 (Commercial)",
                                value.EMAIL
                              )
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                variant="standard"
                                fullWidth
                                required
                                style={{ width: "220px" }}
                              />
                            )}
                          />
                        </div>
                      </div>
                      <div className="md:w-2/6 italic text-sm">
                        {appArcDet?.map((appArc, appArcIndex) => (
                          <div
                            key={appArcIndex}
                            className="md:w-full flex items-start bg-transparent text-black text-xs"
                          >
                            {appArc.cam_role === "Approver" && (
                              <>
                                <div className="md:w-3/12">
                                  Version: {appArc.cam_app_version}
                                </div>
                                <div className="md:w-6/12 max-h-10 overflow-y-auto break-words">
                                  Remarks: {appArc.cam_app_remarks}
                                </div>
                                <div className="md:w-3/12">
                                  {appArc.cam_app_status ? (
                                    <div>Approved</div>
                                  ) : (
                                    <div>Returned</div>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {(mode === "N" || mode === "A" || mode === "R") && (
              <div className="bg-transparent flex justify-end space-x-8 p-4">
                <button
                  className="bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-bold py-2 px-4 rounded shadow-lg transform hover:-translate-y-1 hover:shadow-xl active:translate-y-0.5"
                  onClick={() => setOpen(true)}
                >
                  Submit
                </button>
                <button className="bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-bold py-2 px-4 rounded shadow-lg transform hover:-translate-y-1 hover:shadow-xl active:translate-y-0.5">
                  Cancel
                </button>
              </div>
            )}

            <Dialog
              open={open}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">Confirmation</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  {mode === "R"
                    ? `Note: The attachments section not selected will be continued with previous ones and the attachment uploaded will replace previous one.`
                    : ""}
                  Do you wish to submit?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleSubmit}>Yes</Button>
                <Button onClick={() => setOpen(false)} autoFocus>
                  No
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </div>
      </div>
    </>
  );
}

export default LTC;
