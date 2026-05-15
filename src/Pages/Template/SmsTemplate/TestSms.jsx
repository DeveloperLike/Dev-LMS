import React, { useEffect, useState } from "react";
import FormItem from "antd/es/form/FormItem";
import { InputWithIcon } from "../../../Components/CustomComponents/InputWithIcon";
import { PrimaryButton } from "../../../Components/CustomComponents/ButtonUi";
import { useDispatch } from "react-redux";
import { notificationFun } from "../../../lib/redux/NotificationSlice";
import TextArea from "antd/es/input/TextArea";
import {
  getSmsTemplatedDetailService,
  testSmsTemplateService,
} from "../ApiService";
import { message } from "antd";

const TestSms = ({ id, setTestOpen, getSmsApi }) => {
  const [loading, setLoading] = useState(false); // Track API call state
  const [body, setBody] = useState();
  const [formData, setFormData] = useState({
    phone: { value: "", errors: [] },
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

  let payload = { phone: formData.phone.value };

  const smsTestApi = () => {
    if (loading) return; // Prevent multiple submissions
    setLoading(true); // Disable the button

    testSmsTemplateService(payload, id)
      .then((response) => {
        if (response.data.success === "1") {
          setTestOpen(false);
          getSmsApi();
          setFormData({ phone: { value: "", errors: [] } });
          message.success(response?.data?.message);
        }
      })
      .catch((error) => {
        if (error) {
          handleError(error.response.data.data);
          message.error(error?.response?.data?.message);
        }
      })
      .finally(() => setLoading(false)); // Re-enable the button
  };

  useEffect(() => {
    getSmsTemplatedDetailService(id).then((response) => {
      const smsData = response.data.data;
      setBody(smsData.body);
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
        <FormItem>
          <div className="flex flex-col gap-1">
            <label>
              Preview<sup className="text-red-500">*</sup>
            </label>
            <TextArea
              name="body"
              placeholder="Please enter text"
              disabled
              value={body}
              autoSize={{ minRows: 3, maxRows: 5 }}
            />
          </div>
        </FormItem>

        <FormItem>
          <div className="flex flex-col gap-1">
            <label>
              Phone Number<sup className="text-red-500">*</sup>
            </label>
            <InputWithIcon
              name="phone"
              type={"number"}
              placeholder="Please enter phone number"
              required={true}
              maxLength={10}
              value={formData.phone.value}
              errors={formData.phone.errors}
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
          disabled={loading} // Disable button if loading
        />
      </form>
    </>
  );
};

export default TestSms;
