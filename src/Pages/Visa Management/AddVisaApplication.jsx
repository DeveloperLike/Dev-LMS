import { useState } from "react";
import { FormItem } from "@/Components/Ui/Form";
import { InputWithIcon } from "../../Components/CustomComponents/InputWithIcon";
import { PrimaryButton } from "../../Components/CustomComponents/ButtonUi";
import { addVisaApplicationService } from "./ApiService";
import { DatePicker, message } from "antd";
import dayjs from "dayjs";

const AddVisaApplication = ({ getVisaApplicationApi, setOpen, userData }) => {
  const [loading, setLoading] = useState(false); // Track API call state
  const [formData, setFormData] = useState({
    application_id: { value: null, errors: [] },
    visa_id: { value: null, errors: [] },
    vfs_region: { value: null, errors: [] },
    ba_status: { value: null, errors: [] },
    ba_company: { value: null, errors: [] },
    visa_document_status: { value: null, errors: [] },
    visa_file_status: { value: null, errors: [] },
    visa_waitlisted_on: { value: null, errors: [] },
    visa_appointment_date: { value: null, errors: [] },
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

  // add lead status data here
  const addVisaApplicationApi = () => {
    const payload = {
      application_id: formData.application_id.value,
      visa_id: formData.visa_id.value,
      vfs_region: formData.vfs_region.value,
      ba_status: formData.ba_status.value,
      ba_company: formData.ba_company.value,
      visa_document_status: formData.visa_document_status.value,
      visa_file_status: formData.visa_file_status.value,
      visa_waitlisted_on: dayjs(formData.visa_waitlisted_on.value).format(
        "DD-MM-YYYY"
      ),      visa_appointment_date: dayjs(formData.visa_appointment_date.value).format(
        "DD-MM-YYYY"
      ),
    };
    setLoading(true); // Disable the button
    if (loading) return; // Prevent multiple submissions

    addVisaApplicationService(payload, userData)
      .then(function (response) {
        if (response.data.success === "1") {
          setOpen(false);
          getVisaApplicationApi();
          setFormData({
            application_id: { value: null, errors: [] },
            visa_id: { value: null, errors: [] },
            vfs_region: { value: null, errors: [] },
            ba_status: { value: null, errors: [] },
            ba_company: { value: null, errors: [] },
            visa_document_status: { value: null, errors: [] },
            visa_file_status: { value: null, errors: [] },
            visa_waitlisted_on: { value: null, errors: [] },
            visa_appointment_date: { value: null, errors: [] },
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
          addVisaApplicationApi();
        }}
        className="w-3/3 space-y-4"
      >
        <FormItem>
          <div className="flex flex-col gap-1">
            <label>
              Application Id<sup className="text-red-500">*</sup>
            </label>
            <InputWithIcon
              name="application_id"
              placeholder="Please Enter Application Id"
              required
              value={formData.application_id.value}
              errors={formData.application_id.errors}
              handler={handleInputChange("application_id")}
            />
          </div>
        </FormItem>

        <FormItem>
          <div className="flex flex-col gap-1">
            <label>
              Visa Id<sup className="text-red-500">*</sup>
            </label>
            <InputWithIcon
              name="visa_id"
              placeholder="Please Enter Visa Id"
              required
              value={formData.visa_id.value}
              errors={formData.visa_id.errors}
              handler={handleInputChange("visa_id")}
            />
          </div>
        </FormItem>

        <FormItem>
          <div className="flex flex-col gap-1">
            <label>
              VFS Region<sup className="text-red-500">*</sup>
            </label>
            <InputWithIcon
              name="vfs_region"
              placeholder="Please Enter VFS Region"
              required
              value={formData.vfs_region.value}
              errors={formData.vfs_region.errors}
              handler={handleInputChange("vfs_region")}
            />
          </div>
        </FormItem>

        <FormItem>
          <div className="flex flex-col gap-1">
            <label>
              BA Status<sup className="text-red-500">*</sup>
            </label>
            <InputWithIcon
              name="ba_status"
              placeholder="Please Enter BA Status"
              required
              value={formData.ba_status.value}
              errors={formData.ba_status.errors}
              handler={handleInputChange("ba_status")}
            />
          </div>
        </FormItem>

        <FormItem>
          <div className="flex flex-col gap-1">
            <label>
              BA Company<sup className="text-red-500">*</sup>
            </label>
            <InputWithIcon
              name="ba_company"
              placeholder="Please Enter BA Company"
              required
              value={formData.ba_company.value}
              errors={formData.ba_company.errors}
              handler={handleInputChange("ba_company")}
            />
          </div>
        </FormItem>

        <FormItem>
          <div className="flex flex-col gap-1">
            <label>
              Visa Document Status<sup className="text-red-500">*</sup>
            </label>
            <InputWithIcon
              name="visa_document_status"
              placeholder="Please Enter Visa Document Status"
              required
              value={formData.visa_document_status.value}
              errors={formData.visa_document_status.errors}
              handler={handleInputChange("visa_document_status")}
            />
          </div>
        </FormItem>

        <FormItem>
          <div className="flex flex-col gap-1">
            <label>
              Visa File Status<sup className="text-red-500">*</sup>
            </label>
            <InputWithIcon
              name="visa_file_status"
              placeholder="Please Enter Visa File Status"
              required
              value={formData.visa_file_status.value}
              errors={formData.visa_file_status.errors}
              handler={handleInputChange("visa_file_status")}
            />
          </div>
        </FormItem>

        <FormItem>
          <div className="flex flex-col gap-1">
            <label>
              Visa Waitlisted On<sup className="text-red-500">*</sup>
            </label>
            <DatePicker
              required={true}
              name={"visa_waitlisted_on"}
              className="py-2"
              format="DD-MM-YYYY"
              style={{ width: "100%" }}
              value={formData.visa_waitlisted_on.value}
              onChange={handleInputChange("visa_waitlisted_on")}
              disabledDate={(current) =>
                current && current < dayjs().startOf("day")
              }
            />
            <p className=" text-xs text-red-500">
              {" "}
              {formData.visa_waitlisted_on.errors}
            </p>
          </div>
        </FormItem>

        <FormItem>
          <div className="flex flex-col gap-1">
            <label>
              Visa Appointment Date<sup className="text-red-500">*</sup>
            </label>
            <DatePicker
              required={true}
              name={"visa_appointment_date"}
              className="py-2"
              format="DD-MM-YYYY"
              style={{ width: "100%" }}
              value={formData.visa_appointment_date.value}
              onChange={handleInputChange("visa_appointment_date")}
              disabledDate={(current) =>
                current && current < dayjs().startOf("day")
              }
            />
            <p className=" text-xs text-red-500">
              {" "}
              {formData.visa_appointment_date.errors}
            </p>
          </div>
        </FormItem>

        <PrimaryButton
          type="primary"
          htmlType={"submit"}
          className="p-4"
          title={"Add Visa Application"}
          block={false}
          disabled={loading}
        />
      </form>
    </>
  );
};

export default AddVisaApplication;
