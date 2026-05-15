import React, { useState, useEffect, useRef } from "react";
import FormItem from "antd/es/form/FormItem";
import {
  CustomSelectInput,
  InputWithIcon,
} from "../../../Components/CustomComponents/InputWithIcon";
import { Select, message, Button } from "antd";
import { PrimaryButton } from "../../../Components/CustomComponents/ButtonUi";
import TextArea from "antd/es/input/TextArea";
import {
  getWhatsappTemplateDetailService,
  editwhatsapptemplate,
  getWhatsappTemplateVariableListService,
} from "../ApiService";
import { getUserDropdownService } from "../../User/ApiService";
import { FaMinus } from "react-icons/fa";

// The EditWhatsapp component handles editing an existing WhatsApp template.
const EditWhatsapp = ({ dataid, setEditOpen, getWhatsappApi }) => {
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState([]);
  const [nonEnterpriseVariables, setNonEnterpriseVariables] = useState([]);
  
  // State for form data, mirroring the structure of AddWhatsapp.
  const [formData, setFormData] = useState({
    name: { value: "", errors: [] },
    template_type: { value: null, errors: [] },
    template_name: { value: "", errors: [] },
    body: { value: "", errors: [] },
    status: { value: null, errors: [] },
    visible_to: { value: [], errors: [] },
    assign_to: { value: null, errors: [] },
  });

  // State for dynamic variables, used for "enterprise" templates.
  const [dynamicVariables, setDynamicVariables] = useState([]);
  const [variableIdCounter, setVariableIdCounter] = useState(1);
  const bodyTextAreaRef = useRef(null);

  // Generic handler for all input fields (both text and select).
  const handleInput = (e, name) => {
    let val = e.target ? e.target.value : e;
    setFormData({
      ...formData,
      [name]: { value: val, errors: [] },
    });
  };

  // Handler for selecting a non-enterprise variable from the dropdown.
  const handleNonEnterpriseVariableSelect = (selectedValue) => {
    insertTextAtCursor(`${selectedValue}`);
  };

  // Function to insert text at the current cursor position in the textarea.
  const insertTextAtCursor = (textToInsert) => {
    const textArea = bodyTextAreaRef.current?.resizableTextArea?.textArea;
    if (!textArea) return;

    const start = textArea.selectionStart;
    const end = textArea.selectionEnd;
    const newText =
      formData.body.value.substring(0, start) +
      textToInsert +
      formData.body.value.substring(end);
    setFormData({
      ...formData,
      body: { value: newText, errors: [] },
    });
    
    // Set cursor position after insertion for better user experience.
    setTimeout(() => {
      textArea.focus();
      textArea.setSelectionRange(
        start + textToInsert.length,
        start + textToInsert.length
      );
    }, 0);
  };

  // Handler to add a new dynamic variable field.
  const handleAddDynamicVariable = () => {
    setDynamicVariables([
      ...dynamicVariables,
      { id: variableIdCounter, value: null },
    ]);
    setVariableIdCounter(variableIdCounter + 1);
  };

  // Handler to remove a dynamic variable field.
  const handleRemoveDynamicVariable = (id) => {
    setDynamicVariables(
      dynamicVariables.filter((variable) => variable.id !== id)
    );
  };

  // Handler to update the value of a dynamic variable.
  const handleVariableValue = (id, newValue) => {
    setDynamicVariables(
      dynamicVariables.map((variable) =>
        variable.id === id ? { ...variable, value: newValue } : variable
      )
    );
  };

  // Helper function to handle API validation errors and update form state.
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

  // Function to call the edit API.
  const callPostApi = () => {
    if (loading) return;
    setLoading(true);

    let payload = {
      name: formData.name.value,
      template_type: formData.template_type.value,
      status: formData.status.value,
      visible_to: formData.visible_to.value,
      assign_to: formData.assign_to.value,
    };

    if (formData.template_type.value === "enterprise") {
      const dynamicVariableValues = dynamicVariables
        .map((v) => v.value)
        .filter(Boolean);

      const variablesObject = dynamicVariableValues.reduce(
        (acc, current, index) => {
          acc[index + 1] = current;
          return acc;
        },
        {}
      );

      payload = {
        ...payload,
        variables: variablesObject,
        template_name: formData.template_name.value,
      };
    } else if (formData.template_type.value === "non-enterprise") {
      // For non-enterprise templates, the body is submitted directly.
      payload = {
        ...payload,
        body: formData.body.value,
      };
    }

    editwhatsapptemplate(payload, dataid)
      .then((response) => {
        if (response.data.success === "1") {
          setEditOpen(false);
          getWhatsappApi();
          message.success(response?.data?.message);
        }
      })
      .catch((error) => {
        if (error.response && error.response.data && error.response.data.data) {
          handleError(error.response.data.data);
          message.error(error?.response?.data?.message || "An error occurred.");
        } else {
          message.error("Failed to submit. Please try again.");
          console.error("Submission error:", error);
        }
      })
      .finally(() => setLoading(false));
  };

  // useEffect to fetch the existing template's data and populate the form.
  useEffect(() => {
    getWhatsappTemplateDetailService(dataid).then((response) => {
      const whatsappData = response.data.data;
      
      // Convert the fetched variables object to an array for the dynamic variables state.
      let fetchedDynamicVariables = [];
      if (whatsappData.variables) {
        fetchedDynamicVariables = Object.keys(whatsappData.variables).map(
          (key) => ({
            id: parseInt(key),
            value: whatsappData.variables[key],
          })
        );
      }
      setDynamicVariables(fetchedDynamicVariables);

      setFormData({
        name: { value: whatsappData.name, errors: [] },
        template_type: { value: whatsappData.template_type, errors: [] },
        template_name: { value: whatsappData.template_name, errors: [] },
        body: { value: whatsappData.body, errors: [] },
        status: { value: whatsappData.status, errors: [] },
        visible_to: { value: whatsappData.visible_to, errors: [] },
        assign_to: { value: whatsappData.assign_to, errors: [] },
      });
    });
  }, [dataid]);

  // useEffect to fetch user list for the "Visible to" dropdown.
  useEffect(() => {
    const fetchVisibleTo = async () => {
      try {
        const response = await getUserDropdownService();
        if (response.data && response.data.success === "1") {
          setUserName(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch user dropdown:", error);
        message.error("Failed to load users for 'Visible to'.");
      }
    };
    fetchVisibleTo();
  }, []);

  // useEffect to fetch the list of non-enterprise variables.
  useEffect(() => {
    getWhatsappTemplateVariableListService().then((response) => {
      if (response?.data?.success === "1") {
        setNonEnterpriseVariables(
          response.data.data.map((item) => ({
            value: item.code,
            label: item.name,
          }))
        );
      }
    });
  }, []);

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          callPostApi();
        }}
        className="w-3/3 space-y-6"
      >
        {/* Name Input Field */}
        <FormItem>
          <div className="flex flex-col gap-1">
            <label>
              Name<sup className="text-red-500">*</sup>
            </label>
            <InputWithIcon
              name="name"
              type="text"
              placeholder="Please enter name"
              required={true}
              handler={(e) => handleInput(e, "name")}
              value={formData.name.value}
              errors={formData.name.errors}
            />
          </div>
        </FormItem>

        {/* Template Type Input Field */}
        <FormItem>
          <div className="flex flex-col gap-1">
            <label> Template Type</label>
            <CustomSelectInput
              placeholder="Please select Template Type"
              name="template_type"
              handler={(e) => handleInput(e, "template_type")}
              value={formData.template_type.value}
              options={[
                {
                  value: "enterprise",
                  label: "Enterprise",
                },
                {
                  value: "non-enterprise",
                  label: "Non Enterprise",
                },
              ]}
            />
          </div>
        </FormItem>

        {/* Conditional rendering for Enterprise Template Name */}
        {formData.template_type.value === "enterprise" && (
          <FormItem>
            <div className="flex flex-col gap-1">
              <label>
                Enterprise Template Name<sup className="text-red-500">*</sup>
              </label>
              <InputWithIcon
                name="template_name"
                type="text"
                placeholder="Please enter template name"
                required={true}
                handler={(e) => handleInput(e, "template_name")}
                value={formData.template_name.value}
                errors={formData.template_name.errors}
              />
            </div>
          </FormItem>
        )}

        {/* Conditional rendering for Body and Variables for non-enterprise */}
        {formData.template_type.value === "non-enterprise" && (
          <>
            <FormItem>
              <div className="flex flex-col gap-1">
                <label>Variable</label>
                <CustomSelectInput
                  placeholder="Please select a variable"
                  handler={handleNonEnterpriseVariableSelect}
                  options={nonEnterpriseVariables}
                />
              </div>
            </FormItem>

            <FormItem>
              <div className="flex flex-col gap-1">
                <label>
                  Body<sup className="text-red-500">*</sup>
                </label>
                <TextArea
                  name="body"
                  placeholder="Please enter text"
                  ref={bodyTextAreaRef}
                  required={true}
                  value={formData.body.value}
                  errors={formData.body.errors}
                  onChange={(e) => handleInput(e, "body")}
                  autoSize={{ minRows: 3, maxRows: 5 }}
                />
              </div>
            </FormItem>
          </>
        )}

        {/* Conditional rendering for Dynamic Variables for enterprise */}
        {formData.template_type.value === "enterprise" && (
          <>
            <FormItem>
              <div className="flex flex-col gap-1">
                <label>Add Variables</label>
                <div className="flex flex-col gap-2">
                  {dynamicVariables.map((variable, index) => (
                    <div key={variable.id} className="flex items-center gap-2">
                      {/* <label>{`${index + 1}`}</label> */}
                      <label>{`{{${index + 1}}}`}</label>
                      <CustomSelectInput
                        name={`dynamic_variable_${variable.id}`}
                        placeholder={`variable ${index + 1}`}
                        handler={(value) =>
                          handleVariableValue(variable.id, value)
                        }
                        value={variable.value}
                        options={nonEnterpriseVariables}
                      />
                      {dynamicVariables.length > 0 && (
                        <Button
                          type="default"
                          danger
                          onClick={() =>
                            handleRemoveDynamicVariable(variable.id)
                          }
                          className="flex-shrink-0"
                        >
                          <FaMinus />
                        </Button>
                      )}
                    </div>
                  ))}
                  <PrimaryButton
                    title={" Add Variable"}
                    onClick={handleAddDynamicVariable}
                    type={"primary"}
                    className={"max-w-[100px]"}
                  />
                </div>
              </div>
            </FormItem>
          </>
        )}

        {/* Status Select Input */}
        <FormItem>
          <label className="block">
            Status<sup className="text-red-500">*</sup>
          </label>
          <CustomSelectInput
            name={"status"}
            className="w-full min-w-[300px]"
            placeholder={"Select status"}
            value={formData.status.value}
            errors={formData.status.errors}
            handler={(value) => handleInput(value, "status")}
            options={[
              {
                value: "draft",
                label: "Draft",
              },
              {
                value: "publish",
                label: "Publish",
              },
            ]}
          />
        </FormItem>

        {/* Assignment Type Select Input */}
        <FormItem>
          <div className="flex flex-col gap-1">
            <label className="block">
              Visible to<sup className="text-red-500">*</sup>
            </label>
            <CustomSelectInput
              size="large"
              name="assign_to"
              placeholder="Select visible to"
              value={formData.assign_to.value}
              errors={formData.assign_to.errors}
              handler={(value) => handleInput(value, "assign_to")}
              options={[
                {
                  value: "selected_users",
                  label: "Selected Users",
                },
                {
                  value: "all",
                  label: "All Users",
                },
              ]}
            />
          </div>
        </FormItem>

        {/* Visible To Select Input (conditionally rendered) */}
        {formData.assign_to.value === "selected_users" && (
          <FormItem>
            <div className="flex flex-col gap-1">
              <label className="block">
                Users<sup className="text-red-500">*</sup>
              </label>
              <Select
                size="large"
                name="visible_to"
                placeholder="Select type"
                mode="multiple"
                tokenSeparators={[","]}
                value={formData.visible_to.value}
                onChange={(value) => handleInput(value, "visible_to")}
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={userName.map((item, index) => ({
                  key: index,
                  value: item.username,
                  label: item.email,
                }))}
              />
              {formData.visible_to.errors && (
                <span className="text-red-500 text-sm">
                  {formData.visible_to.errors[0]}
                </span>
              )}
            </div>
          </FormItem>
        )}
        {/* Submit Button */}
        <PrimaryButton
          type="primary"
          htmlType="submit"
          className="p-5 mt-5 text-black"
          title="Update"
          block={false}
          disabled={loading}
        />
      </form>
    </>
  );
};

export default EditWhatsapp;
