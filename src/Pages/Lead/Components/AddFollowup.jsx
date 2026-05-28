import React, { useEffect, useState } from "react";
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
    <div className="h-full flex flex-col">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          callPostApi();
        }}
        className="h-full flex flex-col"
      >

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">

          {/* Next Action */}
          <div>

            <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
              Next Action Date
              <sup className="text-red-500 ml-1">*</sup>
            </label>

            <div className="flex gap-3">

              {/* Date */}
              <div className="flex-1">
                <DatePicker
                  required
                  name="date"
                  format="DD-MM-YYYY"
                  placeholder="Select date"
                  value={formData.date.value}
                  onChange={(date) =>
                    handleInputChange("date")(date)
                  }
                  disabledDate={(current) =>
                    current &&
                    current < dayjs().startOf("day")
                  }
                  className="
                  !h-[48px]
                  !w-full
                  !rounded-xl
                  !border-gray-200
                  dark:!border-gray-700
                  dark:!bg-[#111827]
                  hover:!border-yellow-400
                  focus:!border-yellow-500
                  !shadow-none
                "
                />
              </div>

              {/* Time */}
              <div className="w-[120px]">
                <CustomTimerPicker
                  value={formData.time.value}
                  onChange={handleInputChange("time")}
                  className="
                 !h-[48px]
                 !w-full
                 !rounded-xl
                 !border-gray-200
                 dark:!border-gray-700
                 dark:!bg-[#111827]
                 hover:!border-yellow-400
                 focus:!border-yellow-500
                 !shadow-none
               "
                  disabledTime={() => ({
                    disabledHours: () => {
                      if (
                        dayjs(formData.date.value).isSame(
                          dayjs(),
                          "day"
                        )
                      ) {
                        return [
                          ...Array(dayjs().hour()).keys(),
                        ];
                      }
                      return [];
                    },

                    disabledMinutes: (
                      selectedHour
                    ) => {
                      if (
                        dayjs(
                          formData.date.value
                        ).isSame(dayjs(), "day") &&
                        selectedHour ===
                        dayjs().hour()
                      ) {
                        return [
                          ...Array(
                            dayjs().minute()
                          ).keys(),
                        ];
                      }

                      return [];
                    },
                  })}
                />
              </div>

            </div>

          </div>

          {/* Remark */}
          <div>

            <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
              Remark
            </label>

            <textarea
              rows={5}
              value={formData.comment.value}
              onChange={handleInputChange("comment")}
              placeholder="Write followup remarks..."
              className="
              w-full
              rounded-2xl
              border
              border-gray-200
              dark:border-gray-700
              bg-white
              dark:bg-[#111827]
              px-4
              py-3
              text-sm
              text-gray-800
              dark:text-white
              placeholder:text-gray-400
              focus:outline-none
              focus:border-yellow-400
              focus:ring-4
              focus:ring-yellow-400/10
              transition-all
              resize-none
            "
            />

            {/* Errors */}
            {formData.comment.errors &&
              formData.comment.errors.map((err, index) => (
                <p
                  key={index}
                  className="mt-1 text-sm text-red-500"
                >
                  {err}
                </p>
              ))}

          </div>

        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-800 p-5 bg-white dark:bg-[#0B1120]">

          <PrimaryButton
            type="primary"
            title={loading ? "Submitting..." : "Submit"}
            className="
            w-full
            !h-[48px]
            !rounded-xl
            !bg-yellow-400
            hover:!bg-yellow-500
            !border-none
            !text-black
            !font-semibold
            !shadow-lg
            hover:!shadow-yellow-500/20
            transition-all
          "
            htmlType="submit"
            disabled={loading}
          />

        </div>

      </form>
    </div>
  );
};
