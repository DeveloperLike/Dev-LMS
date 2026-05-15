import React, { useEffect, useState } from "react";
import { Drawer, message, Table } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import LoadSkeleton from "../../../Components/CustomComponents/Skeleton";
import {
  addEmploymentService,
  editEmploymentDetailService,
  getEmploymentDetailService,
  getStudentEmploymentDetailsService,
} from "../ApiService";
import EmploymentDataUpdate from "./EmploymentDataUpdate";
import { PrimaryButton } from "../../../Components/CustomComponents/ButtonUi";
import {
  CustomDatePicker,
  CustomSelectInput,
  InputWithIcon,
} from "../../../Components/CustomComponents/InputWithIcon";
dayjs.extend(customParseFormat);

const fields = [
  {
    key: "employment_type",
    label: "Employment Type",
    type: "dropdown",
  },
  {
    key: "start_date",
    label: "Start Date",
    type: "date",
  },
  {
    key: "end_date",
    label: "End Date",
    type: "date",
  },
  { key: "organisation_name", label: "Organisation Name" },
  {
    key: "designation",
    label: "Designation",
  },
];

const Employment = ({ userName }) => {
  const [data, setData] = useState();
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [changeStatusOpen, setChangeStatusOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);




  let columns = [
    {
      title: "Employment Type",
      dataIndex: "employment_type",
      fixed: "left",
      key: "employment_type",
      minWidth: "120px",
      render: (text, record) => (
        <p className="font-medium" onClick={() => showEditDrawer(record.id)}>
          {text}
        </p>
      ),
    },
    {
      title: "Organisation Name",
      dataIndex: "organisation_name",
      key: "organisation_name",
      minWidth: "160px",
      render: (text, record) => (
        <p onClick={() => showEditDrawer(record.id)}>{text}</p>
      ),
    },
    {
      title: "Designation",
      dataIndex: "designation",
      key: "designation",
      minWidth: "100px",
      render: (text, record) => (
        <p onClick={() => showEditDrawer(record.id)}>{text}</p>
      ),
    },
    {
      title: "Start Date",
      dataIndex: "start_date",
      key: "start_date",
      minWidth: "120px",
      render: (text, record) => (
        <p onClick={() => showEditDrawer(record.id)}>{text}</p>
      ),
    },
    {
      title: "End Date",
      dataIndex: "end_date",
      key: "end_date",
      minWidth: "120px",
      render: (text, record) => (
        <p onClick={() => showEditDrawer(record.id)}>{text}</p>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      minWidth: "120px",
      // render: (text, record) => (
      //   <p onClick={() => showEditDrawer(record.id)}>{text}</p>
      // ),
      filters: [
        {
          text: "Pending",
          value: "pending",
        },
        {
          text: "Approved",
          value: "approved",
        },
        {
          text: "Rejected",
          value: "rejected",
        },
        {
          text: "Uploaded",
          value: "uploaded",
        },
      ],
      onFilter: (value, record) => record.status === value,
      render: (text) => {
        if (typeof text === "string" && text.length > 0) {
          if (text === "Approved") {
            return (
              <p className="bg-green-100 text-green-700 rounded-full py-1 px-3 text-sm font-medium">
                Approved
              </p>
            );
          } else if (text === "Rejected") {
            return (
              <p className="bg-red-100 text-red-700 rounded-full py-1 px-3 text-sm font-medium">
                Rejected
              </p>
            );
          } else if (text === "Submitted") {
            return (
              <p className="bg-blue-100 text-blue-700 rounded-full py-1 px-3 text-sm font-medium">
                Uploaded
              </p>
            );
          } else {
            return text.charAt(0).toUpperCase() + text.slice(1);
          }
        }
        return text;
      },
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      key: "remarks",
      minWidth: "120px",
      render: (text, record) => (
        <p onClick={() => showEditDrawer(record.id)}>{text}</p>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      minWidth: "120px",
      render: (text, record) => (
        <PrimaryButton
          title={"Change Status"}
          type={"primary"}
          onClick={() => showChangeStatusDrawer(record.id)}
        />
      ),
    },
  ];
  const showEditDrawer = (id) => {
    setSelectedData(id);
    setEditOpen(true);
  };
  const onEditClose = () => {
    setEditOpen(false);
    setSelectedData(null);
  };
  const showChangeStatusDrawer = (id) => {
    setSelectedData(id);
    setChangeStatusOpen(true);
  };
  const onChangeStatusClose = () => {
    setChangeStatusOpen(false);
    setSelectedData(null);
  };
  const getListApi = () => {
    getStudentEmploymentDetailsService(userName).then((response) => {
      setData(response.data.data);
    });
  };

  useEffect(getListApi, []);

  return (
    <>
      {/*Change Status section */}
      <Drawer
        title="Employment Details"
        placement="right"
        width={400}
        onClose={onChangeStatusClose}
        open={changeStatusOpen}
      >
        <EmploymentDataUpdate
          userName={userName}
          setEditOpen={setChangeStatusOpen}
          getProfileDetailApi={getListApi}
          dataremarks={data?.remarks}
          status={data?.status}
          selectedData={selectedData}
        />
      </Drawer>
      {/*Change Status section */}

      {/* Add Employment section */}
      <Drawer
        title="Add Employment"
        placement="right"
        width={400}
        onClose={() => setOpen(false)}
        open={open}
      >
        <AddEmployment
          getListApi={getListApi}
          setOpen={setOpen}
          userName={userName}
        />
      </Drawer>
      {/* Add Employment section */}

      {/* Edit Employment section */}
      {selectedData && (
        <Drawer
          title="Edit Employment"
          placement="right"
          width={400}
          onClose={onEditClose}
          open={editOpen}
        >
          <EditEmployment
            id={selectedData}
            setEditOpen={setEditOpen}
            getListApi={getListApi}
            userName={userName}
          />
        </Drawer>
      )}
      {/* Edit Employment section */}
      <div className=" flex items-center justify-self-end my-2">
        <div>
          <PrimaryButton
            type="primary"
            className="p-4"
            title={"Add Employment"}
            block={false}
            onClick={() => setOpen(true)}
          />
        </div>
        <div className="flex gap-3"></div>
      </div>
      <div className="overflow-x-auto">
        {data === undefined || null ? (
          <LoadSkeleton />
        ) : (
          <Table
            dataSource={data}
            columns={columns}
            pagination={false}
            scroll={{ x: "max-content" }}
          />
        )}
      </div>
    </>
  );
};

export default Employment;

export const AddEmployment = ({ getListApi, setOpen, userName }) => {
  const [formData, setFormData] = useState({});

  const handleInputChange = (e, field) => {
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

  const addEmploymentApi = () => {
    const dataToSubmit = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [
        key,
        value.value instanceof dayjs
          ? value.value.format("DD-MM-YYYY") // Format to DD-MM-YYYY
          : value.value,
      ])
    );
    addEmploymentService(dataToSubmit, userName)
      .then((response) => {
        if (response.data.success === "1") {
          getListApi();
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
        addEmploymentApi();
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
              ) : field.type === "dropdown" ? (
                <CustomSelectInput
                  placeholder={`Select ${field.label}`}
                  value={formData[field.key]?.value || null}
                  errors={formData[field.key]?.errors || []}
                  handler={(e) => handleInputChange(e, field.key)}
                  options={[
                    {
                      value: "Full Time",
                      label: "Full Time",
                    },
                    {
                      value: "Part Time",
                      label: "Part Time",
                    },
                  ]}
                />
              ) : field.type === "email" ? (
                <InputWithIcon
                  type="email"
                  placeholder={`Please enter ${field.label}`}
                  value={formData[field.key]?.value || ""}
                  errors={formData[field.key]?.errors || []}
                  handler={(e) => handleInputChange(e, field.key)}
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

export const EditEmployment = ({ id, getListApi, setEditOpen, userName }) => {
  const [formData, setFormData] = useState({});

  const handleInputChange = (e, field) => {
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

  const getEmploymentApi = () => {
    getEmploymentDetailService(userName, id).then((response) => {
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

  const editEmploymentApi = () => {
    const dataToSubmit = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [
        key,
        value.value instanceof dayjs
          ? value.value.format("DD-MM-YYYY") // Format to DD-MM-YYYY
          : value.value,
      ])
    );
    editEmploymentDetailService(dataToSubmit, userName, id)
      .then((response) => {
        if (response.data.success === "1") {
          getListApi();
          setEditOpen(false);
          message.success(response?.data?.message);
        }
      })
      .catch((error) => {
        if (error?.response) {
          handleError(error?.response?.data?.data);
          message.error(error?.response?.data?.message);
        }
      });
  };

  useEffect(() => {
    getEmploymentApi();
  }, [id]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        editEmploymentApi();
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
              ) : field.type === "dropdown" ? (
                <CustomSelectInput
                  placeholder={`Select ${field.label}`}
                  value={formData[field.key]?.value || null}
                  errors={formData[field.key]?.errors || []}
                  handler={(e) => handleInputChange(e, field.key)}
                  options={[
                    {
                      value: "Full Time",
                      label: "Full Time",
                    },
                    {
                      value: "Part Time",
                      label: "Part Time",
                    },
                  ]}
                />
              ) : field.type === "email" ? (
                <InputWithIcon
                  type="email"
                  placeholder={`Please enter ${field.label}`}
                  value={formData[field.key]?.value || ""}
                  errors={formData[field.key]?.errors || []}
                  handler={(e) => handleInputChange(e, field.key)}
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
