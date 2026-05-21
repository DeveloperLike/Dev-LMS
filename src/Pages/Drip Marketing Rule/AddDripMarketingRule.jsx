import { useEffect, useState } from "react";
import { FormItem } from "@/Components/Ui/Form";
import {
  CustomSelectInput,
  InputWithIcon,
} from "../../Components/CustomComponents/InputWithIcon";
import { PrimaryButton } from "../../Components/CustomComponents/ButtonUi";
import { useDispatch } from "react-redux";
import { notificationFun } from "../../lib/redux/NotificationSlice";
import { Button, message, Select } from "antd";
import { NavLink, useNavigate } from "react-router-dom";
import {
  getEventFieldsDropdown,
  postDripMarketingRuleService,
  getWatiTemplatesService,
} from "./ApiService";
import {
  getEmailTemplateListService,
  getSmsTemplateListservice,
  getWhatsappTemplateListService,
} from "../Template/ApiService";
import { getCityDropdownService } from "../City/ApiService";
import {
  getCounsellorDropdown,
  getTrackingUrlDropdown,
} from "../AssignmentRule/ApiService";
import { getLeadSourceService } from "../Lead/ApiService";
import { getStateDropdownService } from "../State/ApiService";
import { getLeadStatusService } from "../LeadStatus/ApiService";
import { getLeadSubStatusService } from "../LeadSubStatus/ApiService";
import { getSMTPSettingsService } from "../Integration/MailSettings/ApiService";

// SMS toggle
const ENABLE_SMS = false;

export default function AddDripMarketingRule({}) {
  const [loading, setLoading] = useState(false);
  const [eventFields, setEventFields] = useState([]);
  const [eventAttributes, setEventAttributes] = useState([]);
  const [smsTemplateDropdown, setSmsTemplateDropdown] = useState([]);
  const [whatsappTemplateDropdown, setWhatsappTemplateDropdown] = useState([]);
  const [emailTemplateDropdown, setEmailTemplateDropdown] = useState([]);
  const [selectedEventField, setSelectedEventField] = useState();
  const [sourceDropdown, setSourceDropdown] = useState([]);
  const [stateDropdown, setStateDropdown] = useState([]);
  const [cityDropdown, setCityDropdown] = useState([]);
  const [statusDropdown, setStatusDropdown] = useState([]);
  const [subStatusDropdown, setSubStatusDropdown] = useState([]);
  const [assignedToDropdown, setAssignedToDropdown] = useState([]);
  const [trackingUrlDropdown, setTrackingUrlDropdown] = useState([]);
  const [watiTemplateDropdown, setWatiTemplateDropdown] = useState([]);
  const [eventTypeDropdown, setEventTypeDropdown] = useState([]);
  const [smtpDropdown, setSmtpDropdown] = useState([]);
  const [fields, setFields] = useState([
    { id: "test", event_field: "", attribute: "", event_field_value: "" },
  ]);

  const [formData, setFormData] = useState({
    name: { value: "", errors: [] },
    events: { value: null, errors: [] },
    email_template: { value: null, errors: [] },
    sms_template: { value: null, errors: [] },
    whatsapp_template: { value: null, errors: [] },
    enterprise_whatsapp_template: { value: null, errors: [] },
    smtp_setting: { value: null, errors: [] },
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleInput = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: { value: e.target.value, errors: [] },
    });
  };

  const addFields = (id) => {
    setFields([
      ...fields,
      {
        id: `test${id + Math.random()}`,
        event_field: "",
        attribute: "",
        event_field_value: "",
      },
    ]);
  };

  const handleSelectInput = (value, name, id) => {
    const finalValue = value === undefined ? null : value;
    if (name === "event_field") {
      setSelectedEventField(finalValue);
      setFormData({
        ...formData,
        [name]: { value: finalValue, errors: [] },
      });
    }

    // Handle setting the attribute per field ID
    if (name === "attribute") {
      const updatedFields = fields.map((item) =>
        item.id === id ? { ...item, attribute: finalValue } : item
      );
      setFields(updatedFields);
    }

    // Handle setting any other field values
    setFormData({
      ...formData,
      [name]: { value: finalValue, errors: [] },
    });
  };

  const minusFields = (idToRemove) => {
    const newFields = fields.filter((field) => field.id !== idToRemove);
    fields.length > 1 && setFields(newFields);
  };

  const handleChange = (id, field, value) => {
    const updatedFields = fields.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    setFields(updatedFields);
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
    name: formData.name.value,
    email_template: formData.email_template.value,
    sms_template: formData.sms_template.value,
    whatsapp_template: formData.whatsapp_template.value,
    enterprise_whatsapp_template: formData.enterprise_whatsapp_template.value,
    smtp_setting_id: formData.smtp_setting.value,
    smtp_setting: formData.smtp_setting.value,
    events: fields.map(({ id, ...rest }) => rest),
  };

  // add assignment rule here
  const addDripMarketingRule = () => {
    if (
      !formData.email_template.value &&
      !formData.whatsapp_template.value &&
      !formData.enterprise_whatsapp_template.value &&
      !formData.sms_template.value
    ) {
      message.error("At least one template (Whatsapp, Enterprise Whatsapp, or Email Template) must be selected.");
      return;
    }
    setLoading(true);
    if (loading) return;

    postDripMarketingRuleService(payload)
      .then(function (response) {
        if (response.data.success === "1") {
          setFormData({
            name: { value: "", errors: [] },
            events: { value: null, errors: [] },
            email_template: { value: null, errors: [] },
            sms_template: { value: null, errors: [] },
            whatsapp_template: { value: null, errors: [] },
            enterprise_whatsapp_template: { value: null, errors: [] },
            smtp_setting: { value: null, errors: [] },
          });
          navigate("/drip-marketing-rule");
          message.success(response?.data?.message);
        }
      })
      .catch(function (error) {
        if (error) {
          handleError(error.response.data.data);
          message.error(error?.response?.data?.message);
        }
      })
      .finally(() => setLoading(false));
  };

  function fetchSelectedEventDropdown() {
    switch (selectedEventField) {
      case "source":
        return getLeadSourceService().then((response) => {
          setSourceDropdown(response.data.data);
        });
      case "state":
        return getStateDropdownService().then((response) => {
          setStateDropdown(response.data.data);
        });
      case "city":
        return getCityDropdownService().then((response) => {
          setCityDropdown(response.data.data);
        });
      case "status":
        return getLeadStatusService().then((response) => {
          setStatusDropdown(response.data.data);
        });
      case "sub_status":
        return getLeadSubStatusService().then((response) => {
          setSubStatusDropdown(response.data.data);
        });
      case "assigned_to":
        return getCounsellorDropdown().then((response) => {
          setAssignedToDropdown(response.data.data);
        });
      case "tracking_url":
        return getTrackingUrlDropdown().then((response) => {
          setTrackingUrlDropdown(response.data.data);
        });
      default:
        return Promise.resolve();
    }
  }

  function fetchData() {
    async function fetchEventData() {
      const response = await getEventFieldsDropdown();
      setEventFields(response.data.data.drip_event_fields);
      setEventAttributes(response.data.data.drip_event_attributes);
      setEventTypeDropdown(response.data.data.drip_event_types || []);
    }

    async function fetchSmsTemplateData() {
      if (!ENABLE_SMS) return;
      const response = await getSmsTemplateListservice();
      setSmsTemplateDropdown(response.data.data);
    }

    async function fetchWhatsappTemplateData() {
      const response = await getWhatsappTemplateListService();
      setWhatsappTemplateDropdown(response.data.data);
    }

    async function fetchEmailTemplateData() {
      const response = await getEmailTemplateListService();
      setEmailTemplateDropdown(response.data.data);
    }

    async function fetchWatiTemplateData() {
      const response = await getWatiTemplatesService();
      setWatiTemplateDropdown(response.data.data);
    }

    async function fetchSmtpData() {
      const response = await getSMTPSettingsService();
      setSmtpDropdown(response.data.data || []);
    }

    fetchEventData();
    ENABLE_SMS && fetchSmsTemplateData();
    fetchWhatsappTemplateData();
    fetchEmailTemplateData();
    fetchWatiTemplateData();
    fetchSmtpData();
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchSelectedEventDropdown();
  }, [selectedEventField]);

  return (
    <>
      <div className="dark:bg-[#24303f] bg-white p-10 rounded-lg mx-6">
        <div className="flex justify-between w-full ">
          <div className="w-fit mb-5">
            <h1 className="text-xl dark:text-yellow-500 text-black font-semibold ">
              Create Drip Marketing Rule
            </h1>
          </div>

          <NavLink to="/drip-marketing-rule">
            <button className="underline block">Back</button>
          </NavLink>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addDripMarketingRule();
          }}
          className="w-3/3 space-y-4"
        >
          <div className="flex flex-col gap-1">
            <label>
              Name<sup className="text-red-500">*</sup>
            </label>
            <InputWithIcon
              name="name"
              type="text"
              placeholder="Please enter drip marketing rule name"
              required={true}
              value={formData.name.value}
              errors={formData.name.errors}
              handler={(e) => handleInput(e)}
            />
          </div>

          <div className={`grid grid-cols-4 gap-3`}>
            {ENABLE_SMS && (
              <div className="flex flex-col gap-1">
                <label>
                  Sms Template
                </label>
                <CustomSelectInput
                  name="sms_template"
                  placeholder="Please select Sms Template"
                  allowClear={true}
                  value={formData.sms_template.value}
                  errors={formData.sms_template.errors}
                  handler={(value) => handleSelectInput(value, "sms_template")}
                  options={smsTemplateDropdown.map((item) => ({
                    value: item.id,
                    label: item.name,
                  }))}
                />
              </div>
            )}
            <div className="flex flex-col gap-1">
              <label>
                Whatsapp Template
              </label>
              <CustomSelectInput
                name="whatsapp_template"
                placeholder="Please select Whatsapp Template"
                allowClear={true}
                value={formData.whatsapp_template.value}
                errors={formData.whatsapp_template.errors}
                handler={(value) =>
                  handleSelectInput(value, "whatsapp_template")
                }
                options={whatsappTemplateDropdown.map((item) => ({
                  value: item.id,
                  label: item.name,
                }))}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label>
                Enterprise Whatsapp
              </label>
              <CustomSelectInput
                name="enterprise_whatsapp_template"
                placeholder="Please select Enterprise Whatsapp Template"
                allowClear={true}
                value={formData.enterprise_whatsapp_template.value}
                errors={formData.enterprise_whatsapp_template.errors}
                handler={(value) =>
                  handleSelectInput(value, "enterprise_whatsapp_template")
                }
                options={watiTemplateDropdown.map((item) => ({
                  value: item.name,
                  label: item.name,
                }))}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label>
                Email Template
              </label>
              <CustomSelectInput
                name="email_template"
                placeholder="Please select Email Template"
                allowClear={true}
                value={formData.email_template.value}
                errors={formData.email_template.errors}
                handler={(value) => handleSelectInput(value, "email_template")}
                options={emailTemplateDropdown.map((item) => ({
                  value: item.id,
                  label: item.name,
                }))}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label>
                SMTP Setting
              </label>
              <CustomSelectInput
                name="smtp_setting"
                placeholder="Please select SMTP Setting"
                allowClear={true}
                value={formData.smtp_setting.value}
                errors={formData.smtp_setting.errors}
                handler={(value) => handleSelectInput(value, "smtp_setting")}
                options={smtpDropdown.map((item) => ({
                  value: item.id,
                  label: `${item.provider_name} (${item.username})${item.is_active ? ' - [Active]' : ''}`,
                }))}
              />
            </div>
          </div>

          {/* fields start from here */}
          {fields &&
            fields.map((field, index) => (
              <div className="w-full flex items-end gap-2" key={field.id}>
                <div className="w-[95%] grid grid-cols-3 gap-3">
                  <div className="flex flex-col gap-1">
                    <label>
                      Event Field<sup className="text-red-500">*</sup>
                    </label>
                    <CustomSelectInput
                      name="event_field"
                      placeholder="Please select Event Field"
                      value={field.event_field || null}
                      errors={formData.events.errors}
                      handler={(value) => {
                        handleSelectInput(value, "event_field", field.id);
                        handleChange(field.id, "event_field", value);
                      }}
                      options={eventFields?.map((item) => ({
                        value: item.field,
                        label: item.display_name,
                      }))}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label>
                      Attribute<sup className="text-red-500">*</sup>
                    </label>
                    <CustomSelectInput
                      name="attribute"
                      placeholder="Please select Attribute"
                      value={field.attribute || null}
                      errors={formData.events.errors}
                      handler={(value) => {
                        handleSelectInput(value, "attribute", field.id);
                        handleChange(field.id, "attribute", value);
                      }}
                      options={eventAttributes?.map((item) => ({
                        value: item.field,
                        label: item.display_name,
                      }))}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label>
                      Value<sup className="text-red-500">*</sup>
                    </label>
                    <CustomSelectInput
                      name="value"
                      placeholder="Please select Value"
                      handler={(value) => {
                        handleSelectInput(value, "event_field_value", field.id);
                        handleChange(field.id, "event_field_value", value);
                      }}
                      options={
                        field.event_field === "event_type"
                          ? eventTypeDropdown?.map((item) => ({
                              value: item.id,
                              label: item.name,
                            }))
                          : field.event_field === "source"
                          ? sourceDropdown?.map((item) => ({
                              value: item.id,
                              label: item.name,
                            }))
                          : field.event_field === "state"
                          ? stateDropdown?.map((item) => ({
                              value: item.id,
                              label: item.name,
                            }))
                          : field.event_field === "city"
                          ? cityDropdown?.map((item) => ({
                              value: item.id,
                              label: item.name,
                            }))
                          : field.event_field === "status"
                          ? statusDropdown?.map((item) => ({
                              value: item.id,
                              label: item.name,
                            }))
                          : field.event_field === "sub_status"
                          ? subStatusDropdown?.map((item) => ({
                              value: item.id,
                              label: item.name,
                            }))
                          : field.event_field === "assigned_to"
                          ? assignedToDropdown?.map((item) => ({
                              value: item.username,
                              label: item.full_name,
                            }))
                          : field.event_field === "tracking_url"
                          ? trackingUrlDropdown?.map((item) => ({
                              value: item.id,
                              label: item.name,
                            }))
                          : []
                      }
                    />
                  </div>
                </div>

                {/* button start from here */}
                <div className="flex gap-1">
                  <Button
                    className="rounded bg-orange-500 text-white"
                    onClick={() => addFields(index)}
                  >
                    +
                  </Button>
                  <Button
                    className={`rounded bg-orange-500 text-white`}
                    onClick={() => minusFields(field.id)}
                    disabled={fields.length <= 1}
                  >
                    -
                  </Button>
                </div>
                {/* button close from here */}
              </div>
            ))}
          {/* fields close from here */}

          <PrimaryButton
            type="primary"
            htmlType={"submit"}
            className="text-black p-5"
            title={"Submit"}
            block={false}
            disabled={loading}
          />
        </form>
      </div>
    </>
  );
}