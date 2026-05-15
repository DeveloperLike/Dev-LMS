import { useEffect, useState } from "react";
import { FormItem } from "@/Components/Ui/Form";
import { message, Select } from "antd";
import {
  CustomSelectInput,
  InputWithIcon,
  CustomDatePicker,
} from "../../Components/CustomComponents/InputWithIcon";
import { PrimaryButton } from "../../Components/CustomComponents/ButtonUi";
import { useDispatch } from "react-redux";
import { notificationFun } from "../../lib/redux/NotificationSlice";
import {
  editAssignmentRuleService,
  getAssignmentRuleDetailService,
  getLeadManagementAssignmentCounsellorDropdownService,
  getTrackingUrlDropdown,
} from "./ApiService";
import { getCityDropdownService } from "../City/ApiService";
import { getBranchService } from "../User/ApiService";
import { getLeadSourceService } from "../Lead/ApiService";
import { getStateDropdownService } from "../State/ApiService";
import dayjs from "dayjs"; // Import dayjs
import customParseFormat from "dayjs/plugin/customParseFormat"; 

dayjs.extend(customParseFormat); 

const EditAssignmentRule = ({ id, AssignmentRuleGetApi, setEditOpen }) => {
  const dispatch = useDispatch();
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [branches, setBranchData] = useState([]);
  const [counsellor, setCounsellor] = useState([]);
  const [leadSource, setLeadSource] = useState([]);
  const [loading, setLoading] = useState(false); // Track API call state
  const [trackingUrlDropdown, setTrackingUrlDropdown] = useState([]);

  const [formData, setFormData] = useState({
    city: { value: [], errors: [] },
    state: { value: [], errors: [] },
    tracking_url: { value: [], errors: [] },
    counsellor: { value: [], errors: [] },
    lead_source: { value: null, errors: [] },
    branch: { value: [], errors: [] },
    assignment_type: { value: null, errors: [] },
    campaign: { value: "", errors: [] },
    form_name: { value: "", errors: [] },
    // New fields added below
    nearest_branch: { value: null, errors: [] },
    preferred_intake_of_pursuing: { value: null, errors: [] }, // Will store Day.js object
    level_of_education: { value: null, errors: [] },
  });

  // Handle input changes and update state
  const handleInput = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: { value: e.target.value, errors: [] },
    });
  };

  const handleSelectInput = (value, name) => {
    // Logic for branch and counsellor assignment type
    if (name === "branch") {
      setFormData((prevData) => ({
        ...prevData,
        branch: { value: value, errors: [] },
        counsellor: { value: [], errors: [] }, // Clear counsellor if branch is selected
      }));
    } else if (name === "counsellor") {
      setFormData((prevData) => ({
        ...prevData,
        counsellor: { value: value, errors: [] },
        branch: { value: [], errors: [] }, // Clear branch if counsellor is selected
      }));
    }
    // Logic for "any" option in multiple selects
    else if (
      name === "city" ||
      name === "state" ||
      name === "tracking_url" 
    ) {
      if (value.includes("any")) {
        setFormData((prevData) => ({
          ...prevData,
          [name]: { value: ["any"], errors: [] },
        }));
      } else {
        setFormData((prevData) => ({
          ...prevData,
          [name]: { value: value.filter((val) => val !== "any"), errors: [] },
        }));
      }
    }
    // Logic for single selects or other inputs
    else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: { value: value, errors: [] },
      }));
    }
  };

  const handleDateChange = (date) => {
    // 'date' here is the Day.js object returned by CustomDatePicker
    setFormData((prevData) => ({
      ...prevData,
      preferred_intake_of_pursuing: {
        ...prevData.preferred_intake_of_pursuing,
        value: date, // Store the Day.js object directly
        errors: [],
      },
    }));
  };

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

  const payload = {
    city: formData.city.value,
    state: formData.state.value,
    tracking_url: formData.tracking_url.value,
    counsellor: formData.counsellor.value,
    lead_source: formData.lead_source.value,
    branch: formData.branch.value,
    assignment_type: formData.assignment_type.value,
    campaign: formData.campaign.value,
    form_name: formData.form_name.value,
    // New fields in payload
    nearest_branch: formData.nearest_branch.value,
    preferred_intake_of_pursuing: formData.preferred_intake_of_pursuing.value
      ? dayjs.isDayjs(formData.preferred_intake_of_pursuing.value)
        ? formData.preferred_intake_of_pursuing.value.format("DD-MM-YYYY")
        : formData.preferred_intake_of_pursuing.value // Fallback if somehow not a Day.js object
      : null,
    level_of_education: formData.level_of_education.value,
  };

  const editAssignmentApiService = () => {
    setLoading(true); // Disable the button
    if (loading) return; // Prevent multiple submissions

    editAssignmentRuleService(payload, id)
      .then((response) => {
        setEditOpen(false);
        AssignmentRuleGetApi();
        message.success(response?.data?.message);
      })
      .catch(function (error) {
        if (error.response) {
          handleError(error.response.data.data);
          message.error(error?.response?.data?.message || "An error occurred.");
        } else {
          message.error("Network Error or unexpected issue.");
        }
      })
      .finally(() => setLoading(false)); // Re-enable the button
  };

  // Fetch initial data and details for editing
  useEffect(() => {
    getBranchService().then((response) => {
      setBranchData(response.data.data);
    });
    getLeadManagementAssignmentCounsellorDropdownService().then((response) => {
      setCounsellor(response.data.data);
    });

    getAssignmentRuleDetailService(id).then(function (response) {
      const jsonResponse = response.data.data;
      setFormData({
        city: { value: jsonResponse.city, errors: [] },
        state: { value: jsonResponse.state, errors: [] },
        tracking_url: { value: jsonResponse.tracking_url, errors: [] },
        campaign: { value: jsonResponse.campaign, errors: [] },
        form_name: { value: jsonResponse.form_name, errors: [] },
        counsellor: { value: jsonResponse.counsellor, errors: [] },
        lead_source: {
          value: jsonResponse.lead_source && jsonResponse.lead_source.id, // Handle potential null lead_source
          errors: [],
        },
        branch: { value: jsonResponse.branch, errors: [] },
        assignment_type: { value: jsonResponse.assignment_type, errors: [] },
        // Set values for the new fields from the fetched data
        nearest_branch: { value: jsonResponse.nearest_branch || null, errors: [] }, // Ensure array for multi-select
        preferred_intake_of_pursuing: {
          value: jsonResponse.preferred_intake_of_pursuing
            ? dayjs(jsonResponse.preferred_intake_of_pursuing, "DD-MM-YYYY") // Parse incoming date string to Day.js object
            : null,
          errors: [],
        },
        level_of_education: { value: jsonResponse.level_of_education || null, errors: [] },
      });
    });
  }, [id]);

  // Fetch dropdown options for City, State, Lead Source, Tracking URL
  useEffect(() => {
    const customOption = { id: "any", name: "Any" };

    getCityDropdownService().then((response) => {
      const fetchedCities = response.data.data;
      setCities([customOption, ...fetchedCities]);
    });

    getStateDropdownService().then((response) => {
      const fetchedStates = response.data.data;
      setStates([customOption, ...fetchedStates]);
    });

    getLeadSourceService().then((response) => {
      const fetchedLeadSources = response.data.data;
      setLeadSource([customOption, ...fetchedLeadSources]);
    });

    getTrackingUrlDropdown().then((response) => {
      const fetchedTrackingUrl = response.data.data;
      setTrackingUrlDropdown([customOption, ...fetchedTrackingUrl]);
    });
  }, []);

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          editAssignmentApiService();
        }}
        className="w-3/3 space-y-4"
      >
        <FormItem>
          <div className="flex flex-col gap-1">
            <label>City</label>
            <CustomSelectInput
              name="city"
              type="text"
              placeholder="Please select city"
              mode="multiple"
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              tokenSeparators={[","]}
              required={false}
              value={formData.city.value}
              errors={formData.city.errors}
              handler={(value) => handleSelectInput(value, "city")}
              options={cities.map((item) => ({
                value: item.id === "any" ? "any" : item.id,
                label: item.name,
              }))}
            />
          </div>
        </FormItem>

        <FormItem>
          <div className="flex flex-col gap-1">
            <label>State</label>
            <CustomSelectInput
              name="state"
              type="text"
              placeholder="Please select state"
              mode="multiple"
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              tokenSeparators={[","]}
              required={false}
              value={formData.state.value}
              errors={formData.state.errors}
              handler={(value) => handleSelectInput(value, "state")}
              options={states.map((item) => ({
                value: item.id === "any" ? "any" : item.id,
                label: item.name,
              }))}
            />
          </div>
        </FormItem>

        <FormItem>
          <div className="flex flex-col gap-1">
            <label>Tracking Url</label>
            <CustomSelectInput
              name="tracking_url"
              type="text"
              placeholder="Please select tracking url"
              mode="multiple"
              tokenSeparators={[","]}
              required={false}
              value={formData.tracking_url.value}
              errors={formData.tracking_url.errors}
              handler={(value) => handleSelectInput(value, "tracking_url")}
              options={trackingUrlDropdown.map((item) => ({
                value: item.id === "any" ? "any" : item.id,
                label: item.name,
              }))}
            />
          </div>
        </FormItem>

        <FormItem>
          <div className="flex flex-col gap-1">
            <label>Campaign</label>
            <InputWithIcon
              name="campaign"
              type="text"
              placeholder="Please enter campaign"
              required={false}
              value={formData.campaign.value}
              errors={formData.campaign.errors}
              handler={(e) => handleInput(e)}
            />
          </div>
        </FormItem>

        <FormItem>
          <div className="flex flex-col gap-1">
            <label>Form Name</label>
            <InputWithIcon
              name="form_name"
              type="text"
              placeholder="Please enter Form Name"
              required={false}
              value={formData.form_name.value}
              errors={formData.form_name.errors}
              handler={(e) => handleInput(e)}
            />
          </div>
        </FormItem>

        <FormItem>
          <div className="flex flex-col gap-1">
            <label>Lead Source</label>
            <CustomSelectInput
              name="lead_source"
              type="text"
              placeholder="Please select lead source"
              value={formData.lead_source.value}
              errors={formData.lead_source.errors}
              handler={(value) => handleSelectInput(value, "lead_source")}
              options={leadSource.map((item) => ({
                value: item.id === "any" ? "any" : item.id,
                label: item.name,
              }))}
            />
          </div>
        </FormItem>

        <FormItem>
          <div className="flex flex-col gap-1">
            <label>
              Assignment Type<sup className="text-red-500">*</sup>
            </label>
            <CustomSelectInput
              name="assignment_type"
              placeholder="Select a type"
              value={formData.assignment_type.value}
              errors={formData.assignment_type.errors}
              handler={(value) => handleSelectInput(value, "assignment_type")} // Use handler prop
              options={[
                {
                  value: "owner",
                  label: "Counsellor",
                },
                {
                  value: "branch",
                  label: "Branch",
                },
              ]}
            />
          </div>
        </FormItem>

        {formData.assignment_type.value === "owner" && (
          <FormItem>
            <div className="flex flex-col gap-1">
              <label>
                Counsellor<sup className="text-red-500">*</sup>
              </label>
              <Select
                name="counsellor"
                size="large"
                placeholder={"Select Counsellor"}
                mode="multiple"
                tokenSeparators={[","]}
                required={true}
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                value={formData.counsellor.value}
                onChange={(value) => handleSelectInput(value, "counsellor")}
                options={counsellor.map((item) => ({
                  value: item.username,
                  label: item.email,
                }))}
              />
              {formData.counsellor.errors && (
                <span className="text-red-500 text-sm">
                  {formData.counsellor.errors[0]}
                </span>
              )}
            </div>
          </FormItem>
        )}

        {formData.assignment_type.value === "branch" && (
          <FormItem>
            <div className="flex flex-col gap-1">
              <label>
                Branch<sup className="text-red-500">*</sup>
              </label>
              <CustomSelectInput
                name="branch"
                type="text"
                placeholder="Please select branch"
                mode="multiple"
                tokenSeparators={[","]}
                value={formData.branch.value}
                errors={formData.branch.errors}
                handler={(value) => handleSelectInput(value, "branch")}
                options={branches.map((item) => ({
                  value: item.id,
                  label: item.name,
                }))}
              />
            </div>
          </FormItem>
        )}

        {/* --- New fields added below --- */}

        <FormItem>
          <div className="flex flex-col gap-1">
            <label>Level of Education</label>
            <CustomSelectInput
              name="level_of_education"
              placeholder="Select level of education"
              value={formData.level_of_education.value}
              errors={formData.level_of_education.errors}
              handler={(value) =>
                handleSelectInput(value, "level_of_education")
              }
              options={[
                {
                  value: "master",
                  label: "Master",
                },
                {
                  value: "bachelor",
                  label: "Bachelor",
                },
              ]}
            />
          </div>
        </FormItem>

        <FormItem>
          <div className="flex flex-col gap-1">
            <label>Nearest Branch</label>
            <CustomSelectInput
              name="nearest_branch"
              type="text"
              placeholder="Please select Nearest Branch"
              required={false}
              value={formData.nearest_branch.value}
              errors={formData.nearest_branch.errors}
              handler={(value) => handleSelectInput(value, "nearest_branch")}
              options={branches.map((item) => ({
                value: item.id === "any" ? "any" : item.id,
                label: item.name,
              }))}
            />
          </div>
        </FormItem>

        <FormItem>
          <div className="flex flex-col gap-1">
            <label>Preferred Intake of Pursuing</label>
            <CustomDatePicker
              name={"preferred_intake_of_pursuing"}
              value={formData?.preferred_intake_of_pursuing?.value}
              errors={formData?.preferred_intake_of_pursuing?.errors}
              onChange={handleDateChange}
              style={{ width: "100%" }}
              required={false}
            />
          </div>
        </FormItem>

        <PrimaryButton
          type="primary"
          htmlType="submit"
          className="p-5"
          title="Submit"
          block={false}
          disabled={loading}
        />
      </form>
    </>
  );
};

export default EditAssignmentRule;