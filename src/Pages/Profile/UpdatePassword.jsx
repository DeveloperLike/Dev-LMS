import { Card, message } from "antd";
import React, { useState } from "react";
import { PrimaryButton } from "../../Components/CustomComponents/ButtonUi";
import { InputPassword } from "../../Components/CustomComponents/InputWithIcon";
import { useDispatch } from "react-redux";
import { UpdatePasswordService } from "./ApiService";
import { notificationFun } from "../../lib/redux/NotificationSlice";

export const UpdatePassword = ({ mode }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    old_password: { value: null, errors: [] },
    new_password: { value: null, errors: [] },
    confirm_password: { value: null, errors: [] },
  });

  const dispatch = useDispatch();

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
  const payload = {
    old_password: formData.old_password.value,
    new_password: formData.new_password.value,
    confirm_password: formData.confirm_password.value,
  };

  // reset form fields after submit
  const resetForm = () => {
    setFormData({
      old_password: { value: null, errors: [] },
      new_password: { value: null, errors: [] },
      confirm_password: { value: null, errors: [] },
    });
  };

  const submitUpdatePassword = (e) => {
    e.preventDefault();

    if (loading) return;
    setLoading(true);
    // console.log(payload);

    // Call the API to update the password
    UpdatePasswordService(payload)
      .then((response) => {
        if (response.data.success === "1") {
          resetForm();
          message.success(response?.data?.message);
        }
      })
      .catch(function (error) {
        if (error) {
          handleError(error.response.data.data);
          message.error(error?.response?.data?.message);
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <form onSubmit={submitUpdatePassword}>

      <InputPassword
        type={"password"}
        name={"old_password"}
        placeholder={"Enter Your Current Password"}
        handler={(e) => handleInput(e)}
        errors={formData.old_password.errors}
        value={formData.old_password.value}
        className="
              bg-white
              dark:bg-slate-800
              text-gray-800
              dark:text-white
              border
              border-gray-300
              dark:border-slate-600
              placeholder-gray-400
              dark:placeholder-gray-400
            "
      />
      <div className="md:flex gap-3">
        <InputPassword
          type={"password"}
          name={"new_password"}
          placeholder={"Enter New Password"}
          handler={(e) => handleInput(e)}
          errors={formData.new_password.errors}
          value={formData.new_password.value}
          className="
                bg-white
                dark:bg-slate-800
                text-gray-800
                dark:text-white
                border
                border-gray-300
                dark:border-slate-600
                placeholder-gray-400
                dark:placeholder-gray-400
                mt-4
              "
        />

        <InputPassword
          type={"password"}
          name={"confirm_password"}
          placeholder={"Confirm New Password"}
          handler={(e) => handleInput(e)}
          errors={formData.confirm_password.errors}
          value={formData.confirm_password.value}
          className="
                bg-white
                dark:bg-slate-800
                text-gray-800
                dark:text-white
                border
                border-gray-300
                dark:border-slate-600
                placeholder-gray-400
                dark:placeholder-gray-400
                mt-4
              "
        />
      </div>

      <PrimaryButton
        className="dark:border-yellow-500 hover:text-white text-black mt-5 px-5 py-4 mt-4"
        title={"Submit"}
        type={"primary"}
        htmlType={"submit"}
      />
    </form>
  );
};
