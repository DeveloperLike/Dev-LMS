import { DatePicker } from "antd";
import React, { useEffect, useState } from "react";
import moment from "moment";

const DatepeakerComponent = ({ date, disabled, onChange }) => {
  const [currentDate, setCurrentDate] = useState("");

  const dateDefault = date !== "" ? date : "03-11-2019";
  // const dateFormatted = new Date(dateDefault).toISOString().split('T')[0];

  useEffect(() => {
    setCurrentDate(dateDefault);
  }, [date]);

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setCurrentDate(selectedDate);
    if (onChange) {
      onChange(selectedDate);
    }
  };

  return (
    // <input
    //   className='w-full border-solid border-2 border-slate rounded-md p-[4px]'
    //   disabled={disabled}
    //   type='date'
    //   value={currentDate}
    //   onChange={handleDateChange}
    // />
    <DatePicker
      className="py-2"
      value={currentDate ? moment(currentDate) : null}
      format="DD-MM-YYYY"
      style={{ width: "100%" }}
      onOk={handleDateChange}
    />
  );
};

export { DatepeakerComponent };


