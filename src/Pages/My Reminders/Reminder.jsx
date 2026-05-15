import React, { useState } from "react";
import { TbListDetails } from "react-icons/tb";
import { Button, Card, DatePicker, Drawer, Tabs } from "antd";
import { FaRegCircleCheck } from "react-icons/fa6";
import { MdCallMissedOutgoing } from "react-icons/md";
import { FaCalendarAlt } from "react-icons/fa";
import AllReminder from "./Components/AllReminder";
import dayjs from "dayjs";
import moment from "moment";
import CompletedReminder from "./Components/CompletedReminder";
import PendingReminder from "./Components/PendingReminder";
const Followup = ({ mode }) => {
  const [dateRange, setDateRange] = useState([dayjs(), dayjs()]);
  const [tempDateRange, setTempDateRange] = useState([dayjs(), dayjs()]);

  const { RangePicker } = DatePicker;
  const dateFormat = "DD-MM-YYYY";

  const column = [
    {
      key: "1",
      label: "All",
      children: <AllReminder dateRange={dateRange} dateFormat={dateFormat} mode={mode} />,
      icon: <TbListDetails className="inline-block" mode={mode} />,
    },
    {
      key: "2",
      label: "Completed",
      children: (
        <CompletedReminder dateRange={dateRange} dateFormat={dateFormat} mode={mode} />
      ),
      icon: <FaRegCircleCheck className="inline-block" mode={mode}/>,
    },
    {
      key: "3",
      label: "Overdue",
      children: (
        <PendingReminder dateRange={dateRange} dateFormat={dateFormat} mode={mode} />
      ),
      icon: <MdCallMissedOutgoing className="inline-block " mode={mode} />,
    },
  ];

  const rangePresets = [
    {
      label: "Today",
      value: [dayjs(), dayjs()],
    },
    {
      label: "Yesterday",
      value: [dayjs().subtract(1, "d"), dayjs().subtract(1, "d")],
    },
    {
      label: "Last 7 Days",
      value: [dayjs().subtract(7, "d"), dayjs()],
    },
    {
      label: "Last 14 Days",
      value: [dayjs().subtract(14, "d"), dayjs()],
    },
    {
      label: "Last 30 Days",
      value: [dayjs().subtract(30, "d"), dayjs()],
    },
    {
      label: "Last 60 Days",
      value: [dayjs().subtract(60, "d"), dayjs()],
    },
    {
      label: "Last 90 Days",
      value: [dayjs().subtract(90, "d"), dayjs()],
    },
  ];
  const applyDateRange = () => {
    setDateRange(tempDateRange);
  };

  return (
    <>
      <div className="mx-5 pb-8 bg-white px-4 relative bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
        <div className="md:absolute pt-2 md:pt-0 right-4 top-2 z-10">
          <RangePicker
            format={dateFormat}
            onChange={(v) => setTempDateRange(v)}
            presets={rangePresets}
            value={tempDateRange && [tempDateRange[0], tempDateRange[1]]}
          />
          <Button onClick={applyDateRange} type="primary" className={`${mode === "dark" ?
            "text-yellow-500 border-yellow-500 hover:text-white" : "text-black"} ml-4 dark:hover:bg-yellow-500 dark:bg-meta-4`}>
            Apply
          </Button>
        </div>
        <Tabs
          className="md:mt-4 p-0"
          defaultActiveKey="1"
          items={column.map((item) => ({
            key: item.key,
            label: item.label,
            children: item.children,
            icon: item.icon,
          }))}
        />
      </div>
    </>
  );
};

export default Followup;
