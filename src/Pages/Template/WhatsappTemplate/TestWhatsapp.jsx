import React, { useState, useEffect } from "react";
import FormItem from "antd/es/form/FormItem";
import { InputWithIcon } from "../../../Components/CustomComponents/InputWithIcon";
import { PrimaryButton } from "../../../Components/CustomComponents/ButtonUi";
import { useDispatch } from "react-redux";
import { notificationFun } from "../../../lib/redux/NotificationSlice";
import TextArea from "antd/es/input/TextArea";
import {
  getWhatsappTemplateDetailService,
  testWhatsappTemplateService,
} from "../ApiService";
import { message } from "antd";

const TestWhatsapp = ({ id, setTestOpen, getWhatsappApi }) => {
  const [loading, setLoading] = useState(false); // Track API call state
  const [body, setBody] = useState();
  const [formData, setFormData] = useState({
    phone: { value: "", errors: [] },
  });

  const dispatch = useDispatch();

  const handleInput = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: { value: e.target.value, errors: [] },
    });
  };

  let payload = { phone: formData.phone.value };

  const whatsappTestApi = () => {
    if (loading) return; // Prevent multiple submissions
    setLoading(true); // Disable the button

    testWhatsappTemplateService(payload, id)
      .then((response) => {
        if (response.data.success === "1") {
          setTestOpen(false);
          getWhatsappApi();
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
    getWhatsappTemplateDetailService(id).then((response) => {
      const whatsappData = response.data.data;
      setBody(whatsappData.body);
    });
  }, [id]);

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          whatsappTestApi();
        }}
        className="w-3/3 space-y-6"
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
          title="Submit"
          block={false}
          disabled={loading} // Disable button if loading
        />
      </form>
    </>
  );
};

export default TestWhatsapp;
