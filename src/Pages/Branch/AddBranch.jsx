import { useRef, useState } from "react";
import { FormItem } from "@/Components/Ui/Form";
import {
  CustomSelectInput,
  InputWithIcon,
} from "../../Components/CustomComponents/InputWithIcon";
import { PrimaryButton } from "../../Components/CustomComponents/ButtonUi";
import { useDispatch } from "react-redux";
import { notificationFun } from "../../lib/redux/NotificationSlice";
import { addBranchService } from "./ApiService";
import { Form, Input, message } from "antd";
import TextArea from "antd/es/input/TextArea";

const AddBranch = ({ branchGetApi, setOpen }) => {
  const [loading, setLoading] = useState(false); // Track API call state
  const [formData, setFormData] = useState({
    name: { value: "", errors: [] },
    branch_number: { value: null, errors: [] },
    branch_address: { value: null, errors: [] },
    branch_type: { value: "self_own" },
    is_active: { value: true },
  });

  const dispatch = useDispatch();

  const handleInput = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: { value: e.target.value, errors: [] },
    });
  };

  const handleSelectInput = (e) => {
    setFormData({
      ...formData,
      branch_type: {
        value: e,
      },
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

  // add branch data here
  const payload = {
    name: formData.name.value,
    branch_number: formData.branch_number.value,
    branch_address: formData.branch_address.value,
    branch_type: formData.branch_type.value,
    is_active: formData.is_active.value,
  };

  // reset form fields after submit
  const resetForm = () => {
    setFormData({
      name: { value: "", errors: [] },
      branch_number: { value: null, errors: [] },
      branch_address: { value: null, errors: [] },
      branch_type: { value: "self_own" },
      is_active: { value: true },
    });
  };

  const callCreateBranchApiService = () => {
    if (loading) return; // Prevent multiple submissions
    setLoading(true); // Disable the button

    addBranchService(payload)
      .then((response) => {
        if (response.data.success === "1") {
          resetForm();
          setOpen(false);
          branchGetApi();
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
      <Form
        layout="vertical"
        onFinish={callCreateBranchApiService}
        className="w-3/3 space-y-4"
      >
        {/* Branch Name */}
        <FormItem>
          <label className="block">
            Branch Name<sup className="text-red-500">*</sup>
          </label>
          <InputWithIcon
            name="name"
            required={true}
            maxLength={35}
            value={formData.name.value}
            errors={formData.name.errors}
            placeholder="Please enter branch name"
            handler={(e) => handleInput(e)}
          />
        </FormItem>
        {/* Branch Name */}

        {/* Branch Type */}
        <FormItem>
          <label className="block">
            Branch Type<sup className="text-red-500">*</sup>
          </label>
          <CustomSelectInput
            className="w-full min-w-[300px]"
            value={formData.branch_type.value}
            options={[
              { value: "self_own", label: "Self Owned" },
              { value: "franchise", label: "Franchise" },
            ]}
            handler={(e) => handleSelectInput(e)}
          />
        </FormItem>
        {/* Branch Type */}

        {/* Contact Number (only for franchise) */}
        {formData.branch_type.value === "franchise" && (
          <>
            <FormItem>
              <label>
                {" "}
                Branch Contact Number<sup className="text-red-500">*</sup>
              </label>
              <InputWithIcon
                name="branch_number"
                type={"number"}
                required={true}
                maxLength={35}
                value={formData.branch_number.value}
                errors={formData.branch_number.errors}
                placeholder="Please enter branch contact number"
                handler={(e) => handleInput(e)}
              />
            </FormItem>
            {/* Contact Number (only for franchise) */}

            {/* Branch Address */}
            <FormItem>
              <div className="flex flex-col gap-1">
                <label>
                  Branch Address<sup className="text-red-500">*</sup>
                </label>
                <TextArea
                  name="branch_address"
                  rows={4}
                  maxLength={250}
                  required={true}
                  value={formData.branch_address.value}
                  type="text"
                  placeholder="Please enter branch address"
                  onChange={(e) => handleInput(e)}
                />
                {formData.branch_address.errors &&
                  formData.branch_address.errors.map((err, index) => {
                    return (
                      <p key={index} className="mt-1 text-sm text-red-500">
                        {err}
                      </p>
                    );
                  })}
              </div>
            </FormItem>
            {/* Branch Address */}
          </>
        )}

        {/* Submit Button */}
        <PrimaryButton
          type="primary"
          htmlType="submit"
          className="p-5 text-black"
          title="Add Branch"
          block={false}
          disabled={loading} // Disable button if loading
        />
        {/* Submit Button */}
      </Form>
    </>
  );
};

export default AddBranch;
