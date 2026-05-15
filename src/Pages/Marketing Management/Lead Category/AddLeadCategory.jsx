import { useState } from "react";
import { FormItem } from "@/Components/Ui/Form";
import { InputWithIcon } from "../../../Components/CustomComponents/InputWithIcon";
import { PrimaryButton } from "../../../Components/CustomComponents/ButtonUi";
import { message } from "antd";
import { addLeadCategoryService } from "./ApiService";

const AddLeadCategory = ({ leadCategoryGetApi, setOpen }) => {
  const [loading, setLoading] = useState(false); // Track API call state
  const [formData, setFormData] = useState({
    title: {
      value: "",
      errors: [],
    },
  });

  //   Handle input changes and update state
  const handleInput = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: { value: e.target.value, errors: [] },
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

  const addleadCategoryApi = () => {
    if (loading) return; // Prevent multiple submissions
    setLoading(true); // Disable the button

    const payload = { title: formData.title.value };
    addLeadCategoryService(payload)
      .then(function (response) {
        if (response.data.success === "1") {
          setOpen(false);
          leadCategoryGetApi();
          setFormData({
            title: {
              value: "",
              errors: [],
            },
          });
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
          addleadCategoryApi();
        }}
        className="w-3/3 space-y-4"
      >
        <FormItem>
          <div className="flex flex-col gap-1">
            <label>
              Lead Category<sup className="text-red-500">*</sup>
            </label>
            <InputWithIcon
              name="title"
              required={true}
              maxLength={35}
              errors={formData.title.errors}
              type="text"
              value={formData.title.value}
              placeholder="Please enter Lead Category"
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
          disabled={loading} // Disable button if loading
        />
      </form>
    </>
  );
};

export default AddLeadCategory;
