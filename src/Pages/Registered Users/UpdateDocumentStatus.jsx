import { useState } from "react";
import { FormItem } from "@/Components/Ui/Form";
import {
  CustomSelectInput,
  InputWithIcon,
} from "../../Components/CustomComponents/InputWithIcon";
import { PrimaryButton } from "../../Components/CustomComponents/ButtonUi";
import { UpdateDocumentStatusService } from "./ApiService";
import { message } from "antd";

const UpdateDocumentStatus = ({
  userName,
  categoryId,
  documentId,
  getCourseApi,
  // setOpen,
  setModalVisible
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    status: { value: null, errors: [] },
    remarks: { value: null, errors: [] },
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

  const addCourseApi = () => {
    const payload = {
      status: formData.status.value,
      remarks: formData.remarks.value,
    };
    setLoading(true);
    if (loading) return;

    UpdateDocumentStatusService(userName, categoryId, documentId, payload)
      .then(function (response) {
        if (response.data.success === "1") {
          // setOpen(false);
          setModalVisible(false);
          getCourseApi();
          setFormData({
            status: { value: null, errors: [] },
            remarks: { value: null, errors: [] },
          });
          message.success(response?.data?.message);
        }
      })
      .catch(function (error) {
        if (error.response) {
          handleError(error?.response?.data?.data);
          message.error(error?.response?.data?.message);
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addCourseApi();
        }}
        className=""
      >
        <FormItem>
          <div className="flex flex-col gap-1 mb-2">
            <label>
              Status<sup className="text-red-500">*</sup>
            </label>
            <CustomSelectInput
              name="status"
              placeholder="Select Status"
              className="w-full"
              value={formData.status.value}
              errors={formData.status.errors}
              handler={handleInputChange("status")}
              options={[
                { value: "rejected", label: "Rejected" },
                { value: "approved", label: "Approved" },
                // { value: "uploaded", label: "Uploaded" },
                // { value: "pending", label: "Pending" },
              ]}
            />
          </div>
        </FormItem>

        {formData.status.value === "rejected" && (
          <FormItem>
            <div className="flex flex-col gap-1">
              <label>
                Remarks<sup className="text-red-500">*</sup>
              </label>
              <InputWithIcon
                name="remarks"
                placeholder="Please Enter Intake Session"
                required={formData.status.value === "rejected" ? true : false} 
                value={formData.remarks.value}
                errors={formData.remarks.errors}
                handler={handleInputChange("remarks")}
              />
            </div>
          </FormItem>
        )}

        <PrimaryButton
          type="primary"
          htmlType={"submit"}
          className="p-4 mt-1 flex justify-self-center "
          title={"Submit"}
          block={false}
          disabled={loading}
        />
      </form>
    </>
  );
};

export default UpdateDocumentStatus;
