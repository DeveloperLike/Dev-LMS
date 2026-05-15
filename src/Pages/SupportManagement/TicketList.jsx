import React, { useEffect, useState } from "react";
import { Badge, Grid, Input, message, Select } from "antd";
import { useSelector } from "react-redux";
import { PAGESIZE } from "../../lib/Constants";
import TableWithPagination from "../../Components/CustomComponents/Table";
import { getTicketListService, patchTicketService } from "./ApiService";
import { NavLink, useNavigate } from "react-router-dom";
import { GetColumnSearchProps } from "../../Components/CustomComponents/TableColumnSearch";
import { SearchOutlined } from "@ant-design/icons";

const TicketList = () => {
  const [pageSize, setPageSize] = useState(PAGESIZE);
  const [ticketData, setTicketData] = useState([]);
  const [page, setPage] = useState(1);
  const [data, setData] = useState({});
  const [searchState, setSearchState] = useState({});
  const [searchTitle, setSearchTitle] = useState("");
    const [searchStatus, setSearchStatus] = useState([]);
  const navigate = useNavigate();

  const ticketModulePermission = useSelector(
    (state) => state.permissions.permissionsData
  );
  const { useBreakPoint } = Grid;
  const screens = useBreakPoint;

  const handleSelectInput = (newStatus, id) => {
    patchTicketService(newStatus, id).then((response) => {
      // console.log(response, "response");
      if (response.data.success === "1") {
        ticketGetApi();
        message.success(response.data.message);
      }
    });
  };

  const columns = [
    {
      title: "Ticket ID",
      dataIndex: "id",
      key: "id",
      width: "20%",
      fixed: "left",
      minWidth: "110px",
      ...GetColumnSearchProps("id", setSearchState, searchState),
      render: (text, record) => (
        <NavLink
          to={`/view-ticket/${record.id}`}
          className="font-medium hover:text-orange-500"
        >
          {text}
        </NavLink>
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: "20%",
      minWidth: "150px",
      ...GetColumnSearchProps("title", setSearchState, searchState),
      render: (text, record) => (
        <NavLink
          to={`/view-ticket/${record.id}`}
          className="font-medium hover:text-orange-500"
        >
          {text}
        </NavLink>
      ),
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      width: "20%",
      ...GetColumnSearchProps("priority", setSearchState, searchState),
      render: (text, record) => (
        <NavLink
          to={`/view-ticket/${record.id}`}
          className="font-medium hover:text-orange-500"
        >
          <span>{text}</span>
        </NavLink>
      ),
    },
    // {
    //   title: "Status",
    //   dataIndex: "status",
    //   key: "status",
    //   width: "20%",
    //   render: (status, data) => (
    //     <Select
    //       className="w-full min-w-[180px]"
    //       size="small"
    //       value={status}
    //       options={[
    //         {
    //           value: "new",
    //           label: "New",
    //         },
    //         {
    //           value: "discussion_required",
    //           label: "Discussion required",
    //         },
    //         {
    //           value: "under_review",
    //           label: "Under review",
    //         },
    //         {
    //           value: "under_development",
    //           label: "Under development",
    //         },
    //         {
    //           value: "under_testing",
    //           label: "Under Testing",
    //         },
    //         {
    //           value: "live_on_uat",
    //           label: "Live on UAT",
    //         },
    //         {
    //           value: "uat_rejected",
    //           label: "UAT rejected",
    //         },
    //         {
    //           value: "uat_approved",
    //           label: "UAT approved",
    //         },
    //         {
    //           value: "production_deployment",
    //           label: "Production deployment",
    //         },
    //         {
    //           value: "deployment_verified",
    //           label: "Deployment verified",
    //         },
    //         {
    //           value: "not_feasible",
    //           label: "Not Feasible",
    //         },

    //         {
    //           value: "on_hold",
    //           label: "on hold",
    //         },
    //         { value: "closed", label: "closed" },
    //       ]}
    //       onChange={(newStatus) => handleSelectInput(newStatus, data.id)}
    //     />
    //   ),
    // },

        {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: "20%",
      minWidth: "250px",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <div style={{ padding: 8 }}>
          <Select
            mode="multiple" 
            placeholder="Select Status"
            style={{ width: "200px" }}
            value={selectedKeys}
            onChange={(values) => {
              setSelectedKeys(values);
              setSearchStatus(values); // Update the searchStatus state
              confirm();
            }}
          options={[
            {
              value: "new",
              label: "New",
            },
            {
              value: "discussion_required",
              label: "Discussion required",
            },
            {
              value: "under_review",
              label: "Under review",
            },
            {
              value: "under_development",
              label: "Under development",
            },
            {
              value: "under_testing",
              label: "Under Testing",
            },
            {
              value: "live_on_uat",
              label: "Live on UAT",
            },
            {
              value: "uat_rejected",
              label: "UAT rejected",
            },
            {
              value: "uat_approved",
              label: "UAT approved",
            },
            {
              value: "production_deployment",
              label: "Production deployment",
            },
            {
              value: "deployment_verified",
              label: "Deployment verified",
            },
            {
              value: "not_feasible",
              label: "Not Feasible",
            },

            {
              value: "on_hold",
              label: "on hold",
            },
            { value: "closed", label: "closed" },
          ]}
          />
        </div>
      ),
      // Update the onFilter function to handle an array of values
      onFilter: (value, record) => searchStatus.includes(record.status),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
      ),
      render: (status, data) => (
        <Select
          className="w-full min-w-[180px]"
          size="small"
          value={status}
          options={[
            {
              value: "new",
              label: "New",
            },
            {
              value: "discussion_required",
              label: "Discussion required",
            },
            {
              value: "under_review",
              label: "Under review",
            },
            {
              value: "under_development",
              label: "Under development",
            },
            {
              value: "under_testing",
              label: "Under Testing",
            },
            {
              value: "live_on_uat",
              label: "Live on UAT",
            },
            {
              value: "uat_rejected",
              label: "UAT rejected",
            },
            {
              value: "uat_approved",
              label: "UAT approved",
            },
            {
              value: "production_deployment",
              label: "Production deployment",
            },
            {
              value: "deployment_verified",
              label: "Deployment verified",
            },
            {
              value: "not_feasible",
              label: "Not Feasible",
            },

            {
              value: "on_hold",
              label: "on hold",
            },
            { value: "closed", label: "closed" },
          ]}
          onChange={(newStatus) => handleSelectInput(newStatus, data.id)}
        />
      ),
    },
    {
      title: "Last Comment",
      dataIndex: "last_comments_by",
      key: "last_comments_by",
      width: "20%",
      minWidth: "180px",
      ...GetColumnSearchProps("last_comments_by", setSearchState, searchState),
      render: (text, record) => (
        <NavLink
          to={`/view-ticket/${record.id}`}
          className="font-medium hover:text-orange-500"
        >
          <span>{text}</span>
        </NavLink>
      ),
    },
    {
      title: "Ticket Category",
      dataIndex: "ticket_category",
      key: "ticket_category",
      width: "20%",
      minWidth: "180px",
      ...GetColumnSearchProps("ticket_category", setSearchState, searchState),
      render: (text, record) => (
        <NavLink
          to={`/view-ticket/${record.id}`}
          className="font-medium hover:text-orange-500"
        >
          {text}
        </NavLink>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: "20%",
      minWidth: "300px",
      ...GetColumnSearchProps("description", setSearchState, searchState),
      render: (text, record) => (
        <NavLink
          to={`/view-ticket/${record.id}`}
          className="font-medium hover:text-orange-500"
        >
          <span>{text}</span>
        </NavLink>
      ),
    },
    {
      title: "Assigned to User",
      dataIndex: "assigned_to_user",
      key: "assigned_to_user",
      width: "20%",
      minWidth: "150px",
      ...GetColumnSearchProps("assigned_to_user", setSearchState, searchState),
      render: (text, record) => (
        <NavLink
          to={`/view-ticket/${record.id}`}
          className="font-medium hover:text-orange-500"
        >
          <span>{text}</span>
        </NavLink>
      ),
    },
    {
      title: "Created by user",
      dataIndex: "created_by_user",
      key: "created_by_user",
      width: "20%",
      minWidth: "180px",
      ...GetColumnSearchProps("created_by_user", setSearchState, searchState),
      render: (text, record) => (
        <NavLink
          to={`/view-ticket/${record.id}`}
          className="font-medium hover:text-orange-500"
        >
          <span>{text}</span>
        </NavLink>
      ),
    },
  ];

  const navigatetoaddpage = () => {
    navigate("/add-ticket");
  };

  // const ticketGetApi = () => {
  //   getTicketListService({
  //     ...searchState,
  //     current_page_number: page,
  //     count_per_page: pageSize,
  //     title: searchTitle,
  //   }).then((response) => {
  //     setTicketData(response.data.data);
  //     setData(response.data);
  //   });
  // };

  // const onSearch = (value, _e) => setSearchTitle(value);

  // useEffect(ticketGetApi, [
  //   page,
  //   searchState,
  //   ticketModulePermission.city_management,
  //   searchTitle,
  //   pageSize,
  // ]);
  // const { Search } = Input;

    const ticketGetApi = () => {
    getTicketListService({
      ...searchState,
      current_page_number: page,
      count_per_page: pageSize,
      title: searchTitle,
      status: searchStatus.join(','),
    }).then((response) => {
      setTicketData(response.data.data);
      setData(response.data);
    });
  };

  const onSearch = (value) => setSearchTitle(value);

  useEffect(ticketGetApi, [page, pageSize, searchState, searchTitle, searchStatus]);
  const { Search } = Input;

  return (
    <>
      <div className="mx-6 md:flex items-center justify-between mb-3">
        <h1 className="text-black font-semibold text-lg">Tickets</h1>
        <div className="flex gap-4 mt-2 md:mt-0">
          <button
            onClick={navigatetoaddpage}
            className="bg-[#ffce00] text-white hover:bg-orange-500 flex items-center gap-1 px-3 py-1 rounded"
          >
            New Ticket
          </button>

          <Search
            placeholder="Search Ticket"
            allowClear
            onSearch={onSearch}
            style={{ width: 200 }}
          />
        </div>
      </div>
      <TableWithPagination
        pageSize={pageSize}
        setPageSize={setPageSize}
        tableData={ticketData}
        tableColumns={columns}
        paginationData={data}
        paginationHandler={setPage}
      />
    </>
  );
};

export default TicketList;





