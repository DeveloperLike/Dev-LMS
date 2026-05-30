import React, { useEffect, useState } from "react";
import { CustomTimerPicker } from "./TimePicker";
import { PrimaryButton } from "../../../Components/CustomComponents/ButtonUi";
import { DatePicker, message } from "antd";
import dayjs from "dayjs";
import { patchSubStatusService } from "../../LeadSubStatus/ApiService";
import axios from "axios";

import { baseurl } from "../../../lib/Constants";
import { getProfileService } from "../../Profile/ApiService";

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
  isDrawerOpen,
}) => {
  const [formData, setFormData] = useState({
    date: {
      value: null,
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

  const [loading, setLoading] = useState(false);
  const [followupList, setFollowupList] = useState([]);
  const [followupLoading, setFollowupLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [followupCount, setFollowupCount] = useState(0);

  const clearFollowupPreview = () => {
    setFollowupList([]);
    setFollowupCount(0);
    setFollowupLoading(false);
  };
  const getFollowupsByDate = async (selectedDate) => {
    try {
      if (!user?.username) {
        message.warning("User profile loading...");
        return;
      }
      setFollowupLoading(true);

      const payload = {
        skip: 0,
        limit: 100,
        counsellor: [],
        username: user.username,
        start_date: dayjs(selectedDate).format("YYYY-MM-DD"),
        end_date: dayjs(selectedDate).format("YYYY-MM-DD"),
      };

      const response = await axios.post(
        `${baseurl}/api/v1/lead-management/actionabale-followup-leads`,
        payload
      );

      setFollowupList(response?.data?.records || []);
      setFollowupCount(response?.data?.data_count || 0);

    } catch (error) {
      console.error(error);
      setFollowupList([]);
    } finally {
      setFollowupLoading(false);
    }
  };

  // Handle input change for all form fields
  const handleInputChange = (field) => (e) => {
    const value = e?.target?.value ?? e;

    setFormData((prevData) => ({
      ...prevData,
      [field]: {
        ...prevData[field],
        value,
      },
    }));
  };

  const resetForm = () => {
    setFormData({
      date: { value: null, errors: [] },
      time: { value: null, errors: [] },
      comment: { value: "", errors: [] },
      lead: { value: id, errors: [] },
      type: { value: "", errors: [] },
    });

    setFollowupList([]);
    setFollowupCount(0);
    setFollowupLoading(false);
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

  useEffect(() => {
    const getUser = async () => {
      const res = await getProfileService();
      setUser(res?.data?.data);
    };

    getUser();
  }, []);

  useEffect(() => {
    if (!isDrawerOpen) {
      resetForm();
    }
  }, [isDrawerOpen]);

  const filteredFollowups = formData.time.value
    ? followupList.filter((item) => {
      if (!item.follow_up_datetime) return false;

      const selectedDateTime = dayjs(
        `${dayjs(formData.date.value).format("YYYY-MM-DD")} ${dayjs(
          formData.time.value
        ).format("HH:mm:ss")}`
      );

      const followupDateTime = dayjs(item.follow_up_datetime);

      return followupDateTime.isBefore(selectedDateTime);
    })
    : followupList;

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
        <div className="flex-1 space-y-5 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">

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
                  allowClear
                  required
                  name="date"
                  format="DD-MM-YYYY"
                  placeholder="Select date"
                  value={formData.date.value}
                  onChange={(date) => {
                    handleInputChange("date")(date);
                    if (!date) {
                      clearFollowupPreview();
                      return;
                    }
                    getFollowupsByDate(date);
                  }}
                  disabledDate={(current) =>
                    current &&
                    (
                      current < dayjs().startOf("day") ||
                      current > dayjs().add(90, "day").endOf("day")
                    )
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
                      const disabled = [];

                      // Before 8 AM
                      for (let i = 0; i < 8; i++) {
                        disabled.push(i);
                      }

                      // After 9 PM (21:00)
                      for (let i = 22; i < 24; i++) {
                        disabled.push(i);
                      }

                      // For today, disable past hours too
                      if (
                        formData.date.value &&
                        dayjs(formData.date.value).isSame(dayjs(), "day")
                      ) {
                        for (
                          let i = 8;
                          i < Math.min(dayjs().hour(), 22);
                          i++
                        ) {
                          if (!disabled.includes(i)) {
                            disabled.push(i);
                          }
                        }
                      }

                      return disabled.sort((a, b) => a - b);
                    },

                    disabledMinutes: (selectedHour) => {
                      if (
                        formData.date.value &&
                        dayjs(formData.date.value).isSame(dayjs(), "day") &&
                        selectedHour === dayjs().hour()
                      ) {
                        return [
                          ...Array(dayjs().minute()).keys(),
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

            <div className="mt-1">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Followups On Selected Date
                </label>

                {!followupLoading && followupList.length > 0 && (
                  <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400">
                    {followupCount} Followups
                  </span>
                )}
              </div>

              {followupLoading ? (
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="h-16 rounded-xl animate-pulse bg-gray-100 dark:bg-[#111827]"
                    />
                  ))}
                </div>
              ) : filteredFollowups.length > 0 ? (
                <div
                  className="
                 max-h-[280px]
                 overflow-y-auto
                 rounded-2xl
                 border
                 border-gray-200
                 dark:border-gray-800
                 bg-gray-50
                 dark:bg-[#0F172A]
                 divide-y
                 divide-gray-200
                 dark:divide-gray-800
               "
                >
                  {filteredFollowups.map((item, index) => (
                    <div
                      key={item.id || item.lead_id || index}
                      className="
                     p-3
                     hover:bg-gray-100
                     dark:hover:bg-[#172036]
                     transition-all
                     cursor-pointer
                   "
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h4
                            className="
                           text-sm
                           font-semibold
                           text-gray-900
                           dark:text-white
                           truncate
                         "
                          >
                            {item.lead_name}
                          </h4>

                          <p
                            className="
                           mt-1
                           text-xs
                           text-gray-500
                           dark:text-gray-400
                         "
                          >
                            {item.follow_up_datetime}
                          </p>
                        </div>

                        <span
                          className="
                          text-[10px]
                          px-2
                          py-1
                          rounded-full
                          bg-yellow-100
                          text-yellow-700
                          dark:bg-yellow-500/10
                          dark:text-yellow-400
                          whitespace-nowrap
                          max-w-[140px]
                          truncate
                        "
                          title={item.lead_status_name}
                        >
                          {item.lead_status_name || "N/A"}
                        </span>
                      </div>

                      <div
                        className="
                       mt-2
                       flex
                       items-center
                       gap-2
                       text-xs
                       text-gray-600
                       dark:text-gray-400
                     "
                      >
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                        {item.full_name}
                      </div>

                      {item.remark && (
                        <p
                          className="
                         mt-2
                         text-xs
                         text-gray-500
                         dark:text-gray-400
                         line-clamp-2
                       "
                        >
                          {item.remark}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  className="
                 rounded-2xl
                 border
                 border-dashed
                 border-gray-300
                 dark:border-gray-700
                 p-6
                 text-center
               "
                >
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No followups found for selected date
                  </p>
                </div>
              )}
            </div>

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
