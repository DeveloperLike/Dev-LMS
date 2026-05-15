import { useState } from "react";
import { FormItem } from "@/Components/Ui/Form";
import { UpdateStudentPersonalDetailsStatusService } from "../ApiService";
import { CustomSelectInput, InputWithIcon } from "../../../Components/CustomComponents/InputWithIcon";
import { PrimaryButton } from "../../../Components/CustomComponents/ButtonUi";
import { message } from "antd";

const PersonalDataUpdate = ({
  userName,
  setEditOpen,
  getProfileDetailApi,
  dataremarks,
  status,
  getIsApprovedApi
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    profile_status: { value: status, errors: [] },
    remarks: { value: dataremarks, errors: [] },
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
          errors: errors?.[field] || [], 
        };
      });
      return updatedFormData;
    });
  };

  const addCourseApi = () => {
    const payload = {
        profile_status: formData.profile_status.value,
      remarks: formData.remarks.value,
    };
    setLoading(true);
    if (loading) return;

    UpdateStudentPersonalDetailsStatusService(userName, payload)
      .then(function (response) {
        if (response.data.success === "1") {
            setEditOpen(false);
          getProfileDetailApi();
          getIsApprovedApi();
          message.success(response?.data?.message);
        }
      })
      .catch(function (error) {
        if (error) {
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
        className="w-3/3 space-y-4"
      >
        <FormItem>
          <div className="flex flex-col gap-1">
            <label>
              Status<sup className="text-red-500">*</sup>
            </label>
            <CustomSelectInput
              name="profile_status"
              placeholder="Select Status"
              className="w-full"
              defaultValue={status}
              value={formData.profile_status.value}
              errors={formData.profile_status.errors}
              handler={handleInputChange("profile_status")}
              options={[
                { value: "Rejected", label: "Rejected" },
                { value: "Approved", label: "Approved" },
              ]}
            />
          </div>
        </FormItem>

        {/* {formData.profile_status.value === "Rejected" && ( */}
          <FormItem>
            <div className="flex flex-col gap-1">
              <label>
                Remarks<sup className="text-red-500">*</sup>
              </label>
              <InputWithIcon
                name="remarks"
                placeholder="Please Enter Intake Session"
                required={formData.profile_status.value === "rejected" ? true : false} 
                value={formData.remarks.value}
                errors={formData.remarks.errors}
                handler={handleInputChange("remarks")}
              />
            </div>
          </FormItem>
        {/* )} */}

        <PrimaryButton
          type="primary"
          htmlType={"submit"}
          className="p-4"
          title={"Submit"}
          block={false}
          disabled={loading}
        />
      </form>
    </>
  );
};

export default PersonalDataUpdate;
