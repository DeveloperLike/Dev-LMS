import { useState } from "react";
import { FormItem } from "@/Components/Ui/Form";
import { InputWithIcon } from "../../Components/CustomComponents/InputWithIcon";
import { PrimaryButton } from "../../Components/CustomComponents/ButtonUi";
import { useDispatch } from "react-redux";
import { notificationFun } from "../../lib/redux/NotificationSlice";
import { addStateListService } from "./ApiService";
import { message } from "antd";

const AddState = ({ stateGetApi, setOpen }) => {
  const [loading, setLoading] = useState(false); // Track API call state
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: {
      value: "",
      errors: [],
    },
  });

  const handleInput = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: { value: e.target.value, errors: [] },
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
  const postStateService = () => {
    if (loading) return; // Prevent multiple submissions
    setLoading(true); // Disable the button

    const payload = { name: formData.name.value };
    addStateListService(payload)
      .then((response) => {
        if (response.data.success === "1") {
          setFormData({
            name: { value: "", errors: [] },
          });
          setOpen(false);
          stateGetApi();
          message.success(response.data.message);
        }
      })
      .catch((error) => {
        if (error) {
          handleError(error.response.data.data);
          message.error(error.response.data.message);
        }
      })
      .finally(() => setLoading(false)); // Re-enable the button
  };

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          postStateService();
        }}
        className="w-3/3 space-y-4"
      >
        <FormItem>
          <div className="flex flex-col gap-1">
            <label>
              State Name<sup className="text-red-500">*</sup>
            </label>
            <InputWithIcon
              name="name"
              required
              maxLength={35}
              value={formData.name.value}
              errors={formData.name.errors}
              type="text"
              placeholder="Please enter state name"
              handler={(e) => {
                handleInput(e);
              }}
            />
          </div>
        </FormItem>

        <PrimaryButton
          type="primary"
          htmlType={"submit"}
          className="p-4 text-black"
          title={"Add State"}
          block={false}
          disabled={loading} // Disable button if loading
        />
      </form>
    </>
  );
};

export default AddState;
