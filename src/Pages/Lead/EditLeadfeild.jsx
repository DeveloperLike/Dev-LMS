import React, { useState, useEffect } from "react";
import { Form, Input, Select, Row, Col, Drawer, Radio, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import {
  OutLineButton,
  PrimaryButton,
} from "../../Components/CustomComponents/ButtonUi";
import {
  CustomDatePicker,
  InputWithIcon,
} from "../../Components/CustomComponents/InputWithIcon";
import {
  editLeadListService,
  getLeadDetailsService,
  getLeadSourceService,
} from "./ApiService";
import { getCityDropdownService } from "../City/ApiService";
import { LeadPackageList } from "./Components/LeadPackageList";
import { AddFollowup } from "./Components/AddFollowup";
import { getLeadStatusDetailService } from "../LeadStatus/ApiService";
import { getCounsellorDropdown } from "../AssignmentRule/ApiService";
import PostTransaction from "./Components/PostTransaction";
import ViewLeadPackage from "./Components/ViewLeadPackage";
import TextArea from "antd/es/input/TextArea";
import { patchSubStatusService } from "../LeadSubStatus/ApiService";
import { useDispatch, useSelector } from "react-redux";
import { getStateDropdownService } from "../State/ApiService";
import { AddSubStatusFollowup } from "./Components/AddSubStatusFollowup";
import {
  getRegisteredUserPackageService,
  getRegisteredUserTransactionService,
} from "../Registered Users/ApiService";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { getBranchService } from "../User/ApiService";
import axios from "axios";
import { baseurl } from "../../lib/Constants";

dayjs.extend(customParseFormat);

const { Option } = Select;

export const EditLeadField = ({ mode, leadId, onSuccess }) => {

  const [formData, setFormData] = useState([]);
  const [dropdownData, setDropdown] = useState([]);
  const [leadsource, setLeadSource] = useState();
  const [leadStatus, setLeadStatus] = useState();
  const [campaign, setCampaign] = useState();
  const [leadSubStatus, setLeadSubStatus] = useState(null);
  const [cityOptions, setCityOptions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);
  const [isFollowUpSubStatusDrawerOpen, setIsFollowUpSubStatusDrawerOpen] =
    useState(false);
  const [packageList, setPackage] = useState([]);
  const [leadSubStatusDropdown, setLeadSubStatusDropdown] = useState([]);
  const [counsellorDropdown, setCounsellorDropdown] = useState([]);
  const [leadassignto, setLeadassignto] = useState(null);
  const [leadstatus, setLeadstatus] = useState();
  const [subleadstatus, setSubLeadstatus] = useState();
  const [assignToChanged, setAssignToChanged] = useState(false);
  const [isSelectedPackage, setIsSelectedPackage] = useState([]);
  const [packageData, setPackageData] = useState(null);
  const [isModalOpenTransaction, setIsModalOpenTransaction] = useState(false);
  const [userdetail, setUserdetail] = useState(null);
  const [userData, setUserData] = useState([]);
  const [nextpage, setNextPage] = useState("pakagelistPackagepage");
  const [openRemarks, setOpenRemarks] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [useAddFollowupService, setUseAddFollowupService] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState();
  const [stateOptions, setStateOptions] = useState([]);
  const [nearestBranchOptions, setNearestBranchOptions] = useState([]);
  const [data, setData] = useState({});
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();

  const packageModulePermission = useSelector(
    (state) => state.permissions.permissionsData
  );

  const handleCancelTransaction = () => {
    setIsModalOpenTransaction(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const getNearestBranchDropdownApi = async () => {
    const response = await getBranchService();
    setNearestBranchOptions(response.data.data);
  };

  const dropdownGetApi = async () => {
    const response = await getLeadSourceService();
    setDropdown(response.data.data);
  };

  const getCityDropdownApi = async () => {
    const response = await getCityDropdownService();
    setCityOptions(response.data.data);
  };

  const getStateDropdownApi = async () => {
    const response = await getStateDropdownService();
    setStateOptions(response.data.data);
  };

  const counsellorDropdownApi = async () => {
    const response = await getCounsellorDropdown();
    setCounsellorDropdown(response.data.data);
  };

  const leadSubStatusDropdownApi = async (statusId) => {
    const response = await getLeadStatusDetailService(statusId);
    setLeadSubStatusDropdown(response.data.data.sub_status);
  };

  // transaction fetching data start from here
  const leadTransactionListGetApi = () => {
    // console.log("leadTransactionListGetApi lead calling");
    getRegisteredUserTransactionService(userData).then((response) => {
      // setTransactionList(response.data.data);
      // setTransactionPaymentDetails(response.data.detail);
    });
  };
  // transaction fetching data close from here

  // Fetching lead data
  const getDetailsDataApi = async () => {
    const response = await getLeadDetailsService(id);
    // console.log(response.data.data.username)
    const data = response.data.data;
    setFormData(data);
    setLeadSource(data.lead_source);
    setLeadassignto(data.assign_to);
    setLeadStatus(data.leads_status.id);
    setCampaign(data.campaign);
    setLeadSubStatus(data.leads_sub_status);
    setLeadstatus(response.data.data.leads_status.name);
    setSubLeadstatus(response.data.data.leads_sub_status);
    // setUserData(response.data.data.user_detail);
    setIsRegistered(response.data.data.registered);
    setUserData(response?.data?.data?.username);

    setData(response.data.data);

    const initialFormValues = {
      lead_source: data.lead_source,
      status: data.leads_status.id,
      sub_status: data?.leads_sub_status?.id,
      // campaign: data.campaign,
    };

    data.lead_fields.forEach((field) => {
      let value = field.value;

      if (
        value === undefined ||
        value === null ||
        value === "undefined" ||
        value === ""
      ) {
        value = null;
      }

      if (field.type === "date") {
        if (value) {
          const parsedDate = dayjs(value, ["DD-MM-YYYY", "YYYY-MM-DD"], true);

          initialFormValues[field.code] = parsedDate.isValid()
            ? parsedDate
            : null;
        } else {
          initialFormValues[field.code] = null;
        }
      } else {
        initialFormValues[field.code] = value;
      }
    });

    form.setFieldsValue(initialFormValues);
  };

  const generatePayload = (values) => {
    const payload = {
      lead_status: leadStatus,
      lead_sub_status: leadSubStatus?.id,

      field_data: formData.lead_fields
        .filter(
          (field) =>
            ![
              "campaign",
              "yg_session_active",
              "yg_referral_url",
              "utm_campaign",
              "utm_source",
              "utm_term",
              "utm_content",
              "utm_medium",
            ].includes(field.code)
        )
        .map((field) => {
          let inputValue = values?.[field.code];
          let fallbackValue = field.value;

          const isInvalidInput =
            inputValue === undefined ||
            inputValue === null ||
            inputValue === "undefined" ||
            (typeof inputValue === "string" && inputValue.trim() === "");

          const isInvalidFallback =
            fallbackValue === undefined ||
            fallbackValue === null ||
            fallbackValue === "undefined" ||
            (typeof fallbackValue === "string" && fallbackValue.trim() === "");

          let fieldValue;

          if (!isInvalidInput) {
            fieldValue = inputValue;
          } else if (!isInvalidFallback) {
            fieldValue = fallbackValue;
          } else {
            fieldValue = null;
          }

          if (field.type === "date") {
            if (dayjs.isDayjs(fieldValue)) {
              fieldValue = fieldValue.format("YYYY-MM-DD");
            } else {
              const parsed = dayjs(fieldValue);
              fieldValue = parsed.isValid() ? parsed.format("YYYY-MM-DD") : null;
            }
          }

          if (
            fieldValue === null ||
            fieldValue === undefined ||
            fieldValue === "undefined" ||
            (typeof fieldValue === "string" && fieldValue.trim() === "")
          ) {
            return null;
          }

          return {
            code: field.code,
            value: fieldValue,
          };
        })
        .filter(Boolean),

      assign_to:
        leadassignto.username === undefined
          ? leadassignto
          : leadassignto.username,

      // campaign: campaign,
    };

    return payload;
  };

  // Handle Backend Errors
  const handleError = (errorResponse) => {
    const errors = errorResponse?.data?.data?.field_data || {};

    const updatedFormData = {
      ...formData,
      lead_fields: formData.lead_fields.map((field) => {
        const errorMessages = errors[field.code] || [];
        return {
          ...field,
          errors: errorMessages,
        };
      }),
    };
    setFormData(updatedFormData);

    // Update the form fields with the error values
    form.setFieldsValue({
      ...updatedFormData.lead_fields.reduce((acc, field) => {
        acc[field.code] = field.value;
        return acc;
      }, {}),
    });
  };

  // Handle form submission
  const handleSubmit = async (values) => {
    console.log("asdsad")
    if (loading) return;
    setLoading(true);

    const payload = generatePayload(values);
    // console.log(payload, "payload");
    try {
      const response = await editLeadListService(leadsource, id, payload);
      if (response.status === 200) {

        let jsonFormat = {}
        payload.field_data.forEach((codes) => {
          const isEmpty =
            codes.value === undefined ||
            codes.value === null ||
            (typeof codes.value === "string" && codes.value.trim() === "");

          if (!isEmpty) {
            jsonFormat[codes.code] = codes.value;
          }
        });
        const saveAnother = await axios.post(baseurl + "/registration/dedicatedCRMUpdateHelper", { "leadIdToUpdate": id, "form_fields": jsonFormat })
        if (saveAnother.status === 200) {
          console.log(saveAnother.data)
        } else {
          console.log(saveAnother.data)
        }

        if (onSuccess) {
          onSuccess();
        }
        message.success(response.data.message);
      }
    } catch (error) {
      if (error) {
        // Call handleError with the error response to update form fields with errors
        handleError(error.response);
        message.error(error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const setSubStatusFunction = (e) => {
    const selectedSubStatus = leadSubStatusDropdown.find(
      (status) => status.lead_sub_status_id === e
    );
    setLeadSubStatus(selectedSubStatus);
    // console.log(
    //   selectedSubStatus.follow_up,
    //   ":selectedSubStatus follow_up",
    //   selectedSubStatus.remarks,
    //   ":selectedSubStatus remarks"
    // );

    if (selectedSubStatus.follow_up) {
      // console.log("follow up opened");
      setIsFollowUpSubStatusDrawerOpen(true);
      setUseAddFollowupService(true);
    } else if (selectedSubStatus.remarks) {
      // console.log("remarks opened");
      setOpenRemarks(true);
      setUseAddFollowupService(false);
    } else if (
      selectedSubStatus.remarks === false &&
      selectedSubStatus.follow_up === false
    ) {
      setUseAddFollowupService(false);
      const payload = { lead_sub_status: e };
      patchSubStatusService(payload, id).then((response) => {
        if (response.data.success === "1") {
          getDetailsDataApi();
          message.success(response.data.message);
        }
      });
    }
  };

  // console.log(isModalOpenTransaction, "isModalOpenTransaction");

  // handle sub status remarks
  const handleRemarks = () => {
    const payload = {
      lead_sub_status: leadSubStatus.lead_sub_status_id,
      lead_status: leadStatus,
      remark: remarks,
    };
    patchSubStatusService(payload, id).then((response) => {
      if (response.data.success === "1") {
        getDetailsDataApi();
        setOpenRemarks(false);
        setRemarks("");
        message.success(response.data.message);
      }
    });
  };

  // get package List start
  const leadPackageListGetApi = () => {
    // getLeadPackageDetailsService(id).then((response) => {
    //   setPackage(response.data.data);
    //   setPackageData(response.data.data);
    // });
    getRegisteredUserPackageService(userData?.username).then((response) => {
      setPackage(response.data.data);
      setPackageData(response.data.data);
    });
  };
  // get package list close

  useEffect(() => {
    getStateDropdownApi();
    dropdownGetApi();
    getCityDropdownApi();
    counsellorDropdownApi();
    leadSubStatusDropdownApi();
    getNearestBranchDropdownApi();
  }, []);

  useEffect(() => {
    leadPackageListGetApi();
    const fetchData = async () => {
      try {
        await getDetailsDataApi();
        await dropdownGetApi();
        await getCityDropdownApi();
        await getStateDropdownApi();
        await counsellorDropdownApi();
      } catch (error) {
        // console.error("Error fetching data:", error);
        // message.error(error);
      }
    };
    fetchData();
    if (leadStatus) {
      leadSubStatusDropdownApi(leadStatus);
    }
  }, [leadStatus]);

  // console.log(leadSubStatus !== undefined && leadSubStatus.id, 'subleadstatus')
  // console.log(isModalOpen,'isModalOpen 77')

  return (
    <>
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <div className="bg-white dark:bg-gray-800 p-5 rounded-lg mx-6 mb-[85px]">
          <div className="flex justify-between w-full ">
            <div className="w-fit mb-5">
              <h1 className={` ${mode === "dark" ? "text-yellow-500" : "text-black"}  text-xl font-semibold`}>Edit Lead</h1>
              <p className="text-sm font-thin text-gray-600 dark:text-gray-400">Manage your leads</p>
            </div>

            <div>
              <button
                onClick={() => history.go(-1)}
                className="underline block text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
              >
                Back
              </button>
            </div>
          </div>

          {packageModulePermission.user_group !== "executive" && (
            <div className="md:flex gap-10">
              <Form.Item
                label={"Lead source"}
                required
                className="mb-[12px] w-full"
              >
                <Select
                  className="w-full mb-2"
                  size="large"
                  placeholder={"Select lead source"}
                  disabled
                  value={leadsource}
                  onChange={(e) => setLeadSource(e)}
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                >
                  {dropdownData?.map((item, index) => (
                    <Option key={index} value={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              {leadassignto && (
                <Form.Item
                  label={"Assign to"}
                  required={true}
                  className="w-full"
                  name="assign_to"
                >
                  <Select
                    required={true}
                    size="large"
                    defaultValue={leadassignto?.email}
                    placeholder={"Select Counsellor"}
                    disabled={
                      packageModulePermission.user_group === "staff"
                        ? true
                        : false
                    }
                    onChange={(e) => {
                      {
                        setLeadassignto(e), setAssignToChanged(true);
                      }
                    }}
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={counsellorDropdown?.map((item) => ({
                      value: item.username,
                      label: item.email,
                    }))}
                  ></Select>
                </Form.Item>
              )}

              {leadassignto === null && (
                <Form.Item
                  label={"Assign to"}
                  required={true}
                  className="w-full"
                  name="assign_to"
                >
                  <Select
                    required={true}
                    size="large"
                    placeholder={"Select Counsellor"}
                    onChange={(e) => {
                      {
                        setLeadassignto(e), setAssignToChanged(true);
                      }
                    }}
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={counsellorDropdown?.map((item) => ({
                      value: item.username,
                      label: item.email,
                    }))}
                  ></Select>
                </Form.Item>
              )}

              {/* Campaign Field */}
              {/* <Form.Item
                label={"Campaign"}
                required={true}
                className="w-full"
                name="campaign"
              rules={[{ required: true, message: "Please enter a campaign" }]}
              >
                <InputWithIcon
                  value={campaign}
                  onChange={(e) => { setCampaign(e.target.value) }}
                  required={false}
                  placeholder={`Please enter Campaign `}
                />
              </Form.Item> */}
            </div>
          )}

          <Row className="mb-8" gutter={[16, 16]}>
            {formData.lead_fields &&
              formData.lead_fields
                .filter(
                  (field) =>
                    ![
                      "campaign",
                      "yg_session_active",
                      "yg_referral_url",
                      "utm_campaign",
                      "utm_source",
                      "utm_term",
                      "utm_content",
                      "utm_medium",
                    ].includes(field.code)
                )
                .map((field) => (
                  <Col xs={{ span: 24 }} md={{ span: 12 }} key={field.code}>
                    <Form.Item
                      className="mb-1"
                      name={field.code}
                      label={field.label}
                      // initialValue is set in getDetailsDataApi via form.setFieldsValue
                      rules={[{ required: field.is_required }]}
                    // help={field.errors && field.errors.join(", ")}
                    >
                      {field.type === "select" ? (
                        <Select
                          size="large"
                          placeholder={`Select ${field.label}`}
                          // defaultValue={field.value} // Handled by Form.Item's initialValue
                          showSearch
                          filterOption={(input, option) =>
                            (option?.label ?? "")
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                        >
                          {field.options.map((option, i) => (
                            <Option key={i} value={option} label={option}>
                              {option}
                            </Option>
                          ))}
                        </Select>
                      ) : field.code === "full_name" ? (
                        <InputWithIcon
                          required={false}
                          name={"full_name"}
                          // value={field.value} // Handled by Form.Item
                          placeholder={field.placeholder || field.label}
                          // onChange={(e) => form.setFieldsValue({ [field.code]: e.target.value })} // Handled by Form.Item
                          errors={field.errors || []}
                        />
                      ) : field.type === "text" ? (
                        <InputWithIcon
                          required={false}
                          name={field.code}
                          // value={field.value} // Handled by Form.Item
                          // onChange={(e) => form.setFieldsValue({ [field.code]: e.target.value })} // Handled by Form.Item
                          placeholder={field.placeholder || field.label}
                          errors={field.errors || []}
                        />
                      ) : field.type === "email" ? (
                        <InputWithIcon
                          required={false}
                          name={field.code}
                          type="email"
                          placeholder={field.placeholder || field.label}
                          errors={field.errors || []}
                        />
                      ) : field.type === "number" &&
                        packageModulePermission.user_group === "admin" ? (
                        <InputWithIcon
                          required={false}
                          name={field.code}
                          // value={field.value} // Handled by Form.Item
                          maxLength={15}
                          type={"text"}
                          // onChange={(e) => form.setFieldsValue({ [field.code]: e.target.value })} // Handled by Form.Item
                          placeholder={field.placeholder || field.label}
                          errors={field.errors || []}
                        />
                      ) : field.type === "number" &&
                        packageModulePermission.user_group !== "admin" ? (
                        <InputWithIcon
                          disabled
                          required={false}
                          name={field.code}
                          // value={field.value} // Handled by Form.Item
                          maxLength={15}
                          type={"text"}
                          // onChange={(e) => form.setFieldsValue({ [field.code]: e.target.value })} // Handled by Form.Item
                          placeholder={field.placeholder || field.label}
                          errors={field.errors || []}
                        />
                      ) : field.type === "radio" ? (
                        <Radio.Group name={field.code}>
                          {/* defaultValue is handled by Form.Item's initialValue */}
                          {field.options.map((option, i) => (
                            <Radio key={i} value={option}>
                              {option}
                            </Radio>
                          ))}
                        </Radio.Group>
                      ) : field.type === "date" ? (
                        <CustomDatePicker
                          errors={field.errors || []}
                          style={{ width: "100%" }}
                          required={false}
                        />
                      ) : field.type === "city" ? (
                        <Select
                          size="large"
                          placeholder={`Select ${field.label}`}
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
                          placeholder={`Select ${field.label}`}
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
                  </Col>
                ))}
          </Row>
        </div>

        <div className="h-18 w-[100%] fixed bottom-0 bg-white dark:bg-gray-800 border-t border-slate-200 dark:border-slate-700">
          <div className="w-[78%] h-full flex items-center justify-between px-2 ">
            <div className="flex gap-4">
              <h2 className="inline-flex text-success bg-opacity-10 rounded-md py-1 px-3 text-sm font-medium">
                Status: {leadstatus && leadstatus}
              </h2>
              <h2 className="inline-flex text-orange-500 bg-opacity-10 rounded-md py-1 px-3 text-sm font-medium">
                Sub Status: {data?.last_sub_status || "-"}
              </h2>

            </div>

            <div className=" h-full flex items-center">
              <PrimaryButton
                type="primary"
                htmlType="submit"
                className="p-5"
                title={"Update Lead"}
                block={false}
              />
              {isRegistered === "registered" && (
                <PrimaryButton
                  type="primary"
                  className="p-5 ml-2"
                  title={"Transaction"}
                  block={false}
                  onClick={() => setIsModalOpenTransaction(true)}
                />
              )}
              <div className="grid grid-rows-1 grid-flow-col gap-2 ml-2">
                {/* <OutLineButton
                  title={
                    isRegistered !== "registered"
                      ? "Register Lead"
                      : "Add Package"
                  }
                  onclick={() => setIsModalOpen(true)}
                  className="py-5"
                /> */}

                {/* <OutLineButton
                  title="Add Followup"
                  onclick={() => setIsFollowUpModalOpen(true)}
                  className="py-5"
                /> */}
              </div>
            </div>
          </div>
        </div>
      </Form >

      <Drawer
        title={"Transaction"}
        placement="right"
        width={400}
        onClose={handleCancelTransaction}
        open={isModalOpenTransaction}
      >
        <PostTransaction
          setIsModalOpenTransaction={setIsModalOpenTransaction}
          isModalOpenTransaction={isModalOpenTransaction}
          userData={userData}
          setNextPage={setNextPage}
          packageData={packageData}
          getDetailsDataApi={getDetailsDataApi}
          isshowBackButton={false}
          leadPackageListGetApi={leadPackageListGetApi}
          leadTransactionListGetApi={leadTransactionListGetApi}
        />
      </Drawer>

      <Drawer
        title={
          nextpage === "pakageTransactionpage"
            ? "Transaction"
            : "List Of Packages"
        }
        placement="right"
        width={400}
        onClose={handleCancel}
        open={isModalOpen}
      >
        {nextpage === "pakagelistPackagepage" && (
          <LeadPackageList
            packageList={packageList}
            setPackageData={setPackageData}
            packageData={packageData}
            id={id}
            setIsModalOpen={setIsModalOpen}
            setNextPage={setNextPage}
            getDetailsDataApi={getDetailsDataApi}
            setIsSelectedPackage={setIsSelectedPackage}
          />
        )}
        {nextpage === "pakageviewpage" && (
          <ViewLeadPackage
            packageData={packageData}
            gridCol="grid-cols-1"
            setNextPage={setNextPage}
            id={id}
            isSelectedPackage={isSelectedPackage}
            getDetailsDataApi={getDetailsDataApi}
          />
        )}
        {nextpage === "pakageTransactionpage" && (
          <PostTransaction
            setIsModalOpenTransaction={setIsModalOpenTransaction}
            setNextPage={setNextPage}
            packageData={packageData}
            userData={userData}
            getDetailsDataApi={getDetailsDataApi}
            isshowBackButton={true}
            leadPackageListGetApi={leadPackageListGetApi}
            setIsModalOpen={setIsModalOpen}
            leadTransactionListGetApi={leadTransactionListGetApi}
          />
        )}
      </Drawer>

      {/* Add Lead Sub Status section */}
      <Drawer
        title="Add Follow up"
        placement="right"
        width={400}
        onClose={() => setIsFollowUpModalOpen(false)}
        open={isFollowUpModalOpen}
      >
        <AddFollowup
          id={id}
          leadSubStatus={leadSubStatus}
          getDetailsDataApi={getDetailsDataApi}
          setIsFollowUpModalOpen={setIsFollowUpModalOpen}
          useAddFollowupService={useAddFollowupService}
          setUseAddFollowupService={setUseAddFollowupService}
        // setPayloadDatas={setPayloadData}
        />
      </Drawer>

      {/* sub status followup Drawer start */}
      <Drawer
        title="Add Followup"
        placement="right"
        width={400}
        onClose={() => setIsFollowUpSubStatusDrawerOpen(false)}
        open={isFollowUpSubStatusDrawerOpen}
      >
        <AddSubStatusFollowup
          // setPayloadDatas={setPayloadData}
          id={id}
          setIsFollowUpSubStatusDrawerOpen={setIsFollowUpSubStatusDrawerOpen}
          leadSubStatus={leadSubStatus}
          // leadStatusId={leadStatusId}
          getDetailsDataApi={getDetailsDataApi}
          useAddFollowupService={useAddFollowupService}
          setUseAddFollowupService={setUseAddFollowupService}
        />
      </Drawer>
      {/* sub status follow up close from here */}

      {/* sub status remarks drawer */}

      <Drawer
        title="Add Remarks"
        placement="right"
        width={400}
        onClose={() => setOpenRemarks(false)}
        open={openRemarks}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleRemarks();
          }}
        >
          <label htmlFor="remark">Remark</label>
          <TextArea
            id="remark"
            className="mb-5 mt-1"
            rows={4}
            required={true}
            placeholder="Please enter remarks"
            maxLength={200}
            onChange={(e) => setRemarks(e.target.value)}
          />
          <PrimaryButton
            type="primary"
            title="Submit"
            onclick={handleRemarks}
            htmlType={"submit"}
            disabled={loading}
          />
        </form>
      </Drawer>
      {/* sub status remarks drawer */}
    </>
  );
};
