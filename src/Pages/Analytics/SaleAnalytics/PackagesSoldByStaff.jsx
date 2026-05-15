import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { getSalesPackagesAnalyticsService } from "../ApiService";
import { DatePicker, Button } from "antd";
import dayjs from "dayjs";

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
    label: "Last 30 Days",
    value: [dayjs().subtract(30, "d"), dayjs()],
  },
];

const PackagesSoldByStaff = () => {
  const [staffNames, setStaffNames] = useState([]);
  const [packageCounts, setPackageCounts] = useState([]);
  const [dateRange, setDateRange] = useState([dayjs(), dayjs()]);
  const [tempDateRange, setTempDateRange] = useState([dayjs(), dayjs()]);

  const fetchData = () => {
    const payload = {
      start_date: dateRange[0].format(dateFormat),
      end_date: dateRange[1].format(dateFormat),
    };

    getSalesPackagesAnalyticsService(payload).then((response) => {
      if (response.data && response.data.data) {
        setStaffNames(response.data.data.map((item) => item.staff));
        setPackageCounts(response.data.data.map((item) => item.package_count));
      }
    });
  };

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const applyDateRange = () => {
    setDateRange(tempDateRange);
  };

  const data = {
    labels: staffNames,
    datasets: [
      {
        label: "Package Count",
        data: packageCounts,
        backgroundColor: "coral",
        borderColor: "orange",
        tension: 0.4,
      },
    ],
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
          text: "Staff Email",
        },
      },
      y: {
        title: {
          display: true,
          text: "Package Count",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="mx-6 bg-white p-4">
      <h1 className="mb-2 text-orange-500 uppercase underline">
        Sales Analytics by Staff:
      </h1>

      <div className="mb-4 flex justify-end gap-3">
        <RangePicker
          size="medium"
          format={dateFormat}
          onChange={(v) => setTempDateRange(v)}
          presets={rangePresets}
          value={tempDateRange}
        />
        <Button type="primary" onClick={applyDateRange}>
          Apply
        </Button>
      </div>

      <div style={{ height: "350px" }}>
        <Bar data={data} options={options} plugins={[ChartDataLabels]} />
      </div>
    </div>
  );
};

export default PackagesSoldByStaff;
