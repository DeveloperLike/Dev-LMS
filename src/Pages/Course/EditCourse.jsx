import { useEffect, useState } from "react";
import { FormItem } from "@/Components/Ui/Form";
import {
  CustomSelectInput,
  InputWithIcon,
} from "../../Components/CustomComponents/InputWithIcon";
import { PrimaryButton } from "../../Components/CustomComponents/ButtonUi";
import {
  editCourseService,
  getCourseDetailService,
  getUniversityDropdownService,
} from "./ApiService";
import { DatePicker, message } from "antd";
import dayjs from "dayjs";
import { CustomTextArea } from "../../Components/CustomComponents/CustomTextArea";

const EditCourse = ({ id, getCourseApi, setEditOpen }) => {
  const [loading, setLoading] = useState(false); // Track API call state
  const [universityDropdown, setUniversityDropdown] = useState([]);
  const [formData, setFormData] = useState({
    university: { value: null, errors: [] },
    intake_session: { value: null, errors: [] },
    year: { value: null, errors: [] },
    course_name: { value: null, errors: [] },
    course_level: { value: null, errors: [] },
    course_link: { value: null, errors: [] },
    majors: { value: null, errors: [] },
    application_fee: { value: null, errors: [] },
    course_fee: { value: null, errors: [] },
    course_duration_months: { value: null, errors: [] },
    english_proficiency_test_requirement: { value: null, errors: [] },
    german_proficiency: { value: null, errors: [] },
    moi_acceptance: { value: null, errors: [] },
    application_start_date: { value: null, errors: [] },
    deadline_date: { value: null, errors: [] },
    deadline_link: { value: null, errors: [] },
    application_mode: { value: null, errors: [] },
    post_requirement: { value: null, errors: [] },
    pre_application_test: { value: null, errors: [] },
    aps_required: { value: null, errors: [] },
    additional_requirement: { value: null, errors: [] },
    sop_guidelines: { value: null, errors: [] },
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

  const editCourseApi = () => {
    const payload = {
      university: formData.university.value,
      intake_session: formData.intake_session.value,
      year: formData.year.value,
      course_name: formData.course_name.value,
      course_level: formData.course_level.value,
      course_link: formData.course_link.value,
      majors: formData.majors.value,
      application_fee: formData.application_fee.value,
      course_fee: formData.course_fee.value,
      course_duration_months: formData.course_duration_months.value,
      english_proficiency_test_requirement:
        formData.english_proficiency_test_requirement.value,
      german_proficiency: formData.german_proficiency.value,
      moi_acceptance: formData.moi_acceptance.value,
      application_start_date: dayjs(
        formData.application_start_date.value
      )?.format("DD-MM-YYYY"),
      deadline_date: dayjs(formData.deadline_date.value)?.format("DD-MM-YYYY"),
      deadline_link: formData.deadline_link.value,
      application_mode: formData.application_mode.value,
      post_requirement: formData.post_requirement.value,
      pre_application_test: formData.pre_application_test.value,
      aps_required: formData.aps_required.value,
      additional_requirement: formData.additional_requirement.value,
      sop_guidelines: formData.sop_guidelines.value,
    };
    setLoading(true); // Disable the button
    if (loading) return; // Prevent multiple submissions

    editCourseService(payload, id)
      .then(function (response) {
        if (response.data.success === "1") {
          setEditOpen(false);
          getCourseApi();
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

  useEffect(() => {
    getCourseDetailService(id).then(function (response) {
      const jsonResponse = response.data.data;
      setFormData({
        university: { value: jsonResponse.university, errors: [] },
        intake_session: { value: jsonResponse.intake_session, errors: [] },
        year: { value: jsonResponse.year, errors: [] },
        course_name: { value: jsonResponse.course_name, errors: [] },
        course_level: { value: jsonResponse.course_level, errors: [] },
        course_link: { value: jsonResponse.course_link, errors: [] },
        majors: { value: jsonResponse.majors, errors: [] },
        application_fee: { value: jsonResponse.application_fee, errors: [] },
        course_fee: { value: jsonResponse.course_fee, errors: [] },
        course_duration_months: {
          value: jsonResponse.course_duration_months,
          errors: [],
        },
        english_proficiency_test_requirement: {
          value: jsonResponse.english_proficiency_test_requirement,
          errors: [],
        },
        german_proficiency: {
          value: jsonResponse.german_proficiency,
          errors: [],
        },
        moi_acceptance: { value: jsonResponse.moi_acceptance, errors: [] },
        application_start_date: {
          value: dayjs(jsonResponse.application_start_date),
          errors: [],
        },
        deadline_date: { value: dayjs(jsonResponse.deadline_date), errors: [] },
        deadline_link: { value: jsonResponse.deadline_link, errors: [] },
        application_mode: { value: jsonResponse.application_mode, errors: [] },
        post_requirement: { value: jsonResponse.post_requirement, errors: [] },
        pre_application_test: {
          value: jsonResponse.pre_application_test,
          errors: [],
        },
        aps_required: { value: jsonResponse.aps_required, errors: [] },
        additional_requirement: {
          value: jsonResponse.additional_requirement,
          errors: [],
        },
        sop_guidelines: { value: jsonResponse.sop_guidelines, errors: [] },
      });
    });

    getUniversityDropdownService().then((response) =>
      setUniversityDropdown(response.data.data)
    );
  }, [id]);

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          editCourseApi();
        }}
        className="w-3/3 space-y-4"
      >
        <FormItem>
          <div className="flex flex-col gap-1">
            <label>
              University<sup className="text-red-500">*</sup>
            </label>
            <CustomSelectInput
              name="university"
              placeholder="Select University"
              className="w-full"
              value={formData.university.value}
              errors={formData.university.errors}
              handler={handleInputChange("university")}
              options={universityDropdown.map((university) => ({
                value: university.id,
                label: university.university_name,
              }))}
            />
          </div>
        </FormItem>

        <FormItem>
          <div className="flex flex-col gap-1">
            <label>
              Intake Session<sup className="text-red-500">*</sup>
            </label>
            <CustomSelectInput
              name="intake_session"
              placeholder="Please Enter Intake Session"
              value={formData.intake_session.value}
              errors={formData.intake_session.errors}
              handler={handleInputChange("intake_session")}
              options={[
                {
                  value: "summer",
                  label: "Summer",
                },
                {
                  value: "winter",
                  label: "Winter",
                },
              ]}
            />
          </div>
        </FormItem>

        <FormItem>
          <div className="flex flex-col gap-1">
            <label>
              Year<sup className="text-red-500">*</sup>
            </label>
            <InputWithIcon
              name="year"
              placeholder="Please Enter Year"
              required
              value={formData.year.value}
              errors={formData.year.errors}
              handler={handleInputChange("year")}
            />
          </div>
        </FormItem>

        <FormItem>
          <div className="flex flex-col gap-1">
            <label>
              Course Name<sup className="text-red-500">*</sup>
            </label>
            <InputWithIcon
              name="course_name"
              placeholder="Please Enter Course Name"
              required
              value={formData.course_name.value}
              errors={formData.course_name.errors}
              handler={handleInputChange("course_name")}
            />
          </div>
        </FormItem>

        <FormItem>
          <div className="flex flex-col gap-1">
            <label>
              Course Level<sup className="text-red-500">*</sup>
            </label>
            <CustomSelectInput
              name="course_level"
              placeholder="Please Enter Course Level"
              value={formData.course_level.value}
              errors={formData.course_level.errors}
              handler={handleInputChange("course_level")}
              options={[
                {
                  value: "phd",
                  label: "PHD",
                },
                {
                  value: "master",
                  label: "Master",
                },
                {
                  value: "bachelor",
                  label: "Bachelor",
                },
                {
                  value: "diploma",
                  label: "Diploma",
                },
              ]}
            />
          </div>
        </FormItem>

        <FormItem>
          <div className="flex flex-col gap-1">
            <label>
              Course Link<sup className="text-red-500">*</sup>
            </label>
            <InputWithIcon
              name="course_link"
              placeholder="Please Enter Course Link"
              required
              value={formData.course_link.value}
              errors={formData.course_link.errors}
              handler={handleInputChange("course_link")}
            />
          </div>
        </FormItem>

        <FormItem>
          <div className="flex flex-col gap-1">
            <label>
              Majors<sup className="text-red-500">*</sup>
            </label>
            <InputWithIcon
              name="majors"
              placeholder="Please Enter Majors"
              required
              value={formData.majors.value}
              errors={formData.majors.errors}
              handler={handleInputChange("majors")}
            />
          </div>
        </FormItem>

        <FormItem>
          <div className="flex flex-col gap-1">
            <label>
              Application Fee<sup className="text-red-500">*</sup>
            </label>
            <InputWithIcon
              name="application_fee"
              placeholder="Please Enter Application Fee"
              required
              value={formData.application_fee.value}
              errors={formData.application_fee.errors}
              handler={handleInputChange("application_fee")}
            />
          </div>
        </FormItem>

        <FormItem>
          <div className="flex flex-col gap-1">
            <label>
              Course Fee<sup className="text-red-500">*</sup>
            </label>
            <InputWithIcon
              name="course_fee"
              placeholder="Please Enter Course Fee"
              required
              value={formData.course_fee.value}
              errors={formData.course_fee.errors}
              handler={handleInputChange("course_fee")}
            />
          </div>
        </FormItem>

        <FormItem>
          <div className="flex flex-col gap-1">
            <label>
              Course Duration Months<sup className="text-red-500">*</sup>
            </label>
            <InputWithIcon
              name="course_duration_months"
              placeholder="Please Enter Course Duration Months"
              required
              value={formData.course_duration_months.value}
              errors={formData.course_duration_months.errors}
              handler={handleInputChange("course_duration_months")}
            />
          </div>
        </FormItem>

        <FormItem>
          <div className="flex flex-col gap-1">
            <label>
              English Proficiency Test Requirement
              <sup className="text-red-500">*</sup>
            </label>
            <InputWithIcon
              name="english_proficiency_test_requirement"
              placeholder="Please Enter English Proficiency Test Requirement"
              required
              value={formData.english_proficiency_test_requirement.value}
              errors={formData.english_proficiency_test_requirement.errors}
              handler={handleInputChange(
                "english_proficiency_test_requirement"
              )}
            />
          </div>
        </FormItem>

        <FormItem>
          <div className="flex flex-col gap-1">
            <label>
              German Proficiency
              <sup className="text-red-500">*</sup>
            </label>
            <InputWithIcon
              name="german_proficiency"
              placeholder="Please Enter German Proficiency"
              required
              value={formData.german_proficiency.value}
              errors={formData.german_proficiency.errors}
              handler={handleInputChange("german_proficiency")}
            />
          </div>
        </FormItem>

        <FormItem>
          <div className="flex flex-col gap-1">
            <label>
              MOI Acceptance
              <sup className="text-red-500">*</sup>
            </label>
            <CustomSelectInput
              name="moi_acceptance"
              placeholder="Select Option"
              className="w-full"
              value={formData.moi_acceptance.value}
              errors={formData.moi_acceptance.errors}
              handler={handleInputChange("moi_acceptance")}
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
              Application Start Date<sup className="text-red-500">*</sup>
            </label>
            <DatePicker
              required={true}
              name={"application_start_date"}
              className="py-2"
              format="DD-MM-YYYY"
              style={{ width: "100%" }}
              value={formData?.application_start_date?.value}
              onChange={handleInputChange("application_start_date")}
              disabledDate={(current) =>
                current && current < dayjs().startOf("day")
              }
            />
            <p className=" text-xs text-red-500">
              {" "}
              {formData?.application_start_date?.errors}
            </p>
          </div>
        </FormItem>

        <FormItem>
          <div className="flex flex-col gap-1">
            <label>
              Deadline Date<sup className="text-red-500">*</sup>
            </label>
            <DatePicker
              required={true}
              name={"deadline_date"}
              className="py-2"
              format="DD-MM-YYYY"
              style={{ width: "100%" }}
              value={formData?.deadline_date?.value}
              onChange={handleInputChange("deadline_date")}
              disabledDate={(current) =>
                current && current < dayjs().startOf("day")
              }
            />
            <p className=" text-xs text-red-500">
              {" "}
              {formData?.deadline_date?.errors}
            </p>
          </div>
        </FormItem>

        <FormItem>
          <div className="flex flex-col gap-1">
            <label>
              Deadline Link
              {/* <sup className="text-red-500">*</sup> */}
            </label>
            <InputWithIcon
              name="deadline_link"
              placeholder="Please Enter Deadline Link"
              required={false}
              value={formData.deadline_link.value}
              errors={formData.deadline_link.errors}
              handler={handleInputChange("deadline_link")}
            />
          </div>
        </FormItem>

        <FormItem>
          <div className="flex flex-col gap-1">
            <label>
              Application Mode
              <sup className="text-red-500">*</sup>
            </label>
            <InputWithIcon
              name="application_mode"
              placeholder="Please Enter Application Mode"
              required
              value={formData.application_mode.value}
              errors={formData.application_mode.errors}
              handler={handleInputChange("application_mode")}
            />
          </div>
        </FormItem>

        <FormItem>
          <div className="flex flex-col gap-1">
            <label>
              Post Requirement
              <sup className="text-red-500">*</sup>
            </label>
            <InputWithIcon
              name="post_requirement"
              placeholder="Please Enter Post Requirement"
              required
              value={formData.post_requirement.value}
              errors={formData.post_requirement.errors}
              handler={handleInputChange("post_requirement")}
            />
          </div>
        </FormItem>

        <FormItem>
          <div className="flex flex-col gap-1">
            <label>
              Pre Application Test
              <sup className="text-red-500">*</sup>
            </label>
            <InputWithIcon
              name="pre_application_test"
              placeholder="Please Enter Pre Application Test"
              required
              value={formData.pre_application_test.value}
              errors={formData.pre_application_test.errors}
              handler={handleInputChange("pre_application_test")}
            />
          </div>
        </FormItem>

        <FormItem>
          <div className="flex flex-col gap-1">
            <label>
              APS Required
              <sup className="text-red-500">*</sup>
            </label>

            <CustomSelectInput
              name="aps_required"
              placeholder="Select Option"
              className="w-full"
              value={formData.aps_required.value}
              errors={formData.aps_required.errors}
              handler={handleInputChange("aps_required")}
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
              Additional Requirement
              <sup className="text-red-500">*</sup>
            </label>
            <CustomTextArea
              name="additional_requirement"
              placeholder="Please Enter Additional Requirement"
              required
              value={formData.additional_requirement.value}
              errors={formData.additional_requirement.errors}
              onChange={handleInputChange("additional_requirement")}
            />
          </div>
        </FormItem>

        <FormItem>
          <div className="flex flex-col gap-1">
            <label>
              SOP Guidelines
              <sup className="text-red-500">*</sup>
            </label>
            <CustomTextArea
              name="sop_guidelines"
              placeholder="Please Enter SOP Guidelines"
              required
              value={formData.sop_guidelines.value}
              errors={formData.sop_guidelines.errors}
              onChange={handleInputChange("sop_guidelines")}
            />
          </div>
        </FormItem>

        <PrimaryButton
          type="primary"
          htmlType={"submit"}
          className="p-4"
          title={"Edit Course"}
          block={false}
          disabled={loading}
        />
      </form>
    </>
  );
};

export default EditCourse;
