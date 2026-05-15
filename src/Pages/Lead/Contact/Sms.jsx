import React, { useEffect, useState } from "react";
import { PrimaryButton } from "../../../Components/CustomComponents/ButtonUi";
import { getSmsTemplateListservice } from "../../Template/ApiService";
import { Card, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import { PostSmsActivityService } from "../ApiService";
import { notificationFun } from "../../../lib/redux/NotificationSlice";
import { useDispatch, useSelector } from "react-redux";

const Sms = ({ setOpenSms, record, smsId }) => {
  const [smsData, setSmsData] = useState();
  const [smsPreview, setSmsPreview] = useState(null);
  const dispatch = useDispatch();
  const leadModulePermission = useSelector(
    (state) => state.permissions.permissionsData
  );
  // console.log(smsId,'isSelected')
  const payload = {
    "lead": smsId,
    "description": smsPreview,
    "user": leadModulePermission.username,
    "purpose": "Sms Template"
  }

  const handleSubmit = () => {
    // Function to make the API call
    PostSmsActivityService(payload)
      .then((response) => {
        dispatch(
          notificationFun({
            message: "Success",
            description: "Lead field added successfully",
            messageType: "success",
          })
        );
        setOpenSms(false);
      })
      .catch((error) => {
        console.error("Error:", error.response ? error.response.data : error);
      });
  };

  const getSmsApi = () => {
    getSmsTemplateListservice().then((response) => {
      setSmsData(response.data.data);
    });
  };

  const handleSelectChange = (value) => {
    const selectedTemplate = smsData.find((option) => option.name === value);
    if (selectedTemplate) {
      setSmsPreview(selectedTemplate.body);
    }
  };

  useEffect(() => {
    getSmsApi();
  }, []);

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="w-3/3 space-y-4"
      >
        <div className="flex-1 flex flex-col gap-1 mt-3 mb-5">
          <label> Select Sms Template </label>

          <Select
            onChange={handleSelectChange}
            size="large"
            style={{ width: "100%" }}
            placeholder="Select"
          >
            {smsData &&
              smsData.map((option) => (
                <Select.Option key={option.id} value={option.name}>
                  {option.name}
                </Select.Option>
              ))}
          </Select>
        </div>

        {smsPreview && (
          <>
            <div className="flex-1 flex flex-col gap-1 mt-3 mb-5">
              <label> Preview </label>
              <TextArea disabled={true} value={smsPreview}></TextArea>
            </div>
          </>
        )}

        <PrimaryButton
          type="primary"
          htmlType="submit"
          className="p-4"
          title="Send Sms"
          block={false}
        />
      </form>
    </>
  );
};

export default Sms;
