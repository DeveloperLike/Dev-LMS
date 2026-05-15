import React from "react";
import { Input } from "antd";

const { TextArea } = Input;
const CustomTextArea = ({
  value,
  onChange,
  errors = [],
  name,
  className,
  placeholder,
}) => (
  <div>
    {/* <label htmlFor="comment"> Comments</label> */}
    {/* <sup className="text-red-500">*</sup> */}
    <TextArea
      id="comment"
      rows={4}
      placeholder={placeholder}
      maxLength={500}
      value={value}
      onChange={onChange}
      required={true}
      name={name}
      className={className}
    />
    {errors.length > 0
      ? errors.map((err, index) => {
          return (
            <p key={index} className="mt-1 text-sm text-red-500">
              {err}
            </p>
          );
        })
      : ""}
  </div>
);

export { CustomTextArea };
