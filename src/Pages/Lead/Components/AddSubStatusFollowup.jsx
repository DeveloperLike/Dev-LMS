import React, { useState } from "react";
import { CustomTextArea } from "../../../Components/CustomComponents/CustomTextArea";
import { CustomSelectInput } from "../../../Components/CustomComponents/InputWithIcon";
import { CustomTimerPicker } from "./TimePicker";
import { addFollowupService } from "../ApiService";
import { PrimaryButton } from "../../../Components/CustomComponents/ButtonUi";
import FormItem from "antd/es/form/FormItem";
import { DatePicker, message } from "antd";
import dayjs from "dayjs";
import { patchSubStatusService } from "../../LeadSubStatus/ApiService";

export const AddSubStatusFollowup = ({
  id,
  setIsFollowUpSubStatusDrawerOpen,
  // setPayloadDatas,
  leadSubStatus,
  getDetailsDataApi,
  useAddFollowupService,
  setUseAddFollowupService,
  leadFollowupListGetApi,
  leadStatusId,
  // added
  leadSubStatusDropdown,
  setSubStatusFunction,
  // added
}) => {
  const [selectedSubStatusId, setSelectedSubStatusId] = useState(null);

  const [formData, setFormData] = useState({
    date: {
      value: "",
      errors: [],
    },
    time: {
      value: null,
      errors: [],
    },
    comment: {
      value: "",
      errors: [],
    },
    remarks: {
      value: "",
      errors: [],
    },
    lead: {
      value: id,
      errors: [],
    },
    type: {
      value: null,
      errors: [],
    },
  });

  const [loading, setLoading] = useState(false);

  // Handle input change for all form fields
  const handleInputChange = (field) => (e) => {
    const value = e.target ? e.target.value : e;
    setFormData((prevData) => ({
      ...prevData,
      [field]: {
        ...prevData[field],
        value,
      },
      errors: [],
    }));
  };

  // handling errors
  const handleError = (response) => {
    const errorFields =
      response !== null || response !== undefined ? Object.keys(response) : [];
    const updatedErrors = {};
    errorFields.forEach((item) => {
      updatedErrors[item] = {
        ...formData[item],
        errors: response[item],
      };
    });
    setFormData({
      ...formData,
      ...updatedErrors,
    });
  };

  // Function to generate the payload from formData
  const createPayload = () =>
    useAddFollowupService === true
      ? {
        lead_sub_status: leadSubStatus.lead_sub_status_id,
        lead_status: leadStatusId,
        remark: formData.remarks.value,
        follow_up: {
          // type: formData.type.value,
          date: dayjs(formData.date.value).format("DD-MM-YYYY"),
          time: formData.time.value
            ? dayjs(formData.time.value).format("HH:mm:ss")
            : null,
          // comment: formData.comment.value,
        },
      }
      : {
        // type: formData.type.value,
        date: dayjs(formData.date.value).format("DD-MM-YYYY"),
        time: formData.time.value
          ? dayjs(formData.time.value).format("HH:mm:ss")
          : null,
        // comment: formData.comment.value,
        lead: formData.lead.value,
      };

  const resetForm = () => {
    setFormData({
      date: { value: "", errors: [] },
      time: { value: null, errors: [] },
      comment: { value: "", errors: [] },
      remarks: { value: "", errors: [] },
      lead: { value: id, errors: [] },
      type: { value: "", errors: [] },
    });
  };

  // Function to make the API call
  const callPostApi = () => {
    if (loading) return; // Prevent multiple submissions
    setLoading(true); // Disable the button
    const payload = createPayload();
    if (useAddFollowupService === true) {
      patchSubStatusService(payload, id)
        .then((response) => {
          setIsFollowUpSubStatusDrawerOpen(false);
          if (response.data.success === "1") {
            leadFollowupListGetApi();
            setIsFollowUpSubStatusDrawerOpen(false);
            setUseAddFollowupService(false);
            getDetailsDataApi();
            resetForm();
            message.success(response.data.message);
          }
        })
        .catch(function (error) {
          if (error.response !== undefined) {
            handleError(error.response.data.data);
            message.error(error.response.data.message);
          }
        })
        .finally(() => setLoading(false));
    } else {
      // setPayloadDatas(payload);
      addFollowupService(payload)
        .then((response) => {
          resetForm();
          leadFollowupListGetApi();
          message.success(response.data.message);
          setIsFollowUpSubStatusDrawerOpen(false);
        })
        .catch(function (error) {
          if (error) {
            handleError(error.response.data.data);
            message.error(error?.response?.data?.message);
          }
        })
        .finally(() => setLoading(false));
    }
  };

  return (
    <div className="h-full flex flex-col">

      {/* SCROLLABLE CONTENT */}
      <div className="flex-1 overflow-y-auto pr-2">

        {/* Sub Status list */}
        {Array.isArray(leadSubStatusDropdown) && (
          <div className="mb-4">
            <p className="text-sm font-semibold mb-2">Select Sub Status</p>

            <div className="flex flex-col gap-2">
              {leadSubStatusDropdown
                .slice() //avoid mutating original state
                .sort((a, b) =>
                  a.lead_sub_status_name.localeCompare(
                    b.lead_sub_status_name,
                    "en",
                    { sensitivity: "base" }
                  )
                )
                .map((item) => (
                  <button
                    key={item.lead_sub_status_id}
                    type="button"
                    className={`w-full text-left px-3 py-2 rounded border transition-all duration-200
                     ${selectedSubStatusId === item.lead_sub_status_id
                        ? "bg-yellow-400 text-white border-yellow-400"
                        : "bg-white text-gray-800 border-gray-200 hover:bg-yellow-50 hover:border-yellow-400"
                      }
                   `}
                    onClick={() => {
                      setSelectedSubStatusId(item.lead_sub_status_id);
                      setSubStatusFunction(item.lead_sub_status_id);
                    }}

                  >
                    {item.lead_sub_status_name}
                  </button>
                ))}

            </div>
          </div>
        )}

      </div>

      {/* STICKY SUBMIT BUTTON */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          callPostApi();
        }}
        className="sticky bottom-0 bg-white border-t pt-3"
      >
        <PrimaryButton
          type="primary"
          title="Submit"
          htmlType="submit"
          disabled={loading}
        />
      </form>

    </div>
  );

};
