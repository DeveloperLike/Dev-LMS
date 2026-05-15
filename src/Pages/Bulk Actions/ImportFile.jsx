import React, { useState } from "react";
import { PrimaryButton } from "../../Components/CustomComponents/ButtonUi";
import { postImportService } from "./ApiService";
import { useDispatch } from "react-redux";
import { notificationFun } from "../../lib/redux/NotificationSlice";
import axios from "axios";
import { baseurl } from "../../lib/Constants";
import { message } from "antd";

const ImportFile = ({ getImportApi, setOpenImport }) => {
  const [loading, setLoading] = useState(false); // Track API call state
  const [importedFile, setImportedFile] = useState(null);
  const dispatch = useDispatch();

  const handleInputFile = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setImportedFile(selectedFile);
    }
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
          accept=".xlsx"
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
