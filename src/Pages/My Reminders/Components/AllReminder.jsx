// import React, { useEffect, useState } from "react";
// import {
//   patchReminderService,
//   PostAddAllMyRemiderService,
//   reminderPostService,
// } from "../ApiService";
// import {
//   DatePicker,
//   Drawer,
//   message,
//   Pagination,
//   Table,
// } from "antd";
// import { NavLink } from "react-router-dom";
// import { useSelector } from "react-redux";
// import dayjs from "dayjs";
// import { PAGESIZE } from "../../../lib/Constants";
// import { PrimaryButton } from "../../../Components/CustomComponents/ButtonUi";
// import { CustomTimerPicker } from "../../Lead/Components/TimePicker";
// import { CustomTextArea } from "../../../Components/CustomComponents/CustomTextArea";
// import LoadSkeleton from "../../../Components/CustomComponents/Skeleton";
// import { GetColumnSearchProps } from "../../../Components/CustomComponents/TableColumnSearch";

// const AllReminder = ({ dateRange, dateFormat }) => {
//   const [pageSize, setPageSize] = useState(PAGESIZE);
//   const [reminderData, setReminderData] = useState();
//   const [data, setData] = useState({});
//   const [page, setPage] = useState(1);
//   const [searchState, setSearchState] = useState({});
//   const [openRemider, setOpenRemider] = useState(false);
//   const [reminderparam, setReminderparam] = useState("lead");

//   const leadModulePermission = useSelector(
//     (state) => state.permissions.permissionsData
//   );

//   const onShowSizeChange = (current, newPageSize) => {
//     setPageSize(newPageSize);
//     setPage(1, newPageSize);
//   };

//   // status api start from here
//   const handleStatusChange = async (leadId, currentStatus) => {
//     const newStatus = currentStatus === true ? false : true;
//     try {
//       await patchReminderService(newStatus, leadId).then((response) => {
//         if (response.data.success === "1") {
//           message.success(response?.data?.message);
//           getReminderApi();
//         }
//       });
//     } catch (error) {
//       message.error(error?.response?.data?.message);
//     }
//   };
//   // status api close from here

//   let columns = [
//     {
//       title: "Email",
//       dataIndex: "lead",
//       key: "lead",
//       width: "20%",
//       ...GetColumnSearchProps("lead", setSearchState, searchState),
//       render: (text, record) =>
//         record.lead_id ? (
//           <NavLink to={`/view-lead/${record.lead_id}`}>
//             <p className="font-medium hover:text-orange-500">
//               {text === null ? "-" : text}
//             </p>
//           </NavLink>
//         ) : (
//           <p className="font-medium">{text === null ? "-" : text}</p>
//         ),
//     },
//     {
//       title: "Registered User",
//       dataIndex: "register_user",
//       key: "register_user",
//       width: "20%",
//       ...GetColumnSearchProps("register_user", setSearchState, searchState),
//       render: (text, record) =>
//         record.lead_id ? (
//           <NavLink to={`/view-lead/${record.lead_id}`}>
//             <p className=" hover:text-orange-500">
//               {text === null ? "-" : text}
//             </p>
//           </NavLink>
//         ) : (
//           <p>{text === null ? "-" : text}</p>
//         ),
//     },
//     {
//       title: "Comment",
//       dataIndex: "comment",
//       key: "comment",
//       width: "20%",
//       render: (text, record) =>
//         record.lead_id ? (
//           <NavLink to={`/view-lead/${record.lead_id}`}>
//             <p className=" hover:text-orange-500">
//               {text === null ? "-" : text}
//             </p>
//           </NavLink>
//         ) : (
//           <p>{text === null ? "-" : text}</p>
//         ),
//     },
//     {
//       title: "Date",
//       dataIndex: "datetime",
//       key: "date",
//       width: "20%",
//       render: (text, record) =>
//         record.lead_id ? (
//           <NavLink to={`/view-lead/${record.lead_id}`}>
//             <p className=" hover:text-orange-500">
//               {text === null ? "-" : text}
//             </p>
//           </NavLink>
//         ) : (
//           <p>{text === null ? "-" : text}</p>
//         ),
//     },
//     {
//       title: "Status",
//       dataIndex: "status",
//       key: "status",
//       width: "15%",
//       render: (text, record) => (
//         <>
//           <p
//             onClick={() => handleStatusChange(record.id, text)}
//             className={`inline-flex py-1 px-3 text-sm shadow ${
//               text === true
//                 ? "bg-green-200 text-green-700 rounded-md hover:bg-green-300"
//                 : "bg-[#ffce00] text-white rounded-md hover:bg-orange-500 "
//             }`}
//           >
//             {text === true ? "Done" : "Mark As Done"}
//           </p>
//         </>
//       ),
//     },
//   ];

//   const getReminderApi = () => {
//     const payload = {
//       type: "all",
//       start_date: dateRange && dateRange[0].format(dateFormat),
//       end_date: dateRange && dateRange[1].format(dateFormat),
//     };
//     reminderPostService(
//       payload,
//       {
//         ...searchState,
//         current_page_number: page,
//         count_per_page: pageSize,
//       },
//       reminderparam
//     )
//       .then((response) => {
//         setReminderData(response.data.data);
//         setData(response.data);
//         // message.success(response?.data?.message);
//       })
//       .catch(function (error) {
//         if (error) {
//           message.error(error?.response?.data?.message);
//         }
//       });
//   };

//   useEffect(getReminderApi, [page, searchState, dateRange, reminderparam, pageSize]);

//   return (
//     <>
//       <div className="w-full flex justify-between">
//         <div className="flex gap-3">
//           <PrimaryButton
//             type="primary"
//             className="p-2 float-end my-2 "
//             title={"Lead"}
//             block={false}
//             onClick={() => setReminderparam("lead")}
//           />
//           <PrimaryButton
//             type="primary"
//             className="p-2 float-end my-2 "
//             title={"Registered User"}
//             block={false}
//             onClick={() => setReminderparam("register_user")}
//           />
//           <PrimaryButton
//             type="primary"
//             className="p-2 float-end my-2 "
//             title={"Self"}
//             block={false}
//             onClick={() => setReminderparam("self")}
//           />
//         </div>
//         {leadModulePermission.lead_management === "edit" && (
//           <div>
//             <PrimaryButton
//               type="primary"
//               className="p-2 float-end my-2 mr-[2%]"
//               title={"Add Reminder"}
//               block={false}
//               onClick={() => setOpenRemider(true)}
//             />
//           </div>
//         )}
//       </div>

//       {/* reminder table start from here */}
//       {reminderData === undefined || reminderData === null ? (
//         <LoadSkeleton />
//       ) : (
//         reminderData && (
//           <Table
//             columns={columns}
//             dataSource={reminderData}
//             pagination={false}
//             className="mt-4"
//             scroll={{ x: "max-content" }}
//           />
//         )
//       )}
//       {/* reminder table close from here */}

//       {/* Table pagination start from here */}
//       <div className="flex justify-between items-center mt-4">
//         <Pagination
//           current={page}
//           total={data.data_count}
//           size="small"
//           showQuickJumper
//           pageSize={pageSize}
//           responsive
//           onChange={(page) => {
//             setPage(page);
//           }}
//           showSizeChanger
//           onShowSizeChange={onShowSizeChange}
//         />
//         <div className="text-sm text-black">
//           {data.current_page_data_count} of {data.data_count} records
//         </div>
//
//       </div>
//       {/* Table pagination close from here */}

//       {/* sub status reminder drawer */}
//       <Drawer
//         title="Add Reminder"
//         placement="right"
//         width={400}
//         onClose={() => setOpenRemider(false)}
//         open={openRemider}
//       >
//         <AddReminder setOpenRemider={setOpenRemider} />
//       </Drawer>
//       {/* sub status reminder drawer */}
//     </>
//   );
// };

// export default AllReminder;

// // add reminder start from here

// const AddReminder = ({ setOpenRemider }) => {
//   const [formData, setFormData] = useState({
//     date: {
//       value: "",
//       errors: [],
//     },
//     time: {
//       value: null,
//       errors: [],
//     },
//     comment: {
//       value: "",
//       errors: [],
//     },
//   });

//   const [loading, setLoading] = useState(false);

//   // Handle input change for all form fields
//   const handleInputChange = (field) => (e) => {
//     const value = e.target ? e.target.value : e;
//     setFormData((prevData) => ({
//       ...prevData,
//       [field]: {
//         ...prevData[field],
//         value,
//       },
//       errors: [],
//     }));
//   };

//   // handling errors
//   const handleError = (response) => {
//     const errorFields = Object.keys(response);
//     const updatedErrors = {};
//     errorFields.forEach((item) => {
//       updatedErrors[item] = {
//         ...formData[item],
//         errors: response[item],
//       };
//     });
//     setFormData({
//       ...formData,
//       ...updatedErrors,
//     });
//   };

//   // Function to generate the payload from formData
//   const payload = {
//     date: dayjs(formData.date.value).format("DD-MM-YYYY"),
//     time: formData.time.value
//       ? dayjs(formData.time.value).format("HH:mm:ss")
//       : null,
//     comment: formData.comment.value,
//   };

//   // Function to make the API call
//   const callPostApi = () => {
//     PostAddAllMyRemiderService(payload)
//       .then((response) => {
//         if (response.data.success === "1") {
//           console.log("Closing Drawer...");
//           setOpenRemider(false);
//           setFormData({
//             date: { value: "", errors: [] },
//             time: { value: null, errors: [] },
//             comment: { value: "", errors: [] },
//           });
//           message.success(response?.data?.message);
//         }
//       })
//       .catch(function (error) {
//         if (error.response) {
//           // handleError(error?.response?.data?.data);
//           message.error(error?.response?.data?.message);
//         }
//       })
//       .finally(() => setLoading(false));
//   };

//   return (
//     <div>
//       <form
//         onSubmit={(e) => {
//           e.preventDefault();
//           callPostApi();
//         }}
//       >
//         <div className="mt-[-1rem]">
//           <div className="flex justify-between">
//             <label>
//               Date<sup className="text-red-500">*</sup>
//             </label>
//             <label>
//               Time<sup className="text-red-500">*</sup>
//             </label>
//           </div>
//           <div className="flex items-center w-full gap-3 mb-4">
//             <div className="w-[65%]">
//               <DatePicker
//                 required={true}
//                 name={"date"}
//                 className="py-2"
//                 format="DD-MM-YYYY"
//                 style={{ width: "100%" }}
//                 value={formData.date.value}
//                 onChange={(date) => handleInputChange("date")(date)}
//                 disabledDate={(current) =>
//                   current && current < dayjs().startOf("day")
//                 }
//               />
//               <p>{formData.date.errors}</p>
//             </div>

//             <div>
//               <CustomTimerPicker
//                 value={formData.time.value}
//                 onChange={handleInputChange("time")}
//                 disabledTime={() => ({
//                   disabledHours: () => {
//                     if (dayjs(formData.date.value).isSame(dayjs(), "day")) {
//                       return [...Array(dayjs().hour()).keys()];
//                     }
//                     return [];
//                   },
//                   disabledMinutes: (selectedHour) => {
//                     if (
//                       dayjs(formData.date.value).isSame(dayjs(), "day") &&
//                       selectedHour === dayjs().hour()
//                     ) {
//                       return [...Array(dayjs().minute()).keys()];
//                     }
//                     return [];
//                   },
//                 })}
//               />
//             </div>
//           </div>
//         </div>
//         <CustomTextArea
//           value={formData.comment.value}
//           onChange={handleInputChange("comment")}
//         />
//         <br />

//         <PrimaryButton
//           type="primary"
//           title="Submit"
//           htmlType="submit"
//           disabled={loading}
//         />
//       </form>
//     </div>
//   );
// };

// // add reminder close from here

import React, { useEffect, useState } from "react";
import {
  patchReminderService,
  PostAddAllMyRemiderService,
  reminderPostService,
} from "../ApiService";
import {
  DatePicker,
  Drawer,
  message,
  Pagination,
  Table,
  Tabs, // Import Tabs component
} from "antd";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { PAGESIZE } from "../../../lib/Constants";
import { PrimaryButton } from "../../../Components/CustomComponents/ButtonUi";
import { CustomTimerPicker } from "../../Lead/Components/TimePicker";
import { CustomTextArea } from "../../../Components/CustomComponents/CustomTextArea";
import LoadSkeleton from "../../../Components/CustomComponents/Skeleton";
import { GetColumnSearchProps } from "../../../Components/CustomComponents/TableColumnSearch";

const AllReminder = ({ dateRange, dateFormat, mode }) => {
  const [pageSize, setPageSize] = useState(PAGESIZE);
  const [reminderData, setReminderData] = useState();
  const [data, setData] = useState({});
  const [page, setPage] = useState(1);
  const [searchState, setSearchState] = useState({});
  const [openRemider, setOpenRemider] = useState(false);
  const [reminderparam, setReminderparam] = useState("lead");

  const leadModulePermission = useSelector(
    (state) => state.permissions.permissionsData
  );

  // Function to handle tab changes
  const handleTabChange = (key) => {
    setReminderparam(key);
    setPage(1);
  };

  const onShowSizeChange = (current, newPageSize) => {
    setPageSize(newPageSize);
    setPage(1, newPageSize);
  };

  // status api start from here
  const handleStatusChange = async (leadId, currentStatus) => {
    const newStatus = currentStatus === true ? false : true;
    try {
      await patchReminderService(newStatus, leadId).then((response) => {
        if (response.data.success === "1") {
          message.success(response?.data?.message);
          getReminderApi();
        }
      });
    } catch (error) {
      message.error(error?.response?.data?.message);
    }
  };
  // status api close from here

  let columns = [
    {
      title: "Email",
      dataIndex: "lead",
      key: "lead",
      width: "20%",
      ...GetColumnSearchProps("lead", setSearchState, searchState),
      render: (text, record) =>
        record.lead_id ? (
          <NavLink to={`/view-lead/${record.lead_id}`}>
            <p className="font-medium hover:text-orange-500">
              {text === null ? "-" : text}
            </p>
          </NavLink>
        ) : (
          <p className="font-medium">{text === null ? "-" : text}</p>
        ),
    },
    {
      title: "Registered User",
      dataIndex: "register_user",
      key: "register_user",
      width: "20%",
      ...GetColumnSearchProps("register_user", setSearchState, searchState),
      render: (text, record) =>
        record.lead_id ? (
          <NavLink to={`/view-lead/${record.lead_id}`}>
            <p className=" hover:text-orange-500">
              {text === null ? "-" : text}
            </p>
          </NavLink>
        ) : (
          <p>{text === null ? "-" : text}</p>
        ),
    },
    {
      title: "Comment",
      dataIndex: "comment",
      key: "comment",
      width: "20%",
      render: (text, record) =>
        record.lead_id ? (
          <NavLink to={`/view-lead/${record.lead_id}`}>
            <p className=" hover:text-orange-500">
              {text === null ? "-" : text}
            </p>
          </NavLink>
        ) : (
          <p>{text === null ? "-" : text}</p>
        ),
    },
    {
      title: "Date",
      dataIndex: "datetime",
      key: "date",
      width: "20%",
      render: (text, record) =>
        record.lead_id ? (
          <NavLink to={`/view-lead/${record.lead_id}`}>
            <p className=" hover:text-orange-500">
              {text === null ? "-" : text}
            </p>
          </NavLink>
        ) : (
          <p>{text === null ? "-" : text}</p>
        ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: "15%",
      render: (text, record) => (
        <>
          <p
            onClick={() => handleStatusChange(record.id, text)}
            className={`inline-flex py-1 px-3 text-sm shadow ${text === true
              ? "bg-green-200 text-green-700 rounded-md hover:bg-green-300"
              : "bg-[#ffce00] text-white rounded-md hover:bg-orange-500 "
              }`}
          >
            {text === true ? "Done" : "Mark As Done"}
          </p>
        </>
      ),
    },
  ];

  const getReminderApi = () => {
    const payload = {
      type: "all",
      start_date: dateRange && dateRange[0].format(dateFormat),
      end_date: dateRange && dateRange[1].format(dateFormat),
    };
    reminderPostService(
      payload,
      {
        ...searchState,
        current_page_number: page,
        count_per_page: pageSize,
      },
      reminderparam
    )
      .then((response) => {
        setReminderData(response.data.data);
        setData(response.data);
        // message.success(response?.data?.message);
      })
      .catch(function (error) {
        if (error) {
          message.error(error?.response?.data?.message);
        }
      });
  };

  useEffect(getReminderApi, [
    page,
    searchState,
    dateRange,
    reminderparam,
    pageSize,
  ]);

  return (
    <>
      <div className="w-full flex justify-between">
        <Tabs defaultActiveKey="lead" onChange={handleTabChange}>
          <Tabs.TabPane
            tab={<span className="text-slate-400">Lead</span>}
            key="lead"
          />
          <Tabs.TabPane
            tab={<span className="text-slate-400">Registered User</span>}
            key="register_user"
          />
          <Tabs.TabPane
            tab={<span className="text-slate-400">Self</span>}
            key="self"
          />
        </Tabs>
        {leadModulePermission.lead_management === "edit" && (
          <div>
            <PrimaryButton
              type="primary"
              className={` p-2 float-end my-2 mr-[2%]`}
              title={"Add Reminder"}
              block={false}
              onClick={() => setOpenRemider(true)}
            />
          </div>
        )}
      </div>

      {/* reminder table start from here */}
      {reminderData === undefined || reminderData === null ? (
        <LoadSkeleton />
      ) : (
        reminderData && (
          <Table
            columns={columns.map((col) => ({
              ...col,
              className: "whitespace-nowrap",
            }))}
            scroll={{ x: "max-content" }}
            dataSource={reminderData}
            pagination={false}
            className="mt-4"
          />
        )
      )}
      {/* reminder table close from here */}

      {/* Table pagination start from here */}
      <div className="flex justify-between items-center mt-4">
        <Pagination
          current={page}
          total={data.data_count}
          size="small"
          showQuickJumper
          pageSize={pageSize}
          responsive
          onChange={(page) => {
            setPage(page);
          }}
          showSizeChanger
          onShowSizeChange={onShowSizeChange}
        />
        <div className="text-sm text-black dark:text-yellow-500">
          {data.current_page_data_count} of {data.data_count} records
        </div>

      </div>
      {/* Table pagination close from here */}

      {/* sub status reminder drawer */}
      <Drawer
        title="Add Reminder"
        placement="right"
        width={400}
        onClose={() => setOpenRemider(false)}
        open={openRemider}
      >
        <AddReminder setOpenRemider={setOpenRemider} />
      </Drawer>
      {/* sub status reminder drawer */}
    </>
  );
};

export default AllReminder;

// add reminder start from here

const AddReminder = ({ setOpenRemider, mode }) => {
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
    date: dayjs(formData.date.value).format("DD-MM-YYYY"),
    time: formData.time.value
      ? dayjs(formData.time.value).format("HH:mm:ss")
      : null,
    comment: formData.comment.value,
  };

  // Function to make the API call
  const callPostApi = () => {
    PostAddAllMyRemiderService(payload)
      .then((response) => {
        if (response.data.success === "1") {
          console.log("Closing Drawer...");
          setOpenRemider(false);
          setFormData({
            date: { value: "", errors: [] },
            time: { value: null, errors: [] },
            comment: { value: "", errors: [] },
          });
          message.success(response?.data?.message);
        }
      })
      .catch(function (error) {
        if (error.response) {
          // handleError(error?.response?.data?.data);
          message.error(error?.response?.data?.message);
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
                      return [...Array(dayjs().hour()).keys()];
                    }
                    return [];
                  },
                  disabledMinutes: (selectedHour) => {
                    if (
                      dayjs(formData.date.value).isSame(dayjs(), "day") &&
                      selectedHour === dayjs().hour()
                    ) {
                      return [...Array(dayjs().minute()).keys()];
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

// add reminder close from here
