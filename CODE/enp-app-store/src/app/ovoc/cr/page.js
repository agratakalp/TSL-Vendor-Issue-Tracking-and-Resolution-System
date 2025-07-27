import React, { useEffect, useState } from "react";
import {
  Paper,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../../components/loader";

export default function Cr() {
  const [email, setEmail] = useState();
  const [message, setMessage] = useState();
  const [sub, setSub] = useState();
  const returnUri = process.env.PUBLIC_URL + "/return-parcel.png";
  const { param1, param2 } = useParams();
  const conId = param2;
  const [contractDetails, setContractDetails] = useState();
  const [arcContractDetails, setArcContractDetails] = useState();
  const [types, setTypes] = useState([]);
  const [chkDet, setChkDet] = useState();
  const [appDet, setAppDet] = useState();
  const [appArcDet, setAppArcDet] = useState();
  const [vendorName, setVendorName] = useState();
  const [vendorAddress, setVendorAddress] = useState();
  const [vendorEmail, setVendorEmail] = useState();
  const [vendorMobile, setVendorMobile] = useState();
  const [rem, setRem] = useState();
  const [load, setLoad] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toString().substring(0, 15);
  };

  useEffect(() => {
    setLoad(true);
    const fetchContract = async () => {
      try {
        const responseConDet = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/get/contractDetails`,
          {
            ContractId: conId,
          }
        );
        if (responseConDet) {
          setContractDetails(responseConDet.data.data);
        }
      } catch (error) {
        console.log("No details found to approve", error);
      }
    };
    const fetchArcContract = async () => {
      try {
        const responseArcConDet = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/get/arcContractDetails`,
          {
            ContractId: conId,
          }
        );
        if (responseArcConDet) {
          setArcContractDetails(responseArcConDet.data.data);
        }
      } catch (error) {
        console.log("No previous details found to approve", error);
      }
    };
    fetchContract();
    fetchArcContract();
    setLoad(false);
  }, [conId]);

  useEffect(() => {
    const fetchTypes = async () => {
      setLoad(true);
      try {
        let rowsUri = process.env.REACT_APP_BACKEND_URL + "/get/availContracts";
        const response = await axios.post(rowsUri, {
          Category: contractDetails[0].con_category,
          VCode: contractDetails[0].ven_code,
        });
        if (response.data.data.length > 0) {
          setTypes(response.data.data);
        }
      } catch (error) {
        console.log("Failed to fetch types", error);
      }
      setLoad(false);
    };
    if (contractDetails !== undefined) {
      fetchTypes();
    }
  }, [contractDetails]);

  useEffect(() => {
    setLoad(true);
    const fetchChkDet = async () => {
      try {
        const responseChkDet = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/get/rows`,
          {
            Category: contractDetails[0].con_category,
            ConId: conId,
          }
        );
        if (responseChkDet) {
          setChkDet(responseChkDet.data.data);
        }
      } catch (error) {
        console.log("No details found to approve", error);
      }
    };
    fetchChkDet();
    setLoad(false);
  }, [conId, contractDetails]);

  useEffect(() => {
    setLoad(true);
    const fetchAppDet = async () => {
      try {
        const responseAppDet = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/get/contractApprovers`,
          {
            ContractId: conId,
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
            ContractId: conId,
          }
        );
        if (responseAppDet) {
          setAppArcDet(responseAppDet.data.data);
        }
      } catch (error) {
        console.log("No details found to approve", error);
      }
    };
    fetchAppDet();
    fetchAppArcDet();
    // appDet.forEach(element => {
    //     if(element.cam_app_elg){
    //         setApp({
    //             cam_id: element.cam_id,
    //             cam_role: element.cam_role,
    //             cam_app_remarks: element.cam_app_remarks
    //         })
    //     }
    // });
    setLoad(false);
  }, [conId, contractDetails]);

  useEffect(() => {
    const fetchVendorDetails = async () => {
      setLoad(true);
      try {
        let vDetailsUrl = process.env.REACT_APP_BACKEND_URL + "/get/vDetails";
        const response = await axios.post(vDetailsUrl, {
          vCode: contractDetails[0].ven_code,
        });
        setVendorName(response.data.data[0].INV_NAME);
        setVendorAddress(response.data.data[0].VM_ADDRESS);
        setVendorEmail(response.data.data[0].inv_ven_email);
        setVendorMobile(response.data.data[0].INS_MOBILE_NO);
      } catch (error) {
        console.log(error);
      }
      setLoad(false);
    };
    fetchVendorDetails();
  }, [contractDetails]);

  function autoResize(event) {
    event.target.style.height = "auto";
    event.target.style.height = event.target.scrollHeight + "px";
  }

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

  const handleApprove = async (level, role, approver, remarks, ver) => {
    setLoad(true);
    try {
      if (remarks != undefined && remarks != "" && remarks != " ") {
        const AppUpUrl = process.env.REACT_APP_BACKEND_URL + "/put/approveCr";
        const response = await axios.post(AppUpUrl, {
          level: level,
          role: role,
          approver: approver,
          conid: conId,
          remarks: remarks,
          Ver: ver,
        });
        if (response) {
          let Level = level + 1;
          let id = 0;
          var subCatString = "";
          types.forEach((type) => {
            subCatString = subCatString + type.cc_con_sub_cat + ", ";
          });
          let k = 0;
          appDet.forEach((obj) => {
            id = obj.cam_approver.split("|")[0];
            if (obj.cam_lv == Level) {
              k = 1;
              setEmail(obj.cam_app_email);
              if (
                arcContractDetails == "undefined" ||
                arcContractDetails == ""
              ) {
                setSub(
                  `LTC Form (New) - Request is awaiting your approval for ${vendorName}`
                );
                setMessage(`
                  Dear Sir/Ma'am,
        
                  Please find below details
                  LTC ID :  ${conId}/V${contractDetails[0].con_version}
                  Registered By	:  ${
                    contractDetails[0].con_modify_by == null
                      ? contractDetails[0].con_create_by
                      : contractDetails[0].con_modify_by
                  }
                  Registered Date	:  ${
                    contractDetails[0].con_modify_by == null
                      ? formatDate(
                          contractDetails[0].con_create_date.split("T")[0]
                        )
                      : formatDate(
                          contractDetails[0].con_modify_date.split("T")[0]
                        )
                  }
                  Vendor Name :  ${vendorName} (${contractDetails[0].ven_code})
                  Category of contract :  ${contractDetails[0].con_category}
                  LTC Sub category :  ${subCatString}
                  Current Status	:  Pending for approval with (${id})
        
                  Click/Copy the below url to your browser
                  ${process.env.REACT_APP_FRONTEND_URL}/ovoc/cr/${id}/${conId}
                  
                  Regards,
                  IPMS Team
                  
                  ****This is a system generated mail****`);
              } else {
                setSub(
                  `LTC Form (Modification) - Request is awaiting your approval for ${vendorName}`
                );
                setMessage(`
                  Dear Sir/Ma'am,
    
                  Please find below details
                  Last approved Request ID :  ${conId}/V${
                  arcContractDetails[0].con_version
                }
                  Last registered by :  ${arcContractDetails[0]?.con_modify_by}
                  Last registered date :  ${formatDate(
                    arcContractDetails[0]?.con_modify_date.split("T")[0]
                  )}
                  LTC ID :  ${conId}/V${contractDetails[0].con_version}
                  Registered By	:  ${
                    contractDetails[0].con_modify_by == null
                      ? contractDetails[0].con_create_by
                      : contractDetails[0].con_modify_by
                  }
                  Registered Date	:  ${
                    contractDetails[0].con_modify_by == null
                      ? formatDate(
                          contractDetails[0].con_create_date.split("T")[0]
                        )
                      : formatDate(
                          contractDetails[0].con_modify_date.split("T")[0]
                        )
                  }
                  Vendor Name :  ${vendorName} (${contractDetails[0].ven_code})
                  Category of contract :  ${contractDetails[0].con_category}
                  LTC Sub category :  ${subCatString}
                  Current Status	:  Pending for approval with (${id})
        
                  Click/Copy the below url to your browser
                  ${process.env.REACT_APP_FRONTEND_URL}/ovoc/cr/${id}/${conId}
                  
                  Regards,
                  IPMS Team
                  
                  ****This is a system generated mail****`);
              }
            }
          });
          if (k === 0) {
            setEmail(
              contractDetails[0].con_modify_by == null
                ? contractDetails[0].con_create_email
                : contractDetails[0].con_modify_email
            );
            if (arcContractDetails == "undefined" || arcContractDetails == "") {
              setSub(`LTC Form (New) - Request is approved for ${vendorName}`);
              setMessage(`
                Dear Sir/Ma'am,
      
                Please find below details
                LTC ID :  ${conId}/V${contractDetails[0].con_version}
                Registered By	:  ${
                  contractDetails[0].con_modify_by == null
                    ? contractDetails[0].con_create_by
                    : contractDetails[0].con_modify_by
                }
                Registered Date	:  ${
                  contractDetails[0].con_modify_by == null
                    ? formatDate(
                        contractDetails[0].con_create_date.split("T")[0]
                      )
                    : formatDate(
                        contractDetails[0].con_modify_date.split("T")[0]
                      )
                }
                Vendor Name :  ${vendorName} (${contractDetails[0].ven_code})
                Category of contract :  ${contractDetails[0].con_category}
                LTC Sub category :  ${subCatString}
                Current Status	:  Approved
                
                Regards,
                IPMS Team
                
                ****This is a system generated mail****`);
            } else {
              setSub(
                `LTC Form (Modification) - Request is approved for ${vendorName}`
              );
              setMessage(`
                Dear Sir/Ma'am,
  
                Please find below details
                Last approved Request ID :  ${conId}/V${
                arcContractDetails[0].con_version
              }
                Last registered by :  ${arcContractDetails[0]?.con_modify_by}
                Last registered date :  ${formatDate(
                  arcContractDetails[0]?.con_modify_date.split("T")[0]
                )}
                LTC ID :  ${conId}/V${contractDetails[0].con_version}
                Registered By	:  ${
                  contractDetails[0].con_modify_by == null
                    ? contractDetails[0].con_create_by
                    : contractDetails[0].con_modify_by
                }
                Registered Date	:  ${
                  contractDetails[0].con_modify_by == null
                    ? formatDate(
                        contractDetails[0].con_create_date.split("T")[0]
                      )
                    : formatDate(
                        contractDetails[0].con_modify_date.split("T")[0]
                      )
                }
                Vendor Name :  ${vendorName} (${contractDetails[0].ven_code})
                Category of contract :  ${contractDetails[0].con_category}
                LTC Sub category :  ${subCatString}
                Current Status	:  Approved
                
                Regards,
                IPMS Team
                
                ****This is a system generated mail****`);
            }
          }
          console.log(response.data.message);
          toast.success(response.data.message);
          setTimeout(() => {
            window.location.reload();
            setLoad(false);
          }, 10000);
        }
      } else {
        toast.error("Please enter remarks");
        setLoad(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("CR Approval Failed!");
      setLoad(false);
    }
  };

  const handleReturn = async (lv, remarks) => {
    setLoad(true);
    try {
      if (remarks != undefined && remarks != "" && remarks != " ") {
        const returnCrUrl = process.env.REACT_APP_BACKEND_URL + "/put/returnCr";
        const response = await axios.post(returnCrUrl, {
          ContractId: conId,
          lv: lv,
          remarks: remarks,
        });
        if (response) {
          var subCatString = "";
          types.forEach((type) => {
            subCatString = subCatString + type.cc_con_sub_cat + ", ";
          });
          setEmail(
            contractDetails[0].con_modify_by == null
              ? contractDetails[0].con_create_email
              : contractDetails[0].con_modify_email
          );
          if (arcContractDetails == "undefined" || arcContractDetails == "") {
            setSub(`LTC Form (New) - Request is returned for ${vendorName}`);
            setMessage(`
              Dear Sir/Ma'am,
    
              Please find below details
              LTC ID :  ${conId}/V${contractDetails[0].con_version}
              Registered By	:  ${
                contractDetails[0].con_modify_by == null
                  ? contractDetails[0].con_create_by
                  : contractDetails[0].con_modify_by
              }
              Registered Date	:  ${
                contractDetails[0].con_modify_by == null
                  ? formatDate(contractDetails[0].con_create_date.split("T")[0])
                  : formatDate(contractDetails[0].con_modify_date.split("T")[0])
              }
              Vendor Name :  ${vendorName} (${contractDetails[0].ven_code})
              Category of contract :  ${contractDetails[0].con_category}
              LTC Sub category :  ${subCatString}
              Current Status	:  Returned
              
              Regards,
              IPMS Team
              
              ****This is a system generated mail****`);
          } else {
            setSub(
              `LTC Form (Modification) - Request is returned for ${vendorName}`
            );
            setMessage(`
                Dear Sir/Ma'am,
  
                Please find below details
                Last approved Request ID :  ${conId}/V${
              arcContractDetails[0].con_version
            }
                Last registered by :  ${arcContractDetails[0]?.con_modify_by}
                Last registered date :  ${formatDate(
                  arcContractDetails[0]?.con_modify_date.split("T")[0]
                )}
                LTC ID :  ${conId}/V${contractDetails[0].con_version}
                Registered By	:  ${
                  contractDetails[0].con_modify_by == null
                    ? contractDetails[0].con_create_by
                    : contractDetails[0].con_modify_by
                }
                Registered Date	:  ${
                  contractDetails[0].con_modify_by == null
                    ? formatDate(
                        contractDetails[0].con_create_date.split("T")[0]
                      )
                    : formatDate(
                        contractDetails[0].con_modify_date.split("T")[0]
                      )
                }
                Vendor Name :  ${vendorName} (${contractDetails[0].ven_code})
                Category of contract :  ${contractDetails[0].con_category}
                LTC Sub category :  ${subCatString}
                Current Status	:  Returned
                
                Regards,
                IPMS Team
                
                ****This is a system generated mail****`);
          }
          console.log(response.data.message);
          toast.success(response.data.message);
          setTimeout(() => {
            window.location.reload();
            setLoad(false);
          }, 10000);
        }
      } else {
        toast.error("Please enter remarks");
        setLoad(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("CR Return Failed!");
      setLoad(false);
    }
  };

  useEffect(() => {
    const genEmail = async () => {
      try {
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/send/genEmail`, {
          ADID: `${process.env.REACT_APP_ID}`,
          PASS: `${process.env.REACT_APP_PASS}`,
          TO: `${email}`,
          SUB: sub,
          TXT: message,
        });
      } catch (error) {
        console.log("Error in mail Sending", error);
      }
    };
    if (
      email !== undefined &&
      email !== "null" &&
      email !== null &&
      contractDetails !== undefined
    ) {
      genEmail();
    }
  }, [message, email, contractDetails]);

  return (
    <>
      {load && <Loader />}
      <ToastContainer />
      <div className="flex-1 overflow-auto relative pt-16">
        <div className="bg-img absolute inset-0">
          <div className="absolute inset-0 bg-white opacity-85"></div>
          <div className="relative p-4 flex-col justify-between items-center">
            <div className="text-xl font-bold flex-grow text-center">
              Long Term Agreement on Commercial terms & conditions (LTC) Form
            </div>
            <div className="flex w-full md:flex">
              {/* RFQ Textbox */}
              {/* <div class="relative md:flex mb-6">
          <div class="md:w-1/3">
            <label htmlFor="rfq" className="ml-2 text-black font-small">
              RFQ<span className="text-red-500">*</span>
            </label>
          </div>
          <div class="md:w-2/3">
            <input
              type="text"
              id="rfq"
              placeholder="Enter RFQ number"
              className="mr-0 p-0 rounded bg-white border border-gray-400"
              required
            />
          </div>
        </div> */}

              {/* Created by Span */}
              <div className="md:w-2/6 flex">
                <span className="text-black font-small">Created by:</span>
                <span className="ml-2 text-black">
                  {contractDetails !== undefined
                    ? contractDetails[0].con_create_by
                    : ""}
                </span>
              </div>

              {/* Created on Span */}
              <div className="md:w-2/6 flex">
                <span className="text-black font-small">Date:</span>
                <span className="ml-2 text-black">
                  {contractDetails !== undefined
                    ? formatDate(
                        contractDetails[0].con_create_date.split("T")[0]
                      )
                    : ""}
                </span>
              </div>

              {/*Contract Id*/}
              <div className="md:w-2/6 flex">
                <span className="text-black font-small">Contract Id:</span>
                <span className="ml-2 text-black">
                  {contractDetails !== undefined
                    ? `E&P/LTC/${contractDetails[0].ven_code}/${contractDetails[0].con_id}/V${contractDetails[0].con_version}`
                    : ""}
                </span>
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
              <div className="md:2/3 flex items-center">
                {contractDetails !== undefined
                  ? contractDetails[0].ven_code
                  : ""}
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
              <div className="md:w-2/3">{vendorName}</div>
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
              <div className="md:w-2/3">{vendorAddress}</div>
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
              <div className="md:w-2/3">{vendorEmail}</div>
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
              <div className="md:w-2/3">{vendorMobile}</div>
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
                {contractDetails !== undefined
                  ? contractDetails[0].con_category
                  : ""}
              </div>
            </div>

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
                            width: "15%",
                            fontWeight: "bold",
                            textAlign: "center",
                          }}
                        >
                          Years
                          <span className="text-red-500">*</span>
                        </TableCell>
                        <TableCell
                          style={{
                            color: "black",
                            width: "15%",
                            fontWeight: "bold",
                            textAlign: "center",
                          }}
                        >
                          Months
                          <span className="text-red-500">*</span>
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
                      {types?.map(
                        (row, index) =>
                          row.cc_flag && (
                            <TableRow key={index}>
                              <TableCell
                                style={{
                                  color: "black",
                                  width: "20%",
                                  textAlign: "center",
                                }}
                              >
                                {row.cc_con_sub_cat}
                              </TableCell>
                              <TableCell
                                style={{
                                  color: "black",
                                  width: "15%",
                                  textAlign: "center",
                                }}
                              >
                                {row.cc_con_t_years}
                              </TableCell>
                              <TableCell
                                style={{
                                  color: "black",
                                  width: "15%",
                                  textAlign: "center",
                                }}
                              >
                                {row.cc_con_t_months}
                              </TableCell>
                              <TableCell
                                style={{
                                  color: "black",
                                  width: "25%",
                                  textAlign: "center",
                                }}
                              >
                                {formatDate(row.cc_con_s_date.split("T")[0])}
                              </TableCell>
                              <TableCell
                                style={{
                                  color: "black",
                                  width: "25%",
                                  textAlign: "center",
                                }}
                              >
                                {formatDate(row.cc_con_e_date.split("T")[0])}
                              </TableCell>
                            </TableRow>
                          )
                      )}
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
                {contractDetails !== undefined
                  ? contractDetails[0].con_intro
                  : ""}
              </div>
            </div>
            <div className="bg-transparent relative w-full md:flex mb-2">
              <div className="md:w-1/3">
                <label className="ml-2 text-black font-small">
                  Scope<span className="text-red-500">*</span>
                </label>
              </div>
              <div className="md:w-2/3">
                {contractDetails !== undefined
                  ? contractDetails[0].con_scope
                  : ""}
              </div>
            </div>

            <div className="relative w-full md:flex mb-2">
              <div className="md:w-1/3">
                <label className="ml-2 text-black font-small">
                  Deviations<span className="text-red-500">*</span>
                </label>
              </div>
              <div className="md:w-2/3 flex-col">
                {contractDetails !== undefined
                  ? contractDetails[0].con_l_dev_flag === "N"
                    ? "No Deviation OR Deviation in Terms of payment and / or delivery schedule only"
                    : "Any other deviation except Terms of Payment / Delivery Schedule"
                  : ""}
              </div>
            </div>

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
                          width: "50%",
                          fontWeight: "bolder",
                          textAlign: "center",
                        }}
                      >
                        Tendor Documents
                      </TableCell>
                      <TableCell
                        style={{
                          color: "blue",
                          width: "25%",
                          fontWeight: "bolder",
                          textAlign: "center",
                        }}
                      >
                        Flags<span className="text-red-500">*</span>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {chkDet?.map((row, rowIndex) => (
                      <TableRow key={rowIndex}>
                        <TableCell
                          style={{
                            width: "25%",
                            textWrap: "wrap",
                            fontWeight: row.lv2 === null ? "bolder" : "medium",
                            textAlign: "left",
                          }}
                        >
                          {row.lv2 === null ? row.lv1 + ". " : "  "}
                          {row.Clause}
                        </TableCell>
                        <TableCell style={{ width: "50%", textAlign: "left" }}>
                          <textarea
                            className="w-full p-1 bg-blue-50 rounded shadow-md"
                            type="text"
                            disabled
                            style={{ minHeight: "30px" }}
                            value={row.document === "null" ? "" : row.document}
                          />
                        </TableCell>
                        <TableCell style={{ width: "25%" }}>
                          {row.flag == "Y"
                            ? "Yes"
                            : row.flag == "N"
                            ? "No"
                            : row.flag == "NA"
                            ? "NA"
                            : ""}
                          {(row.flag === "N" || row.flag === "NA") && (
                            <div>
                              {row.remarks == "null" || row.remarks == null
                                ? ""
                                : row.remarks}
                            </div>
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
                {contractDetails !== undefined
                  ? contractDetails[0].con_otc
                  : ""}
              </div>
            </div>
            <div className="relative w-full md:flex mb-2">
              <div className="md:w-1/3">
                <label className="ml-2 text-black font-small">
                  Commercial Recommendation
                </label>
              </div>
              <div className="md:w-2/3">
                {contractDetails !== undefined
                  ? contractDetails[0].con_osc
                  : ""}
              </div>
            </div>

            <div className="flex-col items-center rounded-xl">
              <div className="bg-blue-200 text-xl rounded-t-xl font-bold justify-start px-2">
                Attachments
              </div>
              <div>
                <div className="relative w-full md:flex mb-2">
                  <div className="md:w-1/3">
                    <label className="ml-2 text-black font-small">
                      Contract shared with vendor
                    </label>
                  </div>
                  <div className="md:w-2/3">
                    {contractDetails !== undefined ? (
                      <button
                        onClick={() => {
                          const id = contractDetails[0].con_VSF;
                          handleFetchFile(id);
                        }}
                      >
                        {contractDetails[0].con_VSF}
                      </button>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <div className="relative w-full md:flex mb-2">
                  <div className="md:w-1/3">
                    <label className="ml-2 text-black font-small">
                      Vendor Signed Contract
                    </label>
                  </div>
                  <div className="md:w-2/3">
                    {contractDetails !== undefined ? (
                      <button
                        onClick={() => {
                          const id = contractDetails[0].con_VSgF;
                          handleFetchFile(id);
                        }}
                      >
                        {contractDetails[0].con_VSgF}
                      </button>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <div className="relative w-full md:flex mb-2">
                  <div className="md:w-1/3">
                    <label className="ml-2 text-black font-small">
                      Final Deviations list
                    </label>
                  </div>
                  <div className="md:w-2/3">
                    {contractDetails !== undefined ? (
                      <button
                        onClick={() => {
                          const id = contractDetails[0].con_DF;
                          handleFetchFile(id);
                        }}
                      >
                        {contractDetails[0].con_DF}
                      </button>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-col items-center rounded-xl">
              <div className="bg-blue-200 text-xl rounded-t-xl font-bold justify-start px-2">
                Approval Matrix
              </div>
              <div className="bg-blue-50 rounded-b-xl">
                {appDet?.map((app, appIndex) => (
                  <div key={appIndex} className="bg-transparent">
                    {app.cam_role === "Proposer" && (
                      <div className="w-full md:flex mb-2 mt-4">
                        <div className="md:w-1/3 flex items-start">
                          <label className="ml-2 text-black font-small">
                            {app.cam_role}
                            <span className="text-red-500">*</span>
                          </label>
                        </div>
                        <div className="md:w-2/3 flex items-start">
                          <div className="md:w-1/3">{app.cam_approver}</div>
                          {app.cam_app_elg &&
                          app.cam_approver.split("|")[0] == param1 ? (
                            <div className="md:w-2/3 flex-col">
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
                              <div className="md:w-full flex items-start">
                                <textarea
                                  className="px-2 bg-white-50 border-black border-2 rounded shadow-xl"
                                  type="text"
                                  onInput={autoResize}
                                  required
                                  onChange={(e) => {
                                    setRem(e.target.value);
                                  }}
                                  style={{ minWidth: "400px" }}
                                />
                                <div className="flex justify-end space-x-2">
                                  <div>
                                    <button
                                      className="hover:-translate-y-1"
                                      onClick={() => {
                                        handleApprove(
                                          app.cam_lv,
                                          app.cam_role,
                                          app.cam_approver,
                                          rem,
                                          app.cam_app_version
                                        );
                                      }}
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="35"
                                        height="35"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        id="verified"
                                      >
                                        <path
                                          fill="#C3FDF3"
                                          d="M10.8843 3.55009C11.2538 2.81664 12.3009 2.81664 12.6704 3.55009L13.6627 5.51966C13.8855 5.96205 14.3987 6.17461 14.8691 6.01938L16.9634 5.3283C17.7433 5.07095 18.4838 5.81139 18.2264 6.59129L17.5353 8.68561C17.3801 9.15602 17.5926 9.66917 18.035 9.89204L20.0046 10.8843C20.7381 11.2538 20.7381 12.3009 20.0046 12.6704L18.035 13.6627C17.5926 13.8855 17.3801 14.3987 17.5353 14.8691L18.2264 16.9634C18.4838 17.7433 17.7433 18.4838 16.9634 18.2264L14.8691 17.5353C14.3987 17.3801 13.8855 17.5926 13.6627 18.035L12.6704 20.0046C12.3009 20.7381 11.2538 20.7381 10.8843 20.0046L9.89204 18.035C9.66917 17.5926 9.15602 17.3801 8.68561 17.5353L6.59129 18.2264C5.81139 18.4838 5.07095 17.7433 5.3283 16.9634L6.01938 14.8691C6.17461 14.3987 5.96205 13.8855 5.51966 13.6627L3.55009 12.6704C2.81664 12.3009 2.81664 11.2538 3.55009 10.8843L5.51966 9.89204C5.96205 9.66917 6.17461 9.15602 6.01938 8.68561L5.3283 6.59129C5.07095 5.81139 5.81139 5.07095 6.59129 5.3283L8.68561 6.01938C9.15602 6.17461 9.66917 5.96205 9.89204 5.51966L10.8843 3.55009Z"
                                        ></path>
                                        <path
                                          stroke="#079B7F"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                          stroke-width="1.5"
                                          d="M9 12L11 14L15 10"
                                        ></path>
                                      </svg>
                                    </button>
                                  </div>
                                  <div>
                                    <button
                                      className="hover:-translate-y-1"
                                      onClick={() => {
                                        handleReturn(app.cam_lv, rem);
                                      }}
                                    >
                                      <img
                                        src={returnUri}
                                        height="35"
                                        width="30"
                                        alt="Return"
                                      />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="md:w-2/3 flex-col">
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
                              {/* <div className="md:w-full flex items-start bg-transparent text-black text-xs">
                              <div className="md:w-3/12">
                                Version: {app.cam_app_version}
                              </div>
                              <div className="md:w-6/12">
                                Remarks: {app.cam_app_remarks === "NA"
                                  ? ""
                                  : app.cam_app_remarks}
                              </div>
                              {app.cam_app_date !== null && (
                                <div className="md:w-3/12">
                                  {app.cam_app_status ? (
                                    <span>Approved</span>
                                  ) : (
                                    <span>Returned</span>
                                  )}
                                </div>
                              )}
                            </div> */}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {app.cam_role === "Additional Proposer" && (
                      <div className="w-full md:flex mb-2 mt-4">
                        <div className="md:w-1/3 flex items-start">
                          <label className="ml-2 text-black font-small">
                            {app.cam_role}
                            <span className="text-red-500">*</span>
                          </label>
                        </div>
                        <div className="md:w-2/3 flex items-start">
                          <div className="md:w-1/3">{app.cam_approver}</div>
                          {app.cam_app_elg &&
                          app.cam_approver.split("|")[0] == param1 ? (
                            <div className="md:w-2/3 flex-col">
                              {appArcDet?.map((appArc, appArcIndex) => (
                                <div
                                  key={appArcIndex}
                                  className="md:w-full flex items-start bg-transparent text-black text-xs"
                                >
                                  {appArc.cam_role ===
                                    "Additional Proposer" && (
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
                              <div className="md:w-full flex items-start">
                                <textarea
                                  className="px-2 bg-white-50 border-black border-2 rounded shadow-xl"
                                  type="text"
                                  onInput={autoResize}
                                  required
                                  onChange={(e) => {
                                    setRem(e.target.value);
                                  }}
                                  style={{ minWidth: "400px" }}
                                />
                                <div className="flex justify-end space-x-2">
                                  <div>
                                    <button
                                      className="hover:-translate-y-1"
                                      onClick={() => {
                                        handleApprove(
                                          app.cam_lv,
                                          app.cam_role,
                                          app.cam_approver,
                                          rem,
                                          app.cam_app_version
                                        );
                                      }}
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="35"
                                        height="35"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        id="verified"
                                      >
                                        <path
                                          fill="#C3FDF3"
                                          d="M10.8843 3.55009C11.2538 2.81664 12.3009 2.81664 12.6704 3.55009L13.6627 5.51966C13.8855 5.96205 14.3987 6.17461 14.8691 6.01938L16.9634 5.3283C17.7433 5.07095 18.4838 5.81139 18.2264 6.59129L17.5353 8.68561C17.3801 9.15602 17.5926 9.66917 18.035 9.89204L20.0046 10.8843C20.7381 11.2538 20.7381 12.3009 20.0046 12.6704L18.035 13.6627C17.5926 13.8855 17.3801 14.3987 17.5353 14.8691L18.2264 16.9634C18.4838 17.7433 17.7433 18.4838 16.9634 18.2264L14.8691 17.5353C14.3987 17.3801 13.8855 17.5926 13.6627 18.035L12.6704 20.0046C12.3009 20.7381 11.2538 20.7381 10.8843 20.0046L9.89204 18.035C9.66917 17.5926 9.15602 17.3801 8.68561 17.5353L6.59129 18.2264C5.81139 18.4838 5.07095 17.7433 5.3283 16.9634L6.01938 14.8691C6.17461 14.3987 5.96205 13.8855 5.51966 13.6627L3.55009 12.6704C2.81664 12.3009 2.81664 11.2538 3.55009 10.8843L5.51966 9.89204C5.96205 9.66917 6.17461 9.15602 6.01938 8.68561L5.3283 6.59129C5.07095 5.81139 5.81139 5.07095 6.59129 5.3283L8.68561 6.01938C9.15602 6.17461 9.66917 5.96205 9.89204 5.51966L10.8843 3.55009Z"
                                        ></path>
                                        <path
                                          stroke="#079B7F"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                          stroke-width="1.5"
                                          d="M9 12L11 14L15 10"
                                        ></path>
                                      </svg>
                                    </button>
                                  </div>
                                  <div>
                                    <button
                                      className="hover:-translate-y-1"
                                      onClick={() => {
                                        handleReturn(app.cam_lv, rem);
                                      }}
                                    >
                                      <img
                                        src={returnUri}
                                        height="35"
                                        width="30"
                                        alt="Return"
                                      />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="md:w-2/3 flex-col">
                              {appArcDet?.map((appArc, appArcIndex) => (
                                <div
                                  key={appArcIndex}
                                  className="md:w-full flex items-start bg-transparent text-black text-xs"
                                >
                                  {appArc.cam_role ===
                                    "Additional Proposer" && (
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
                              {/* <div className="md:w-full flex items-start bg-transparent text-black text-xs">
                              <div className="md:w-3/12">
                                Version: {app.cam_app_version}
                              </div>
                              <div className="md:w-6/12">
                                Remarks: {app.cam_app_remarks === "NA"
                                  ? ""
                                  : app.cam_app_remarks}
                              </div>
                              {app.cam_app_date !== null && (
                                <div className="md:w-3/12">
                                  {app.cam_app_status ? (
                                    <span>Approved</span>
                                  ) : (
                                    <span>Returned</span>
                                  )}
                                </div>
                              )}
                            </div> */}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    {app.cam_role === "Verifier" && (
                      <div className="w-full md:flex mb-2 mt-4">
                        <div className="md:w-1/3 flex items-start">
                          <label className="ml-2 text-black font-small">
                            {app.cam_role}
                            <span className="text-red-500">*</span>
                          </label>
                        </div>
                        <div className="md:w-2/3 flex items-start">
                          <div className="md:w-1/3">{app.cam_approver}</div>
                          {app.cam_app_elg &&
                          app.cam_approver.split("|")[0] == param1 ? (
                            <div className="md:w-2/3 flex-col">
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
                              <div className="md:w-full flex items-start">
                                <textarea
                                  className="px-2 bg-white-50 border-black border-2 rounded shadow-xl"
                                  type="text"
                                  onInput={autoResize}
                                  required
                                  onChange={(e) => {
                                    setRem(e.target.value);
                                  }}
                                  style={{ minWidth: "400px" }}
                                />
                                <div className="flex justify-end space-x-2">
                                  <div>
                                    <button
                                      className="hover:-translate-y-1"
                                      onClick={() => {
                                        handleApprove(
                                          app.cam_lv,
                                          app.cam_role,
                                          app.cam_approver,
                                          rem,
                                          app.cam_app_version
                                        );
                                      }}
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="35"
                                        height="35"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        id="verified"
                                      >
                                        <path
                                          fill="#C3FDF3"
                                          d="M10.8843 3.55009C11.2538 2.81664 12.3009 2.81664 12.6704 3.55009L13.6627 5.51966C13.8855 5.96205 14.3987 6.17461 14.8691 6.01938L16.9634 5.3283C17.7433 5.07095 18.4838 5.81139 18.2264 6.59129L17.5353 8.68561C17.3801 9.15602 17.5926 9.66917 18.035 9.89204L20.0046 10.8843C20.7381 11.2538 20.7381 12.3009 20.0046 12.6704L18.035 13.6627C17.5926 13.8855 17.3801 14.3987 17.5353 14.8691L18.2264 16.9634C18.4838 17.7433 17.7433 18.4838 16.9634 18.2264L14.8691 17.5353C14.3987 17.3801 13.8855 17.5926 13.6627 18.035L12.6704 20.0046C12.3009 20.7381 11.2538 20.7381 10.8843 20.0046L9.89204 18.035C9.66917 17.5926 9.15602 17.3801 8.68561 17.5353L6.59129 18.2264C5.81139 18.4838 5.07095 17.7433 5.3283 16.9634L6.01938 14.8691C6.17461 14.3987 5.96205 13.8855 5.51966 13.6627L3.55009 12.6704C2.81664 12.3009 2.81664 11.2538 3.55009 10.8843L5.51966 9.89204C5.96205 9.66917 6.17461 9.15602 6.01938 8.68561L5.3283 6.59129C5.07095 5.81139 5.81139 5.07095 6.59129 5.3283L8.68561 6.01938C9.15602 6.17461 9.66917 5.96205 9.89204 5.51966L10.8843 3.55009Z"
                                        ></path>
                                        <path
                                          stroke="#079B7F"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                          stroke-width="1.5"
                                          d="M9 12L11 14L15 10"
                                        ></path>
                                      </svg>
                                    </button>
                                  </div>
                                  <div>
                                    <button
                                      className="hover:-translate-y-1"
                                      onClick={() => {
                                        handleReturn(app.cam_lv, rem);
                                      }}
                                    >
                                      <img
                                        src={returnUri}
                                        height="35"
                                        width="30"
                                        alt="Return"
                                      />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="md:w-2/3 flex-col">
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
                              {/* <div className="md:w-full flex items-start bg-transparent text-black text-xs">
                              <div className="md:w-3/12">
                                Version: {app.cam_app_version}
                              </div>
                              <div className="md:w-6/12">
                                Remarks: {app.cam_app_remarks === "NA"
                                  ? ""
                                  : app.cam_app_remarks}
                              </div>
                              {app.cam_app_date !== null && (
                                <div className="md:w-3/12">
                                  {app.cam_app_status ? (
                                    <span>Approved</span>
                                  ) : (
                                    <span>Returned</span>
                                  )}
                                </div>
                              )}
                            </div> */}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {app.cam_role === "Recommender #1" && (
                      <div className="w-full md:flex mb-2 mt-4">
                        <div className="md:w-1/3 flex items-start">
                          <label className="ml-2 text-black font-small">
                            {app.cam_role}
                            <span className="text-red-500">*</span>
                          </label>
                        </div>
                        <div className="md:w-2/3 flex items-start">
                          <div className="md:w-1/3">{app.cam_approver}</div>
                          {app.cam_app_elg &&
                          app.cam_approver.split("|")[0] == param1 ? (
                            <div className="md:w-2/3 flex-col">
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
                              <div className="md:w-full flex items-start">
                                <textarea
                                  className="px-2 bg-white-50 border-black border-2 rounded shadow-xl"
                                  type="text"
                                  onInput={autoResize}
                                  required
                                  onChange={(e) => {
                                    setRem(e.target.value);
                                  }}
                                  style={{ minWidth: "400px" }}
                                />
                                <div className="flex justify-end space-x-2">
                                  <div>
                                    <button
                                      className="hover:-translate-y-1"
                                      onClick={() => {
                                        handleApprove(
                                          app.cam_lv,
                                          app.cam_role,
                                          app.cam_approver,
                                          rem,
                                          app.cam_app_version
                                        );
                                      }}
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="35"
                                        height="35"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        id="verified"
                                      >
                                        <path
                                          fill="#C3FDF3"
                                          d="M10.8843 3.55009C11.2538 2.81664 12.3009 2.81664 12.6704 3.55009L13.6627 5.51966C13.8855 5.96205 14.3987 6.17461 14.8691 6.01938L16.9634 5.3283C17.7433 5.07095 18.4838 5.81139 18.2264 6.59129L17.5353 8.68561C17.3801 9.15602 17.5926 9.66917 18.035 9.89204L20.0046 10.8843C20.7381 11.2538 20.7381 12.3009 20.0046 12.6704L18.035 13.6627C17.5926 13.8855 17.3801 14.3987 17.5353 14.8691L18.2264 16.9634C18.4838 17.7433 17.7433 18.4838 16.9634 18.2264L14.8691 17.5353C14.3987 17.3801 13.8855 17.5926 13.6627 18.035L12.6704 20.0046C12.3009 20.7381 11.2538 20.7381 10.8843 20.0046L9.89204 18.035C9.66917 17.5926 9.15602 17.3801 8.68561 17.5353L6.59129 18.2264C5.81139 18.4838 5.07095 17.7433 5.3283 16.9634L6.01938 14.8691C6.17461 14.3987 5.96205 13.8855 5.51966 13.6627L3.55009 12.6704C2.81664 12.3009 2.81664 11.2538 3.55009 10.8843L5.51966 9.89204C5.96205 9.66917 6.17461 9.15602 6.01938 8.68561L5.3283 6.59129C5.07095 5.81139 5.81139 5.07095 6.59129 5.3283L8.68561 6.01938C9.15602 6.17461 9.66917 5.96205 9.89204 5.51966L10.8843 3.55009Z"
                                        ></path>
                                        <path
                                          stroke="#079B7F"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                          stroke-width="1.5"
                                          d="M9 12L11 14L15 10"
                                        ></path>
                                      </svg>
                                    </button>
                                  </div>
                                  <div>
                                    <button
                                      className="hover:-translate-y-1"
                                      onClick={() => {
                                        handleReturn(app.cam_lv, rem);
                                      }}
                                    >
                                      <img
                                        src={returnUri}
                                        height="35"
                                        width="30"
                                        alt="Return"
                                      />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="md:w-2/3 flex-col">
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
                              {/* <div className="md:w-full flex items-start bg-transparent text-black text-xs">
                              <div className="md:w-3/12">
                                Version: {app.cam_app_version}
                              </div>
                              <div className="md:w-6/12">
                                Remarks: {app.cam_app_remarks === "NA"
                                  ? ""
                                  : app.cam_app_remarks}
                              </div>
                              {app.cam_app_date !== null && (
                                <div className="md:w-3/12">
                                  {app.cam_app_status ? (
                                    <span>Approved</span>
                                  ) : (
                                    <span>Returned</span>
                                  )}
                                </div>
                              )}
                            </div> */}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {app.cam_role === "Recommender #2" && (
                      <div className="w-full md:flex mb-2 mt-4">
                        <div className="md:w-1/3 flex items-start">
                          <label className="ml-2 text-black font-small">
                            {app.cam_role}
                            <span className="text-red-500">*</span>
                          </label>
                        </div>
                        <div className="md:w-2/3 flex items-start">
                          <div className="md:w-1/3">{app.cam_approver}</div>
                          {app.cam_app_elg &&
                          app.cam_approver.split("|")[0] == param1 ? (
                            <div className="md:w-2/3 flex-col">
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
                              <div className="md:w-full flex items-start">
                                <textarea
                                  className="px-2 bg-white-50 border-black border-2 rounded shadow-xl"
                                  type="text"
                                  onInput={autoResize}
                                  required
                                  onChange={(e) => {
                                    setRem(e.target.value);
                                  }}
                                  style={{ minWidth: "400px" }}
                                />
                                <div className="flex justify-end space-x-2">
                                  <div>
                                    <button
                                      className="hover:-translate-y-1"
                                      onClick={() => {
                                        handleApprove(
                                          app.cam_lv,
                                          app.cam_role,
                                          app.cam_approver,
                                          rem,
                                          app.cam_app_version
                                        );
                                      }}
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="35"
                                        height="35"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        id="verified"
                                      >
                                        <path
                                          fill="#C3FDF3"
                                          d="M10.8843 3.55009C11.2538 2.81664 12.3009 2.81664 12.6704 3.55009L13.6627 5.51966C13.8855 5.96205 14.3987 6.17461 14.8691 6.01938L16.9634 5.3283C17.7433 5.07095 18.4838 5.81139 18.2264 6.59129L17.5353 8.68561C17.3801 9.15602 17.5926 9.66917 18.035 9.89204L20.0046 10.8843C20.7381 11.2538 20.7381 12.3009 20.0046 12.6704L18.035 13.6627C17.5926 13.8855 17.3801 14.3987 17.5353 14.8691L18.2264 16.9634C18.4838 17.7433 17.7433 18.4838 16.9634 18.2264L14.8691 17.5353C14.3987 17.3801 13.8855 17.5926 13.6627 18.035L12.6704 20.0046C12.3009 20.7381 11.2538 20.7381 10.8843 20.0046L9.89204 18.035C9.66917 17.5926 9.15602 17.3801 8.68561 17.5353L6.59129 18.2264C5.81139 18.4838 5.07095 17.7433 5.3283 16.9634L6.01938 14.8691C6.17461 14.3987 5.96205 13.8855 5.51966 13.6627L3.55009 12.6704C2.81664 12.3009 2.81664 11.2538 3.55009 10.8843L5.51966 9.89204C5.96205 9.66917 6.17461 9.15602 6.01938 8.68561L5.3283 6.59129C5.07095 5.81139 5.81139 5.07095 6.59129 5.3283L8.68561 6.01938C9.15602 6.17461 9.66917 5.96205 9.89204 5.51966L10.8843 3.55009Z"
                                        ></path>
                                        <path
                                          stroke="#079B7F"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                          stroke-width="1.5"
                                          d="M9 12L11 14L15 10"
                                        ></path>
                                      </svg>
                                    </button>
                                  </div>
                                  <div>
                                    <button
                                      className="hover:-translate-y-1"
                                      onClick={() => {
                                        handleReturn(app.cam_lv, rem);
                                      }}
                                    >
                                      <img
                                        src={returnUri}
                                        height="35"
                                        width="30"
                                        alt="Return"
                                      />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="md:w-2/3 flex-col">
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
                              {/* <div className="md:w-full flex items-start bg-transparent text-black text-xs">
                              <div className="md:w-3/12">
                                Version: {app.cam_app_version}
                              </div>
                              <div className="md:w-6/12">  
                                Remarks: {app.cam_app_remarks === "NA"
                                  ? ""
                                  : app.cam_app_remarks}
                              </div>
                              {app.cam_app_date !== null && (
                                <div className="md:w-3/12">
                                  {app.cam_app_status ? (
                                    <span>Approved</span>
                                  ) : (
                                    <span>Returned</span>
                                  )}
                                </div>
                              )}
                            </div> */}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {app.cam_role === "Approver" && (
                      <div className="w-full md:flex mb-2 mt-4">
                        <div className="md:w-1/3 flex items-start">
                          <label className="ml-2 text-black font-small">
                            {app.cam_role}
                            <span className="text-red-500">*</span>
                          </label>
                        </div>
                        <div className="md:w-2/3 flex items-start">
                          <div className="md:w-1/3">{app.cam_approver}</div>
                          {app.cam_app_elg &&
                          app.cam_approver.split("|")[0] == param1 ? (
                            <div className="md:w-2/3 flex-col">
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
                              <div className="md:w-full flex items-start">
                                <textarea
                                  className="px-2 bg-white-50 border-black border-2 rounded shadow-xl"
                                  type="text"
                                  onInput={autoResize}
                                  required
                                  onChange={(e) => {
                                    setRem(e.target.value);
                                  }}
                                  style={{ minWidth: "400px" }}
                                />
                                <div className="flex justify-end space-x-2">
                                  <div>
                                    <button
                                      className="hover:-translate-y-1"
                                      onClick={() => {
                                        handleApprove(
                                          app.cam_lv,
                                          app.cam_role,
                                          app.cam_approver,
                                          rem,
                                          app.cam_app_version
                                        );
                                      }}
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="35"
                                        height="35"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        id="verified"
                                      >
                                        <path
                                          fill="#C3FDF3"
                                          d="M10.8843 3.55009C11.2538 2.81664 12.3009 2.81664 12.6704 3.55009L13.6627 5.51966C13.8855 5.96205 14.3987 6.17461 14.8691 6.01938L16.9634 5.3283C17.7433 5.07095 18.4838 5.81139 18.2264 6.59129L17.5353 8.68561C17.3801 9.15602 17.5926 9.66917 18.035 9.89204L20.0046 10.8843C20.7381 11.2538 20.7381 12.3009 20.0046 12.6704L18.035 13.6627C17.5926 13.8855 17.3801 14.3987 17.5353 14.8691L18.2264 16.9634C18.4838 17.7433 17.7433 18.4838 16.9634 18.2264L14.8691 17.5353C14.3987 17.3801 13.8855 17.5926 13.6627 18.035L12.6704 20.0046C12.3009 20.7381 11.2538 20.7381 10.8843 20.0046L9.89204 18.035C9.66917 17.5926 9.15602 17.3801 8.68561 17.5353L6.59129 18.2264C5.81139 18.4838 5.07095 17.7433 5.3283 16.9634L6.01938 14.8691C6.17461 14.3987 5.96205 13.8855 5.51966 13.6627L3.55009 12.6704C2.81664 12.3009 2.81664 11.2538 3.55009 10.8843L5.51966 9.89204C5.96205 9.66917 6.17461 9.15602 6.01938 8.68561L5.3283 6.59129C5.07095 5.81139 5.81139 5.07095 6.59129 5.3283L8.68561 6.01938C9.15602 6.17461 9.66917 5.96205 9.89204 5.51966L10.8843 3.55009Z"
                                        ></path>
                                        <path
                                          stroke="#079B7F"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                          stroke-width="1.5"
                                          d="M9 12L11 14L15 10"
                                        ></path>
                                      </svg>
                                    </button>
                                  </div>
                                  <div>
                                    <button
                                      className="hover:-translate-y-1"
                                      onClick={() => {
                                        handleReturn(app.cam_lv, rem);
                                      }}
                                    >
                                      <img
                                        src={returnUri}
                                        height="35"
                                        width="30"
                                        alt="Return"
                                      />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="md:w-2/3 flex-col">
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
                              {/* <div className="md:w-full flex items-start bg-transparent text-black text-xs">
                              <div className="md:w-3/12">
                                Version: {app.cam_app_version}
                              </div>
                              <div className="md:w-6/12">  
                                Remarks: {app.cam_app_remarks === "NA"
                                  ? ""
                                  : app.cam_app_remarks}
                              </div>
                              {app.cam_app_date !== null && (
                                <div className="md:w-3/12">
                                  {app.cam_app_status ? (
                                    <span>Approved</span>
                                  ) : (
                                    <span>Returned</span>
                                  )}
                                </div>
                              )}
                            </div> */}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
