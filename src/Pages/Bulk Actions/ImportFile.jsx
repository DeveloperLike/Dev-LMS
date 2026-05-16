import React, { useState } from "react";
import { PrimaryButton } from "../../Components/CustomComponents/ButtonUi";
import { postImportService } from "./ApiService";
import { useDispatch } from "react-redux";
import { notificationFun } from "../../lib/redux/NotificationSlice";
import axios from "axios";
import { baseurl } from "../../lib/Constants";
import { message } from "antd";
import { parseCSV } from "./parseCSV.js";

const ImportFile = ({ getImportApi, setOpenImport }) => {
  const [loading, setLoading] = useState(false); // Track API call state
  const [importedFile, setImportedFile] = useState(null);
  const dispatch = useDispatch();


  const [data, setData] = useState([]);
  const [errors, setErrors] = useState([]);
  const [progress, setProgress] = useState(null)
  const [completed, setCompleted] = useState(false)
  const [showCSVIUploader, setShowCSVIUploader] = useState(false)
  const columns = data.length > 0 ? Object.keys(data[0]) : [];
  const [selectedIds, setSelectedIds] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [baches, setBaches] = useState([])


  const handleInputFile = async (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setImportedFile(selectedFile);
    }


    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    setData([]);
    setErrors([]);

    try {
      const results = await parseCSV(file, {
        requiredFields: ["full_name", "email", "phone", "source"],
        // uniqueBy: "email",

        // validateRow: (row, index) => {
        //   const errs = [];

        //   if (row.age && isNaN(row.age)) {
        //     errs.push({
        //       row: index + 1,
        //       field: "age",
        //       message: "Age must be a number",
        //     });
        //   }

        //   return errs;
        // },
      });
      const cleanData = results.data.filter((row) => {
        return Object.values(row).some(
          (value) => value !== null && value !== undefined && value.toString().trim() !== ""
        );
      });

      console.log(cleanData)
      setData(cleanData);
      setErrors(results.errors);

    } catch (err) {
      // alert(err);
      setErrors([{
        "row": "",
        "field": "",
        "message": err
      }])
      console.log(err)
    }

    setLoading(false);
  };

  const postImportApi = () => {
    setLoading(true); // Disable the button
    if (loading) return; // Prevent multiple submissions

    const formData = new FormData();
    if (importedFile) {
      formData.append("importedFile", importedFile);
    }

    const token = localStorage.getItem("token");
    axios
      .post(`${baseurl}/api/v1/lead-management/import-lead`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Token ${token}`,
        },
      })
      .then((response) => {
        if (response.data.success === "1") {
          setOpenImport(false);
          getImportApi();
          message.success(response?.data?.message);
        }
      })
      .catch((error) => {
        if (error) {
          message.error(error?.response?.data?.message);
        }
      })
      .finally(() => setLoading(false)); // Re-enable the button
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    postImportApi();
  };

  return (
    <>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label className="block mb-2">
          Please attach relevant document
          <sup className="text-red-500">*</sup>
        </label>
        <input
          type="file"
          accept=".xlsx,.csv"
          className="block border p-4"
          required
          onChange={handleInputFile}
        />

        <PrimaryButton
          title={"Import"}
          className={"mt-5"}
          htmlType="submit"
          disabled={loading}
        />
      </form>
    </>
  );
};

export default ImportFile;
