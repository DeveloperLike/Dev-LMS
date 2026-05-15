import React from "react";
import { Select } from "antd";
import { Input, DatePicker } from "antd";

export const InputWithIcon = ({
  name,
  type,
  value,
  className,
  handler,
  maxLength = 70,
  placeholder,
  required = true,
  disabled = false,
  errors = [],
  mode,
  ...props
}) => {
  // console.log(errors, "errors");
  return (
    <>
      <Input
        size="small"
        type={type}
        name={name}
        maxLength={maxLength}
        value={value}
        onChange={handler}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        {...props}
        className={`
            ${errors.length > 0 ? "border-[#ef4444] " : " "
          } focus:border-orange-500 p-2 focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white
                    ${className}`}
      />
      {errors?.length > 0
        ? errors.map((err, index) => {
          return (
            <p key={index} className=" text-sm text-red-500">
              {err}
            </p>
          );
        })
        : ""}
    </>
  );
};

// password input

export const InputPassword = ({
  name,
  type,
  value,
  className,
  handler,
  placeholder,
  errors = [],
  required = true,
  mde,
  ...props
}) => {
  // console.log(errors.length, errors);
  return (
    <>
      <Input.Password
        size="small"
        autoComplete="new-password"
        name={name}
        type={type}
        value={value}
        onChange={handler}
        placeholder={placeholder}
        required={required}
        {...props}
        className={`
${errors.length > 0 ? "border-[#ef4444] " : " "
          } focus:border-orange-500 p-2 focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white
    ${className}`}
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
    </>
  );
};

// disabled input feild
export const DisabledButton = ({ name, type, value }) => {
  return (
    <>
      <Input size="large" disabled name={name} type={type} value={value} />
    </>
  );
};

export const CustomSelectInput = ({
  name,
  value,
  defaultValue,
  options,
  className,
  handler,
  errors = [],
  placeholder,
  required,
  size = "large",
  ...props
}) => {
  // console.log(errors, "errors");
  return (
    <>
      <Select
        mode={props.mode}
        defaultValue={defaultValue}
        placeholder={<span className="text-sm">{placeholder}</span>}
        value={value}
        size={size}
        className={className}
        name={name}
        onChange={handler}
        {...props}
        options={options}
        showSearch
        filterOption={(input, option) => {
          const label = option?.label;
          return typeof label === 'string' && label.toLowerCase().includes(input.toLowerCase());
        }}
      // filterOption={(input, option) =>
      //   (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
      // }
      />
      {errors?.length > 0
        ? errors.map((err, index) => {
          return (
            <p key={index} className="mt-1 text-sm text-red-500">
              {err}
            </p>
          );
        })
        : ""}
    </>
  );
};

export const CustomModeSelectInput = ({
  name,
  value,
  defaultValue,
  options,
  className,
  handler,
  errors = [],
  placeholder,
  required,
  size = "large",
  showSearch,
  ...props
}) => {
  // console.log(errors, "errors");
  return (
    <>
      <Select
        mode="multiple"
        defaultValue={defaultValue}
        value={value}
        size={size}
        className={className}
        name={name}
        onChange={handler}
        placeholder={<span className="text-sm">{placeholder}</span>}
        {...props}
        options={options}
        tokenSeparators={[","]}
        showSearch={showSearch}
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
    </>
  );
};

export const CustomDatePicker = ({
  name,
  value,
  className,
  required = true,
  onChange,
  disabled,
  disabledDate,
  errors = [],
  mode,
  ...props
}) => {
  return (
    <>
      <DatePicker
        required={required}
        name={name}
        className="py-2"
        format="DD-MM-YYYY"
        size="large"
        value={value}
        onChange={onChange}
        disabled={disabled}
        disabledDate={disabledDate}
        {...props}
      />
      {errors?.length > 0
        ? errors.map((err, index) => {
          return (
            <p key={index} className="mt-1 text-sm text-red-500">
              {err}
            </p>
          );
        })
        : ""}
    </>
  );
};
