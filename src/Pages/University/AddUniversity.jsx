import { useState } from "react";
import { FormItem } from "@/Components/Ui/Form";
import {
  CustomSelectInput,
  InputWithIcon,
} from "../../Components/CustomComponents/InputWithIcon";
import { PrimaryButton } from "../../Components/CustomComponents/ButtonUi";
import { addUniversityService } from "./ApiService";
import { message } from "antd";

const AddUniversity = ({ getUniversityApi, setOpen, id }) => {
  const [loading, setLoading] = useState(false); // Track API call state
  const [formData, setFormData] = useState({
    country: { value: null, errors: [] },
    university_category: { value: null, errors: [] },
    university_type: { value: null, errors: [] },
    university_name: { value: null, errors: [] },
    university_link: { value: null, errors: [] },
    campus_location: { value: null, errors: [] },
  });

  // Handle input change for all form fields
  const handleInputChange = (field) => (e) => {
    // const value = e.target ? e.target.value : e;
    let value = e?.target?.value !== undefined ? e.target.value : e;
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
          errors: errors[field] || [],
        };
      });
      return updatedFormData;
    });
  };

  const addUniversityApi = () => {
    const payload = {
      country: formData.country.value,
      university_category: formData.university_category.value,
      university_type: formData.university_type.value,
      university_name: formData.university_name.value,
      university_link: formData.university_link.value,
      campus_location: formData.campus_location.value,
    };
    setLoading(true); // Disable the button
    if (loading) return; // Prevent multiple submissions

    addUniversityService(payload, id)
      .then(function (response) {
        if (response.data.success === "1") {
          setOpen(false);
          getUniversityApi();
          setFormData({
            country: { value: null, errors: [] },
            university_category: { value: null, errors: [] },
            university_type: { value: null, errors: [] },
            university_name: { value: null, errors: [] },
            university_link: { value: null, errors: [] },
            campus_location: { value: null, errors: [] },
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
          addUniversityApi();
        }}
        className="w-3/3 space-y-4"
      >
        <FormItem>
          <div className="flex flex-col gap-1">
            <label>
              Country<sup className="text-red-500">*</sup>
            </label>
            <CustomSelectInput
              name="country"
              placeholder="Please Enter Country"
              value={formData.country.value}
              errors={formData.country.errors}
              handler={handleInputChange("country")}
              options={[
                {
                  value: "germany",
                  label: "Germany",
                },
                {
                  value: "usa",
                  label: "USA",
                },
                {
                  value: "canada",
                  label: "Canada",
                },
                {
                  value: "uk",
                  label: "UK",
                },
              ]}
            />
          </div>
        </FormItem>

        <FormItem>
          <div className="flex flex-col gap-1">
            <label>
              University Category<sup className="text-red-500">*</sup>
            </label>
            <CustomSelectInput
              name="university_category"
              placeholder="Please Enter University Category"
              value={formData.university_category.value}
              errors={formData.university_category.errors}
              handler={handleInputChange("university_category")}
              options={[
                {
                  value: "public",
                  label: "Public",
                },
                {
                  value: "private",
                  label: "Private",
                },
              ]}
            />
          </div>
        </FormItem>

        <FormItem>
          <div className="flex flex-col gap-1">
            <label>
              University Type<sup className="text-red-500">*</sup>
            </label>
            <CustomSelectInput
              name="university_type"
              placeholder="Please Enter University Type"
              value={formData.university_type.value}
              errors={formData.university_type.errors}
              handler={handleInputChange("university_type")}
              options={[
                {
                  value: "research",
                  label: "Research",
                },
                {
                  value: "technical",
                  label: "Technical",
                },
                {
                  value: "applied_sciences",
                  label: "Applied Sciences",
                },
                {
                  value: "comprehensive",
                  label: "Comprehensive",
                },
              ]}
            />
          </div>
        </FormItem>

        <FormItem>
          <div className="flex flex-col gap-1">
            <label>
              University Name<sup className="text-red-500">*</sup>
            </label>
            <InputWithIcon
              name="university_name"
              placeholder="Please Enter University Name"
              required
              value={formData.university_name.value}
              errors={formData.university_name.errors}
              handler={handleInputChange("university_name")}
            />
          </div>
        </FormItem>

        <FormItem>
          <div className="flex flex-col gap-1">
            <label>
              University Link<sup className="text-red-500">*</sup>
            </label>
            <InputWithIcon
              name="university_link"
              placeholder="Please Enter University Link"
              required
              value={formData.university_link.value}
              errors={formData.university_link.errors}
              handler={handleInputChange("university_link")}
            />
          </div>
        </FormItem>

        <FormItem>
          <div className="flex flex-col gap-1">
            <label>
              Campus Location<sup className="text-red-500">*</sup>
            </label>
            <InputWithIcon
              name="campus_location"
              placeholder="Please Enter Campus Location"
              required
              value={formData.campus_location.value}
              errors={formData.campus_location.errors}
              handler={handleInputChange("campus_location")}
            />
          </div>
        </FormItem>

        <PrimaryButton
          type="primary"
          htmlType={"submit"}
          className="p-4"
          title={"Add University"}
          block={false}
          disabled={loading}
        />
      </form>
    </>
  );
};

export default AddUniversity;
