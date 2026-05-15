import { Drawer, message, Table, DatePicker } from "antd";
import React, { useEffect, useState } from "react";
import { PrimaryButton } from "../../Components/CustomComponents/ButtonUi";
import { useSelector } from "react-redux";
import { getVisaApplicationService } from "./ApiService";
import {
  CustomDatePicker,
  CustomSelectInput,
  InputWithIcon,
} from "../../Components/CustomComponents/InputWithIcon";
import { addVisaApplicationService } from "./ApiService";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
import {
  editVisaApplicationService,
  getVisaApplicationDetailService,
} from "./ApiService";

const fields = [
  // { key: "application_id", label: "Application id" },
  { key: "visa_id", label: "Visa id" },
  { key: "vfs_region", label: "VFS Region", type: "dropdown" },
  { key: "ba_status", label: "BA Status", type: "dropdown" },
  { key: "visa_status", label: "Visa Status", type: "dropdown" },
  { key: "ba_company", label: "BA Company", type: "dropdown" },
  {
    key: "visa_document_status",
    label: "Visa Document Status",
    type: "dropdown",
  },
  { key: "visa_file_status", label: "Visa File Status", type: "dropdown" },
  { key: "visa_waitlisted_on", label: "Visa Waitlisted On", type: "date" },
  {
    key: "visa_appointment_date",
    label: "Visa Appointment Date",
    type: "date",
  },
];

export const VisaApplication = ({ userData, mode }) => {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [visaManagementData, setVisaManagementData] = useState();
  const modulePermission = useSelector(
    (state) => state.permissions.permissionsData
  );

  let columns = [
    {
      title: "Application id",
      dataIndex: "application_id",
      fixed: "left",
      key: "application_id",
      width: "20%",
      minWidth: "160px",
      render: (text, record) => (
        <p className="font-medium" onClick={() => showEditDrawer(record.id)}>
          {text}
        </p>
      ),
    },
    {
      title: "Visa id",
      dataIndex: "visa_id",
      key: "visa_id",
      width: "10%",
      minWidth: "100px",
      render: (text, record) => (
        <p onClick={() => showEditDrawer(record.id)}>{text}</p>
      ),
    },
    {
      title: "VFS region",
      dataIndex: "vfs_region",
      key: "vfs_region",
      minWidth: "110px",
      render: (text, record) => (
        <p onClick={() => showEditDrawer(record.id)}>{text}</p>
      ),
    },
    {
      title: "BA status",
      dataIndex: "ba_status",
      key: "ba_status",
      minWidth: "100px",
      render: (text, record) => (
        <p onClick={() => showEditDrawer(record.id)}>{text}</p>
      ),
    },
    {
      title: "BA company",
      dataIndex: "ba_company",
      key: "ba_company",
      minWidth: "120px",
      render: (text, record) => (
        <p onClick={() => showEditDrawer(record.id)}>{text}</p>
      ),
    },
    {
      title: "Visa document status",
      dataIndex: "visa_document_status",
      key: "visa_document_status",
      minWidth: "170px",
      render: (text, record) => (
        <p onClick={() => showEditDrawer(record.id)}>{text}</p>
      ),
    },
    {
      title: "Visa file status",
      dataIndex: "visa_file_status",
      key: "visa_file_status",
      minWidth: "130px",
      render: (text, record) => (
        <p onClick={() => showEditDrawer(record.id)}>{text}</p>
      ),
    },
    {
      title: "Visa waitlisted on",
      dataIndex: "visa_waitlisted_on",
      key: "visa_waitlisted_on",
      minWidth: "150px",
      render: (text, record) => (
        <p onClick={() => showEditDrawer(record.id)}>{text}</p>
      ),
    },
    {
      title: "Visa appointment date",
      dataIndex: "visa_appointment_date",
      key: "visa_appointment_date",
      minWidth: "180px",
      render: (text, record) => (
        <p onClick={() => showEditDrawer(record.id)}>{text}</p>
      ),
    },
  ];

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const showEditDrawer = (id) => {
    setSelectedData(id);
    setEditOpen(true);
  };
  const onEditClose = () => {
    setEditOpen(false);
    setSelectedData(null);
  };

  const getVisaApplicationApi = () => {
    getVisaApplicationService(userData).then((response) => {
      setVisaManagementData(response.data.data);
    });
  };

  useEffect(getVisaApplicationApi, [modulePermission.lead_management]);
  return (
    <>
      {/* Add Visa Application section */}
      <Drawer
        title="Add Visa Application"
        placement="right"
        width={400}
        onClose={onClose}
        open={open}
      >
        <AddVisaApplication
          getVisaApplicationApi={getVisaApplicationApi}
          setOpen={setOpen}
          userData={userData}
          mode={mode}
        />
      </Drawer>
      {/* Add Visa Application section */}

      {/* Edit Visa Application section */}
      {selectedData && (
        <Drawer
          title="Edit Visa Application"
          placement="right"
          width={400}
          onClose={onEditClose}
          open={editOpen}
        >
          <EditVisaApplication
            id={selectedData}
            setEditOpen={setEditOpen}
            getVisaApplicationApi={getVisaApplicationApi}
            userData={userData}
            mode={mode}
          />
        </Drawer>
      )}
      {/* Edit Visa Application section */}

      <div className="flex justify-self-end pt-2">
        <PrimaryButton
          type="primary"
          className={`${mode === "dark" ?
            "text-yellow-500 border-yellow-500 hover:text-white" : "text-black"} dark:hover:bg-yellow-500 dark:bg-meta-4 p-2`}
          title={"Add Visa Application"}
          block={false}
          onClick={showDrawer}
          mode={mode}
        />
      </div>
      <div className="h-2"></div>
      <div className="max-w-full overflow-x-auto bg-white dark:bg-boxdark rounded-lg transition-colors duration-200">
        <Table
          rowHoverable={false}
          columns={columns.map((col) => ({
            ...col,
            className: "whitespace-nowrap",
          }))}
          dataSource={visaManagementData}
          pagination={false}
          scroll={{ x: "max-content" }}
          bordered={false}
          className="
      bg-white dark:bg-boxdark
      [&_.ant-table-tbody>tr>td]:bg-white
      dark:[&_.ant-table-tbody>tr>td]:bg-boxdark
      [&_.ant-table-empty]:bg-white
      dark:[&_.ant-table-empty]:bg-boxdark
    "
        />
      </div>

    </>
  );
};

export const AddVisaApplication = ({
  getVisaApplicationApi,
  setOpen,
  userData,
}) => {
  const [formData, setFormData] = useState({});

  const handleInputChange = (e, field) => {
    // const value = e instanceof dayjs ? e : e?.target?.value;
    let value = e?.target?.value !== undefined ? e.target.value : e;
    setFormData((prevState) => ({
      ...prevState,
      [field]: { ...prevState[field], value },
    }));
  };

  const handleError = (errors) => {
    setFormData((prevData) => {
      const updatedFormData = {};
      Object.keys(prevData).forEach((field) => {
        updatedFormData[field] = {
          ...prevData[field],
          errors: errors[field] || [],
        };
      });
      return updatedFormData;
    });
  };

  const addApplicationApi = () => {
    const dataToSubmit = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [
        key,
        value.value instanceof dayjs
          ? value.value.format("DD-MM-YYYY") // Format to DD-MM-YYYY
          : value.value,
      ])
    );
    addVisaApplicationService(dataToSubmit, userData)
      .then((response) => {
        if (response.data.success === "1") {
          getVisaApplicationApi();
          setFormData({});
          setOpen(false);
          message.success(response?.data?.message);
        }
      })
      .catch((error) => {
        if (error) {
          handleError(error?.response?.data?.data);
          message.error(error?.response?.data?.message);
        }
      });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        addApplicationApi();
      }}
      className="w-full"
    >
      <div>
        <div className="grid grid-cols-1 gap-4">
          {fields.map((field) => (
            <div className="flex flex-col gap-1" key={field.key}>
              <label className="text-sm flex items-center gap-1">
                {field.label}
              </label>
              {field.type === "date" ? (
                <CustomDatePicker
                  value={formData[field.key]?.value}
                  errors={formData[field.key]?.errors || []}
                  onChange={(date) => handleInputChange(date, field.key)}
                />
              ) : field.type === "email" ? (
                <InputWithIcon
                  type="email"
                  placeholder={`Please enter ${field.label}`}
                  value={formData[field.key]?.value || ""}
                  errors={formData[field.key]?.errors || []}
                  handler={(e) => handleInputChange(e, field.key)}
                />
              ) : field.type === "dropdown" ? (
                <CustomSelectInput
                  placeholder={`Select ${field.label}`}
                  value={formData[field.key]?.value || null}
                  errors={formData[field.key]?.errors || []}
                  handler={(e) => handleInputChange(e, field.key)}
                  options={
                    field.key === "vfs_region"
                      ? [
                        {
                          value: "Bangalore",
                          label: "Bangalore",
                        },
                        {
                          value: "Mumbai",
                          label: "Mumbai",
                        },
                        {
                          value: "Delhi",
                          label: "Delhi",
                        },
                        {
                          value: "Hyderabad",
                          label: "Hyderabad",
                        },
                        {
                          value: "Chennai",
                          label: "Chennai",
                        },
                        {
                          value: "Kolkata",
                          label: "Kolkata",
                        },
                        {
                          value: "Dubai",
                          label: "Dubai",
                        },
                        {
                          value: "Cochin",
                          label: "Cochin",
                        },
                      ]
                      : field.key === "ba_status"
                        ? [
                          {
                            value:
                              "Blocked Account Not Started Due To Low Payment",
                            label:
                              "Blocked Account Not Started Due To Low Payment",
                          },
                          {
                            value: "Blocked Account Intro Email And Call",
                            label: "Blocked Account Intro Email And Call",
                          },
                          {
                            value: "Blocked Account Opened",
                            label: "Blocked Account Opened",
                          },
                          {
                            value: "Funds Transferred",
                            label: "Funds Transferred",
                          },
                          {
                            value: "Not Applicable",
                            label: "Not Applicable",
                          },
                        ]
                        : field.key === "ba_company"
                          ? [
                            {
                              value: "Fintiba",
                              label: "Fintiba",
                            },
                            {
                              value: "Expatrio",
                              label: "Expatrio",
                            },
                            {
                              value: "ICICI Bank",
                              label: "ICICI Bank",
                            },
                            {
                              value: "Studely",
                              label: "Studely",
                            },
                          ]
                          : field.key === "visa_document_status"
                            ? [
                              {
                                value: "Not Received",
                                label: "Not Received",
                              },
                              {
                                value: "Partially Received",
                                label: "Partially Received",
                              },
                              {
                                value: "Fully Received",
                                label: "Fully Received",
                              },
                              {
                                value: "Not Verified",
                                label: "Not Verified",
                              },
                              {
                                value: "Verified",
                                label: "Verified",
                              },
                            ]
                            : field.key === "visa_file_status"
                              ? [
                                {
                                  value: "Visa Not Started Due To Low Payment",
                                  label: "Visa Not Started Due To Low Payment",
                                },
                                {
                                  value: "Visa Checklist Sent",
                                  label: "Visa Checklist Sent",
                                },
                                {
                                  value: "Visa Process Email & Call Done",
                                  label: "Visa Process Email & Call Done",
                                },
                                {
                                  value: "Visa Document Prepared",
                                  label: "Visa Document Prepared",
                                },
                                {
                                  value: "Visa Documents Verified And Sent",
                                  label: "Visa Documents Verified And Sent",
                                },
                                {
                                  value: "Financials Received",
                                  label: "Financials Received",
                                },
                                {
                                  value: "Mock One Done",
                                  label: "Mock One Done",
                                },
                                {
                                  value: "Full File Received & Verified",
                                  label: "Full File Received & Verified",
                                },
                                {
                                  value: "Mock Two Done",
                                  label: "Mock Two Done",
                                },
                              ]
                              : [
                                {
                                  value: "Appointment Not Booked",
                                  label: "Appointment Not Booked",
                                },
                                {
                                  value: "Waitlisted",
                                  label: "Waitlisted",
                                },
                                {
                                  value: "Appointment Booked",
                                  label: "Appointment Booked",
                                },
                                {
                                  value: "Applied",
                                  label: "Applied",
                                },
                                {
                                  value: "Rejected",
                                  label: "Rejected",
                                },
                                {
                                  value: "To Be Rebooked",
                                  label: "To Be Rebooked",
                                },
                                {
                                  value: "Stamped",
                                  label: "Stamped",
                                },
                              ]
                  }
                />
              ) : (
                <InputWithIcon
                  type="text"
                  placeholder={`Please enter ${field.label}`}
                  value={formData[field.key]?.value || ""}
                  errors={formData[field.key]?.errors || []}
                  handler={(e) => handleInputChange(e, field.key)}
                />
              )}
            </div>
          ))}
        </div>
        <PrimaryButton
          type="primary"
          htmlType={"submit"}
          className="p-4 px-7 mt-4 flex justify-self-center "
          title={"Submit"}
          block={false}
        />
      </div>
    </form>
  );
};

export const EditVisaApplication = ({
  id,
  getVisaApplicationApi,
  setEditOpen,
  userData,
}) => {
  const [formData, setFormData] = useState({});

  const handleInputChange = (e, field) => {
    // const value = e instanceof dayjs ? e : e?.target?.value;
    let value = e?.target?.value !== undefined ? e.target.value : e;
    setFormData((prevState) => ({
      ...prevState,
      [field]: { ...prevState[field], value },
    }));
  };

  const handleError = (errors) => {
    setFormData((prevData) => {
      const updatedFormData = {};
      Object.keys(prevData).forEach((field) => {
        updatedFormData[field] = {
          ...prevData[field],
          errors: errors[field] || [],
        };
      });
      return updatedFormData;
    });
  };

  const getApplicationApi = () => {
    getVisaApplicationDetailService(userData, id).then((response) => {
      if (response && response.data && response.data.data) {
        const initialFormData = {};
        fields.forEach((field) => {
          initialFormData[field.key] = {
            value:
              field.type === "date" && response.data.data[field.key]
                ? dayjs(response.data.data[field.key])
                : response.data.data[field.key] || "",
            errors: [],
          };
        });
        setFormData(initialFormData);
      }
    });
  };

  const editApplicationApi = () => {
    const dataToSubmit = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [
        key,
        value.value instanceof dayjs
          ? value.value.format("DD-MM-YYYY") // Format to DD-MM-YYYY
          : value.value,
      ])
    );
    editVisaApplicationService(dataToSubmit, userData, id)
      .then((response) => {
        if (response.data.success === "1") {
          getVisaApplicationApi();
          setEditOpen(false);
          setFormData({});
          message.success(response?.data?.message);
        }
      })
      .catch((error) => {
        if (error) {
          handleError(error?.response?.data?.data);
          message.error(error?.response?.data?.message);
        }
      });
  };

  useEffect(() => {
    getApplicationApi();
  }, [id]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        editApplicationApi();
      }}
      className="w-3/3"
    >
      <div>
        <div className="grid grid-cols-1 gap-4">
          {fields.map((field) => (
            <div className="flex flex-col gap-1" key={field.key}>
              <label className="text-sm flex items-center gap-1">
                {field.label}
              </label>
              {field.type === "date" ? (
                <CustomDatePicker
                  value={formData[field.key]?.value}
                  errors={formData[field.key]?.errors || []}
                  onChange={(date) => handleInputChange(date, field.key)}
                />
              ) : field.type === "email" ? (
                <InputWithIcon
                  type="email"
                  placeholder={`Please enter ${field.label}`}
                  value={formData[field.key]?.value || ""}
                  errors={formData[field.key]?.errors || []}
                  handler={(e) => handleInputChange(e, field.key)}
                />
              ) : field.type === "dropdown" ? (
                <CustomSelectInput
                  placeholder={`Select ${field.label}`}
                  value={formData[field.key]?.value || null}
                  errors={formData[field.key]?.errors || []}
                  handler={(e) => handleInputChange(e, field.key)}
                  options={
                    field.key === "vfs_region"
                      ? [
                        {
                          value: "Bangalore",
                          label: "Bangalore",
                        },
                        {
                          value: "Mumbai",
                          label: "Mumbai",
                        },
                        {
                          value: "Delhi",
                          label: "Delhi",
                        },
                        {
                          value: "Hyderabad",
                          label: "Hyderabad",
                        },
                        {
                          value: "Chennai",
                          label: "Chennai",
                        },
                        {
                          value: "Kolkata",
                          label: "Kolkata",
                        },
                        {
                          value: "Dubai",
                          label: "Dubai",
                        },
                        {
                          value: "Cochin",
                          label: "Cochin",
                        },
                      ]
                      : field.key === "ba_status"
                        ? [
                          {
                            value:
                              "Blocked Account Not Started Due To Low Payment",
                            label:
                              "Blocked Account Not Started Due To Low Payment",
                          },
                          {
                            value: "Blocked Account Intro Email And Call",
                            label: "Blocked Account Intro Email And Call",
                          },
                          {
                            value: "Blocked Account Opened",
                            label: "Blocked Account Opened",
                          },
                          {
                            value: "Funds Transferred",
                            label: "Funds Transferred",
                          },
                          {
                            value: "Not Applicable",
                            label: "Not Applicable",
                          },
                        ]
                        : field.key === "ba_company"
                          ? [
                            {
                              value: "Fintiba",
                              label: "Fintiba",
                            },
                            {
                              value: "Expatrio",
                              label: "Expatrio",
                            },
                            {
                              value: "ICICI Bank",
                              label: "ICICI Bank",
                            },
                            {
                              value: "Studely",
                              label: "Studely",
                            },
                          ]
                          : field.key === "visa_document_status"
                            ? [
                              {
                                value: "Not Received",
                                label: "Not Received",
                              },
                              {
                                value: "Partially Received",
                                label: "Partially Received",
                              },
                              {
                                value: "Fully Received",
                                label: "Fully Received",
                              },
                              {
                                value: "Not Verified",
                                label: "Not Verified",
                              },
                              {
                                value: "Verified",
                                label: "Verified",
                              },
                            ]
                            : field.key === "visa_file_status"
                              ? [
                                {
                                  value: "Visa Not Started Due To Low Payment",
                                  label: "Visa Not Started Due To Low Payment",
                                },
                                {
                                  value: "Visa Checklist Sent",
                                  label: "Visa Checklist Sent",
                                },
                                {
                                  value: "Visa Process Email & Call Done",
                                  label: "Visa Process Email & Call Done",
                                },
                                {
                                  value: "Visa Document Prepared",
                                  label: "Visa Document Prepared",
                                },
                                {
                                  value: "Visa Documents Verified And Sent",
                                  label: "Visa Documents Verified And Sent",
                                },
                                {
                                  value: "Financials Received",
                                  label: "Financials Received",
                                },
                                {
                                  value: "Mock One Done",
                                  label: "Mock One Done",
                                },
                                {
                                  value: "Full File Received & Verified",
                                  label: "Full File Received & Verified",
                                },
                                {
                                  value: "Mock Two Done",
                                  label: "Mock Two Done",
                                },
                              ]
                              : [
                                {
                                  value: "Appointment Not Booked",
                                  label: "Appointment Not Booked",
                                },
                                {
                                  value: "Waitlisted",
                                  label: "Waitlisted",
                                },
                                {
                                  value: "Appointment Booked",
                                  label: "Appointment Booked",
                                },
                                {
                                  value: "Applied",
                                  label: "Applied",
                                },
                                {
                                  value: "Rejected",
                                  label: "Rejected",
                                },
                                {
                                  value: "To Be Rebooked",
                                  label: "To Be Rebooked",
                                },
                                {
                                  value: "Stamped",
                                  label: "Stamped",
                                },
                              ]
                  }
                />
              ) : (
                <InputWithIcon
                  type="text"
                  placeholder={`Please enter ${field.label}`}
                  value={formData[field.key]?.value || ""}
                  errors={formData[field.key]?.errors || []}
                  handler={(e) => handleInputChange(e, field.key)}
                />
              )}
            </div>
          ))}
        </div>
        <PrimaryButton
          type="primary"
          htmlType={"submit"}
          className="p-4 px-7 mt-4 flex justify-self-center "
          title={"Submit"}
          block={false}
        />
      </div>
    </form>
  );
};
