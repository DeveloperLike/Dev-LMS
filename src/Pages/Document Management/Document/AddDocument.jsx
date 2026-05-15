import { useState } from "react";
import { FormItem } from "@/Components/Ui/Form";
import { InputWithIcon } from "../../../Components/CustomComponents/InputWithIcon";
import { PrimaryButton } from "../../../Components/CustomComponents/ButtonUi";
import { message } from "antd";
import { addDocumentService } from "./ApiService";

const AddDocument = ({ getDocumentApi, setOpen, id }) => {
  const [loading, setLoading] = useState(false); // Track API call state
  const [formData, setFormData] = useState({
    title: { value: null, errors: [] },
  });

  // Handle input change for all form fields
  const handleInputChange = (field) => (e) => {
    const value = e.target ? e.target.value : e;
    setFormData((prevData) => ({
      ...prevData,
      [field]: {
        ...prevData[field],
        value,
      },
      errors: [],
    }));
  };

  const handleError = (errors) => {
    setFormData((prevData) => {
      const updatedFormData = {};
      Object.keys(prevData).forEach((field) => {
        updatedFormData[field] = {
          ...prevData[field],
          errors: errors[field] || [], // Use new errors or empty array if not present
        };
      });
      return updatedFormData;
    });
  };

  const addDocumentApi = () => {
    const payload = {
      title: formData.title.value,
    };
    setLoading(true); // Disable the button
    if (loading) return; // Prevent multiple submissions

    addDocumentService(payload, id)
      .then(function (response) {
        if (response.data.success === "1") {
          setOpen(false);
          getDocumentApi();
          setFormData({
            title: { value: null, errors: [] },
          });
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

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addDocumentApi();
        }}
        className="w-3/3 space-y-4"
      >
        <FormItem>
          <div className="flex flex-col gap-1">
            <label>
              Title<sup className="text-red-500">*</sup>
            </label>
            <InputWithIcon
              name="title"
              placeholder="Please Enter Title"
              required
              value={formData.title.value}
              errors={formData.title.errors}
              handler={handleInputChange("title")}
            />
          </div>
        </FormItem>

        <PrimaryButton
          type="primary"
          htmlType={"submit"}
          className="p-4"
          title={"Add Document"}
          block={false}
          disabled={loading}
        />
      </form>
    </>
  );
};

export default AddDocument;
