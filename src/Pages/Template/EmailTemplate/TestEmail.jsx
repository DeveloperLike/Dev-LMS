import React, { useEffect, useState } from "react";
import FormItem from "antd/es/form/FormItem";
import { InputWithIcon } from "../../../Components/CustomComponents/InputWithIcon";
import { PrimaryButton } from "../../../Components/CustomComponents/ButtonUi";
import { useDispatch } from "react-redux";
import { notificationFun } from "../../../lib/redux/NotificationSlice";
import TextArea from "antd/es/input/TextArea";
import {
  editEmailTemplatedDetailService,
  testEmailTemplateService,
} from "./ApiService";
import { message } from "antd";

const TestEmail = ({ id, setTestOpen }) => {
  const [loading, setLoading] = useState(false);
  const [body, setBody] = useState();
  const [formData, setFormData] = useState({
    email: { value: "", errors: [] },
  });

  const dispatch = useDispatch();

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: { value: value, errors: [] },
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

  let payload = { email: formData.email.value };

  const smsTestApi = () => {
    if (loading) return;
    setLoading(true);

    testEmailTemplateService(payload, id)
      .then((response) => {
        if (response.data.success === "1") {
          setTestOpen(false);
          setFormData({ email: { value: "", errors: [] } });
          message.success(response?.data?.message);
        }
      })
      .catch((error) => {
        if (error) {
          handleError(error.response.data.data);
          message.error(error?.response?.data?.message);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    editEmailTemplatedDetailService(id).then((response) => {
      const emailData = response.data.data;
      setBody(emailData.body);
    });
  }, [id]);

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          smsTestApi();
        }}
        className="w-3/3 space-y-4"
      >
        {/* <FormItem>
          <div className="flex flex-col gap-1">
            <label>
              Preview<sup className="text-red-500">*</sup>
            </label>
            <div
              className="border rounded-lg p-4 bg-slate-100"
              dangerouslySetInnerHTML={{ __html: body }}
            ></div>
          </div>
        </FormItem> */}

        <FormItem>
          <div className="flex flex-col gap-1">
            <label>
              Email<sup className="text-red-500">*</sup>
            </label>
            <InputWithIcon
              name="email"
              type={"email"}
              placeholder="Please enter email id"
              required={true}
              value={formData.email.value}
              errors={formData.email.errors}
              handler={handleInput}
            />
          </div>
        </FormItem>

        <PrimaryButton
          type="primary"
          htmlType="submit"
          className="p-5 mt-5"
          title="Send Test Message"
          block={false}
          disabled={loading}
        />
      </form>
    </>
  );
};

export default TestEmail;
