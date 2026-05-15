import React, { useEffect, useRef, useState } from "react";
import { Button, Card, DatePicker, Grid, Input, Space } from "antd";
import { IoCallOutline } from "react-icons/io5";
import LoadSkeleton from "../../../Components/CustomComponents/Skeleton";
import { useNavigate } from "react-router-dom";
import { getCallReportService, getUserDropdown } from "../ApiService";
import { MdPhone } from "react-icons/md";
import { HiPhoneIncoming } from "react-icons/hi";
import { HiPhoneOutgoing } from "react-icons/hi";
import { MdPhoneMissed } from "react-icons/md";
import { TfiHeadphoneAlt } from "react-icons/tfi";
import { RxLapTimer } from "react-icons/rx";
import { MdPhoneInTalk } from "react-icons/md";
import { HiPhoneMissedCall } from "react-icons/hi";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  CustomModeSelectInput,
  CustomSelectInput,
} from "../../../Components/CustomComponents/InputWithIcon";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { PAGESIZE } from "../../../lib/Constants";
import TableWithPagination from "../../../Components/CustomComponents/Table";
import { SearchOutlined } from "@ant-design/icons";
import { getCounsellorDropdown } from "../../AssignmentRule/ApiService";

const CallReport = ({ mode }) => {
  const [pageSize, setPageSize] = useState(PAGESIZE);

  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [counsellorDropdown, setCounsellorDropdown] = useState([]);
  const [counsellor, setCounsellor] = useState([]);

  const [dashboardData, setDashboardData] = useState({});
  const [calllReportData, setCallReportData] = useState([]);
  const [userDropdown, setUserDropdown] = useState([]);
  const [user, setUser] = useState();
  const [dateRange, setDateRange] = useState([dayjs(), dayjs()]);
  const [tempDateRange, setTempDateRange] = useState([dayjs(), dayjs()]);
  const [page, setPage] = useState(1);
  const [data, setData] = useState({});
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchState, setSearchState] = useState({});
  const searchInput = useRef(null);

  const navigate = useNavigate();
  const { RangePicker } = DatePicker;
  const dateFormat = "DD-MM-YYYY";
  const modulePermission = useSelector(
    (state) => state.permissions.permissionsData
  );
  const { useBreakPoint } = Grid;
  const screens = useBreakPoint;

  const GetDashboardApi = () => {
    setTableLoading(true);

    getCallReportService({
      current_page_number: page,
      count_per_page: pageSize,

      user: counsellor?.length ? counsellor[0] : null,

      start_date:
        !dateRange || dateRange.length !== 2
          ? null
          : dateRange[0].format(dateFormat),

      end_date:
        !dateRange || dateRange.length !== 2
          ? null
          : dateRange[1].format(dateFormat),
    })

      .then((response) => {
        setData(response.data);
        setDashboardData(response.data.dashboard_data);
        setCallReportData(response.data.data);
      })
      .finally(() => {
        setTableLoading(false);
      });
  };


  useEffect(() => {
    console.log(tempDateRange)
  }, [tempDateRange])

  const doughnutChartData = {
    labels: ["Total Calls", "Inbound Calls", "Outbound Calls"],
    datasets: [
      {
        label: "Calls",
        data: [
          dashboardData?.total_calls,
          dashboardData?.inbound_calls,
          dashboardData?.outbound_calls,
        ],
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
        ],
        hoverOffset: 4,
      },
    ],
  };


  useEffect(() => {
    getCounsellorDropdown().then((response) => {
      setCounsellorDropdown(response.data.data);
    });
  }, []);


  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Total calls: ${dashboardData?.total_calls}`,
      },
    },
  };

  const barChartData = {
    labels: [
      "Total Calls",
      "Connected Calls",
      "Not Connected Calls",
      "Missed Calls",
      "Inbound Calls",
      "Outbound Calls",
    ],
    datasets: [
      {
        label: "Call Count",
        maxBarThickness: 40,
        data: [
          dashboardData?.total_calls,
          dashboardData?.connected_calls,
          dashboardData?.not_connected_calls,
          dashboardData?.missed_calls,
          dashboardData?.inbound_calls,
          dashboardData?.outbound_calls,
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(255, 159, 64, 0.6)",
          "rgba(255, 205, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(201, 203, 207, 0.6)",
        ],
        borderColor: [
          "rgb(255, 99, 132)",
          "rgb(255, 159, 64)",
          "rgb(255, 205, 86)",
          "rgb(75, 192, 192)",
          "rgb(54, 162, 235)",
          "rgb(153, 102, 255)",
          "rgb(201, 203, 207)",
        ],
        borderWidth: 1,
      },
    ],
  };

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

  // Handle sorting and search
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    let key = dataIndex;
    let value = selectedKeys[0];
    setSearchState({
      ...searchState,
      [key]: value,
    });
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    confirm();
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    filterDropdownProps: {
      onOpenChange: (visible) => {
        if (visible) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <div
          style={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
        >
          {text}
        </div>
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: "User Mail Id",
      dataIndex: "email",
      key: "email",
      minWidth: "150px",
      ...getColumnSearchProps("email"),
      render: (text, record) => <>{text}</>,
    },
    // {
    //   title: "Manager",
    //   dataIndex: "manager",
    //   key: "manager",
    //   minWidth: "150px",
    //   render: (text, record) => <>{text}</>,
    // },
    {
      title: "Unique Dialed Count",
      dataIndex: "unique_dial_counts",
      key: "unique_dial_counts",
      align: "center",
      minWidth: "170px",
      render: (text, record) => <>{text}</>,
    },
    {
      title: "Total Calls",
      dataIndex: "total_calls",
      key: "total_calls",
      align: "center",
      minWidth: "100px",
      render: (text, record) => <>{text}</>,
    },
    {
      title: "Outbound Calls",
      dataIndex: "outbound_calls",
      key: "outbound_calls",
      align: "center",
      minWidth: "140px",
      render: (text, record) => <>{text}</>,
    },
    {
      title: "Inbound Calls",
      dataIndex: "inbound_calls",
      key: "inbound_calls",
      align: "center",
      minWidth: "130px",
      render: (text, record) => <>{text}</>,
    },
    {
      title: "Connected Calls",
      dataIndex: "connected_calls",
      key: "connected_calls",
      align: "center",
      minWidth: "140px",
      render: (text, record) => <>{text}</>,
    },
    {
      title: "Not Connected Calls",
      dataIndex: "not_connected_calls",
      key: "not_connected_calls",
      align: "center",
      minWidth: "170px",
      render: (text, record) => <>{text}</>,
    },
    {
      title: "Missed Calls",
      dataIndex: "missed_calls",
      key: "missed_calls",
      align: "center",
      minWidth: "110px",
      render: (text, record) => <>{text}</>,
    },
    {
      title: "Call Time",
      dataIndex: "call_time",
      key: "call_time",
      align: "center",
      minWidth: "100px",
      render: (text, record) => <>{text}</>,
    },
    {
      title: "Talk Time",
      dataIndex: "talk_time",
      key: "talk_time",
      align: "center",
      minWidth: "100px",
      render: (text, record) => <>{text}</>,
    },
  ];

  useEffect(() => {
    setCallReportData([]);
    setDashboardData({});
    GetDashboardApi();

    getUserDropdown().then((response) => {
      setUserDropdown(response.data.data);
    });
  }, [user, dateRange, pageSize, page]);

  const CardWrapper = ({ children, loading, className }) => {
    return (
      <Card className={`relative overflow-hidden ${className}`}>

        {loading && (
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent blur-sm opacity-80 animate-shimmer" />
          </div>
        )}

        <div className={`${loading ? "blur-sm opacity-60" : ""} transition-all duration-500`}>
          {children}
        </div>

      </Card>
    );
  };

  return (
    <>
      <div className="mx-6 mb-3">
        <div className="md:flex justify-between w-full items-center">
          <div className="w-fit mb-5">
            <h1 className={` ${mode === "dark" ? "text-yellow-500" : "text-black"} text-xl font-semibold `}>
              Call Analytics
            </h1>
          </div>
          <div className="flex flex-wrap gap-3 items-center">
            {modulePermission.user_group !== "staff" && (
              <CustomModeSelectInput
                className="min-w-[200px] max-w-[200px]"
                name="counsellor"
                mode="multiple"
                size="medium"
                onChange={(e) => {
                  setCounsellor(e);
                  setPage(1);
                }}
                placeholder="Select Counsellor"
                tokenSeparators={[","]}
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={counsellorDropdown.map((item) => ({
                  value: item.username,
                  label: item.email,
                }))}
              />

            )}
            <div className="md:flex gap-1">
              <RangePicker
                format={dateFormat}
                onChange={(v) => setTempDateRange(v)}
                presets={rangePresets}
                value={tempDateRange && [tempDateRange[0], tempDateRange[1]]}
              />
              <Button
                className={` ${mode === "dark" ? "text-yellow-500 border-yellow-500 hover:text-white" : "text-black"} dark:hover:bg-yellow-500 dark:bg-meta-4 ml-4`}
                onClick={() => setDateRange(tempDateRange)}
                type="primary"
              >
                Apply
              </Button>
            </div>

            <button
              onClick={() => navigate("/package")}
              className={`underline block ${mode === "dark" ? "text-white" : "text-black"}`}
            >
              Back
            </button>
          </div>
        </div>
      </div>
      {dashboardData === null ? (
        <LoadSkeleton />
      ) : (
        <>
          <div className="mx-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5">
              {/* Total Calls CardWrapper */}
              <CardWrapper
                loading={tableLoading}
                className={`relative overflow-hidden w-full cursor-pointer flex justify-center shadow-md ${mode === "dark" ? "bg-gray-800 border-gray-700" : "bg-white"}`}
              >
                <MdPhone size={27} className={`mx-auto w-fit ${mode === "dark" ? "text-gray-300" : "text-gray-700"}`} />
                <div className={`font-semibold mx-auto w-fit ${mode === "dark" ? "text-white" : "text-gray-900"}`}>
                  {dashboardData?.total_calls}
                </div>
                <div className={`font-light justify-self-center ${mode === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  Total Calls
                </div>
              </CardWrapper>

              {/* Unique Dial Counts CardWrapper */}
              <CardWrapper
                loading={tableLoading}
                className={`relative overflow-hidden w-full cursor-pointer flex justify-center shadow-md ${mode === "dark" ? "bg-gray-800 border-gray-700" : "bg-white"}`}
              >
                <IoCallOutline size={27} className={`mx-auto w-fit ${mode === "dark" ? "text-gray-300" : "text-gray-700"}`} />
                <div className={`font-semibold mx-auto w-fit ${mode === "dark" ? "text-white" : "text-gray-900"}`}>
                  {dashboardData?.unique_dial_counts}
                </div>
                <div className={`font-light justify-self-center ${mode === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  Unique Dial Counts
                </div>
              </CardWrapper>

              {/* Inbound Calls CardWrapper */}
              <CardWrapper
                loading={tableLoading}
                className={`relative overflow-hidden w-full cursor-pointer flex justify-center shadow-md ${mode === "dark" ? "bg-gray-800 border-gray-700" : "bg-white"}`}
              >
                <HiPhoneIncoming size={27} className={`mx-auto w-fit ${mode === "dark" ? "text-gray-300" : "text-gray-700"}`} />
                <div className={`font-semibold mx-auto w-fit ${mode === "dark" ? "text-white" : "text-gray-900"}`}>
                  {dashboardData?.inbound_calls}
                </div>
                <div className={`font-light justify-self-center ${mode === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  Inbound Calls
                </div>
              </CardWrapper>

              {/* Outbound Calls CardWrapper */}
              <CardWrapper
                loading={tableLoading}
                className={`relative overflow-hidden w-full cursor-pointer flex justify-center shadow-md ${mode === "dark" ? "bg-gray-800 border-gray-700" : "bg-white"}`}
              >
                <HiPhoneOutgoing size={27} className={`mx-auto w-fit ${mode === "dark" ? "text-gray-300" : "text-gray-700"}`} />
                <div className={`font-semibold mx-auto w-fit ${mode === "dark" ? "text-white" : "text-gray-900"}`}>
                  {dashboardData?.outbound_calls}
                </div>
                <div className={`font-light justify-self-center ${mode === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  Outbound Calls
                </div>
              </CardWrapper>

              {/* Connected Calls CardWrapper */}
              <CardWrapper
                loading={tableLoading}
                className={`relative overflow-hidden w-full cursor-pointer flex justify-center shadow-md ${mode === "dark" ? "bg-gray-800 border-gray-700" : "bg-white"}`}
              >
                <MdPhoneInTalk size={27} className={`mx-auto w-fit ${mode === "dark" ? "text-gray-300" : "text-gray-700"}`} />
                <div className={`font-semibold mx-auto w-fit ${mode === "dark" ? "text-white" : "text-gray-900"}`}>
                  {dashboardData?.connected_calls}
                </div>
                <div className={`font-light justify-self-center ${mode === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  Connected Calls
                </div>
              </CardWrapper>

              {/* Not Connected Calls CardWrapper */}
              <CardWrapper
                loading={tableLoading}
                className={`relative overflow-hidden w-full cursor-pointer flex justify-center shadow-md ${mode === "dark" ? "bg-gray-800 border-gray-700" : "bg-white"}`}
              >
                <HiPhoneMissedCall size={27} className={`mx-auto w-fit ${mode === "dark" ? "text-gray-300" : "text-gray-700"}`} />
                <div className={`font-semibold mx-auto w-fit ${mode === "dark" ? "text-white" : "text-gray-900"}`}>
                  {dashboardData?.not_connected_calls}
                </div>
                <div className={`font-light justify-self-center w-[max-content] ${mode === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  Not Connected Calls
                </div>
              </CardWrapper>

              {/* Missed Calls CardWrapper */}
              <CardWrapper
                loading={tableLoading}
                className={`relative overflow-hidden w-full cursor-pointer flex justify-center shadow-md ${mode === "dark" ? "bg-gray-800 border-gray-700" : "bg-white"}`}
              >
                <MdPhoneMissed size={27} className={`mx-auto w-fit ${mode === "dark" ? "text-gray-300" : "text-gray-700"}`} />
                <div className={`font-semibold mx-auto w-fit ${mode === "dark" ? "text-white" : "text-gray-900"}`}>
                  {dashboardData?.missed_calls}
                </div>
                <div className={`font-light justify-self-center ${mode === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  Missed Calls
                </div>
              </CardWrapper>

              {/* Talk Time CardWrapper */}
              <CardWrapper
                loading={tableLoading}
                className={`relative overflow-hidden w-full cursor-pointer flex justify-center shadow-md ${mode === "dark" ? "bg-gray-800 border-gray-700" : "bg-white"}`}
              >
                <TfiHeadphoneAlt size={27} className={`mx-auto w-fit ${mode === "dark" ? "text-gray-300" : "text-gray-700"}`} />
                <div className={`font-semibold mx-auto w-fit ${mode === "dark" ? "text-white" : "text-gray-900"}`}>
                  {dashboardData?.total_talk_time}
                </div>
                <div className={`font-light justify-self-center ${mode === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  Talk Time
                </div>
              </CardWrapper>

              {/* Call Time CardWrapper */}
              <CardWrapper
                loading={tableLoading}
                className={`relative overflow-hidden w-full cursor-pointer flex justify-center shadow-md ${mode === "dark" ? "bg-gray-800 border-gray-700" : "bg-white"}`}
              >
                <RxLapTimer size={27} className={`mx-auto w-fit ${mode === "dark" ? "text-gray-300" : "text-gray-700"}`} />
                <div className={`font-semibold mx-auto w-fit ${mode === "dark" ? "text-white" : "text-gray-900"}`}>
                  {dashboardData?.duration}
                </div>
                <div className={`font-light justify-self-center ${mode === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  Call Time
                </div>
              </CardWrapper>
            </div>
            {/* <div className="bg-white w-full p-4  mb-5">
              <div className="w-fit mb-5">
                <h1 className="text-lg text-black font-semibold ">
                  Call Insights
                </h1>
              </div>
              <div className="md:flex justify-between items-center gap-5">
                <div style={{ height: "350px" }} className="flex-auto">
                  <Doughnut
                    data={doughnutChartData}
                    options={doughnutOptions}
                  />
                </div>
                <div style={{ height: "360px" }} className="flex-auto">
                  <Bar data={barChartData} />
                </div>
              </div>
            </div> */}
          </div>
          <TableWithPagination
            rowKey={(record) => record.email}
            loading={tableLoading}
            pageSize={pageSize}
            setPageSize={setPageSize}
            tableData={calllReportData}
            tableColumns={columns}
            paginationData={data}
            paginationHandler={setPage}
          />
        </>
      )}
    </>
  );
};

export default CallReport;
