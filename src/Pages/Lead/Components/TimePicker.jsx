import React from "react";
import { TimePicker } from "antd";
import dayjs from "dayjs";

const CustomTimerPicker = ({
  value,
  onChange,
  disabledTime,
}) => {
  const dayjsValue  = value ? dayjs(value, "HH:mm A") : null;

  return (
    <TimePicker
      required
      format="hh:mm A"
      size="large"
      // defaultOpenValue={dayjs("00:00", "HH:mm")}
      onChange={onChange}
      value={dayjsValue }
      disabledTime={disabledTime}
    />
  );
};

export { CustomTimerPicker };
