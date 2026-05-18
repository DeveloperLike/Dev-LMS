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

        for (let i = 0; cleanData.length; i++) {

          console.log(`Started CSV Migrations: ${i + 1}/${cleanData.length}`)

          // Step 1: Find the lead
          const getLeadData = await findLeadByEmailAndPhone({ "phone": cleanData[i]?.phone, "email": cleanData[i]?.email })
          if (getLeadData.status === 200) {
            // const lead_id = getLeadData?.data?.lead_id
            console.log("lead already exist. Skipping")
          } else {
            console.log("Lead not found Making a new lead")
            const leadPayload = {
              "source": cleanData?.source,
              "tracking_url": cleanData?.tracking_url,
              "utm_campaign": cleanData?.utm_campaign,
              "utm_content": cleanData?.utm_content,
              "utm_medium": cleanData?.utm_medium,
              "utm_source": cleanData?.utm_source,
              "utm_term": cleanData?.utm_term,
              "campaign": cleanData?.campaign,
              "form_name": cleanData?.form_name,
              "ad_name": cleanData?.ad_name,
              "adset_name": cleanData?.adset_name,
              "field_data": [
                { "code": "full_name", "value": cleanData?.full_name },
                { "code": "phone", "value": cleanData?.phone },
                { "code": "email", "value": cleanData?.email },
                { "code": "nearest_branch", "value": cleanData?.nearest_branch },
                { "code": "city", "value": cleanData?.city },
                { "code": "state", "value": cleanData?.state },
                { "code": "ad_name", "value": cleanData?.ad_name },
                { "code": "budget", "value": cleanData?.budget },
                { "code": "gender", "value": cleanData?.gender },
                { "code": "german_level", "value": cleanData?.german_level },
                { "code": "learnt_german_language", "value": cleanData?.learnt_german_language },
                { "code": "learnt_ielts", "value": cleanData?.learnt_ielts },
                { "code": "level_of_education", "value": cleanData?.level_of_education },
                { "code": "mode_of_consultation", "value": cleanData?.mode_of_consultation },
                { "code": "other_english_proficiency_test", "value": cleanData?.other_english_proficiency_test },
                { "code": "preferred_countries", "value": cleanData?.preferred_countries },
                { "code": "preferred_intake_of_pursuing", "value": cleanData?.preferred_intake_of_pursuing },
                { "code": "service_looking_for", "value": cleanData?.service_looking_for },
                { "code": "fund_mode", "value": cleanData?.fund_mode },
              ]
            }

            const createLead = await createLeadByWebsite(leadPayload)

            // Step 2: Create Follow Up
            const followUpPayload = {
              follow_up_type: false,
              remarks: cleanData?.last_remark,
              scheduled_at: cleanData[i]?.modified_on + dayjs().format("hh:mma"),
              lead_id: cleanData[i]?.lead_id,
            }

            if (cleanData?.next_action_date) {
              const saveTheFollowUp = await createFollowUp(followUpPayload);

              if (saveTheFollowUp.status === 200 || saveTheFollowUp.status === 201) {
                console.log("Lead Saved to CRM")
                console.log(saveTheFollowUp?.data)
              } else {
                console.log(saveTheFollowUp?.data?.message)
              }
            }




            // const data = {
            //################## lead_Mangement_leadformvalue ############################
            //   full_name: "Hameed kakar",
            //   phone: "+971504992370",
            //   email: "hameedkakar1020@gmail.com",
            //   nearest_branch: "NULL",
            //   city: "Dubai",
            //   state: "NULL",
            //   ad_name: "DB | LG | R4",
            //   budget: "NULL",
            //   gender: "NULL",
            //   german_level: "NULL",
            //   learnt_german_language: "NULL",
            //   learnt_ielts: "NULL",
            //   level_of_education: "NULL",
            //   mode_of_consultation: "NULL",
            //   other_english_proficiency_test: "NULL",
            //   preferred_countries: "NULL",
            //   preferred_intake_of_pursuing: "NULL",
            //   service_looking_for: "NULL",
            //   fund_mode: "NULL",

            //################## lead_Mangement_lead ############################
            //   source: "facebook",
            //   tracking_url: "Deira Only",
            //   utm_campaign: "Dubai | 06/01/2026",
            //   utm_content: "NULL",
            //   utm_medium: "Dubai | July 25 New",
            //   utm_source: "DB | LG | R4",
            //   utm_term: "NULL",
            //   campaign: "Dubai | 06/01/2026",
            //   form_name: "Dubai | July 25 New",
            //   ad_name:,
            //   adset_name: "Deira Only",
            //################## lead_Mangement_followup ############################
            //   counsellor: "Geetha N",
            //   last_remark: "Tried calling the student  multiple times but not reachable, will attempt again later.",
            //   lead_status: "Follow - Up",
            //   lead_sub_status: "Did Not Pick",
            //   next_action_date: "11-May-2026",
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
