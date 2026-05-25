import React, { useEffect, useState } from "react";
import { CustomTextArea } from "../../../Components/CustomComponents/CustomTextArea";
import { CustomSelectInput } from "../../../Components/CustomComponents/InputWithIcon";
import { CustomTimerPicker } from "./TimePicker";
import { addFollowupService } from "../ApiService";
import { PrimaryButton } from "../../../Components/CustomComponents/ButtonUi";
import FormItem from "antd/es/form/FormItem";
import { DatePicker, message } from "antd";
import { useDispatch } from "react-redux";
import { notificationFun } from "../../../lib/redux/NotificationSlice";
import dayjs from "dayjs";
import { patchSubStatusService } from "../../LeadSubStatus/ApiService";
import axios from "axios";

import { baseurl } from "../../../lib/Constants";

export const AddFollowup = ({
  id,
  dataForMetaPush,
  setIsFollowUpModalOpen,
  // setPayloadDatas,
  leadSubStatus,
  getDetailsDataApi,
  useAddFollowupService,
  setUseAddFollowupService,
  leadFollowupListGetApi,
  leadStatusId,
}) => {
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
    lead: {
      value: id,
      errors: [],
    },
    type: {
      value: null,
      errors: [],
    },
  });

  const dispatch = useDispatch();
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
    const errorFields = Object.keys(response);
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
        remark: formData.comment.value,
        follow_up: {
          type: formData.type.value,
          date: dayjs(formData.date.value).format("DD-MM-YYYY"),
          time: formData.time.value
            ? dayjs(formData.time.value).format("HH:mm:ss")
            : null,
          comment: formData.comment.value,
        },
      }
      : {
        type: formData.type.value,
        date: dayjs(formData.date.value).format("DD-MM-YYYY"),
        time: formData.time.value
          ? dayjs(formData.time.value).format("HH:mm:ss")
          : null,
        comment: formData.comment.value,
        lead: formData.lead.value,
      };


  const resetForm = () => {
    setFormData({
      date: { value: "", errors: [] },
      time: { value: null, errors: [] },
      comment: { value: "", errors: [] },
      lead: { value: id, errors: [] },
      type: { value: "", errors: [] },
    });
  };

  // Function to make the API call
  const callPostApi = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const payload = {
        lead_status: leadStatusId,
        lead_sub_status: leadSubStatus.lead_sub_status_id,
        remark: formData.comment.value,
        follow_up: {
          date: dayjs(formData.date.value).format("DD-MM-YYYY"),
          time: formData.time.value
            ? dayjs(formData.time.value).format("HH:mm:ss")
            : null,
          comment: formData.comment.value,
        },
      };

      //SAVE FOLLOWUP + STATUS TOGETHER
      const response = await patchSubStatusService(payload, id);

      if (response.data.success !== "1") {
        throw new Error("Backend rejected followup");
      }

      //REFRESH VIEW LEAD
      getDetailsDataApi();
      leadFollowupListGetApi();

      //CLOSE DRAWER
      setIsFollowUpModalOpen(false);
      resetForm();

      message.success("Followup added & status updated");


      // ############################################### META Audience PUSH #####################################################################
      try {
        console.log("Meta Audience Push started with data:", dataForMetaPush);
        if (Array.isArray(dataForMetaPush)) {
          const phoneObj = dataForMetaPush.find((data) => data.code === "phone");
          const emailObj = dataForMetaPush.find((data) => data.code === "email");

          const phone = phoneObj ? phoneObj.value : "";
          const email = emailObj ? emailObj.value : "";

          if (phone || email) {
            const userList = {
              "users": [
                {
                  "email": email,
                  "phone": phone
                }
              ],
              "FB_CUSTOM_AUDIENCE_ID": "120243338931080581"
            };

            console.log("Sending Meta Audience Push user list:", userList);
            const pushToMetaAdd = await axios.post(baseurl + "/crmCallbacks/addAudienceToMetaAdd", userList);
            if (pushToMetaAdd.status === 200) {
              console.log("Meta Push Success:", pushToMetaAdd.data);
            } else {
              console.warn("Meta Push returned non-200 status:", pushToMetaAdd.status, pushToMetaAdd.data);
            }
          } else {
            console.warn("Meta Push skipped: Both phone and email are empty.");
          }
        } else {
          console.warn("Meta Push skipped: dataForMetaPush is not a valid array.");
        }
      } catch (metaError) {
        console.error("META AUDIENCE PUSH ERROR (NON-BLOCKING):", metaError);
      }
      // ############################################### META Audience PUSH #####################################################################

    } catch (err) {
      console.error("Followup error:", err);
      message.error("Failed to add followup");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          callPostApi();
        }}
      >
        {/* <FormItem>
          <div className="flex flex-col gap-1">
            <label>
              Add/Update Followup Type<sup className="text-red-500">*</sup>
            </label>
            <CustomSelectInput
              placeholder="Select Followup Type"
              required={true}
              name="type"
              value={formData.type.value || undefined}
              errors={formData.type.errors}
              handler={handleInputChange("type")}
              options={[
                {
                  value: "appointment",
                  label: "Appointment",
                },
                { value: "follow_up_call", label: "Follow Up Call" },
                { value: "payment_link_sent", label: "Payment Link Sent" },
                {
                  value: "push_lead_to_other_domain",
                  label: "Push Lead To Other Domain",
                },
                {
                  value: "send_whatsapp_failed",
                  label: "Send Whatsapp Failed",
                },
              ]}
            />
          </div>
        </FormItem> */}

        <div className="mt-[-1rem]">
          <label>
            Next Action Date<sup className="text-red-500">*</sup>
          </label>
          <div className="flex items-center w-full gap-3 mb-4">
            <div className="w-[65%]">
              <DatePicker
                required={true}
                name={"date"}
                className="py-2"
                format="DD-MM-YYYY"
                style={{ width: "100%" }}
                value={formData.date.value}
                onChange={(date) => handleInputChange("date")(date)}
                disabledDate={(current) =>
                  current && current < dayjs().startOf("day")
                }
              />
            </div>

            <div>
              <CustomTimerPicker
                value={formData.time.value}
                onChange={handleInputChange("time")}
                disabledTime={() => ({
                  disabledHours: () => {
                    if (dayjs(formData.date.value).isSame(dayjs(), "day")) {
                      return [...Array(dayjs().hour()).keys()]; // Disable past hours if today
                    }
                    return [];
                  },
                  disabledMinutes: (selectedHour) => {
                    if (
                      dayjs(formData.date.value).isSame(dayjs(), "day") &&
                      selectedHour === dayjs().hour()
                    ) {
                      return [...Array(dayjs().minute()).keys()]; // Disable past minutes for the current hour
                    }
                    return [];
                  },
                })}
              />
            </div>
          </div>
        </div>

        <CustomTextArea
          value={formData.comment.value}
          onChange={handleInputChange("comment")}
        />
        {formData.comment.errors &&
          formData?.comment?.errors.map((err) => {
            return <p className=" text-sm text-red-500">{err}</p>;
          })}
        <br />
        <div className="pt-4 border-t mt-4 flex justify-center">

          <PrimaryButton
            type="primary"
            title="Submit"
            className="w-full !bg-yellow-400 hover:!bg-yellow-500 !text-black"
            htmlType="submit"
            disabled={loading}
          />

        </div>

      </form>
    </div>
  );
};
