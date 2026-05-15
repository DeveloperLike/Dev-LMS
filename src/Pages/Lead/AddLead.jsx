import React, { useState, useEffect } from "react";
import { Form, Select, Row, Col, Button, message, Modal, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { PrimaryButton } from "../../Components/CustomComponents/ButtonUi";
import {
  CustomSelectInput,
  InputWithIcon,
} from "../../Components/CustomComponents/InputWithIcon";
import {
  addleadlistService,
  getLeadformsService,
  getLeadSourceDropdownService,
} from "../Lead/ApiService";
import { DatePicker, Radio } from "antd";
import { getCityDropdownService } from "../City/ApiService";
import { getCounsellorDropdown } from "../AssignmentRule/ApiService";
import moment from "moment";
import { useDispatch } from "react-redux";
import { notificationFun } from "../../lib/redux/NotificationSlice";
import { getStateDropdownService } from "../State/ApiService";
import { set } from "react-hook-form";
import { getBranchService } from "../User/ApiService";
import { useSelector } from "react-redux";

const { Option } = Select; // Destructure Option from Select

const AddLeadForm2 = ({ mode }) => {
  const [formData, setFormData] = useState([]);
  const [dropdownData, setDropdown] = useState([]);
  const [counsellorDropdown, setCounsellorDropdown] = useState([]);
  const [counsellor, setCounsellor] = useState();
  const [leadsource, setLeadSource] = useState();
  const [cityOptions, setCityOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [nearestBranchOptions, setNearestBranchOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isReEnquiryModalOpen, setIsReEnquiryModalOpen] = useState(false);
  const user = useSelector((state) => state.permissions.permissionsData);
  const ALLOWED_SOURCES = [
    "walk_in",
    "refer_by_student",
    "reference",
  ];

  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // API Calls
  const leadformfieldGetApi = async () => {
    const response = await getLeadformsService();
    setFormData(response.data.data);
  };

  const dropdownGetApi = async () => {
    const response = await getLeadSourceDropdownService();
    setDropdown(response.data.data);
  };

  const counsellorDropdownApi = async () => {
    const response = await getCounsellorDropdown();
    setCounsellorDropdown(response.data.data);
  };

  const getCityDropdownApi = async () => {
    const response = await getCityDropdownService();
    setCityOptions(response.data.data);
  };

  const getStateDropdownApi = async () => {
    const response = await getStateDropdownService();
    setStateOptions(response.data.data);
  };

  const getNearestBranchDropdownApi = async () => {
    const response = await getBranchService();
    setNearestBranchOptions(response.data.data);
  };


  const generatePayload = (values) => {
    const payload = {
      assign_to: counsellor,
      lead_source: leadsource,
      campaign: values.campaign, // Added campaign to the payload
      field_data: formData
        .filter((field) => values?.[field.code] !== undefined)
        .map((field) => ({
          code: field.code,
          value:
            field.type === "date" && values[field.code]
              ? moment(values[field.code]).format("DD-MM-YYYY") // format the date here
              : values[field.code], // leave other field values unchanged
        })),
    };
    isReEnquiryModalOpen && Object.assign(payload, { re_enquiry: true });
    return payload;
  };

  // Handle Backend Errors
  const handleError = (errors) => {
    setFormData((prevData) =>
      prevData.map((field) => ({
        ...field,
        errors: errors?.[field.code] ? errors[field.code] : [], // Set errors if present
      }))
    );
  };

  // Form Submit
  const handleSubmit = async (values) => {
    if (loading) return;

    const hasSpaceInPhone = Object.entries(values).some(
      ([key, val]) =>
        typeof val === "string" &&
        /\s/.test(val) &&
        key.toLowerCase().includes("phone")
    );

    if (hasSpaceInPhone) {
      message.error("Phone number should not contain spaces");
      return;
    }

    setLoading(true);

    const payload = generatePayload(values);

    try {
      const response = await addleadlistService(payload, leadsource);

      if (response.data.success === "1") {
        message.success(response.data.message || "Lead added successfully");
        navigate("/lead");
        return;
      }

      const backendErrors = response.data.data;

      if (backendErrors) {
        handleError(backendErrors);

        const formErrors = Object.keys(backendErrors).map((key) => ({
          name: key,
          errors: backendErrors[key],
        }));

        form.setFields(formErrors);
      }

      message.error(response.data.message || "Lead already exists");

      if (response.data.success === "2") {
        setIsReEnquiryModalOpen(true);
      }

    } catch (error) {
      if (error.response && error.response.data) {
        const backendErrors = error.response.data.data?.field_data;

        if (backendErrors) {
          handleError(backendErrors);

          const formErrors = Object.keys(backendErrors).map((key) => ({
            name: key,
            errors: backendErrors[key],
          }));

          form.setFields(formErrors);
        }

        message.error(error.response.data.message || "Lead already exists");
      } else {
        message.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        await leadformfieldGetApi();
        await dropdownGetApi();
        await getCityDropdownApi();
        await getStateDropdownApi();
        await counsellorDropdownApi();
        await getNearestBranchDropdownApi();
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Failed to fetch data.");
      }
    };
    fetchData();
    form.setFieldsValue({ phone: "+91" }); // Set initial value for phone
  }, []);

  return (
    <>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <div className="flex items-center gap-3">
            <Spin size="large" />
            <span className="font-medium text-white">Adding Lead...</span>
          </div>
        </div>
      )}

      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <div className="bg-white p-13 rounded-lg mx-6 mb-[75px] dark:bg-slate-800">
          <div className="flex justify-between w-full ">
            <div className="w-fit mb-5">
              <h1 className={` ${mode === "dark" ? "text-yellow-500" : "text-black"}  text-xl font-semibold `}>Add Lead</h1>
              <p className="text-sm font-thin ">Manage your leads</p>
            </div>
            <div>
              <button
                onClick={() => navigate("/lead")}
                className="underline block"
              >
                Back
              </button>
            </div>
          </div>

          <Modal
            title={<>Do you want to create re enquiry of this lead?</>}
            open={isReEnquiryModalOpen}
            onOk={() => form.submit()} // If user confirms, submit the form again with re_enquiry flag
            onCancel={() => setIsReEnquiryModalOpen(false)}
          >
            {" "}
            <span className="font-medium">Note:</span> This lead already exists
            with us.
          </Modal>

          <div className="md:flex items-center gap-3 w-full">
            {/* Lead Source Field */}
            <Form.Item
              label={"Lead source"}
              required={true}
              className="w-full"
              name="lead_source"
              rules={[{ required: true, message: "Please select a lead source" }]}
            >
              <Select
                size="large"
                placeholder={"Select lead source"}
                onChange={(e) => setLeadSource(e)}
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              >
                {dropdownData &&
                  dropdownData
                    .filter((item) => {
                      if (user?.user_group === "admin") return true;
                      return ALLOWED_SOURCES.includes(item.id);
                    })
                    .map((item, i) => (
                      <Option key={i} value={item.id} label={item.name}>
                        {item.name}
                      </Option>
                    ))}
              </Select>
            </Form.Item>

            {/* Assign To Field */}
            <Form.Item
              label={"Assign To"}
              required={true}
              className="w-full"
              name="assign_to"
              rules={[{ required: true, message: "Please select a counsellor" }]}
            >
              <Select
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                required={true}
                size="large"
                placeholder={"Select Counsellor"}
                onChange={(e) => setCounsellor(e)}
                options={counsellorDropdown.map((item) => ({
                  value: item.username,
                  label: item.email,
                }))}
              />
            </Form.Item>

            {/* Campaign Field */}
            <Form.Item label={"Campaign"} className="w-full" name="campaign">
              <InputWithIcon
                required={false}
                placeholder={`Please enter Campaign `}
              />
            </Form.Item>
          </div>

          <Row gutter={[16, 16]}>
            {formData &&
              formData.map((field) => (
                <Col xs={{ span: 24 }} md={{ span: 12 }} key={field.code}>
                  <Form.Item
                    className="mb-1"
                    name={field.code}
                    label={field.label}
                    validateTrigger="onChange"
                    rules={[
                      {
                        required: field.is_required,
                        message: `${field.label} is required`,
                      },
                      {
                        validator: (_, value) => {
                          if (field.type === "phone" && value && /\s/.test(value)) {
                            return Promise.reject("Spaces are not allowed in phone number");
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    {field.type === "select" ? (
                      <CustomSelectInput
                        size="large"
                        placeholder={field.label ? "" : field.placeholder}
                        errors={field.errors || []}
                        showSearch
                        filterOption={(input, option) =>
                          (option?.label ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                      >
                        {field.options.length > 0 ? (
                          field.options.map((option, i) => (
                            <Option key={i} value={option} label={option}>
                              {option}
                            </Option>
                          ))
                        ) : (
                          <Option disabled>No options available</Option>
                        )}
                      </CustomSelectInput>
                    ) : field.type === "text" ? (
                      <InputWithIcon
                        required={false}
                        placeholder={
                          field.placeholder || `Please enter something`
                        }
                        errors={field.errors || []}
                      />
                    ) : field.type === "number" ? (
                      <InputWithIcon
                        type="text"
                        // maxLength={15}
                        required={false}
                        placeholder={
                          field.placeholder || `Please enter something`
                        }
                        errors={field.errors || []}
                      />
                    ) : field.type === "email" ? (
                      <InputWithIcon
                        type="email"
                        required={false}
                        placeholder={
                          field.placeholder || `Please enter something`
                        }
                        errors={field.errors || []}
                      />
                    ) : field.type === "phone" ? (
                      <InputWithIcon
                        type="text"
                        required={false}
                        placeholder={field.placeholder || `Please enter something`}
                        errors={field.errors || []}

                        onChange={(e) => {
                          let value = e.target.value
                            .replace(/[^0-9+ ]/g, "");

                          if (value.includes("+")) {
                            value = "+" + value.replace(/\+/g, "");
                          }

                          form.setFieldsValue({
                            [field.code]: value,
                          });
                        }}
                      />
                    ) : field.type === "radio" ? (
                      <Radio.Group name={field.code}>
                        {field.options.map((option, i) => (
                          <Radio key={i} value={option}>
                            {option}
                          </Radio>
                        ))}
                      </Radio.Group>
                    ) : field.type === "date" ? (
                      <DatePicker
                        className="py-2"
                        format="DD-MM-YYYY"
                        style={{ width: "100%" }}
                      />
                    ) : field.type === "city" ? (
                      <Select
                        size="large"
                        placeholder={field.placeholder || "Select"}
                        showSearch
                        filterOption={(input, option) =>
                          (option?.label ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                      >
                        {cityOptions.map((option, index) => (
                          <Option
                            key={index}
                            value={option.name}
                            label={option.name}
                          >
                            {option.name}
                          </Option>
                        ))}
                      </Select>
                    ) : field.type === "state" ? (
                      <Select
                        size="large"
                        placeholder={field.placeholder || "Select"}
                        showSearch
                        filterOption={(input, option) =>
                          (option?.label ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                      >
                        {stateOptions.map((option, index) => (
                          <Option
                            key={index}
                            value={option.name}
                            label={option.name}
                          >
                            {option.name}
                          </Option>
                        ))}
                      </Select>
                    ) : field.type === "nearest_branch" ? (
                      <Select
                        size="large"
                        placeholder={field.placeholder || "Select"}
                        showSearch
                        filterOption={(input, option) =>
                          (option?.label ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                      >
                        {nearestBranchOptions.map((option, index) => (
                          <Option
                            key={index}
                            value={option.name}
                            label={option.name}
                          >
                            {option.name}
                          </Option>
                        ))}
                      </Select>
                    ) : null}
                  </Form.Item>
                  {/* <p className="text-slate-500 font-thin text-xs">
                    {field.help_text}
                  </p> */}
                </Col>
              ))}
          </Row>
        </div>

        <div className="h-18 overflow-x-scroll md:overflow-hidden w-[100%] fixed bottom-0 bg-white dark:bg-slate-800">
          <div className="w-[max-content] md:w-[78%] h-full flex items-center justify-end mx-auto md:mx-0">
            <PrimaryButton
              type="primary"
              htmlType="submit"
              className="p-5 text-black flex items-center justify-center gap-2"
              title={
                loading ? (
                  <>
                    <Spin size="small" />
                    Adding...
                  </>
                ) : (
                  "Add Lead"
                )
              }
              block={false}
              disabled={loading}
            />
          </div>
        </div>
      </Form>
    </>
  );
};

export default AddLeadForm2;
