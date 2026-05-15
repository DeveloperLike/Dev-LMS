import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import { getAnalysisByCityService, getAnalysisBycounsellorsService } from "./ApiService";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Button, DatePicker } from "antd";
import dayjs from "dayjs";
import { CustomModeSelectInput } from "../../Components/CustomComponents/InputWithIcon";
import { getCounsellorDropdown } from "../AssignmentRule/ApiService";

const AnalyticsByCounsellors = () => {
  const [failedLead, setFailedLead] = useState();
  const [counsellors, setCounsellors] = useState(null);
  const [counsellorsLead, setCounsellorsLead] = useState(null);
  const [dateRange, setDateRange] = useState([dayjs(), dayjs()]);
  const [tempDateRange, setTempDateRange] = useState([dayjs(), dayjs()]);
  const [counsellorOption, setCounsellorOption] = useState([]);
  const [counsellor, setCounsellor] = useState([]);
  const [feildError, setFeildError] = useState([]);

  const { RangePicker } = DatePicker;
  const dateFormat = "DD-MM-YYYY";

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

  const handleError = (response) => {
    setFeildError(response);
  };

  const applyDateRange = () => {
    // Prepare the payload in the desired format
    const payload = {
      start_date: dateRange && dateRange[0].format(dateFormat),
      end_date: dateRange && dateRange[1].format(dateFormat),
      counsellors: counsellor,
    };
    setDateRange(tempDateRange);
    getAnalysisBycounsellorsService(payload).then((response) => {
      setFailedLead(response.data.unassigned_leads);
      setCounsellors(
        response.data.data.map((item) => {
          return item.counsellor;
        })
      );
      setCounsellorsLead(
        response.data.data.map((item) => {
          return item.lead;
        })
      );
    });
  };

  useEffect(() => {
    applyDateRange();
    getCounsellorDropdown().then((response) => {
      setCounsellorOption(response.data.data);
    });
  }, [dateRange]);

  const data = {
    labels: counsellors,
    datasets: [
      {
        label: "Lead",
        data: counsellorsLead,
        backgroundColor: "coral",
        fill: false,
        borderColor: "orange",
        tension: 0.4,
      },
    ],
    backgroundColor: "red",
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        anchor: "end",
        align: "top",
        color: "black",
        font: {
          weight: "bold",
        },
        formatter: (value) => value,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Counsellors",
        },
      },
      y: {
        title: {
          display: true,
          text: "Lead",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="mx-6 bg-white p-4">
      <h1 className="mb-2 text-orange-500 uppercase underline">
      Counsellors Analytics:
      </h1>
      <div style={{ height: "350px" }}>
        <Bar data={data} options={options} plugins={[ChartDataLabels]} />
      </div>
    </div>
  );
};

export default AnalyticsByCounsellors;

