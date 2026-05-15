import React from "react";
import { Select } from "antd";

const { Option } = Select;

const SelectInput = ({
  options = [],
  mode = "single", // "single" or "multiple"
  placeholder = "Select option",
  value,
  onChange,
  ...props
}) => {
  return (
    <Select
      mode={mode === "multiple" ? "multiple" : undefined}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="custom-select w-100"
      size="large"  
      allowClear
      optionFilterProp="label"
      getPopupContainer={(triggerNode) => triggerNode.parentNode}
      {...props}
    >
      {options.map((opt, idx) => (
        <Option key={idx} value={opt.value} label={opt.label}>
          {opt.label}
        </Option>
      ))}
    </Select>
  );
};

export default SelectInput;
