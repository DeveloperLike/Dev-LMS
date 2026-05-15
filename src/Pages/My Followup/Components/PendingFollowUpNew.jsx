import React, { useEffect, useState } from "react";
import {
  getUnassignedLeadService,
  assignMultipleLeadService,
} from "../../Unassignedlead/ApiService";
import { Drawer, Grid, message, Table } from "antd";
import TableWithPagination from "../../../Components/CustomComponents/Table";
import { useSelector } from "react-redux";
import { PAGESIZE , baseurl} from "../../../lib/Constants";
import { NavLink } from "react-router-dom";
import { CustomSelectInput } from "../../../Components/CustomComponents/InputWithIcon";
import { PrimaryButton } from "../../../Components/CustomComponents/ButtonUi";
import { getCounsellorDropdown } from "../../AssignmentRule/ApiService";
import { getProfileService } from "../../Profile/ApiService";
import {
  CustomModeSelectInput,
  InputWithIcon,
} from "../../../Components/CustomComponents/InputWithIcon";

import { TbListDetails } from "react-icons/tb";
import { Button, DatePicker, Tabs, Form } from "antd";
import dayjs from "dayjs";
import { getLeadStatusDropdownService } from "../../LeadStatus/ApiService";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const PendingFollowUpNew = ({ mode }) => {
  const [pageSize, setPageSize] = useState(PAGESIZE);

  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [unassignedLeadList, setUnassignedLeadList] = useState([]);
  const [data, setData] = useState({});
  const [user, setUser] = useState(null)
  const [page, setPage] = useState(1);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [open, setOpen] = useState(false);
  const [counsellorDropdown, setCounsellorDropdown] = useState([]);
  const [filterCounsellor, setFilterCounsellor] = useState([]);
  const [assignCounsellor, setAssignCounsellor] = useState(null);
  const [counsellorError, setCounsellorError] = useState([]);

  const [dateRange, setDateRange] = useState([dayjs(), dayjs()]);
  const [tempDateRange, setTempDateRange] = useState([dayjs(), dayjs()]);

  const [missedFollowupDateRange, setMissedFollowupDateRange] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [leadStatusList, setLeadStatusList] = useState([]);
  const [selectedLeadStatus, setSelectedLeadStatus] = useState(null);

  const [filteredLeadList, setFilteredLeadList] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // If no filter selected → show all
    if (!selectedLeadStatus) {
      setFilteredLeadList(unassignedLeadList);
      return;
    }

    // Find selected status name using ID
    const selectedStatusName =
      leadStatusList.find(
        (status) => status.id === selectedLeadStatus
      )?.name;

    if (!selectedStatusName) {
      setFilteredLeadList(unassignedLeadList);
      return;
    }

    // Filter records
    const filtered = unassignedLeadList.filter(
      (item) => item.lead_status_name === selectedStatusName
    );

    setFilteredLeadList(filtered);
  }, [selectedLeadStatus, unassignedLeadList, leadStatusList]);


  useEffect(() => {
    if (location.state?.resetDate === "EMPTY") {
      setDateRange([null, null]);
      setTempDateRange([null, null]);
      navigate(location.pathname, { replace: true });
    }
  }, [location.key]);

  const { RangePicker } = DatePicker;
  const dateFormat = "YYYY-MM-DD";
  const modulePermission = useSelector(
    (state) => state.permissions.permissionsData
  );

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
    setPage(1);
    setMissedFollowupDateRange(tempDateRange);
  };

  const getLeadStatusDropdownApi = () => {
    getLeadStatusDropdownService().then((response) => {
      setLeadStatusList(response.data.data);
    });
  };

  useEffect(() => {
    getCounsellorDropdown().then((response) => {
      setCounsellorDropdown(response.data.data);
    });
    getLeadStatusDropdownApi();
  }, []);


  const leadModulePermission = useSelector(
    (state) => state.permissions.permissionsData
  );
  const { useBreakPoint } = Grid;
  const screens = useBreakPoint;

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const getFollowUps = async () => {
    setTableLoading(true);

    // block ONLY when user is not ready
    if (!user) {
      setTableLoading(false);
      return;
    }

    try {
      const payload = {
        skip: (page - 1) * pageSize,
        limit: pageSize * page,
        counsellor: filterCounsellor,
        username: user.username,
      };

      // LEAD STATUS FILTER
      if (selectedLeadStatus) {
        payload.lead_status = selectedLeadStatus;
      }

      // send date filter only if selected
      if (dateRange?.[0] && dateRange?.[1]) {
        payload.start_date = dateRange[0].format(dateFormat);
        payload.end_date = dateRange[1].format(dateFormat);
      }

      const res = await axios.post(
        `${baseurl}/api/v1/lead-management/actionabale-followup-leads`,
        payload
      );

      setUnassignedLeadList(res.data.records || []);
      setData(res.data || {});
    } catch (err) {
      message.error("Failed to load follow-ups");
      setUnassignedLeadList([]);
      setData({});
    } finally {
      setTableLoading(false);
    }
  };



  let columns = [
    {
      title: "Student Name",
      dataIndex: "lead_name",
      fixed: screens?.md ? "left" : false,
      key: "lead_name",
      width: "15%",
      minWidth: "50px",
      render: (text, record) => (
        <NavLink to={`/view-lead/${record.lead_id}`}>
          <p className="font-medium hover:text-orange-500">
            {text === null || undefined ? "-" : text}
          </p>
        </NavLink>
      ),
    },
    {
      title: "Student Email",
      dataIndex: "lead_email",
      fixed: screens?.md ? "left" : false,
      key: "lead_email",
      width: "15%",
      minWidth: "120px",
      render: (text, record) => (
        <NavLink to={`/view-lead/${record.lead_id}`}>
          <p className="font-medium hover:text-orange-500">
            {text === null || undefined ? "-" : text}
          </p>
        </NavLink>
      ),
    },
    {
      title: "Follow Up For",
      dataIndex: "follow_up_datetime",
      fixed: screens?.md ? "left" : false,
      key: "follow_up_datetime",
      width: "15%",
      minWidth: "50px",
      render: (text, record) => (
        <NavLink to={`/view-lead/${record.lead_id}`}>
          <p className="font-medium hover:text-orange-500">
            {text === null || undefined ? "-" : text}
          </p>
        </NavLink>
      ),
    },
    {
      title: "Assigned To",
      dataIndex: "full_name",
      fixed: screens?.md ? "left" : false,
      key: "full_name",
      width: "15%",
      minWidth: "150px",
      render: (text, record) => (
        <NavLink to={`/view-lead/${record.lead_id}`}>
          <p className="font-medium hover:text-orange-500">
            {text === null || undefined ? "-" : text}
          </p>
        </NavLink>
      ),
    },
    {
      title: "Lead Status",
      dataIndex: "lead_status_name",
      fixed: screens?.md ? "left" : false,
      key: "lead_status_name",
      width: "15%",
      minWidth: "150px",
      render: (text, record) => (
        <NavLink to={`/view-lead/${record.lead_id}`}>
          <p className="font-medium hover:text-orange-500">
            {text === null || undefined ? "-" : text}
          </p>
        </NavLink>
      ),
    },
    {
      title: "Remarks",
      dataIndex: "remark",
      fixed: screens?.md ? "left" : false,
      key: "remark",
      width: "15%",
      minWidth: "150px",
      render: (text, record) => (
        <NavLink to={`/view-lead/${record.lead_id}`}>
          <p className="font-medium hover:text-orange-500">
            {text === null || undefined ? "-" : text}
          </p>
        </NavLink>
      ),
    },
  ];

  const assignMultipleLeadApi = async () => {
    const myData = await getProfileService()

    const payload = {
      assign_to: assignCounsellor,
      lead_id: selectedRowKeys,
      user_id: myData?.data?.data?.username,
    };
    console.log(payload);


    if (loading) return; // Prevent multiple submissions
    setLoading(true); // Disable the button

    assignMultipleLeadService(payload)
      .then((response) => {
        if (response.data.success === "1") {
          setOpen(false);

          getFollowUps();
          setAssignCounsellor(null);
          setSelectedRowKeys([]);

          message.success(response?.data?.message);
        }
      })
      .catch((error) => {
        if (error) {
          message.error(error?.response?.data?.message);
          setCounsellorError(error?.response?.data?.data.assign_to);
        }
      })
      .finally(() => setLoading(false)); // Re-enable the button
  };

  useEffect(() => {
    if (user) {
      getFollowUps();
    }
    getCounsellorDropdown().then((response) => {
      setCounsellorDropdown(response.data.data);
    });
  }, [page, pageSize, dateRange, user, filterCounsellor, selectedLeadStatus]);

  const getUsersData = async () => {
    const myData = await getProfileService()
    setUser(myData?.data?.data)
  }

  useEffect(() => {
    getUsersData()
  }, [])



  return (
    <>
      <div className="mx-6 flex items-center justify-between mb-3">
        <div>
          <h1 className={`dark:text-yellow-500 text-black font-semibold flex items-center gap-2 justify-self-start text-lg rounded `}>
            Follow Ups
          </h1>
        </div>
        {leadModulePermission.lead_management === "edit" ? (
          <>
            <div className="flex gap-2 items-center flex-wrap">
              {/* <div className="">
                <InputWithIcon
                  className={"min-w-[200px] max-w-[200px] max-h-[32px]"}
                  name="phone"
                  type={"number"}
                  placeholder={"Enter Phone Number "}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                  }}
                />
              </div> */}

              {/* Lead Status Form Item */}
              <div className="">
                <CustomSelectInput
                  className={"min-w-[200px] max-w-[200px] max-h-[32px]"}
                  name="leadStatus"
                  allowClear
                  value={selectedLeadStatus}
                  placeholder="Select lead status"
                  handler={(value) => {
                    setSelectedLeadStatus(value ?? null);
                    setPage(1);
                  }}
                  options={leadStatusList.map((item) => ({
                    value: item.id,
                    label: item.name,
                  }))}
                />
              </div>
              {/* End Lead Status Form Item */}

              {modulePermission.user_group !== "staff" && (
                <div className="relative min-w-[200px] max-w-[200px]">
                  <CustomModeSelectInput
                    className={"min-w-[200px] max-w-[200px] absolute top-[-1rem] z-10"}
                    name="counsellor"
                    mode="multiple"
                    size="medium"
                    onChange={(e) => setFilterCounsellor(e)}
                    placeholder="Select Counsellor"
                    tokenSeparators={[","]}
                    defaultValue={null}
                    showSearch
                    required={true}
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
                </div>
              )}
              <div className="">
                <RangePicker
                  format={dateFormat}
                  className="w-full md:w-fit"
                  onChange={(v) => { setTempDateRange(v); console.log(v) }}
                  presets={rangePresets}
                  value={tempDateRange && [tempDateRange[0], tempDateRange[1]]}
                />
                <Button
                  onClick={applyDateRange}
                  type="primary"
                  className={`${mode === "dark" ?
                    "text-yellow-500 border-yellow-500 hover:text-white" : "text-black"} dark:hover:bg-yellow-500 md:ml-2 mt-2 md:mt-0 dark:bg-meta-4`}
                >
                  Apply
                </Button>
              </div>
              <button
                disabled={selectedRowKeys?.length === 0}
                onClick={showDrawer}
                className={`${mode === "dark" ?
                  "text-yellow-500 border-yellow-500 hover:text-white" : "text-black"} dark:hover:bg-yellow-500 bg-[#ffce00] hover:bg-orange-500 flex items-center gap-1  dark:bg-meta-4 shadow border px-3 py-1  rounded`}
              >
                Change Owner
              </button>
            </div>

          </>
        ) : null}
        <Drawer
          title="Assign Lead"
          placement="right"
          width={400}
          onClose={onClose}
          open={open}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              assignMultipleLeadApi();
            }}
            className="w-3/3 space-y-4"
          >
            <div className="flex flex-col gap-1">
              <label className="block">
                Assign to<sup className="text-red-500">*</sup>
              </label>
              <CustomSelectInput
                size="large"
                name="counsellor"
                placeholder="Select Counsellor"
                errors={counsellorError}
                value={assignCounsellor}
                onChange={(value) => setAssignCounsellor(value)}
                options={counsellorDropdown.map((item) => ({
                  value: item.username,
                  label: item.email,
                }))}
              />
            </div>
            <PrimaryButton
              type="primary"
              htmlType="submit"
              className="p-4 mt-6 text-black"
              title="Submit"
              block={false}
              disabled={loading}
            />
          </form>
        </Drawer>
      </div>
      <TableWithPagination
        loading={tableLoading}
        pageSize={pageSize}
        setPageSize={setPageSize}
        // tableData={unassignedLeadList}
        tableData={filteredLeadList}
        rowHoverable={false}
        tableColumns={columns}
        paginationData={data}
        paginationHandler={setPage}
        islead={leadModulePermission.lead_management === "edit" && "lead"}
        rowKey="lead_id"
        rowSelection={{
          type: "checkbox",
          selectedRowKeys,
          onChange: (newSelectedRowKeys) => {
            console.log(newSelectedRowKeys)
            setSelectedRowKeys(newSelectedRowKeys);
          },
        }}
      />
    </>
  );
};

export default PendingFollowUpNew;
