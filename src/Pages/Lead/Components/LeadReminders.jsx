import React, { useEffect, useState } from "react";
import { PrimaryButton } from "../../../Components/CustomComponents/ButtonUi";
import { DatePicker, Drawer, Grid, message, Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { CustomTimerPicker } from "./TimePicker";
import { CustomTextArea } from "../../../Components/CustomComponents/CustomTextArea";
import dayjs from "dayjs";
import {
  getLeadMyReminderDetailsService,
  PostAddRemiderService,
} from "../ApiService";
import { useParams } from "react-router-dom";
import { notificationFun } from "../../../lib/redux/NotificationSlice";
import TableWithPagination from "../../../Components/CustomComponents/Table";
import { PostAddRegisterRemiderService } from "../../Registered Users/ApiService";
import { patchReminderService } from "../../My Reminders/ApiService";

const LeadReminders = ({
  registerUserName,
  leadReminderListGetApi,
  laedreminderList,
  isRegisterUserreminder,
  mode
}) => {
  const [openRemider, setOpenRemider] = useState(false);
  const { id } = useParams();
  const leadModulePermission = useSelector(
    (state) => state.permissions.permissionsData
  );

  // status api start from here
  const handleStatusChange = async (leadId, currentStatus) => {
    const newStatus = currentStatus === true ? false : true;
    try {
      await patchReminderService(newStatus, leadId).then((response) => {
        if (response.data.success === "1") {
          message.success(response?.data?.message);
          leadReminderListGetApi();
        }
      });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };
  // status api close from here

  useEffect(() => {
    leadReminderListGetApi();
  }, []);

  return (
    <>
      {leadModulePermission.lead_management === "edit" && (
        <PrimaryButton
          type="primary"
          className={`${mode === "dark" ?
            "text-black border-yellow-500 hover:text-white" : "text-black"} dark:hover:bg-yellow-500 p-2 float-end my-2`}
          title={"Add Reminder"}
          block={false}
          onClick={() => setOpenRemider(true)}
        />
      )}
      <br />
      <br />
      <VeiwLeadReminder
        laedreminderList={laedreminderList}
        handleStatusChange={handleStatusChange}
        mode={mode}
      />
      <br />

      {/* sub status reminder drawer */}
      <Drawer
        title="Add Reminder"
        placement="right"
        width={400}
        onClose={() => setOpenRemider(false)}
        open={openRemider}
      >
        <AddLeadReminder
          id={id}
          leadReminderListGetApi={leadReminderListGetApi}
          setOpenRemider={setOpenRemider}
          isRegisterUserreminder={isRegisterUserreminder}
          registerUserName={registerUserName}
        />
      </Drawer>
      {/* sub status reminder drawer */}
    </>
  );
};

export default LeadReminders;

// Add Lead Reminder start from here
const AddLeadReminder = ({
  id,
  leadReminderListGetApi,
  setOpenRemider,
  isRegisterUserreminder,
  registerUserName,
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
  const payload = {
    lead: id,
    date: dayjs(formData.date.value).format("DD-MM-YYYY"),
    time: formData.time.value
      ? dayjs(formData.time.value).format("HH:mm:ss")
      : null,
    comment: formData.comment.value,
  };

  const registerUserpayload = {
    register_user: registerUserName,
    date: dayjs(formData.date.value).format("DD-MM-YYYY"),
    time: formData.time.value
      ? dayjs(formData.time.value).format("HH:mm:ss")
      : null,
    comment: formData.comment.value,
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
  const callPostApi = () => {
    // console.log( payload,"testing");
    isRegisterUserreminder === "isRegisterUserreminder"
      ? PostAddRegisterRemiderService(registerUserpayload)
        .then((response) => {
          if (response.data.success === "1") {
            leadReminderListGetApi();
            resetForm();
            setOpenRemider(false);
            message.success(response?.data?.message);
          }
        })
        .catch(function (error) {
          if (error) {
            handleError(error.response.data.data);
            message.error(error?.response?.data?.message);
          }
        })
        .finally(() => setLoading(false))
      : PostAddRemiderService(payload)
        .then((response) => {
          if (response.data.success === "1") {
            leadReminderListGetApi();
            resetForm();
            setOpenRemider(false);
            message.success(response?.data?.message);
          }
        })
        .catch(function (error) {
          if (error) {
            handleError(error.response.data.data);
            console.log(error, "testing uu");
          }
        })
        .finally(() => setLoading(false));
  };

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          callPostApi();
        }}
      >
        <div className="mt-[-1rem]">
          <div className="flex justify-between">
            <label>
              Date<sup className="text-red-500">*</sup>
            </label>
            <label>
              Time<sup className="text-red-500">*</sup>
            </label>
          </div>
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
              <p>{formData.date.errors}</p>
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
        <br />

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
// Add Lead Reminder close from here

// view lead Reminder start from here

const VeiwLeadReminder = ({ laedreminderList, handleStatusChange }) => {
  const { useBreakPoint } = Grid;
  const screens = useBreakPoint;
  let columns = [
    {
      title: "Email",
      dataIndex: "lead",
      fixed: screens?.md ? "left" : false,
      key: "lead",
      width: "35%",
      render: (text, res) => {
        return (
          <p className="font-medium">
            {res.lead === null ? res.register_user : res.lead}
          </p>
        );
      },
    },
    {
      title: "Comment",
      dataIndex: "comment",
      key: "comment",
      width: "35%",
      render: (text) => (
        <div
          className="whitespace-pre-wrap break-words max-w-[500px]"
        >
          {text}
        </div>
      ),
    },
    {
      title: "Date",
      dataIndex: "datetime",
      key: "datetime",
      width: "30%",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: "max-content",
      minWidth: "200px",
      render: (text, record) => (
        <>
          <p
            onClick={() => handleStatusChange(record.id, text)}
            className={`inline-flex py-1 px-3 text-sm shadow ${text === true
              ? "bg-green-200 text-green-700 rounded-md hover:bg-green-300"
              : "bg-[#ffce00] text-black rounded-md hover:bg-orange-500 "
              }`}
          >
            {text === true ? "Done" : "Mark As Done"}
          </p>
        </>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      scroll={{ x: "max-content" }}
      dataSource={laedreminderList}
      pagination={false}
    />
  );
};

// view lead reminder close from here
