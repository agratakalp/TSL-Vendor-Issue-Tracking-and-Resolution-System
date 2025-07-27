import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import { RadioGroup, Radio, FormControlLabel } from "@mui/material";

// Helper function to compute the current stage

function OvocMis() {
  const [misType, setMisType] = useState("Current");
  const [data, setData] = useState();
  const [filteredData, setFilteredData] = useState();
  const [fetchData, setFetchData] = useState("fetch");
  const [filters, setFilters] = useState({
    con_id: "",
    con_version: "",
    INV_NAME: "",
    INV_VENDOR_CODE: "",
    cc_con_cat: "",
    cc_con_sub_cat: "",
    cc_con_t_years: "",
    cc_con_t_months: "",
    cc_con_s_date: "",
    cc_con_e_date: "",
    con_modify_by: "",
    con_modify_date: "",
    con_l_dev_flag: "",
    con_legacy: "",
    Proposer: "",
    Action_DateTime_Proposer: "",
    Additional_Proposer: "",
    Action_DateTime_Additional_Proposer: "",
    Verifier: "",
    Action_DateTime_Verifier: "",
    Recommender_1: "",
    Action_DateTime_Recommender_1: "",
    Recommender_2: "",
    Action_DateTime_Recommender_2: "",
    Approver: "",
    Action_DateTime_Approver: "",
    Current_Stage: "",
    Ageing_days: "",
    con_exp: "",
  });

  const formatDate = (dateString) => {
    if(dateString != null){
      const date = new Date(dateString);
      return date.toString().substring(0, 15);
    } else {
      return "";
    }
  };

  const computeCurrentStage = (row) => {
    const {
      Action_DateTime_Proposer,
      Proposer,
      Action_DateTime_Additional_Proposer,
      Additional_Proposer,
      Action_DateTime_Recommender_1,
      Recommender_1,
      Action_DateTime_Recommender_2,
      Recommender_2,
      Action_DateTime_Verifier,
      Verifier,
      Action_DateTime_Approver,
      Approver,
    } = row;
    if (Action_DateTime_Proposer == null && Proposer != null)
      return "Pending with Proposer";
    else if (
      Action_DateTime_Additional_Proposer == null &&
      Additional_Proposer != null
    )
      return "Pending with Verifier";
    else if (Action_DateTime_Verifier == null && Verifier != null)
      return "Pending with Verifier";
    else if (Action_DateTime_Recommender_1 == null && Recommender_1 != null)
      return "Pending with Verifier";
    else if (Action_DateTime_Recommender_2 == null && Recommender_2 != null)
      return "Pending with Verifier";
    else if (Action_DateTime_Approver == null && Approver != null)
      return "Pending with Approver";
    return "Completed";
  };

  const handleMisType = (event) => {
    setMisType(event.target.value);
    setFetchData("fetch");
  };

  useEffect(() => {
    const fetchMisData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/get/misData`
        );
        if (response) {
          setData(response.data.data);
          setFilteredData(response.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const fetchArchiveData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/get/misArchiveData`
        );
        if (response) {
          setData(response.data.data);
          setFilteredData(response.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (fetchData === "fetch" && misType === "Current") {
      setFilters({
        con_id: "",
        con_version: "",
        INV_NAME: "",
        INV_VENDOR_CODE: "",
        cc_con_cat: "",
        cc_con_sub_cat: "",
        cc_con_t_years: "",
        cc_con_t_months: "",
        cc_con_s_date: "",
        cc_con_e_date: "",
        con_modify_by: "",
        con_modify_date: "",
        con_l_dev_flag: "",
        con_legacy: "",
        Proposer: "",
        Action_DateTime_Proposer: "",
        Additional_Proposer: "",
        Action_DateTime_Additional_Proposer: "",
        Verifier: "",
        Action_DateTime_Verifier: "",
        Recommender_1: "",
        Action_DateTime_Recommender_1: "",
        Recommender_2: "",
        Action_DateTime_Recommender_2: "",
        Approver: "",
        Action_DateTime_Approver: "",
        Current_Stage: "",
        Ageing_days: "",
        con_exp: "",
      });
      fetchMisData();
      setFetchData("do not fetch");
    } else if (fetchData === "fetch" && misType === "Approved") {
      setFilters({
        con_id: "",
        con_version: "",
        INV_NAME: "",
        INV_VENDOR_CODE: "",
        cc_con_cat: "",
        cc_con_sub_cat: "",
        cc_con_t_years: "",
        cc_con_t_months: "",
        cc_con_s_date: "",
        cc_con_e_date: "",
        con_modify_by: "",
        con_modify_date: "",
        con_l_dev_flag: "",
        con_legacy: "",
        Proposer: "",
        Action_DateTime_Proposer: "",
        Additional_Proposer: "",
        Action_DateTime_Additional_Proposer: "",
        Verifier: "",
        Action_DateTime_Verifier: "",
        Recommender_1: "",
        Action_DateTime_Recommender_1: "",
        Recommender_2: "",
        Action_DateTime_Recommender_2: "",
        Approver: "",
        Action_DateTime_Approver: "",
        Current_Stage: "",
        Ageing_days: "",
        con_exp: "",
      });
      fetchArchiveData();
      setFetchData("do not fetch");
    } else {
      return;
    }
  }, [fetchData, misType]);

  // Helper function to convert string dates to Date objects
  const stringToDate = (dateStr) => {
    if (dateStr === "NULL" || !dateStr) return null;
    return new Date(dateStr);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  useEffect(() => {
    const filtered = data?.filter((row) => {
      return Object.keys(filters).every((key) => {
        if (key === "Current_Stage") {
          return computeCurrentStage(row)
            .toLowerCase()
            .includes(filters[key].toLowerCase());
        } else if (key === "cc_con_s_date" || key === "cc_con_e_date") {
          const filterDate = filters[key] ? new Date(filters[key]) : null;
          const rowDate = stringToDate(row[key]);

          // For start date, we include records on or after the selected date
          if (key === "cc_con_s_date" && filterDate && rowDate) {
            return rowDate >= filterDate;
          }

          // For end date, we include records on or before the selected date
          if (key === "cc_con_e_date" && filterDate && rowDate) {
            return rowDate <= filterDate;
          }

          return true;
        } else {
          return String(row[key])
            .toLowerCase()
            .includes(filters[key].toLowerCase());
        }
      });
    });
    setFilteredData(filtered);
  }, [filters]);

  const handleDownloadExcel = () => {
    const processedData = filteredData.map((row) => ({
      ...row,
      Current_Stage: computeCurrentStage(row),
    }));
    const ws = XLSX.utils.json_to_sheet(processedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "table-data.xlsx");
  };

  return (
    <div className="p-4">
      <div className="mb-2">
        <RadioGroup
          row
          required
          defaultValue={"Current"}
          onChange={handleMisType}
        >
          <FormControlLabel
            className="ml-4"
            value="Current"
            control={<Radio />}
            label="Under Approval"
          />
          <FormControlLabel
            className="ml-4"
            value="Approved"
            control={<Radio />}
            label="Approved"
          />
        </RadioGroup>
      </div>
      <button
        className="flex items-center hover:text-green-500 mb-4"
        onClick={handleDownloadExcel}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          width="32px"
          height="px"
        >
          <path
            fill="#169154"
            d="M29,6H15.744C14.781,6,14,6.781,14,7.744v7.259h15V6z"
          />
          <path
            fill="#18482a"
            d="M14,33.054v7.202C14,41.219,14.781,42,15.743,42H29v-8.946H14z"
          />
          <path fill="#0c8045" d="M14 15.003H29V24.005000000000003H14z" />
          <path fill="#17472a" d="M14 24.005H29V33.055H14z" />
          <g>
            <path
              fill="#29c27f"
              d="M42.256,6H29v9.003h15V7.744C44,6.781,43.219,6,42.256,6z"
            />
            <path
              fill="#27663f"
              d="M29,33.054V42h13.257C43.219,42,44,41.219,44,40.257v-7.202H29z"
            />
            <path fill="#19ac65" d="M29 15.003H44V24.005000000000003H29z" />
            <path fill="#129652" d="M29 24.005H44V33.055H29z" />
          </g>
          <path
            fill="#0c7238"
            d="M22.319,34H5.681C4.753,34,4,33.247,4,32.319V15.681C4,14.753,4.753,14,5.681,14h16.638 C23.247,14,24,14.753,24,15.681v16.638C24,33.247,23.247,34,22.319,34z"
          />
          <path
            fill="#fff"
            d="M9.807 19L12.193 19 14.129 22.754 16.175 19 18.404 19 15.333 24 18.474 29 16.123 29 14.013 25.07 11.912 29 9.526 29 12.719 23.982z"
          />
        </svg>
        <span>Excel</span>
      </button>

      <div className="overflow-x-auto rounded-lg border-black">
        {/* Container to enable horizontal scroll */}
        {misType === "Current" ? (
          <table className="min-w-full bg-white border border-black rounded-lg">
            <thead className="text-xs">
              <tr className="bg-blue-200">
                <th className="border border-black p-2">Request ID</th>
                <th className="border border-black p-2">Version</th>
                <th className="border border-black p-2">Vendor Name</th>
                <th className="border border-black p-2">Vendor Code</th>
                <th className="border border-black p-2">Applicable LTC</th>
                <th className="border border-black p-2">LTC Type</th>
                <th className="border border-black p-2">Validity(Years)</th>
                <th className="border border-black p-2">Validity(Months)</th>
                <th className="border border-black p-2">Start Date</th>
                <th className="border border-black p-2">End Date</th>
                <th className="border border-black p-2">Register By</th>
                <th className="border border-black p-2">Register Date</th>
                <th className="border border-black p-2">Deviations</th>
                <th className="border border-black p-2">Legacy</th>
                <th className="border border-black p-2">Proposer</th>
                <th className="border border-black p-2">
                  Action DateTime Proposer
                </th>
                <th className="border border-black p-2">Additional Proposer</th>
                <th className="border border-black p-2">
                  Action_DateTime Additional Proposer
                </th>
                <th className="border border-black p-2">Verifier</th>
                <th className="border border-black p-2">
                  Action DateTime Verifier
                </th>
                <th className="border border-black p-2">Recommender 1</th>
                <th className="border border-black p-2">
                  Action DateTime Recommender 1
                </th>
                <th className="border border-black p-2">Recommender 2</th>
                <th className="border border-black p-2">
                  Action DateTime Recommender 2
                </th>
                <th className="border border-black p-2">Approver</th>
                <th className="border border-black p-2">
                  Action DateTime Approver
                </th>
                <th className="border border-black p-2">Current Stage</th>
                <th className="border border-black p-2">Ageing (Days)</th>
              </tr>
              <tr>
                <th className="border border-black p-2">
                  <input
                    className="p-2 border border-black"
                    type="text"
                    name="con_id"
                    value={filters.con_id}
                    onChange={handleFilterChange}
                    placeholder="Filter ID"
                  />
                </th>
                <th className="border border-black p-2">
                  <input
                    className="p-2 border border-black"
                    type="text"
                    name="con_version"
                    value={filters.con_version}
                    onChange={handleFilterChange}
                    placeholder="Filter Version"
                  />
                </th>
                <th className="border border-black p-2">
                  <input
                    className="p-2 border border-black"
                    type="text"
                    name="INV_NAME"
                    value={filters.INV_NAME}
                    onChange={handleFilterChange}
                    placeholder="Filter Vendor_Name"
                  />
                </th>
                <th className="border border-black p-2">
                  <input
                    className="p-2 border border-black"
                    type="text"
                    name="INV_VENDOR_CODE"
                    value={filters.INV_VENDOR_CODE}
                    onChange={handleFilterChange}
                    placeholder="Filter Vendor_code"
                  />
                </th>
                <th className="border border-black p-2">
                  <input
                    className="p-2 border border-black"
                    type="text"
                    name="cc_con_cat"
                    value={filters.cc_con_cat}
                    onChange={handleFilterChange}
                    placeholder="Filter Applicable_LTC_Form"
                  />
                </th>
                <th className="border border-black p-2">
                  <input
                    className="p-2 border border-black"
                    type="text"
                    name="cc_con_sub_cat"
                    value={filters.cc_con_sub_cat}
                    onChange={handleFilterChange}
                    placeholder="Filter LTC_Type"
                  />
                </th>
                <th className="border border-black p-2">
                  <input
                    className="p-2 border border-black"
                    type="text"
                    name="cc_con_t_years"
                    value={filters.cc_con_t_years}
                    onChange={handleFilterChange}
                    placeholder="Filter Validity(Years)"
                  />
                </th>
                <th className="border border-black p-2">
                  <input
                    className="p-2 border border-black"
                    type="text"
                    name="cc_con_t-months"
                    value={filters.cc_con_t_months}
                    onChange={handleFilterChange}
                    placeholder="Filter Validity(Months)"
                  />
                </th>
                <th className="border border-black p-2">
                  <input
                    className="p-2 border border-black"
                    type="date"
                    name="cc_con_s_date"
                    value={filters.cc_con_s_date}
                    onChange={handleFilterChange}
                    placeholder="Filter Start_Date"
                  />
                </th>
                <th className="border border-black p-2">
                  <input
                    className="p-2 border border-black"
                    type="date"
                    name="cc_con_e_date"
                    value={filters.cc_con_e_date}
                    onChange={handleFilterChange}
                    placeholder="Filter End_Date"
                  />
                </th>
                <th className="border border-black p-2">
                  <input
                    className="p-2 border border-black"
                    type="text"
                    name="con_modify_by"
                    value={filters.con_modify_by}
                    onChange={handleFilterChange}
                    placeholder="Filter Register_By"
                  />
                </th>
                <th className="border border-black p-2">
                  <input
                    className="p-2 border border-black"
                    type="date"
                    name="con_modify_date"
                    value={filters.con_modify_date}
                    onChange={handleFilterChange}
                    placeholder="Filter Register_Date"
                  />
                </th>
                <th className="border border-black p-2">
                  <input
                    className="p-2 border border-black"
                    type="text"
                    name="con_l_dev_flag"
                    value={filters.con_l_dev_flag}
                    onChange={handleFilterChange}
                    placeholder="Filter Deviations Label"
                  />
                </th>
                <th className="border border-black p-2">
                  <input
                    className="p-2 border border-black"
                    type="text"
                    name="con_legacy"
                    value={filters.con_legacy}
                    onChange={handleFilterChange}
                    placeholder="Filter Legacy"
                  />
                </th>
                <th className="border border-black p-2">
                  <input
                    className="p-2 border border-black"
                    type="text"
                    name="Proposer"
                    value={filters.Proposer}
                    onChange={handleFilterChange}
                    placeholder="Filter Proposer"
                  />
                </th>
                <th className="border border-black p-2"></th>
                <th className="border border-black p-2">
                  <input
                    className="p-2 border border-black"
                    type="text"
                    name="Recommender_2"
                    value={filters.Additional_Proposer}
                    onChange={handleFilterChange}
                    placeholder="Filter Additional_Proposer"
                  />
                </th>
                <th className="border border-black p-2"></th>
                <th className="border border-black p-2">
                  <input
                    className="p-2 border border-black"
                    type="text"
                    name="Verifier"
                    value={filters.Verifier}
                    onChange={handleFilterChange}
                    placeholder="Filter Verifier"
                  />
                </th>
                <th className="border border-black p-2"></th>
                <th className="border border-black p-2">
                  <input
                    className="p-2 border border-black"
                    type="text"
                    name="Recommender_1"
                    value={filters.Recommender_1}
                    onChange={handleFilterChange}
                    placeholder="Filter Recommender_1"
                  />
                </th>
                <th className="border border-black p-2"></th>
                <th className="border border-black p-2">
                  <input
                    className="p-2 border border-black"
                    type="text"
                    name="Recommender_2"
                    value={filters.Recommender_2}
                    onChange={handleFilterChange}
                    placeholder="Filter Recommender_2"
                  />
                </th>
                <th className="border border-black p-2"></th>
                <th className="border border-black p-2">
                  <input
                    className="p-2 border border-black"
                    type="text"
                    name="Approver"
                    value={filters.Approver}
                    onChange={handleFilterChange}
                    placeholder="Filter Approver"
                  />
                </th>
                <th className="border border-black p-2"></th>
                <th className="border border-black p-2">
                  <input
                    className="p-2 border border-black"
                    type="text"
                    name="Current_Stage"
                    value={filters.Current_Stage}
                    onChange={handleFilterChange}
                    placeholder="Filter Stage"
                  />
                </th>
                <th className="border border-black p-2">
                  <input
                    className="p-2 border border-black"
                    type="text"
                    name="Ageing_days"
                    value={filters.Ageing_days}
                    onChange={handleFilterChange}
                    placeholder="Filter Ageing"
                  />
                </th>
              </tr>
            </thead>
            <tbody className="text-xs">
              {filteredData?.map((row) => {
                const proposerBgColor =
                  row.Action_DateTime_Proposer != null
                    ? "bg-green-200"
                    : row.Proposer != null
                    ? "bg-yellow-200"
                    : "";
                const additionalProposerBgColor =
                  row.Action_DateTime_Additional_Proposer != null
                    ? "bg-green-200"
                    : row.Additional_Proposer != null
                    ? "bg-yellow-200"
                    : "";
                const verifierBgColor =
                  row.Action_DateTime_Verifier != null
                    ? "bg-green-200"
                    : row.Verifier != null
                    ? "bg-yellow-200"
                    : "";
                const recommender1BgColor =
                  row.Action_DateTime_Recommender_1 != null
                    ? "bg-green-200"
                    : row.Recommender_1 != null
                    ? "bg-yellow-200"
                    : "";
                const recommender2BgColor =
                  row.Action_DateTime_Recommender_2 != null
                    ? "bg-green-200"
                    : row.Recommender_2 != null
                    ? "bg-yellow-200"
                    : "";
                const approverBgColor =
                  row.Action_DateTime_Approver != null
                    ? "bg-green-200"
                    : row.Approver != null
                    ? "bg-yellow-200"
                    : "";
                const actionDateTimeProposerBgColor =
                  row.Action_DateTime_Proposer != null
                    ? "bg-green-200"
                    : row.Proposer != null
                    ? "bg-yellow-200"
                    : "";
                const actionDateTimeAdditionalProposerBgColor =
                  row.Action_DateTime_Additional_Proposer != null
                    ? "bg-green-200"
                    : row.Additional_Proposer != null
                    ? "bg-yellow-200"
                    : "";
                const actionDateTimeVerifierBgColor =
                  row.Action_DateTime_Verifier != null
                    ? "bg-green-200"
                    : row.Verifier != null
                    ? "bg-yellow-200"
                    : "";
                const actionDateTimeRecommender1BgColor =
                  row.Action_DateTime_Recommender_1 != null
                    ? "bg-green-200"
                    : row.Recommender_1 != null
                    ? "bg-yellow-200"
                    : "";
                const actionDateTimeRecommender2BgColor =
                  row.Action_DateTime_Recommender_2 != null
                    ? "bg-green-200"
                    : row.Recommender_2 != null
                    ? "bg-yellow-200"
                    : "";
                const actionDateTimeApproverBgColor =
                  row.Action_DateTime_Approver != null
                    ? "bg-green-200"
                    : row.Approver != null
                    ? "bg-yellow-200"
                    : "";

                return (
                  <tr key={row.id} className="border-t">
                    <td className="border border-black p-2">{row.con_id}</td>
                    <td className="border border-black p-2">
                      {row.con_version}
                    </td>
                    <td className="border border-black p-2">{row.INV_NAME}</td>
                    <td className="border border-black p-2">
                      {row.INV_VENDOR_CODE}
                    </td>
                    <td className="border border-black p-2">
                      {row.cc_con_cat}
                    </td>
                    <td className="border border-black p-2">
                      {row.cc_con_sub_cat}
                    </td>
                    <td className="border border-black p-2">
                      {row.cc_con_t_years}
                    </td>
                    <td className="border border-black p-2">
                      {row.cc_con_t_months}
                    </td>
                    <td className="border border-black p-2">
                      {formatDate(row.cc_con_s_date.split("T")[0])}
                    </td>
                    <td className="border border-black p-2">
                      {formatDate(row.cc_con_e_date.split("T")[0])}
                    </td>
                    <td className="border border-black p-2">
                      {row.con_modify_by}
                    </td>
                    <td className="border border-black p-2">
                      {formatDate(row.con_modify_date.split("T")[0])}
                    </td>
                    <td className="border border-black p-2">
                      {row.con_l_dev_flag}
                    </td>
                    <td className="border border-black p-2">
                      {row.con_legacy}
                    </td>

                    {/* Proposer cell with conditional background color */}
                    <td
                      className={`border border-black p-2 ${proposerBgColor}`}
                    >
                      {row.Proposer}
                    </td>

                    {/* Action_DateTime_Proposer cell with conditional background color */}
                    <td
                      className={`border border-black p-2 ${actionDateTimeProposerBgColor}`}
                    >
                      {formatDate(row.Action_DateTime_Proposer?.split("T")[0])}
                    </td>

                    <td
                      className={`border border-black p-2 ${additionalProposerBgColor}`}
                    >
                      {row.Additional_Proposer}
                    </td>
                    <td
                      className={`border border-black p-2 ${actionDateTimeAdditionalProposerBgColor}`}
                    >
                      {formatDate(row.Action_DateTime_Additional_Proposer?.split("T")[0])}
                    </td>
                    <td
                      className={`border border-black p-2 ${verifierBgColor}`}
                    >
                      {row.Verifier}
                    </td>
                    <td
                      className={`border border-black p-2 ${actionDateTimeVerifierBgColor}`}
                    >
                      {formatDate(row.Action_DateTime_Verifier?.split("T")[0])}
                    </td>
                    <td
                      className={`border border-black p-2 ${recommender1BgColor}`}
                    >
                      {row.Recommender_1}
                    </td>
                    <td
                      className={`border border-black p-2 ${actionDateTimeRecommender1BgColor}`}
                    >
                      {formatDate(row.Action_DateTime_Recommender_1?.split("T")[0])}
                    </td>
                    <td
                      className={`border border-black p-2 ${recommender2BgColor}`}
                    >
                      {row.Recommender_2}
                    </td>
                    <td
                      className={`border border-black p-2 ${actionDateTimeRecommender2BgColor}`}
                    >
                      {formatDate(row.Action_DateTime_Recommender_2?.split("T")[0])}
                    </td>
                    <td
                      className={`border border-black p-2 ${approverBgColor}`}
                    >
                      {row.Approver}
                    </td>
                    <td
                      className={`border border-black p-2 ${actionDateTimeApproverBgColor}`}
                    >
                      {formatDate(row.Action_DateTime_Approver?.split("T")[0])}
                    </td>
                    <td className="border border-black p-2">
                      {computeCurrentStage(row)}
                    </td>
                    <td className="border border-black p-2">
                      {row.Ageing_days}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <table className="min-w-full bg-white border border-black rounded-lg">
            <thead className="text-xs">
              <tr className="bg-blue-200">
                <th className="border border-black p-2">Request ID</th>
                <th className="border border-black p-2">Version</th>
                <th className="border border-black p-2">Vendor Name</th>
                <th className="border border-black p-2">Vendor Code</th>
                <th className="border border-black p-2">Applicable LTC</th>
                <th className="border border-black p-2">LTC Type</th>
                <th className="border border-black p-2">Validity(Years)</th>
                <th className="border border-black p-2">Validity(Months)</th>
                <th className="border border-black p-2">Start Date</th>
                <th className="border border-black p-2">End Date</th>
                <th className="border border-black p-2">Register By</th>
                <th className="border border-black p-2">Register Date</th>
                <th className="border border-black p-2">Deviations</th>
                <th className="border border-black p-2">Legacy</th>
                <th className="border border-black p-2">Proposer</th>
                <th className="border border-black p-2">
                  Action DateTime Proposer
                </th>
                <th className="border border-black p-2">Additional Proposer</th>
                <th className="border border-black p-2">
                  Action_DateTime Additional Proposer
                </th>
                <th className="border border-black p-2">Verifier</th>
                <th className="border border-black p-2">
                  Action DateTime Verifier
                </th>
                <th className="border border-black p-2">Recommender 1</th>
                <th className="border border-black p-2">
                  Action DateTime Recommender 1
                </th>
                <th className="border border-black p-2">Recommender 2</th>
                <th className="border border-black p-2">
                  Action DateTime Recommender 2
                </th>
                <th className="border border-black p-2">Approver</th>
                <th className="border border-black p-2">
                  Action DateTime Approver
                </th>
                <th className="border border-black p-2">Expired or not?</th>
              </tr>
              <tr>
                <th className="border border-black p-2">
                  <input
                    className="p-2 border border-black"
                    type="text"
                    name="con_id"
                    value={filters.con_id}
                    onChange={handleFilterChange}
                    placeholder="Filter ID"
                  />
                </th>
                <th className="border border-black p-2">
                  <input
                    className="p-2 border border-black"
                    type="text"
                    name="con_version"
                    value={filters.con_version}
                    onChange={handleFilterChange}
                    placeholder="Filter Version"
                  />
                </th>
                <th className="border border-black p-2">
                  <input
                    className="p-2 border border-black"
                    type="text"
                    name="INV_NAME"
                    value={filters.INV_NAME}
                    onChange={handleFilterChange}
                    placeholder="Filter Vendor_Name"
                  />
                </th>
                <th className="border border-black p-2">
                  <input
                    className="p-2 border border-black"
                    type="text"
                    name="INV_VENDOR_CODE"
                    value={filters.INV_VENDOR_CODE}
                    onChange={handleFilterChange}
                    placeholder="Filter Vendor_code"
                  />
                </th>
                <th className="border border-black p-2">
                  <input
                    className="p-2 border border-black"
                    type="text"
                    name="cc_con_cat"
                    value={filters.cc_con_cat}
                    onChange={handleFilterChange}
                    placeholder="Filter Applicable_LTC_Form"
                  />
                </th>
                <th className="border border-black p-2">
                  <input
                    className="p-2 border border-black"
                    type="text"
                    name="cc_con_sub_cat"
                    value={filters.cc_con_sub_cat}
                    onChange={handleFilterChange}
                    placeholder="Filter LTC_Type"
                  />
                </th>
                <th className="border border-black p-2">
                  <input
                    className="p-2 border border-black"
                    type="text"
                    name="cc_con_t_years"
                    value={filters.cc_con_t_years}
                    onChange={handleFilterChange}
                    placeholder="Filter Validity(Years)"
                  />
                </th>
                <th className="border border-black p-2">
                  <input
                    className="p-2 border border-black"
                    type="text"
                    name="cc_con_t-months"
                    value={filters.cc_con_t_months}
                    onChange={handleFilterChange}
                    placeholder="Filter Validity(Months)"
                  />
                </th>
                <th className="border border-black p-2">
                  <input
                    className="p-2 border border-black"
                    type="date"
                    name="cc_con_s_date"
                    value={filters.cc_con_s_date}
                    onChange={handleFilterChange}
                    placeholder="Filter Start_Date"
                  />
                </th>
                <th className="border border-black p-2">
                  <input
                    className="p-2 border border-black"
                    type="date"
                    name="cc_con_e_date"
                    value={filters.cc_con_e_date}
                    onChange={handleFilterChange}
                    placeholder="Filter End_Date"
                  />
                </th>
                <th className="border border-black p-2">
                  <input
                    className="p-2 border border-black"
                    type="text"
                    name="con_modify_by"
                    value={filters.con_modify_by}
                    onChange={handleFilterChange}
                    placeholder="Filter Register_By"
                  />
                </th>
                <th className="border border-black p-2">
                  <input
                    className="p-2 border border-black"
                    type="date"
                    name="con_modify_date"
                    value={filters.con_modify_date}
                    onChange={handleFilterChange}
                    placeholder="Filter Register_Date"
                  />
                </th>
                <th className="border border-black p-2">
                  <input
                    className="p-2 border border-black"
                    type="text"
                    name="con_l_dev_flag"
                    value={filters.con_l_dev_flag}
                    onChange={handleFilterChange}
                    placeholder="Filter Deviations Label"
                  />
                </th>
                <th className="border border-black p-2">
                  <input
                    className="p-2 border border-black"
                    type="text"
                    name="con_legacy"
                    value={filters.con_legacy}
                    onChange={handleFilterChange}
                    placeholder="Filter Legacy"
                  />
                </th>
                <th className="border border-black p-2">
                  <input
                    className="p-2 border border-black"
                    type="text"
                    name="Proposer"
                    value={filters.Proposer}
                    onChange={handleFilterChange}
                    placeholder="Filter Proposer"
                  />
                </th>
                <th className="border border-black p-2"></th>
                <th className="border border-black p-2">
                  <input
                    className="p-2 border border-black"
                    type="text"
                    name="Recommender_2"
                    value={filters.Additional_Proposer}
                    onChange={handleFilterChange}
                    placeholder="Filter Additional_Proposer"
                  />
                </th>
                <th className="border border-black p-2"></th>
                <th className="border border-black p-2">
                  <input
                    className="p-2 border border-black"
                    type="text"
                    name="Verifier"
                    value={filters.Verifier}
                    onChange={handleFilterChange}
                    placeholder="Filter Verifier"
                  />
                </th>
                <th className="border border-black p-2"></th>
                <th className="border border-black p-2">
                  <input
                    className="p-2 border border-black"
                    type="text"
                    name="Recommender_1"
                    value={filters.Recommender_1}
                    onChange={handleFilterChange}
                    placeholder="Filter Recommender_1"
                  />
                </th>
                <th className="border border-black p-2"></th>
                <th className="border border-black p-2">
                  <input
                    className="p-2 border border-black"
                    type="text"
                    name="Recommender_2"
                    value={filters.Recommender_2}
                    onChange={handleFilterChange}
                    placeholder="Filter Recommender_2"
                  />
                </th>
                <th className="border border-black p-2"></th>
                <th className="border border-black p-2">
                  <input
                    className="p-2 border border-black"
                    type="text"
                    name="Approver"
                    value={filters.Approver}
                    onChange={handleFilterChange}
                    placeholder="Filter Approver"
                  />
                </th>
                <th className="border border-black p-2"></th>
                <th className="border border-black p-2">
                  <input
                    className="p-2 border border-black"
                    type="text"
                    name="con_exp"
                    value={filters.con_exp}
                    onChange={handleFilterChange}
                    placeholder="Expired"
                  />
                </th>
              </tr>
            </thead>
            <tbody className="text-xs">
              {filteredData?.map((row) => {
                const proposerBgColor =
                  row.Action_DateTime_Proposer != null
                    ? "bg-green-200"
                    : row.Proposer != null
                    ? "bg-yellow-200"
                    : "";
                const additionalProposerBgColor =
                  row.Action_DateTime_Additional_Proposer != null
                    ? "bg-green-200"
                    : row.Additional_Proposer != null
                    ? "bg-yellow-200"
                    : "";
                const verifierBgColor =
                  row.Action_DateTime_Verifier != null
                    ? "bg-green-200"
                    : row.Verifier != null
                    ? "bg-yellow-200"
                    : "";
                const recommender1BgColor =
                  row.Action_DateTime_Recommender_1 != null
                    ? "bg-green-200"
                    : row.Recommender_1 != null
                    ? "bg-yellow-200"
                    : "";
                const recommender2BgColor =
                  row.Action_DateTime_Recommender_2 != null
                    ? "bg-green-200"
                    : row.Recommender_2 != null
                    ? "bg-yellow-200"
                    : "";
                const approverBgColor =
                  row.Action_DateTime_Approver != null
                    ? "bg-green-200"
                    : row.Approver != null
                    ? "bg-yellow-200"
                    : "";
                const actionDateTimeProposerBgColor =
                  row.Action_DateTime_Proposer != null
                    ? "bg-green-200"
                    : row.Proposer != null
                    ? "bg-yellow-200"
                    : "";
                const actionDateTimeAdditionalProposerBgColor =
                  row.Action_DateTime_Additional_Proposer != null
                    ? "bg-green-200"
                    : row.Additional_Proposer != null
                    ? "bg-yellow-200"
                    : "";
                const actionDateTimeVerifierBgColor =
                  row.Action_DateTime_Verifier != null
                    ? "bg-green-200"
                    : row.Verifier != null
                    ? "bg-yellow-200"
                    : "";
                const actionDateTimeRecommender1BgColor =
                  row.Action_DateTime_Recommender_1 != null
                    ? "bg-green-200"
                    : row.Recommender_1 != null
                    ? "bg-yellow-200"
                    : "";
                const actionDateTimeRecommender2BgColor =
                  row.Action_DateTime_Recommender_2 != null
                    ? "bg-green-200"
                    : row.Recommender_2 != null
                    ? "bg-yellow-200"
                    : "";
                const actionDateTimeApproverBgColor =
                  row.Action_DateTime_Approver != null
                    ? "bg-green-200"
                    : row.Approver != null
                    ? "bg-yellow-200"
                    : "";

                return (
                  <tr key={row.id} className="border-t">
                    <td className="border border-black p-2">{row.con_id}</td>
                    <td className="border border-black p-2">
                      {row.con_version}
                    </td>
                    <td className="border border-black p-2">{row.INV_NAME}</td>
                    <td className="border border-black p-2">
                      {row.INV_VENDOR_CODE}
                    </td>
                    <td className="border border-black p-2">
                      {row.cc_con_cat}
                    </td>
                    <td className="border border-black p-2">
                      {row.cc_con_sub_cat}
                    </td>
                    <td className="border border-black p-2">
                      {row.cc_con_t_years}
                    </td>
                    <td className="border border-black p-2">
                      {row.cc_con_t_months}
                    </td>
                    <td className="border border-black p-2">
                      {formatDate(row.cc_con_s_date?.split("T")[0])}
                    </td>
                    <td className="border border-black p-2">
                      {formatDate(row.cc_con_e_date?.split("T")[0])}
                    </td>
                    <td className="border border-black p-2">
                      {row.con_modify_by}
                    </td>
                    <td className="border border-black p-2">
                      {formatDate(row.con_modify_date?.split("T")[0])}
                    </td>
                    <td className="border border-black p-2">
                      {row.con_l_dev_flag}
                    </td>
                    <td className="border border-black p-2">
                      {row.con_legacy}
                    </td>

                    {/* Proposer cell with conditional background color */}
                    <td
                      className={`border border-black p-2 ${proposerBgColor}`}
                    >
                      {row.Proposer}
                    </td>

                    {/* Action_DateTime_Proposer cell with conditional background color */}
                    <td
                      className={`border border-black p-2 ${actionDateTimeProposerBgColor}`}
                    >
                      {formatDate(row.Action_DateTime_Proposer?.split("T")[0])}
                    </td>

                    <td
                      className={`border border-black p-2 ${additionalProposerBgColor}`}
                    >
                      {row.Additional_Proposer}
                    </td>
                    <td
                      className={`border border-black p-2 ${actionDateTimeAdditionalProposerBgColor}`}
                    >
                      {formatDate(row.Action_DateTime_Additional_Proposer?.split("T")[0])}
                    </td>
                    <td
                      className={`border border-black p-2 ${verifierBgColor}`}
                    >
                      {row.Verifier}
                    </td>
                    <td
                      className={`border border-black p-2 ${actionDateTimeVerifierBgColor}`}
                    >
                      {formatDate(row.Action_DateTime_Verifier?.split("T")[0])}
                    </td>
                    <td
                      className={`border border-black p-2 ${recommender1BgColor}`}
                    >
                      {row.Recommender_1}
                    </td>
                    <td
                      className={`border border-black p-2 ${actionDateTimeRecommender1BgColor}`}
                    >
                      {formatDate(row.Action_DateTime_Recommender_1?.split("T")[0])}
                    </td>
                    <td
                      className={`border border-black p-2 ${recommender2BgColor}`}
                    >
                      {row.Recommender_2}
                    </td>
                    <td
                      className={`border border-black p-2 ${actionDateTimeRecommender2BgColor}`}
                    >
                      {formatDate(row.Action_DateTime_Recommender_2?.split("T")[0])}
                    </td>
                    <td
                      className={`border border-black p-2 ${approverBgColor}`}
                    >
                      {row.Approver}
                    </td>
                    <td
                      className={`border border-black p-2 ${actionDateTimeApproverBgColor}`}
                    >
                      {formatDate(row.Action_DateTime_Approver?.split("T")[0])}
                    </td>
                    <td className="border border-black p-2">
                      {row.con_exp}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default OvocMis;
