import React, { useEffect, useState } from "react";
import { Table, DatePicker, Button, Grid } from "antd";
import dayjs from "dayjs";
import { getCounsellorDropdown } from "../AssignmentRule/ApiService";
import { getLeadStatusDropdownService } from "./ApiService";

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

export const StatusWiseLead = () => {
  const [failedLead, setFailedLead] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [statusLead, setStatusLead] = useState([]);
  const [loading, setLoading] = useState(false);

  const [dateRange, setDateRange] = useState([dayjs(), dayjs()]);
  const [tempDateRange, setTempDateRange] = useState([dayjs(), dayjs()]);
  const { useBreakPoint } = Grid;
  const screens = useBreakPoint;

  const fetchData = () => {
    setLoading(true);

    const payload = {
      start_date: dateRange[0].format(dateFormat),
      end_date: dateRange[1].format(dateFormat),
    };

    Promise.all([
      getLeadStatusDropdownService(payload),
      getCounsellorDropdown(),
    ])
      .then(([statusResponse, counsellorResponse]) => {
        if (statusResponse.data && statusResponse.data.data) {
          const transformedData = statusResponse.data.data.map((item) => {
            const newItem = {
              key: item.email,
              email: item.email,
              count: item.count,
            };
            if (item.status && Array.isArray(item.status)) {
              item.status.forEach((status) => {
                newItem[`status_${status.name.replace(/ /g, "_")}`] =
                  status.count;
              });
            }
            return newItem;
          });
          setDataSource(transformedData);
          setStatusLead(statusResponse.data.data[0]?.status || []);
        } else {
          setDataSource([]);
          setStatusLead([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setDataSource([]);
        setStatusLead([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const applyDateRange = () => {
    setDateRange(tempDateRange);
  };

  const columns = [
    {
      title: "Lead Owner",
      dataIndex: "email",
      key: "email",
      fixed: screens?.md ? "left" : false,
      width: "10%",
      minWidth:"200px",
      render: (text) => <p className="font-medium">{text}</p>,
    },
    {
      title: "Total",
      dataIndex: "count",
      key: "count",
      render: (text) => <p className="font-medium">{text}</p>,
    },
    ...statusLead.map((status) => ({
      title: status.name,
      dataIndex: `status_${status?.name?.replace(/ /g, "_")}`,
      key: `status_${status?.name?.replace(/ /g, "_")}`,
      render: (text) => <p className="font-medium">{text || 0}</p>,
    })),
  ];

  return (
    <div className="px-6 py-3 bg-white m-6">
      <div className="flex justify-between items-center mb-4">
        <p className="text-black">Failed Lead: {failedLead}</p>

        <div className="flex gap-3">
          <RangePicker
            size="medium"
            format={dateFormat}
            value={tempDateRange}
            presets={rangePresets}
            onChange={(v) => setTempDateRange(v)}
          />
          <Button type="primary" onClick={applyDateRange}>
            Apply
          </Button>
        </div>
      </div>

      <Table
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        size="middle"
        scroll={{ x: "calc(700px + 200%)", y: 47 * 5 }}
      />
    </div>
  );
};
