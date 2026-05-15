import { useEffect, useState } from "react";
import { FormItem } from "@/Components/Ui/Form";
import { InputWithIcon } from "../../Components/CustomComponents/InputWithIcon";
import { PrimaryButton } from "../../Components/CustomComponents/ButtonUi";
import { useDispatch } from "react-redux";
import { notificationFun } from "../../lib/redux/NotificationSlice";
import {
  editLeadStatusService,
  getLeadStatusDetailService,
} from "./ApiService";
import { message } from "antd";

const EditLeadStatus = ({ id, getLeadStatusApi, setEditOpen }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false); // Track API call state
  const [formData, setFormData] = useState({ name: { value: "", errors: [] } });

  // Handle input changes and update state
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

  const editLeadStatusApi = () => {
    setLoading(true); // Disable the button
    if (loading) return; // Prevent multiple submissions

    const payload = { name: formData.name.value };
    editLeadStatusService(id, payload)
      .then((response) => {
        if (response.data.success === "1") {
          setEditOpen(false);
          getLeadStatusApi();
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

  // Fetch branch data on component mount
  useEffect(() => {
    getLeadStatusDetailService(id).then(function (response) {
      const jsonResponse = response.data.data;
      setFormData({ name: { value: jsonResponse.name, errors: [] } });
    });
  }, [id]);

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          editLeadStatusApi();
          // Submit logic
        }}
        className="w-3/3 space-y-4"
      >
        <FormItem>
          <div className="flex flex-col gap-1">
            <label>
              Lead Status Name<sup className="text-red-500">*</sup>
            </label>
            <InputWithIcon
              name="name"
              type="text"
              placeholder="Please enter lead status name"
              required={true}
              value={formData.name.value}
              errors={formData.name.errors}
              handler={(e) => {
                handleInput(e);
              }}
            />
          </div>
        </FormItem>

        <PrimaryButton
          type="primary"
          htmlType="submit"
          className="p-4 text-black"
          title="Submit"
          block={false}
          disabled={loading} // Disable button if loading
        />
      </form>
    </>
  );
};

export default EditLeadStatus;
