import { useState } from "react";
import { FormItem } from "@/Components/Ui/Form";
import { InputWithIcon } from "../../Components/CustomComponents/InputWithIcon";
import { PrimaryButton } from "../../Components/CustomComponents/ButtonUi";
import { addCourseAdmissionApplicationService } from "./ApiService";
import { message } from "antd";

const AddCourseAdmissionApplication = ({ getUniversityApi, setOpen, id }) => {
  const [loading, setLoading] = useState(false); // Track API call state
  const [formData, setFormData] = useState({
    course: { value: null, errors: [] },
    suggestedBy: { value: null, errors: [] },
    ApprovedByStudent: { value: null, errors: [] },
    application_status: { value: null, errors: [] },
    eligibility: { value: null, errors: [] },
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

  const addCourseAdmissionApplicationApi = () => {
    const payload = {
      course: formData.course.value,
      suggestedBy: formData.suggestedBy.value,
      ApprovedByStudent: formData.ApprovedByStudent.value,
      application_status: formData.application_status.value,
      eligibility: formData.eligibility.value,
    };
    setLoading(true); // Disable the button
    if (loading) return; // Prevent multiple submissions

    addCourseAdmissionApplicationService(payload, id)
      .then(function (response) {
        if (response.data.success === "1") {
          setOpen(false);
          getUniversityApi();
          setFormData({
            course: { value: null, errors: [] },
            suggestedBy: { value: null, errors: [] },
            ApprovedByStudent: { value: null, errors: [] },
            application_status: { value: null, errors: [] },
            eligibility: { value: null, errors: [] },
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
          addCourseAdmissionApplicationApi();
        }}
        className="w-3/3 space-y-4"
      >
        <FormItem>
          <div className="flex flex-col gap-1">
            <label>
              Course<sup className="text-red-500">*</sup>
            </label>
            <InputWithIcon
              name="course"
              placeholder="Please Enter Course"
              required
              value={formData.course.value}
              errors={formData.course.errors}
              handler={handleInputChange("course")}
            />
          </div>
        </FormItem>

        <FormItem>
          <div className="flex flex-col gap-1">
            <label>
              Suggested By<sup className="text-red-500">*</sup>
            </label>
            <InputWithIcon
              name="suggestedBy"
              placeholder="Please Enter Suggested By"
              required
              value={formData.suggestedBy.value}
              errors={formData.suggestedBy.errors}
              handler={handleInputChange("suggestedBy")}
            />
          </div>
        </FormItem>

        <FormItem>
          <div className="flex flex-col gap-1">
            <label>
              Approved By Student<sup className="text-red-500">*</sup>
            </label>
            <InputWithIcon
              name="ApprovedByStudent"
              placeholder="Please Enter Approved By Student"
              required
              value={formData.ApprovedByStudent.value}
              errors={formData.ApprovedByStudent.errors}
              handler={handleInputChange("ApprovedByStudent")}
            />
          </div>
        </FormItem>

        <FormItem>
          <div className="flex flex-col gap-1">
            <label>
              Application Status<sup className="text-red-500">*</sup>
            </label>
            <InputWithIcon
              name="application_status"
              placeholder="Please Enter Application Status"
              required
              value={formData.application_status.value}
              errors={formData.application_status.errors}
              handler={handleInputChange("application_status")}
            />
          </div>
        </FormItem>

        <FormItem>
          <div className="flex flex-col gap-1">
            <label>
              Eligibility<sup className="text-red-500">*</sup>
            </label>
            <InputWithIcon
              name="eligibility"
              placeholder="Please Enter Eligibility"
              required
              value={formData.eligibility.value}
              errors={formData.eligibility.errors}
              handler={handleInputChange("eligibility")}
            />
          </div>
        </FormItem>

        <PrimaryButton
          type="primary"
          htmlType={"submit"}
          className="p-4"
          title={"Add Course Admission Application"}
          block={false}
          disabled={loading}
        />
      </form>
    </>
  );
};

export default AddCourseAdmissionApplication;
