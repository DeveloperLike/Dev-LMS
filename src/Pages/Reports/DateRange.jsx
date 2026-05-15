import React from "react";
import { DatePicker } from "antd";
import dayjs from "dayjs";
const DateRange = ({ value, onChange, placeholder = "Select date range" }) => {
  const { RangePicker } = DatePicker;
  const presets = [
    {
      label: "Today",
      value: [dayjs(), dayjs()],
    },
    {
      label: "Yesterday",
      value: [dayjs().subtract(1, "day"), dayjs().subtract(1, "day")],
    },
    {
      label: "Last 7 Days",
      value: [dayjs().subtract(6, "day"), dayjs()],
    },
    {
      label: "Last 30 Days",
      value: [dayjs().subtract(29, "day"), dayjs()],
    },
    {
      label: "This Month",
      value: [dayjs().startOf("month"), dayjs().endOf("month")],
    },
    {
      label: "Last Month",
      value: [
        dayjs().subtract(1, "month").startOf("month"),
        dayjs().subtract(1, "month").endOf("month"),
      ],
    },
  ];
  return (
    <RangePicker
      value={value}
      onChange={onChange}
      format="YYYY-MM-DD"
      placeholder={placeholder}
      presets={presets}
      style={{
        width: "100%",
        borderColor: "#f8d24c",
        borderRadius: "0.5rem",
        padding: "8px 12px",
        fontSize: "1.125rem",
        height: "auto",
      }}
    />
  );
};

export default DateRange;
