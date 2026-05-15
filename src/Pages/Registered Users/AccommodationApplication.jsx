import { Drawer, message, Table, DatePicker, Button, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { PrimaryButton } from "../../Components/CustomComponents/ButtonUi";
import { useSelector } from "react-redux";
import { getAccommodationApplicationService } from "./ApiService";
import {
  CustomDatePicker,
  CustomSelectInput,
  InputWithIcon,
} from "../../Components/CustomComponents/InputWithIcon";
import { addAccommodationApplicationService } from "./ApiService";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
import {
  editAccommodationApplicationService,
  getAccommodationApplicationDetailService,
} from "./ApiService";
import { CustomUpload } from "../../Components/CustomComponents/CustomUpload";

const fields = [
  { key: "accommodation_title", label: "Accommodation Title" },
  { key: "check_in_date", label: "Check in Date", type: "date" },
  { key: "address", label: "Address" },
  { key: "booking_status", label: "Booking Status", type: "dropdown" },
  { key: "lease_agreement", label: "Lease Agreement", type: "file" },
  { key: "housing_insurance", label: "Housing Insurance", type: "file" },
];

export const AccommodationApplication = ({ userData, mode }) => {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [data, setData] = useState();
  const [leaseModalOpen, setLeaseModalOpen] = useState(false);
  const [leaseUrl, setLeaseUrl] = useState("");
  const [insuranceModalOpen, setInsuranceModalOpen] = useState(false);
  const [insuranceUrl, setInsuranceUrl] = useState("");

  const modulePermission = useSelector(
    (state) => state.permissions.permissionsData
  );

  let columns = [
    {
      title: "Accommodation Title",
      dataIndex: "accommodation_title",
      fixed: "left",
      key: "accommodation_title",
      width: "20%",
      minWidth: "150px",
      render: (text, record) => (
        <p className="font-medium" onClick={() => showEditDrawer(record.id)}>
          {text}
        </p>
      ),
    },
    {
      title: "Booking Status",
      dataIndex: "booking_status",
      key: "booking_status",
      width: "10%",
      minWidth: "170px",
      render: (text, record) => (
        <p onClick={() => showEditDrawer(record.id)}>{text}</p>
      ),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      width: "10%",
      minWidth: "170px",
      render: (text, record) => (
        <p onClick={() => showEditDrawer(record.id)}>{text}</p>
      ),
    },
    {
      title: "Check in Date",
      dataIndex: "check_in_date",
      key: "check_in_date",
      minWidth: "140px",
      render: (text, record) => (
        <p onClick={() => showEditDrawer(record.id)}>{text}</p>
      ),
    },
    {
      title: "Lease Agreement",
      dataIndex: "lease_agreement",
      key: "lease_agreement",
      minWidth: "130px",
      render: (file) => (
        <>
          {file && (
            <Button
              onClick={() => {
                setLeaseUrl(file);
                setLeaseModalOpen(true);
              }}
            >
              View
            </Button>
          )}
        </>
      ),
    },
    {
      title: "Housing Insurance",
      dataIndex: "housing_insurance",
      key: "housing_insurance",
      minWidth: "120px",
      render: (file) => (
        <>
          {file && (
            <Button
              onClick={() => {
                setInsuranceUrl(file);
                setInsuranceModalOpen(true);
              }}
            >
              View
            </Button>
          )}
        </>
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

  const getApplicationsApi = () => {
    getAccommodationApplicationService(userData).then((response) => {
      setData(response.data.data);
    });
  };

  useEffect(getApplicationsApi, [modulePermission.lead_management]);
  return (
    <>
      {/* Add Accommodation Application section */}
      <Drawer
        title="Add Accommodation Application"
        placement="right"
        width={400}
        onClose={onClose}
        open={open}
      >
        <AddAccommodationApplication
          getApplicationsApi={getApplicationsApi}
          setOpen={setOpen}
          userData={userData}
        />
      </Drawer>
      {/* Add Accommodation Application section */}

      {/* Edit Accommodation Application section */}
      {selectedData && (
        <Drawer
          title="Edit Accommodation Application"
          placement="right"
          width={400}
          onClose={onEditClose}
          open={editOpen}
        >
          <EditAccommodationApplication
            id={selectedData}
            setEditOpen={setEditOpen}
            getApplicationsApi={getApplicationsApi}
            userData={userData}
          />
        </Drawer>
      )}
      {/* Edit Accommodation Application section */}

      {/* Lease Agreement Modal */}
      <Modal
        title="View Lease Agreement"
        open={leaseModalOpen}
        footer={null}
        onCancel={() => setLeaseModalOpen(false)}
        width={500}
      >
        <img
          src={leaseUrl}
          alt="Lease Agreement"
          style={{ width: "100%", height: "auto" }}
        />

        <a
          href={leaseUrl}
          download={leaseUrl}
          target="_blank"
          className="flex justify-self-end"
        >
          <PrimaryButton
            title={"Download"}
            type={"primary"}
            className={"mt-6"}
          ></PrimaryButton>
        </a>
      </Modal>
      {/* Lease Agreement Modal */}

      {/* Housing Insurance Modal */}
      <Modal
        title="View Housing Insurance"
        open={insuranceModalOpen}
        footer={null}
        onCancel={() => setInsuranceModalOpen(false)}
        width={500}
      >
        <img
          src={insuranceUrl}
          alt="Lease Agreement"
          style={{ width: "100%", height: "auto" }}
        />

        <a
          href={insuranceUrl}
          download={insuranceUrl}
          target="_blank"
          className="flex justify-self-end"
        >
          <PrimaryButton
            title={"Download"}
            type={"primary"}
            className={"mt-6"}
          ></PrimaryButton>
        </a>
      </Modal>
      {/* Housing Insurance Modal */}

      <div className="flex justify-self-end pt-2">
        <PrimaryButton
          type="primary"
          className={`${mode === "dark" ?
            "text-yellow-500 border-yellow-500 hover:text-white" : "text-black"} dark:hover:bg-yellow-500 dark:bg-meta-4 p-2`}
          title={"Add Accommodation Application"}
          block={false}
          onClick={showDrawer}
        />
      </div>
      <div className="h-2"></div>
      <div className="max-w-full overflow-x-auto">
        <Table
          footer={null}
          bordered
          rowHoverable={false}
          columns={columns}
          dataSource={data}
          pagination={false}
          scroll={{ x: "max-content" }}
        />
      </div>
    </>
  );
};

export const AddAccommodationApplication = ({
  getApplicationsApi,
  setOpen,
  userData,
}) => {
  const [formData, setFormData] = useState({});

  const handleInputChange = (e, fieldKey) => {
    let value = e?.target?.value !== undefined ? e.target.value : e;
    setFormData((prevState) => ({
      ...prevState,
      [fieldKey]: { ...prevState[fieldKey], value },
    }));
    // For file fields, update formData with the file name
    if (
      fields.find((f) => f.key === fieldKey)?.type === "file" &&
      e?.fileList?.[0]?.originFileObj
    ) {
      setFormData((prevState) => ({
        ...prevState,
        [fieldKey]: {
          ...prevState[fieldKey],
          file: e.fileList[0].originFileObj,
          value: e.fileList[0].name,
        },
      }));
    } else if (
      fields.find((f) => f.key === fieldKey)?.type === "file" &&
      e?.fileList?.length === 0 // Check if fileList is empty after removal
    ) {
      // Handle case where file is removed
      setFormData((prevState) => ({
        ...prevState,
        [fieldKey]: { ...prevState[fieldKey], file: null, value: null },
      }));
    }
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
    const dataToSubmit = new FormData();
    for (const key in formData) {
      if (Object.hasOwnProperty.call(formData, key)) {
        const fieldData = formData[key];
        if (fieldData?.file) {
          dataToSubmit.append(key, fieldData.file); // Append the File object
        } else if (fieldData?.value instanceof dayjs) {
          dataToSubmit.append(key, fieldData.value.format("DD-MM-YYYY"));
        } else if (fieldData?.value !== undefined) {
          dataToSubmit.append(key, fieldData.value);
        }
      }
    }

    addAccommodationApplicationService(dataToSubmit, userData)
      .then((response) => {
        if (response.data.success === "1") {
          getApplicationsApi();
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
      className="w-3/3"
      encType="multipart/form-data" // IMPORTANT!
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
              ) : field.type === "file" ? (
                <CustomUpload
                  fileList={
                    formData[field.key]?.value
                      ? [{ name: formData[field.key].value }]
                      : []
                  }
                  errors={formData[field.key]?.errors || []}
                  onChange={(info) => handleInputChange(info, field.key)}
                  beforeUpload={() => false}
                  showUploadList={true}
                />
              ) : field.type === "dropdown" ? (
                <CustomSelectInput
                  placeholder={`Select ${field.label}`}
                  value={formData[field.key]?.value || null}
                  errors={formData[field.key]?.errors || []}
                  handler={(e) => handleInputChange(e, field.key)}
                  options={[
                    {
                      value: "Approved",
                      label: "Approved",
                    },
                  ]}
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

export const EditAccommodationApplication = ({
  id,
  getApplicationsApi,
  setEditOpen,
  userData,
}) => {
  const [formData, setFormData] = useState({});

  const handleInputChange = (e, fieldKey) => {
    let value = e?.target?.value !== undefined ? e.target.value : e;
    setFormData((prevState) => ({
      ...prevState,
      [fieldKey]: { ...prevState[fieldKey], value },
    }));
    // For file fields, update formData with the file name
    if (
      fields.find((f) => f.key === fieldKey)?.type === "file" &&
      e?.fileList?.[0]?.originFileObj
    ) {
      setFormData((prevState) => ({
        ...prevState,
        [fieldKey]: {
          ...prevState[fieldKey],
          file: e.fileList[0].originFileObj,
          value: e.fileList[0].name,
        },
      }));
    } else if (
      fields.find((f) => f.key === fieldKey)?.type === "file" &&
      e?.fileList?.length === 0 // Check if fileList is empty after removal
    ) {
      // Handle case where file is removed
      setFormData((prevState) => ({
        ...prevState,
        [fieldKey]: { ...prevState[fieldKey], file: null, value: null },
      }));
    }
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
    getAccommodationApplicationDetailService(userData, id).then((response) => {
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
    const dataToSubmit = new FormData();
    for (const key in formData) {
      if (Object.hasOwnProperty.call(formData, key)) {
        const fieldData = formData[key];
        if (fieldData?.file) {
          dataToSubmit.append(key, fieldData.file); // Append the File object
        } else if (fieldData?.value instanceof dayjs) {
          dataToSubmit.append(key, fieldData.value.format("DD-MM-YYYY"));
        } else if (fieldData?.value !== undefined) {
          dataToSubmit.append(key, fieldData.value);
        }
      }
    }
    editAccommodationApplicationService(dataToSubmit, userData, id)
      .then((response) => {
        if (response.data.success === "1") {
          getApplicationsApi();
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
    getApplicationApi();
  }, [id]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        editApplicationApi();
      }}
      className="w-3/3"
      encType="multipart/form-data" // IMPORTANT!
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
              ) : field.type === "file" ? (
                <CustomUpload
                  fileList={
                    formData[field.key]?.value
                      ? [{ name: formData[field.key].value }]
                      : []
                  }
                  errors={formData[field.key]?.errors || []}
                  onChange={(info) => handleInputChange(info, field.key)}
                  beforeUpload={() => false}
                  showUploadList={true}
                />
              ) : field.type === "dropdown" ? (
                <CustomSelectInput
                  placeholder={`Select ${field.label}`}
                  value={formData[field.key]?.value || null}
                  errors={formData[field.key]?.errors || []}
                  handler={(e) => handleInputChange(e, field.key)}
                  options={[
                    {
                      value: "Approved",
                      label: "Approved",
                    },
                  ]}
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
