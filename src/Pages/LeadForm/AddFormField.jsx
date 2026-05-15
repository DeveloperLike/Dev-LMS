import React, { useState } from "react";
import FormItem from "antd/es/form/FormItem";
import { InputWithIcon } from "../../Components/CustomComponents/InputWithIcon";
import { message, Select, Switch } from "antd";
import { PrimaryButton } from "../../Components/CustomComponents/ButtonUi";
import { useDispatch } from "react-redux";
import { notificationFun } from "../../lib/redux/NotificationSlice";
import { addLeadFormFeildService } from "./ApiService";

const AddFormField = ({ setOpen, leadGetApi }) => {
  const [loading, setLoading] = useState(false); // Track API call state
  const [formData, setFormData] = useState({
    label: { value: "", errors: [] },
    code: { value: "", errors: [] },
    help_text: { value: "", errors: [] },
    placeholder: { value: "", errors: [] },
    type: { value: null, errors: [] },
    options: { value: [], errors: [] },
    is_required: { value: true, errors: [] },
    is_active: { value: true, errors: [] },
    position: { value: 999, errors: [] },
  });

  const dispatch = useDispatch();

  const handleInput = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: { value: e.target.value, errors: [] },
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

  let payload = {
    label: formData.label.value,
    code: formData.code.value,
    help_text: formData.help_text.value,
    placeholder: formData.placeholder.value,
    type: formData.type.value,
    options: formData.options.value,
    is_active: formData.is_active.value,
    is_required: formData.is_required.value,
    position: formData.position.value,
  };
  console.log(payload);

  const resetForm = () => {
    setFormData({
      label: { value: "", errors: [] },
      code: { value: "", errors: [] },
      help_text: { value: "", errors: [] },
      placeholder: { value: "", errors: [] },
      type: { value: null, errors: [] },
      options: { value: [], errors: [] },
      is_required: { value: true, errors: [] },
      is_active: { value: true, errors: [] },
      position: { value: 999, errors: [] },
    });
  };

  const callPostApi = () => {
    if (loading) return; // Prevent multiple submissions
    setLoading(true); // Disable the button

    addLeadFormFeildService(payload)
      .then(function (response) {
        if (response.data.success === "1") {
          setOpen(false);
          leadGetApi();
          resetForm();
          message.success(response.data.message);
        }
      })
      .catch(function (error) {
        if (error) {
          handleError(error.response.data.data);
          message.error(error.response.data.message);
        }
      })
      .finally(() => setLoading(false)); // Re-enable the button
  };

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          callPostApi();
        }}
        className="w-3/3 space-y-4"
      >
        <FormItem>
          <div className="flex flex-col gap-1">
            <label>
              Field Name<sup className="text-red-500">*</sup>
            </label>
            <InputWithIcon
              name="label"
              type="text"
              placeholder="Please enter field name"
              handler={(e) => handleInput(e)}
              value={formData.label.value}
              errors={formData.label.errors}
            />
          </div>
        </FormItem>

        <FormItem>
          <div className="flex flex-col gap-1">
            <label>
              Field Code<sup className="text-red-500">*</sup>
            </label>
            <InputWithIcon
              name="code"
              type="text"
              placeholder="Please enter field code"
              handler={(e) => handleInput(e)}
              value={formData.code.value}
              errors={formData.code.errors}
            />
          </div>
        </FormItem>

        <FormItem>
          <div className="flex flex-col gap-1">
            <label>
              Position<sup className="text-red-500">*</sup>
            </label>
            <InputWithIcon
              name="position"
              type="number"
              placeholder="Please enter position"
              handler={handleInput}
              value={formData.position.value}
              errors={formData.position.errors}
            />
          </div>
        </FormItem>

        <FormItem>
          <label>
            Type<sup className="text-red-500">*</sup>
          </label>
          <Select
            showSearch
            name="type"
            size="large"
            placeholder="Select a type"
            value={formData.type.value}
            onChange={(value) => handleSelectInput(value, "type")}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={[
              {
                value: "text",
                label: "Text",
              },
              {
                value: "email",
                label: "Email",
              },
              {
                value: "number",
                label: "Number",
              },
              {
                value: "select",
                label: "Select",
              },
              {
                value: "date",
                label: "Date",
              },
              {
                value: "password",
                label: "Password",
              },
              {
                value: "state",
                label: "State",
              },
              {
                value: "city",
                label: "City",
              },
            ]}
          />
          {formData.type.errors && (
            <span className="text-red-500 text-sm">
              {formData.type.errors[0]}
            </span>
          )}
        </FormItem>

        {formData.type.value === "select" && (
          <FormItem>
            <label>
              Options<sup className="text-red-500">*</sup>
            </label>
            <Select
              showSearch
              name="options"
              mode="tags"
              size="large"
              placeholder="Select a type"
              value={formData.options.value}
              onChange={(value) => handleSelectInput(value, "options")}
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            />
            {formData.options.errors && (
              <span className="text-red-500 text-sm">
                {formData.options.errors[0]}
              </span>
            )}
          </FormItem>
        )}

        <FormItem>
          <div className="flex flex-col gap-1">
            <label>Placeholder</label>
            <InputWithIcon
              name="placeholder"
              type="text"
              placeholder="Please enter placeholder"
              handler={(e) => handleInput(e)}
              value={formData.placeholder.value}
              errors={formData.placeholder.errors}
              required={false}
            />
          </div>
        </FormItem>

        <FormItem>
          <div className="flex flex-col gap-1">
            <label>Help Text</label>
            <InputWithIcon
              name="help_text"
              type="text"
              placeholder="Please enter text"
              handler={(e) => handleInput(e)}
              value={formData.help_text.value}
              errors={formData.help_text.errors}
              required={false}
            />
          </div>
        </FormItem>

        <FormItem>
          <label className="block text-md mb-2">
            Required<sup className="text-red-500">*</sup>
          </label>
          <Switch
            name="is_required"
            value={formData.is_required.value}
            errors={formData.is_required.errors}
            defaultChecked
            onChange={(value) => handleSelectInput(value, "is_required")}
          />
        </FormItem>

        <PrimaryButton
          type="primary"
          htmlType="submit"
          className="p-5 mt-5 text-black"
          title="Add Field"
          block={false}
          disabled={loading} // Disable button if loading
        />
      </form>
    </>
  );
};

export default AddFormField;
