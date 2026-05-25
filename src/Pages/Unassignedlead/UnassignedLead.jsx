import React, { useEffect, useState } from "react";
import {
  getUnassignedLeadService,
  assignMultipleLeadService,
} from "./ApiService";
import { Drawer, Grid, message, Table } from "antd";
import TableWithPagination from "../../Components/CustomComponents/Table";
import { useSelector } from "react-redux";
import { PAGESIZE } from "../../lib/Constants";
import { NavLink } from "react-router-dom";
import { CustomSelectInput } from "../../Components/CustomComponents/InputWithIcon";
import { PrimaryButton } from "../../Components/CustomComponents/ButtonUi";
import { getCounsellorDropdown } from "../AssignmentRule/ApiService";
import { getProfileService } from "../Profile/ApiService";
import dayjs from "dayjs";

export const UnassignedLead = ({ mode }) => {
  const [pageSize, setPageSize] = useState(PAGESIZE);

  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [unassignedLeadList, setUnassignedLeadList] = useState();
  const [data, setData] = useState({});
  const [page, setPage] = useState(1);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [open, setOpen] = useState(false);
  const [counsellorDropdown, setCounsellorDropdown] = useState([]);
  const [counsellor, setCounsellor] = useState([]);
  const [counsellorError, setCounsellorError] = useState([]);

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

  const getUnaasignedLeadList = () => {

    // START loader
    setTableLoading(true);
    setUnassignedLeadList([]);
    setData({});

    getUnassignedLeadService({
      current_page_number: page,
      count_per_page: pageSize,
    })
      .then((response) => {
        setUnassignedLeadList(response.data.data || []);
        setData(response.data || {});
      })
      .catch((error) => {
        message.error(error?.response?.data?.message);
        setUnassignedLeadList([]);
        setData({});
      })
      .finally(() => {

        // STOP loader
        setTableLoading(false);

      });
  };

  let columns = [
    {
      title: "Created at",
      dataIndex: "created_at",
      key: "created_at",
      width: "10%",
      minWidth: "180px",
      sorter: (a, b) =>
        new Date(a.created_at).getTime() -
        new Date(b.created_at).getTime(),
      sortDirections: ["descend", "ascend"],
      render: (text, record) => (
        <NavLink to={`/view-lead/${record.id}`}>
          <p className="hover:text-orange-500">
            {text ? dayjs(text).format("DD MMM YY, hh:mma") : "-"}
          </p>
        </NavLink>
      ),
    },
    {
      title: "Lead Source",
      dataIndex: "lead_source",
      key: "lead_source",
      width: "10%",
      minWidth: "120px",
      render: (text, record) => (
        <NavLink to={`/view-lead/${record.id}`}>
          <p className="hover:text-orange-500">
            {text === null || undefined ? "-" : text}
          </p>
        </NavLink>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      fixed: screens?.md ? "left" : false,
      key: "email",
      width: "15%",
      minWidth: "150px",
      render: (text, record) => (
        <NavLink to={`/view-lead/${record.id}`}>
          <p className="font-medium hover:text-orange-500">
            {text === null || undefined ? "-" : text}
          </p>
        </NavLink>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "10%",
      minWidth: "150px",
      render: (text, record) => (
        <NavLink to={`/view-lead/${record.id}`}>
          <p className="hover:text-orange-500">
            {text === null || undefined ? "-" : text}
          </p>
        </NavLink>
      ),
    },

    {
      title: "Phone Number",
      dataIndex: "phone",
      key: "phone",
      width: "10%",
      minWidth: "150px",
      render: (text, record) => (
        <NavLink to={`/view-lead/${record.id}`}>
          <p className="hover:text-orange-500">
            {text === null || undefined ? "-" : text}
          </p>
        </NavLink>
      ),
    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
      width: "10%",
      minWidth: "150px",
      render: (text, record) => (
        <NavLink to={`/view-lead/${record.id}`}>
          <p className="hover:text-orange-500">
            {text === null || undefined ? "-" : text}
          </p>
        </NavLink>
      ),
    },
    {
      title: "State",
      dataIndex: "state",
      key: "state",
      width: "10%",
      minWidth: "150px",
      render: (text, record) => (
        <NavLink to={`/view-lead/${record.id}`}>
          <p className="hover:text-orange-500">
            {text === null || undefined ? "-" : text}
          </p>
        </NavLink>
      ),
    },
    {
      title: "Nearest Branch",
      dataIndex: "nearest_branch",
      key: "nearest_branch",
      width: "10%",
      minWidth: "150px",
      render: (text, record) => (
        <NavLink to={`/view-lead/${record.id}`}>
          <p className="hover:text-orange-500">
            {text === null || undefined ? "-" : text}
          </p>
        </NavLink>
      ),
    },
    {
      title: "Tracking Url",
      dataIndex: "tracking_url",
      key: "tracking_url",
      width: "10%",
      minWidth: "150px",
      render: (text, record) => (
        <NavLink to={`/view-lead/${record.id}`}>
          <p className="hover:text-orange-500">
            {text === null || undefined ? "-" : text}
          </p>
        </NavLink>
      ),
    },
    {
      title: "Lead Status",
      dataIndex: "leads_status",
      key: "leads_status",
      width: "10%",
      minWidth: "150px",
      render: (text, record) => (
        <NavLink to={`/view-lead/${record.id}`}>
          <p className="hover:text-orange-500">
            {text === null || undefined ? "-" : text}
          </p>
        </NavLink>
      ),
    },
    {
      title: "Interested Course",
      dataIndex: "interested_course",
      key: "interested_course",
      width: "10%",
      minWidth: "180px",
      render: (text, record) => (
        <NavLink to={`/view-lead/${record.id}`}>
          <p className="hover:text-orange-500">
            {text === null || undefined ? "-" : text}
          </p>
        </NavLink>
      ),
    },
    {
      title: "Interested Degree",
      dataIndex: "interested_degree",
      key: "interested_degree",
      width: "10%",
      minWidth: "180px",
      render: (text, record) => (
        <NavLink to={`/view-lead/${record.id}`}>
          <p className="hover:text-orange-500">
            {text === null || undefined ? "-" : text}
          </p>
        </NavLink>
      ),
    },
    {
      title: "Campaign",
      dataIndex: "campaign",
      key: "campaign",
      width: "10%",
      minWidth: "150px",
      render: (text, record) => (
        <NavLink to={`/view-lead/${record.id}`}>
          <p className="hover:text-orange-500">
            {text === null || undefined ? "-" : text}
          </p>
        </NavLink>
      ),
    },
    {
      title: "Form Name",
      dataIndex: "form_name",
      key: "form_name",
      width: "10%",
      minWidth: "150px",
      render: (text, record) => (
        <NavLink to={`/view-lead/${record.id}`}>
          <p className="hover:text-orange-500">
            {text === null || undefined ? "-" : text}
          </p>
        </NavLink>
      ),
    },
  ];

  const assignMultipleLeadApi = async () => {
    const myData = await getProfileService()

    const payload = {
      assign_to: counsellor,
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
          getUnaasignedLeadList();
          setCounsellor(null);
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
  getUnaasignedLeadList();

  getCounsellorDropdown().then((response) => {
    setCounsellorDropdown(response.data.data || []);
  });

}, [page, pageSize]);

  return (
    <>
      <div className="mx-6 flex items-center justify-between mb-3">
        <div>
          <h1 className={`${mode === "dark" ? "text-yellow-500" : "text-black"} font-semibold flex items-center gap-2 justify-self-start text-lg rounded `}>
            Unassigned leads
          </h1>
        </div>
        {leadModulePermission.lead_management === "edit" ? (
          <button
            disabled={selectedRowKeys?.length === 0}
            onClick={showDrawer}
            className={`${mode === "dark" ? "text-yellow-500 border-yellow-500 hover:text-white" : "text-black"} dark:hover:bg-yellow-500 bg-[#ffce00] hover:bg-orange-500 flex items-center gap-1  dark:bg-meta-4 shadow border px-3 py-1  rounded`}
          >
            Assign Lead
          </button>
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
                value={counsellor}
                errors={counsellorError}
                onChange={(value) => setCounsellor(value)}
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
              disabled={loading} // Disable button if loading
            />
          </form>
        </Drawer>
      </div>
      <TableWithPagination
        loading={tableLoading}
        pageSize={pageSize}
        setPageSize={setPageSize}
        tableData={unassignedLeadList}
        rowHoverable={false}
        tableColumns={columns}
        paginationData={data}
        paginationHandler={setPage}
        islead={leadModulePermission.lead_management === "edit" && "lead"}
        rowKey="id"
        rowSelection={{
          type: "checkbox",
          selectedRowKeys,
          onChange: (newSelectedRowKeys) => {
            setSelectedRowKeys(newSelectedRowKeys);
          },
        }}
      />
    </>
  );
};
