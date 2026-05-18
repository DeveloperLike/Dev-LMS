import React, { useState } from "react";
import { PrimaryButton } from "../../Components/CustomComponents/ButtonUi";
import { postImportService } from "./ApiService";
import { useDispatch } from "react-redux";
import { notificationFun } from "../../lib/redux/NotificationSlice";
import axios from "axios";
import { baseurl } from "../../lib/Constants";
import { message } from "antd";
import { parseCSV } from "./parseCSV.js";
import { createFollowUp, createLeadByWebsite, findLeadByEmailAndPhone } from "../Lead/ApiService.js";
import dayjs from "dayjs";

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


      if (cleanData.length > 0) {

        for (let i = 0; i < cleanData.length; i++) {

          console.log(`Started CSV Migrations: ${i + 1}/${cleanData.length}`)

          // Step 1: Find the lead
          const getLeadData = await findLeadByEmailAndPhone({ "phone": cleanData[i]?.phone, "email": cleanData[i]?.email })
          if (getLeadData?.data?.lead_id) {
            const lead_id = getLeadData?.data?.lead_id
            console.log("lead already exist. Skipping", lead_id)
          } else {
            console.log("Lead not found Making a new lead")
            const leadPayload = {
              "source": cleanData[i]?.source,
              "tracking_url": cleanData[i]?.tracking_url,
              "utm_campaign": cleanData[i]?.utm_campaign,
              "utm_content": cleanData[i]?.utm_content,
              "utm_medium": cleanData[i]?.utm_medium,
              "utm_source": cleanData[i]?.utm_source,
              "utm_term": cleanData[i]?.utm_term,
              "campaign": cleanData[i]?.campaign,
              "form_name": cleanData[i]?.form_name,
              "ad_name": cleanData[i]?.ad_name,
              "adset_name": cleanData[i]?.adset_name,
              "field_data": [
                { "code": "full_name", "value": cleanData[i]?.full_name },
                { "code": "phone", "value": cleanData[i]?.phone },
                { "code": "email", "value": cleanData[i]?.email },
                { "code": "nearest_branch", "value": cleanData[i]?.nearest_branch },
                { "code": "city", "value": cleanData[i]?.city },
                { "code": "state", "value": cleanData[i]?.state },
                { "code": "ad_name", "value": cleanData[i]?.ad_name },
                { "code": "budget", "value": cleanData[i]?.budget },
                { "code": "gender", "value": cleanData[i]?.gender },
                { "code": "german_level", "value": cleanData[i]?.german_level },
                { "code": "learnt_german_language", "value": cleanData[i]?.learnt_german_language },
                { "code": "learnt_ielts", "value": cleanData[i]?.learnt_ielts },
                { "code": "level_of_education", "value": cleanData[i]?.level_of_education },
                { "code": "mode_of_consultation", "value": cleanData[i]?.mode_of_consultation },
                { "code": "other_english_proficiency_test", "value": cleanData[i]?.other_english_proficiency_test },
                { "code": "preferred_countries", "value": cleanData[i]?.preferred_countries },
                { "code": "preferred_intake_of_pursuing", "value": cleanData[i]?.preferred_intake_of_pursuing },
                { "code": "service_looking_for", "value": cleanData[i]?.service_looking_for },
                { "code": "fund_mode", "value": cleanData[i]?.fund_mode },
              ]
            }

            const createLead = await createLeadByWebsite(leadPayload)

            console.log(createLead.data)


            // if (cleanData[i]?.next_action_date) {
            //   // Step 2: Create Follow Up
            //   const followUpPayload = {
            //     follow_up_type: false,
            //     remarks: cleanData[i]?.last_remark,
            //     scheduled_at: cleanData[i]?.modified_on + dayjs().format("hh:mma"),
            //     lead_id: cleanData[i]?.lead_id,
            //   }

            //   const saveTheFollowUp = await createFollowUp(followUpPayload);

            //   if (saveTheFollowUp.status === 200 || saveTheFollowUp.status === 201) {
            //     console.log("Lead Saved to CRM")
            //     console.log(saveTheFollowUp?.data)
            //   } else {
            //     console.log(saveTheFollowUp?.data?.message)
            //   }
            // }

          }
        }
      } else {
        console.log("There are no leads in sheet")
      }




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
