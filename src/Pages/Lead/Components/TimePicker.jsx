import React from "react";
import { TimePicker } from "antd";
import dayjs from "dayjs";

const CustomTimerPicker = ({
  value,
  onChange,
  disabledTime,
  className = "",
}) => {

  const dayjsValue = value
    ? dayjs(value, "HH:mm A")
    : null;

  return (
    <TimePicker
      required
      format="hh:mm A"
      size="large"
      onChange={onChange}
      value={dayjsValue}
      disabledTime={disabledTime}
      className={className}
    />
  );
};

export { CustomTimerPicker };