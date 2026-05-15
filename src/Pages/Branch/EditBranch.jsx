import { useEffect, useState } from "react";
import { FormItem } from "@/Components/Ui/Form";
import { Form, message } from "antd";
import {
  CustomSelectInput,
  InputWithIcon,
} from "../../Components/CustomComponents/InputWithIcon";
import { PrimaryButton } from "../../Components/CustomComponents/ButtonUi";
import { useDispatch } from "react-redux";
import { notificationFun } from "../../lib/redux/NotificationSlice";
import { editBranchService, getBranchDetailService } from "./ApiService";
import { CustomTextArea } from "../../Components/CustomComponents/CustomTextArea";
import TextArea from "antd/es/input/TextArea";

const EditBranch = ({ id, setEditOpen, branchGetApi }) => {
  const [isSelected, setIsSelected] = useState(false);
  const [loading, setLoading] = useState(false); // Track API call state
  const [formData, setFormData] = useState({
    name: {
      value: "",
      errors: [],
    },
    branch_number: {
      value: "",
      errors: [],
    },
    branch_address: {
      value: "",
      errors: [],
    },
    branch_type: {
      value: "",
      errors: [],
    },
    is_active: {
      value: true,
    },
  });
  const dispatch = useDispatch();

  // Handle input changes and update state
  const handleInput = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: {
        value: e.target.value,
        errors: [],
      },
    });
  };

  const handleSelectInput = (e) => {
    if (e === "franchise") {
      setIsSelected(true);
    } else {
      setIsSelected(false);
    }

    setFormData((prevData) => ({
      ...prevData,
      branch_type: {
        value: e,
        errors: [],
      },
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

  const payload = {
    name: formData.name.value,
    branch_number: formData.branch_number.value,
    branch_address: formData.branch_address.value,
    branch_type: formData.branch_type.value,
    is_active: formData.is_active.value,
  };

  const editBranchApiService = async () => {
    if (loading) return; // Prevent multiple submissions
    setLoading(true); // Start loading state

    try {
      const response = await editBranchService(id, payload);
      if (response.data.success === "1") {
        setEditOpen(false);
        branchGetApi();
        message.success(response.data.message);
      }
    } catch (error) {
      if (error.response.data) {
        handleError(error.response.data.data);
        message.error(error.response.data.message);
      }
    } finally {
      setLoading(false); // End loading state
    }
  };

  // Fetch branch data on component mount
  useEffect(() => {
    getBranchDetailService(id)
      .then(function (response) {
        const jsonResponse = response.data.data;
        setFormData((prevData) => ({
          name: { value: jsonResponse.name },
          branch_number: { value: jsonResponse.branch_number },
          branch_address: { value: jsonResponse.branch_address },
          branch_type: { value: jsonResponse.branch_type },
          is_active: { value: jsonResponse.is_active },
        }));
        // Set `isSelected` conditionally
        setIsSelected(jsonResponse.branch_type === "franchise");
      })
      .catch(function (error) {
        console.error("Error fetching branch details:", error);
      });
  }, [id]);

  return (
    <>
      <Form
        layout="vertical"
        onFinish={editBranchApiService}
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
            errors={formData.branch_type.errors}
            placeholder="Please select branch type"
            options={[
              {
                value: "self_own",
                label: "Self Owned",
              },
              {
                value: "franchise",
                label: "Franchise",
              },
            ]}
            handler={(e) => {
              handleSelectInput(e);
            }}
          />
        </FormItem>
        {/* Branch Type */}

        {isSelected && (
          <>
            <>
              {/* Contact Number (only for franchise) */}
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
          </>
        )}

        <PrimaryButton
          type="primary"
          htmlType="submit"
          className="p-5 text-black"
          title="Submit"
          block={false}
          disabled={loading} // Disable button if loading
        />
      </Form>
      {/* </form> */}
    </>
  );
};

export default EditBranch;
