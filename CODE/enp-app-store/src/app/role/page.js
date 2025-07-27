import React, { useState, useEffect } from "react";
import {
  Autocomplete,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Loader from "../../components/loader";
import { useNavigate } from "react-router-dom";

function Role() {
  const ADID = JSON.parse(sessionStorage.getItem("userData")).ADID;
  const [typeOfRoleOp, setTypeOfRoleOp] = useState("setRole");
  const [modules, setModules] = useState([]);
  const [module, setModule] = useState("");
  const [roleCodes, setRoleCodes] = useState([]);
  const [roleCode, setRoleCode] = useState("");
  const [userId, setUserId] = useState("");
  const [desc, setDesc] = useState("");
  const [url, setURL] = useState("");
  const [activeFlag, setActiveFlag] = useState("");
  const [errors, setErrors] = useState({});
  const [load, setLoad] = useState(false);
  const token = JSON.parse(sessionStorage.getItem("userData")).token;

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/roleGet/get-module`
        );
        setModules(response.data.data);
      } catch (error) {
        console.error("Failed to fetch systems:", error);
      }
    };
    fetchModules();
  }, []);
  const defaultModules = {
    options: modules,
    getOptionLabel: (option) => (option != undefined ? option?.er_role_id : []),
  };

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/roleGet/get-role`,
          {
            Module: module,
          }
        );
        setRoleCodes(response.data.data);
      } catch (error) {
        console.error("No codes found:", error);
      }
    };
    module != undefined && fetchRoles();
  }, [module]);
  const defaultRoles = {
    options: roleCodes,
    getOptionLabel: (option) => (option != undefined ? option?.er_role_cd : []),
  };

  const handleTypeOfRoleOp = (event) => {
    setTypeOfRoleOp(event.target.value);
    setModule("");
    setRoleCode("");
    setUserId("");
    setActiveFlag("");
    setDesc("");
    setURL("");
  };

  const handleValidation = () => {
    let tempErrors = {};
    let isValid = true;
    if (module === "") {
      tempErrors["module"] = "Module name is required";
      isValid = false;
    }
    if (roleCode === "") {
      tempErrors["roleCode"] = "Role code is required";
      isValid = false;
    }
    if (typeOfRoleOp === "setRole") {
      if (userId === "") {
        tempErrors["userId"] = "userId is required";
        isValid = false;
      }
      if (activeFlag === "") {
        tempErrors["activeFlag"] = "Active flag is required";
        isValid = false;
      }
    } else {
      if (url === "") {
        tempErrors["url"] = "URL is required";
        isValid = false;
      }
    }
    // } else if (!/\S+@\S+\.\S+/.test(email)) {
    //   tempErrors["email"] = "Email is invalid";
    //   isValid = false;
    // }
    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (handleValidation()) {
      setLoad(true);
      let result = "";
      if(typeOfRoleOp === "setRole"){
        result = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/roleSet/set-role`,
        {
          USER_ID: userId,
          ROLE: roleCode,
          ACTIVE_FLAG: activeFlag,
          DESC: desc,
          ADID: ADID,
        },
        {
          headers: {
            "auth-token": token,
          },
        }
      );}else{
        result = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/roleSet/create-role`,
          {
            SYS: module,
            ROLE: roleCode,
            URL: url,
            ADID: ADID,
          },
          {
            headers: {
              "auth-token": token,
            },
          }
        );
      }
      if (result) {
        toast.success(result.data.message);
        setTimeout(() => {
          setLoad(true);
          window.location.reload();
          setLoad(false);
        }, 6000);
      } else {
        toast.error(result.data.message);
      }
      setLoad(false);
      //alert("Form submitted successfully!");
    } else {
      toast.error("Form has errors!");
      //alert("Form has errors.");
    }
  };

  return (
    <>
      {load && <Loader />}
      <ToastContainer />
      <div className="flex w-full items-center justify-end bg-white overflow-auto">
        <div className="w-7/12">
          <div className="circle xlarge shade2"></div>
          <div className="circle large shade3"></div>
          <div className="circle mediun shade4"></div>
          <div className="circle small shade5"></div>
        </div>
        <div className="w-5/12 flex-col px-12 h-full justify-end self-start mt-3">
          <div className="bg-blue-100 shadow-2xl shadow-black p-6 rounded-xl">
            <h1 className="text-2xl font-bold mb-4">Role Management</h1>
            <div className="mb-4">
              <RadioGroup
                row
                onChange={handleTypeOfRoleOp}
                value={typeOfRoleOp == undefined ? "" : typeOfRoleOp}
                required
              >
                <FormControlLabel
                  className="ml-4"
                  value="setRole"
                  control={<Radio />}
                  label="Add/Revoke Access"
                />
                <FormControlLabel
                  className="ml-4"
                  value="createRole"
                  control={<Radio />}
                  label="Create Module/Function"
                />
              </RadioGroup>
            </div>
            {typeOfRoleOp === "setRole" ? (
              <div className="mb-4">
                <Autocomplete
                  {...defaultModules}
                  id="module"
                  disableClearable
                  onChange={(event, value) => {
                    setModule(value?.er_role_id);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Module"
                      variant="outlined"
                      fullWidth
                      required
                      error={!!errors.module}
                      helperText={errors.module}
                    />
                  )}
                />
              </div>
            ) : (
              <div className="mb-4">
                <TextField
                  label="Module"
                  variant="outlined"
                  fullWidth
                  required
                  onChange={(e) => setModule(e.target.value)}
                  error={!!errors.module}
                  helperText={errors.module}
                />
              </div>
            )}

            {typeOfRoleOp === "setRole" ? (
              <div className="mb-4">
                <Autocomplete
                  {...defaultRoles}
                  id="roleCode"
                  disableClearable
                  onChange={(event, value) => {
                    setRoleCode(value?.er_role_cd);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Role Code"
                      variant="outlined"
                      fullWidth
                      required
                      error={!!errors.roleCode}
                      helperText={errors.roleCode}
                    />
                  )}
                />
              </div>
            ) : (
              <div className="mb-4">
                <TextField
                  label="Role Code"
                  variant="outlined"
                  fullWidth
                  required
                  onChange={(e) => setRoleCode(e.target.value)}
                  error={!!errors.roleCode}
                  helperText={errors.roleCode}
                />
              </div>
            )}

            {typeOfRoleOp === "setRole" ? (
              <div className="mb-4">
                <TextField
                  label="User ADID"
                  variant="outlined"
                  fullWidth
                  required
                  onChange={(e) => setUserId(e.target.value)}
                  error={!!errors.userId}
                  helperText={errors.userId}
                />
              </div>
            ) : (
              ""
            )}

            {typeOfRoleOp === "setRole" ? (
              <div className="mb-4">
                <FormControl fullWidth required error={!!errors.activeFlag}>
                  <InputLabel id="active-label">Active</InputLabel>
                  <Select
                    labelId="active-label"
                    value={activeFlag}
                    onChange={(e) => setActiveFlag(e.target.value)}
                    label="Active"
                  >
                    <MenuItem value="Y">Y</MenuItem>
                    <MenuItem value="N">N</MenuItem>
                  </Select>
                  <FormHelperText>{errors.activeFlag}</FormHelperText>
                </FormControl>
              </div>
            ) : (
              ""
            )}

            {typeOfRoleOp === "setRole" ? (
              <div className="mb-4">
                <TextField
                  label="Role Description"
                  variant="outlined"
                  fullWidth
                  required
                  onChange={(e) => setDesc(e.target.value)}
                />
              </div>
            ) : (
              <div className="mb-4">
                <TextField
                  label="URL"
                  variant="outlined"
                  fullWidth
                  required
                  onChange={(e) => setURL(e.target.value)}
                  error={!!errors.url}
                  helperText={errors.url}
                />
              </div>
            )}

            <div className="flex space-x-4">
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                Register
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => {
                  setModule("");
                  setRoleCode("");
                  setUserId("");
                  setActiveFlag("");
                  setDesc("");
                  setURL("");
                }}
              >
                Reset
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Role;
