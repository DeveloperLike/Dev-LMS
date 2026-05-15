import React, { useEffect, useState } from "react";
import { Form, Select, Row, Col, Radio } from "antd";
import { InputWithIcon } from "../../../Components/CustomComponents/InputWithIcon";
import { DatepeakerComponent } from "./DatePicker";
import { getCityDropdownService } from "../../City/ApiService";

export default function TabChildComponent({ moreinfoData, readOnly = true }) {
  const [cityOptions, setCityOptions] = useState([]);

  // getting data from city dropdown
  const getCityDropdownApi = () => {
    getCityDropdownService().then((response) => {
      setCityOptions(response.data.data);
    });
  };

  useEffect(() => {
    getCityDropdownApi();
  }, []);

  return (
    <div className="pt-4" >
    <Row gutter={[16, 16]} className="mb-4">
      {moreinfoData &&
        moreinfoData.map((field, index) => (
          <React.Fragment key={field.code}>
            <Col span={12}>
              <Form.Item
                className="mb-1"
                name={field.code}
                label={field.label}
                rules={[{ required: field.is_required }]}
                initialValue={field.value}
              >
                {field.type === "select" ? (
                  <>
                    <Select
                      size="large"
                      placeholder={`Select ${field.label}`}
                      defaultValue={field.value}
                      disabled
                    >
                      {field.options.length > 0 ? (
                        field.options.map((option, i) => (
                          <Option key={i} value={option}>
                            {option}
                          </Option>
                        ))
                      ) : (
                        <Option disabled>No options available</Option>
                      )}
                    </Select>
                    <p className="text-slate-500 text-xs text-light">
                      {field.help_text}
                    </p>
                  </>
                ) : field.type === "text" || field.type === "number" ? (
                  <>
                    <InputWithIcon
                      name={field.code}
                      type="text"
                      placeholder={field.placeholder || field.label}
                      value={field.value}
                      disabled={true}
                    />
                    <p className="text-slate-500 text-xs text-light">
                      {field.help_text}
                    </p>
                  </>
                ) : field.type === "radio" ? (
                  <Radio.Group name={field.code} defaultValue={field.value} disabled={true} >
                    {field.options.length > 0 ? (
                      field.options.map((option, i) => (
                        <Radio key={i} value={option}>
                          {option}
                        </Radio>
                      ))
                    ) : (
                      <Radio>No options available</Radio>
                    )}
                  </Radio.Group>
                ) : field.type === "date" ? (
                  <>
                    <DatepeakerComponent date={field.value} disabled={true} />
                    <p className="text-slate-500 text-xs text-light">
                      {field.help_text}
                    </p>
                  </>
                ) : field.type === "city" || field.type === "state" ? (
                  <>
                    <Select size="large" disabled>
                      {cityOptions.length > 0 ? (
                        cityOptions.map((option, index) => (
                          <Option key={index} value={option.id}>
                            {option.name}
                          </Option>
                        ))
                      ) : (
                        <Option disabled>No options selected</Option>
                      )}
                    </Select>
                    <p className="text-slate-500 text-xs text-light">
                      {field.help_text}
                    </p>
                  </>
                ) : null}
              </Form.Item>
            </Col>
          </React.Fragment>
        ))}
    </Row>
    </div>
  );
}
