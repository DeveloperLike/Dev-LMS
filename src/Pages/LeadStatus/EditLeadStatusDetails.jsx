import { useEffect, useState } from "react";
import { FormItem } from "@/Components/Ui/Form";
import {
  CustomSelectInput,
  InputWithIcon,
} from "../../Components/CustomComponents/InputWithIcon";
import { PrimaryButton } from "../../Components/CustomComponents/ButtonUi";
import {
  putMappedLeadSubStatusService,
  getMappedLeadSubStatusDetailService,
  getLeadStatusDetailService,
  getLeadSubStatusDropdownService,
} from "./ApiService";
import { getLeadStatusDropdownService } from "./ApiService";
import { message } from "antd";

const EditLeadStatusDetails = ({
  id,
  getMappedLeadSubStatusApi,
  setEditOpen,
}) => {
  const [loading, setLoading] = useState(false); // Track API call state
  const [leadStatusDropdown, setLeadStatusDropdown] = useState([]);
  const [leadSubStatusDropdown, setLeadSubStatusDropdown] = useState([]);
  const [formData, setFormData] = useState({
    lead_sub_status: { value: null, errors: [] },
    lead_status: { id: "", name: "", errors: [] },
    reached_out_count: { value: "", errors: [] },
    interaction_count: { value: "", errors: [] },
    vc_count: { value: "", errors: [] },
    visit_count: { value: "", errors: [] },
    interest_count: {value: "", errors: []},
    new_lead_status: { value: null, errors: [] },
    follow_up: { value: null, errors: [] },
    remarks: { value: null, errors: [] },
  });

  // Handle input changes and update state
  const handleInput = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: {
        value: e.target.value,
        errors: [],
      },
    });
  };

  const handleSelectInput = (value, name) => {
    setFormData({
      ...formData,
      [name]: { value: value, errors: [] },
    });
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
    lead_sub_status: formData.lead_sub_status.value,
    lead_status: formData.lead_status.id,
    new_lead_status: formData.new_lead_status.value,
    reached_out_count: formData.reached_out_count.value,
    interaction_count: formData.interaction_count.value,
    vc_count: formData.vc_count.value,
    visit_count: formData.visit_count.value,
    interest_count: formData.interest_count.value,
    follow_up: formData.follow_up.value,
    remarks: formData.remarks.value,
  };

  const editLeadSubStatusApi = () => {
    setLoading(true); // Disable the button
    if (loading) return; // Prevent multiple submissions

    putMappedLeadSubStatusService(id, payload)
      .then((response) => {
        if (response.data.success === "1") {
          setEditOpen(false);
          getMappedLeadSubStatusApi();
          message.success(response?.data?.message);
        }
      })
      .catch(function (error) {
        if (error) {
          handleError(error.response.data.data);
          message.error(error?.response?.data?.message);
        }
      })
      .finally(() => setLoading(false)); // Re-enable the button
  };

  // Fetch branch data on component mount
  useEffect(() => {
    getMappedLeadSubStatusDetailService(id).then(function (response) {
      const jsonResponse = response.data.data;
      setFormData({
        lead_status: {
          name: jsonResponse.lead_status.name,
          id: jsonResponse.lead_status.id,
          errors: [],
        },
        lead_sub_status: {
          value: jsonResponse.lead_sub_status,
          errors: [],
        },
        new_lead_status: {
          value: jsonResponse.new_lead_status,
          errors: [],
        },
        reached_out_count: {
          value: jsonResponse.reached_out_count,
          errors: [],
        },
        interaction_count: {
          value: jsonResponse.interaction_count,
          errors: [],
        },
        vc_count: {
          value: jsonResponse.vc_count,
          errors: [],
        },
        visit_count: {
          value: jsonResponse.visit_count,
          errors: [],
        },
        interest_count: {
          value: jsonResponse.interest_count,
          errors: [],
        },
        follow_up: {
          value: jsonResponse.follow_up,
          errors: [],
        },
        remarks: {
          value: jsonResponse.remarks,
          errors: [],
        },
      });
    });

    getLeadStatusDropdownService().then((res) => {
      setLeadStatusDropdown(res.data.data);
    });
    getLeadSubStatusDropdownService().then((response) => {
      setLeadSubStatusDropdown(response.data.data);
    });
  }, [id]);

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          editLeadSubStatusApi();
        }}
        className="w-3/3 space-y-4"
      >
        <FormItem>
          <div className="flex flex-col gap-1">
            <label>
              Lead Status<sup className="text-red-500">*</sup>
            </label>
            <InputWithIcon
              name="lead_status"
              type="text"
              disabled
              value={formData.lead_status.name}
              errors={formData.lead_status.errors}
            />
          </div>
        </FormItem>

        <FormItem>
          <div className="flex flex-col gap-1">
            <label>
              Lead Sub Status<sup className="text-red-500">*</sup>
            </label>
            <CustomSelectInput
              name="lead_sub_status"
              placeholder="Please select lead sub status"
              value={formData.lead_sub_status.value}
              errors={formData.lead_sub_status.errors}
              handler={(value) => handleSelectInput(value, "lead_sub_status")}
              options={leadSubStatusDropdown.map((item) => ({
                value: item.id,
                label: item.name,
              }))}
            />
          </div>
        </FormItem>

        <FormItem>
          <div className="flex flex-col gap-1">
            <label>
              Next Status<sup className="text-red-500">*</sup>
            </label>
            <CustomSelectInput
              name="new_lead_status"
              placeholder="Please select lead's new status"
              value={formData.new_lead_status.value}
              errors={formData.new_lead_status.errors}
              handler={(value) => handleSelectInput(value, "new_lead_status")}
              options={leadStatusDropdown.map((item, index) => ({
                value: item.id,
                label: item.name,
              }))}
            />
          </div>
        </FormItem>

        <FormItem>
          <div className="flex flex-col gap-1">
            <label>
              Follow Up Required<sup className="text-red-500">*</sup>
            </label>
            <CustomSelectInput
              name="follow_up"
              type="text"
              placeholder="Is follow up required?"
              value={formData.follow_up.value}
              errors={formData.follow_up.errors}
              handler={(value) => handleSelectInput(value, "follow_up")}
              options={[
                {
                  value: true,
                  label: "Yes",
                },
                {
                  value: false,
                  label: "No",
                },
              ]}
            />
          </div>
        </FormItem>

        <FormItem>
          <div className="flex flex-col gap-1">
            <label>
              Remarks Required<sup className="text-red-500">*</sup>
            </label>
            <CustomSelectInput
              name="remarks"
              type="text"
              placeholder="Is remarks required?"
              value={formData.remarks.value}
              errors={formData.remarks.errors}
              handler={(value) => handleSelectInput(value, "remarks")}
              options={[
                {
                  value: true,
                  label: "Yes",
                },
                {
                  value: false,
                  label: "No",
                },
              ]}
            />
          </div>
        </FormItem>

        <FormItem>
          <div className="flex flex-col gap-1">
            <label>
              Reach Out count<sup className="text-red-500">*</sup>
            </label>
            <InputWithIcon
              name="reached_out_count"
              type="number"
              placeholder={"Please enter count"}
              min={0}
              max={10}
              required={true}
              value={formData.reached_out_count.value}
              errors={formData.reached_out_count.errors}
              handler={(e) => handleInput(e)}
            />
          </div>
        </FormItem>

        <FormItem>
          <div className="flex flex-col gap-1">
            <label>
              Interaction count<sup className="text-red-500">*</sup>
            </label>
            <InputWithIcon
              name="interaction_count"
              type="number"
              placeholder={"Please enter count"}
              min={0}
              max={10}
              required={true}
              value={formData.interaction_count.value}
              errors={formData.interaction_count.errors}
              handler={(e) => handleInput(e)}
            />
          </div>
        </FormItem>

        <FormItem>
          <div className="flex flex-col gap-1">
            <label>
              Video Call count<sup className="text-red-500">*</sup>
            </label>
            <InputWithIcon
              name="vc_count"
              type="number"
              placeholder={"Please enter count"}
              min={0}
              max={10}
              required={true}
              value={formData.vc_count.value}
              errors={formData.vc_count.errors}
              handler={(e) => handleInput(e)}
            />
          </div>
        </FormItem>

        <FormItem>
          <div className="flex flex-col gap-1">
            <label>
              Visit count<sup className="text-red-500">*</sup>
            </label>
            <InputWithIcon
              name="visit_count"
              type="number"
              placeholder={"Please enter count"}
              min={0}
              max={10}
              required={true}
              value={formData.visit_count.value}
              errors={formData.visit_count.errors}
              handler={(e) => handleInput(e)}
            />
          </div>
        </FormItem>

                <FormItem>
          <div className="flex flex-col gap-1">
            <label>
              Interest Count<sup className="text-red-500">*</sup>
            </label>
            <InputWithIcon
              name="interest_count"
              type="number"
              placeholder={"Please enter interest count"}
              min={0}
              max={10}
              required={true}
              value={formData.interest_count.value}
              errors={formData.interest_count.errors}
              handler={(e) => handleInput(e)}
            />
          </div>
        </FormItem>

        <PrimaryButton
          type="primary"
          htmlType="submit"
          className="p-4"
          title="Submit"
          block={false}
          disabled={loading}
        />
      </form>
    </>
  );
};

export default EditLeadStatusDetails;
