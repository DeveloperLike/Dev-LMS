import FormItem from "antd/es/form/FormItem";
import React, { useEffect, useState } from "react";
import {
  CustomSelectInput,
  InputWithIcon,
} from "../../../Components/CustomComponents/InputWithIcon";
import { PrimaryButton } from "../../../Components/CustomComponents/ButtonUi";
import { Select } from "antd";
import { getEmailTemplateListService } from "../../Template/ApiService";

const Email = ({ setOpenEmail, record }) => {
  const [emailTemplateDropdown, setEmailTemplateDropdown] = useState([]);
  const [emailPreview, setEmailPreview] = useState(null);

  const handleSubmit = () => {
    setOpenEmail(false);
  };
  const handleSelectChange = (value) => {
    const selectedTemplate = emailTemplateDropdown.find(
      (option) => option.name === value
    );
    if (selectedTemplate) {
      setEmailPreview(selectedTemplate.body);
    }
  };

  async function fetchEmailTemplateData() {
    const response = await getEmailTemplateListService();
    setEmailTemplateDropdown(response.data.data);
  }

  useEffect(() => {
    fetchEmailTemplateData();
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
        <FormItem>
          <div className="flex flex-col gap-1">
            <label> Select Email Template</label>

            <Select
              onChange={handleSelectChange}
              size="large"
              style={{ width: "100%" }}
              placeholder="Select"
              options={emailTemplateDropdown.map((item) => ({
                value: item.id,
                label: item.name,
              }))}
            />
          </div>
        </FormItem>

        <FormItem>
          <div className="flex flex-col gap-1">
            <label>
              Subject<sup className="text-red-500">*</sup>
            </label>
            <InputWithIcon
              name=""
              className=""
              type="text"
              placeholder="Subject"
              // handler={(e) => handleInput(e)}
            />
          </div>
        </FormItem>

        {emailPreview && (
          <>
            <div className="flex-1 flex flex-col gap-1 mt-3 mb-5">
              <label> Preview </label>
              <TextArea disabled={true} value={emailPreview}></TextArea>
            </div>
          </>
        )}

        <PrimaryButton
          type="primary"
          htmlType="submit"
          className="p-4"
          title="Send Email"
          block={false}
        />
      </form>
    </>
  );
};

export default Email;
