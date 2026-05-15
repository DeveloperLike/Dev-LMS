import React, { useState, useEffect, useRef } from "react";
import FormItem from "antd/es/form/FormItem";
import {
  CustomSelectInput,
  InputWithIcon,
} from "../../../Components/CustomComponents/InputWithIcon";
import { Select, message, Button } from "antd";
import { PrimaryButton } from "../../../Components/CustomComponents/ButtonUi";
import { useDispatch } from "react-redux";
import TextArea from "antd/es/input/TextArea";
import { addwhatsapptemplate } from "../ApiService";
import { getUserDropdownService } from "../../User/ApiService";
import { FaMinus } from "react-icons/fa";
import { getWhatsappTemplateVariableListService } from "../ApiService";

const AddWhatsapp = ({ setIsModalOpen, getWhatsappApi }) => {
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState([]);
  const [formData, setFormData] = useState({
    name: { value: "", errors: [] },
    template_type: { value: null, errors: [] },
    template_name: { value: "", errors: [] },
    body: { value: "", errors: [] },
    status: { value: null, errors: [] },
    visible_to: { value: [], errors: [] },
    assign_to: { value: null, errors: [] },
  });

  const [nonEnterpriseVariables, setNonEnterpriseVariables] = useState([]);

  const bodyTextAreaRef = useRef(null);
  const [dynamicVariables, setDynamicVariables] = useState([]);
  const [variableIdCounter, setVariableIdCounter] = useState(1);

  const dispatch = useDispatch();

  // Handler for all input fields
  const handleInput = (e, name) => {
    let val = e.target ? e.target.value : e;
    setFormData({
      ...formData,
      [name]: { value: val, errors: [] },
    });
  };

  const handleNonEnterpriseVariableSelect = (selectedValue) => {
    // `selectedValue` is the `code` from the dropdown
    insertTextAtCursor(`${selectedValue}`);
  };

  const insertVariable = () => {
    const nextVariable =
      (formData.body.value.match(/\{\{(\d+)\}\}/g) || []).length + 1;
    insertTextAtCursor(`${nextVariable}`);
  };

  // Function to insert variable at cursor position
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
    // Set cursor position after insertion
    setTimeout(() => {
      textArea.focus();
      textArea.setSelectionRange(
        start + textToInsert.length,
        start + textToInsert.length
      );
    }, 0);
  };

  const handleAddDynamicVariable = () => {
    setDynamicVariables([
      ...dynamicVariables,
      { id: variableIdCounter, value: null },
    ]);
    setVariableIdCounter(variableIdCounter + 1);
  };

  const handleRemoveDynamicVariable = (id) => {
    setDynamicVariables(
      dynamicVariables.filter((variable) => variable.id !== id)
    );
  };

  const handleVariableValue = (id, newValue) => {
    setDynamicVariables(
      dynamicVariables.map((variable) =>
        variable.id === id ? { ...variable, value: newValue } : variable
      )
    );
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

  // Function to call the post API
  const callPostApi = () => {
    if (loading) return;
    setLoading(true);

    let payload = {
      name: formData.name.value,
      // template_name: formData.template_name.value,
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
      const extractedVariables = formData.body.value.match(/\{\{([^{}]+)\}\}/g);
      const variablesForApi = extractedVariables
        ? extractedVariables.map((v) =>
            v.replace("{{", "").replace("}}", "").trim()
          )
        : [];
      payload = {
        ...payload,
        body: formData.body.value,
        // variables: variablesForApi,
      };
    }

    addwhatsapptemplate(payload)
      .then((response) => {
        if (response.data.success === "1") {
          setIsModalOpen(false);
          getWhatsappApi();
          setFormData({
            name: { value: "", errors: [] },
            template_type: { value: null, errors: [] },
            template_name: { value: "", errors: [] },
            body: { value: "", errors: [] },
            status: { value: null, errors: [] },
            visible_to: { value: [], errors: [] },
            assign_to: { value: null, errors: [] },
          });
          setDynamicVariables([]);
          setVariableIdCounter(1);
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

  useEffect(() => {
    getWhatsappTemplateVariableListService().then((response) => {
      if (response?.data?.success === "1") {
        setNonEnterpriseVariables(
          response.data.data.map((item) => ({
            value: item.code, // Send code as value
            label: item.name, // Display name as label
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

        {/* Conditional rendering for Body and Variables */}
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

            {/* Body Text Area */}
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

        {formData.template_type.value === "enterprise" && (
          <>
            {/* Dynamic Variables Section for Enterprise */}
            <FormItem>
              <div className="flex flex-col gap-1">
                <label>Add Variables</label>
                <div className="flex flex-col gap-2">
                  {dynamicVariables.map((variable, index) => (
                    <div key={variable.id} className="flex items-center gap-2">
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
                      {/* Show Minus button if there's at least one dynamic variable */}
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
          title="Submit"
          block={false}
          disabled={loading}
        />
      </form>
    </>
  );
};

export default AddWhatsapp;
