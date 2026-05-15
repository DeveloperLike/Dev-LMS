import React, { useEffect, useState } from "react";
import {
  editStudentCourseApplicationService,
  getDetailsStudentCourseApplicationService,
} from "../ApiService";
import {
  CustomDatePicker,
  CustomSelectInput,
} from "../../../Components/CustomComponents/InputWithIcon";
import { PrimaryButton } from "../../../Components/CustomComponents/ButtonUi";
import { message } from "antd";
import moment from "moment";
import dayjs from "dayjs";

export const ApplyEditCourse = ({
  userName,
  selectedCourse,
  setEditOpen,
  applicationId,
  getListApi,
}) => {
  const [data, setData] = useState();
  const [formData, setFormData] = useState({
    course: { value: selectedCourse, errors: [] },
    deadline: { value: null, errors: [] },
    first_step_deadline: { value: null, errors: [] },
    application_fee_status: { value: null, errors: [] },
    application_start_date: { value: null, errors: [] },
    acceptance_deadline: { value: null, errors: [] },
    offer_received_on: { value: null, errors: [] },
    offer_letter_status: { value: null, errors: [] },
    admission_status: { value: null, errors: [] },
    late_arrival_date: { value: null, errors: [] },
    enrollment_date: { value: null, errors: [] },
    tuition_fee_status: { value: null, errors: [] },
    course_start_date: { value: null, errors: [] },
    application_status: { value: null, errors: [] },
    application_intake: { value: null, errors: [] },
  });

  const handleError = (errors) => {
    setFormData((prevData) => {
      const updatedFormData = {};
      Object.keys(prevData).forEach((field) => {
        updatedFormData[field] = {
          ...prevData[field],
          errors: errors[field] || [],
        };
      });
      return updatedFormData;
    });
  };

  const addUserMappedDocumentApi = () => {
    const payload = {
      course: selectedCourse,
      deadline: formData.deadline.value
        ? moment(formData.deadline.value).format("DD-MM-YYYY")
        : null,
      first_step_deadline: formData.first_step_deadline.value
        ? moment(formData.first_step_deadline.value).format("DD-MM-YYYY")
        : null,
      application_fee_status: formData.application_fee_status.value,
      application_start_date: formData.application_start_date.value
        ? moment(formData.application_start_date.value).format("DD-MM-YYYY")
        : null,
      acceptance_deadline: formData.acceptance_deadline.value
        ? moment(formData.acceptance_deadline.value).format("DD-MM-YYYY")
        : null,
      offer_received_on: formData.offer_received_on.value
        ? moment(formData.offer_received_on.value).format("DD-MM-YYYY")
        : null,
      offer_letter_status: formData.offer_letter_status.value,
      admission_status: formData.admission_status.value,
      late_arrival_date: formData.late_arrival_date.value
        ? moment(formData.late_arrival_date.value).format("DD-MM-YYYY")
        : null,
      enrollment_date: formData.enrollment_date.value
        ? moment(formData.enrollment_date.value).format("DD-MM-YYYY")
        : null,
      tuition_fee_status: formData.tuition_fee_status.value,
      course_start_date: formData.course_start_date.value
        ? moment(formData.course_start_date.value).format("DD-MM-YYYY")
        : null,
      application_status: formData.application_status.value,
      application_intake: formData.application_intake.value,
    };

    editStudentCourseApplicationService(payload, userName, applicationId)
      .then(function (response) {
        if (response.data.success === "1") {
          message.success(response?.data?.message);
          setEditOpen(false);
          getListApi();
        }
      })
      .catch(function (error) {
        if (error) {
          handleError(error?.response?.data?.data);
          message.error(error?.response?.data?.message);
          console.log(error?.response?.data);
        }
      });
  };

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

  const handleDateChange = (field) => (date, dateString) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: {
        ...prevData[field],
        value: date,
      },
      errors: [],
    }));
  };

  // Dropdown choices
  const course_application_status_choices = [
    { value: "not_applied_yet", label: "Not Applied Yet" },
    { value: "1st_step_applied", label: "1st Step Applied" },
    {
      value: "filled_&_pending_for_review",
      label: "Filled & Pending For Review (1st Step)",
    },
    { value: "2nd_review_pending", label: "2nd Review Pending" },
    {
      value: "2nd_review_pending_1st_step",
      label: "2nd Review Pending (1st Step)",
    },
    {
      value: "filled_&pending_for_review",
      label: "Filled & Pending For Review",
    },
    {
      value: "reviewed&document_pending",
      label: "Reviewed & Document Pending",
    },
    { value: "reviewed&fee_pending", label: "Reviewed & Fee Pending" },
    { value: "reviewed&_fee_pending", label: "Reviewed & Fee Pending" },
    { value: "applied", label: "Applied" },
    { value: "cancelled", label: "Cancelled" },
    { value: "dropped_by_student", label: "Dropped by Student" },
  ];

  const application_intake = [
    { value: "summer", label: "Summer" },
    { value: "winter", label: "Winter" },
  ];

  const course_application_fee_status_choices = [
    { value: "paid", label: "Application Fee Paid" },
    { value: "not_paid", label: "Application fee not paid" },
    { value: "not_required", label: "Application Fee Not Required" },
  ];

  const offer_letter_status_choices = [
    { value: "rejected", label: "Offer Rejected By University" },
    {
      value: "unconditional_offer_received",
      label: "Unconditional Offer Received",
    },
    {
      value: "conditional_offer_received",
      label: "Conditional Offer Received",
    },
    {
      value: "university_contract_received",
      label: "University Contract Received",
    },
  ];

  const tuition_fee_status_choices = [
    { value: "one_year_tuition_fee_paid", label: "One Year Tuition Fee Paid" },
    { value: "seat_block_deposit_paid", label: "Seat Block Deposit Paid" },
    { value: "tuition_fee_not_paid", label: "Tuition Fee Not Paid" },
    { value: "tuition_fee_not_required", label: "Tuition Fee Not Required" },
  ];

  const admission_status_choices = [
    { value: "not_applied_yet", label: "Not Applied Yet" },
    { value: "application_in_process", label: "Application In Process" },
    { value: "cancelled", label: "Cancelled" },
    { value: "applied", label: "Applied" },
    { value: "admission_given", label: "Admission Given" },
    { value: "rejected", label: "Rejected" },
    {
      value: "admission_not_accepted_by_student",
      label: "Admission Not Accepted By Student",
    },
    {
      value: "admission_accepted_by_student",
      label: "Admission Accepted By Student",
    },
    { value: "final_admission_accepted", label: "Final Admission Accepted" },
  ];

  useEffect(() => {
    getDetailsStudentCourseApplicationService(userName, applicationId).then(
      (response) => {
        const data = response.data.data;
        setFormData({
          deadline: { value: dayjs(data?.deadline, "DD-MM-YYYY") },
          first_step_deadline: {
            value: dayjs(data?.first_step_deadline, "DD-MM-YYYY"),
          },
          application_fee_status: { value: data?.application_fee_status },
          application_start_date: {
            value: dayjs(data?.application_start_date, "DD-MM-YYYY"),
          },
          acceptance_deadline: {
            value: dayjs(data?.acceptance_deadline, "DD-MM-YYYY"),
          },
          offer_received_on: {
            value: dayjs(data?.offer_received_on, "DD-MM-YYYY"),
          },
          offer_letter_status: { value: data?.offer_letter_status },
          admission_status: { value: data?.admission_status },
          late_arrival_date: {
            value: dayjs(data?.late_arrival_date, "DD-MM-YYYY"),
          },
          enrollment_date: {
            value: dayjs(data?.enrollment_date, "DD-MM-YYYY"),
          },
          tuition_fee_status: { value: data?.tuition_fee_status },
          course_start_date: {
            value: dayjs(data?.course_start_date, "DD-MM-YYYY"),
          },
          application_status: { value: data?.application_status },
          application_intake: { value: data?.application_intake },
        });
      }
    );
  }, []);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        addUserMappedDocumentApi();
      }}
      className="w-3/3 space-y-4"
    >
      <div className="flex flex-col gap-1">
        <label>
          Deadline<sup className="text-red-500">*</sup>
        </label>
        <CustomDatePicker
          name={"deadline"}
          value={formData?.deadline?.value}
          errors={formData?.deadline?.errors}
          onChange={handleDateChange("deadline")}
          required={false}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label>
          First Step Deadline<sup className="text-red-500">*</sup>
        </label>
        <CustomDatePicker
          name={"first_step_deadline"}
          value={formData.first_step_deadline.value}
          errors={formData?.first_step_deadline?.errors}
          onChange={handleDateChange("first_step_deadline")}
          required={false}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label>
          Application Fee Status<sup className="text-red-500">*</sup>
        </label>
        <CustomSelectInput
          name="application_fee_status"
          placeholder="Select application fee status"
          className="w-full"
          value={formData.application_fee_status.value}
          errors={formData.application_fee_status.errors}
          handler={handleInputChange("application_fee_status")}
          options={course_application_fee_status_choices}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label>
          Application Start Date<sup className="text-red-500">*</sup>
        </label>
        <CustomDatePicker
          name={"application_start_date"}
          value={formData.application_start_date.value}
          errors={formData?.application_start_date?.errors}
          onChange={handleDateChange("application_start_date")}
          required={false}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label>
          Acceptance Deadline<sup className="text-red-500">*</sup>
        </label>
        <CustomDatePicker
          name={"acceptance_deadline"}
          value={formData.acceptance_deadline.value}
          errors={formData?.acceptance_deadline?.errors}
          onChange={handleDateChange("acceptance_deadline")}
          required={false}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label>
          Offer Received On<sup className="text-red-500">*</sup>
        </label>
        <CustomDatePicker
          name={"offer_received_on"}
          value={formData.offer_received_on.value}
          errors={formData?.offer_received_on?.errors}
          onChange={handleDateChange("offer_received_on")}
          required={false}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label>
          Offer Letter Status<sup className="text-red-500">*</sup>
        </label>
        <CustomSelectInput
          name="offer_letter_status"
          placeholder="Select offer letter status"
          className="w-full"
          value={formData.offer_letter_status.value}
          errors={formData.offer_letter_status.errors}
          handler={handleInputChange("offer_letter_status")}
          options={offer_letter_status_choices}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label>
          Admission Status<sup className="text-red-500">*</sup>
        </label>
        <CustomSelectInput
          name="admission_status"
          placeholder="Select admission status"
          className="w-full"
          value={formData.admission_status.value}
          errors={formData.admission_status.errors}
          handler={handleInputChange("admission_status")}
          options={admission_status_choices}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label>
          Late Arrival Date<sup className="text-red-500">*</sup>
        </label>
        <CustomDatePicker
          name={"late_arrival_date"}
          value={formData.late_arrival_date.value}
          errors={formData?.late_arrival_date?.errors}
          onChange={handleDateChange("late_arrival_date")}
          required={false}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label>
          Enrollment Date<sup className="text-red-500">*</sup>
        </label>
        <CustomDatePicker
          name={"enrollment_date"}
          value={formData.enrollment_date.value}
          errors={formData?.enrollment_date?.errors}
          onChange={handleDateChange("enrollment_date")}
          required={false}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label>
          Tuition Fee Status<sup className="text-red-500">*</sup>
        </label>
        <CustomSelectInput
          name="tuition_fee_status"
          placeholder="Select tuition fee status"
          className="w-full"
          value={formData.tuition_fee_status.value}
          errors={formData.tuition_fee_status.errors}
          handler={handleInputChange("tuition_fee_status")}
          options={tuition_fee_status_choices}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label>
          Course Start Date<sup className="text-red-500">*</sup>
        </label>
        <CustomDatePicker
          name={"course_start_date"}
          value={formData.course_start_date.value}
          errors={formData?.course_start_date?.errors}
          onChange={handleDateChange("course_start_date")}
          required={false}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label>
          Application Status<sup className="text-red-500">*</sup>
        </label>
        <CustomSelectInput
          name="application_status"
          placeholder="Select application status"
          className="w-full"
          value={formData.application_status.value}
          errors={formData.application_status.errors}
          handler={handleInputChange("application_status")}
          options={course_application_status_choices}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label>
          Application Intake<sup className="text-red-500">*</sup>
        </label>
        <CustomSelectInput
          name="application_intake"
          placeholder="Select application intake"
          className="w-full"
          value={formData.application_intake.value}
          errors={formData.application_intake.errors}
          handler={handleInputChange("application_intake")}
          options={application_intake}
        />
      </div>

      <PrimaryButton
        type="primary"
        htmlType="submit"
        className="p-4"
        title="Save"
        block={false}
      />
    </form>
  );
};
