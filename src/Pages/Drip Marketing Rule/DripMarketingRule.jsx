import React, { useEffect, useState, useRef } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Drawer, Input, Space, Tooltip, Badge ,message } from "antd";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import Highlighter from "react-highlight-words";
import { getDripMarketingRuleService , deleteDripMarketingRuleService } from "./ApiService";
import TableWithPagination from "../../Components/CustomComponents/Table";
import { useSelector } from "react-redux";
import { PAGESIZE } from "../../lib/Constants";
import { CustomSelectInput } from "../../Components/CustomComponents/InputWithIcon";
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";



const DripMarketingRule = () => {
  const [tableLoading, setTableLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [dripMarketingRuleData, setDripMarketingRuleData] = useState();
  const [page, setPage] = useState(1);
  const [data, setData] = useState({});
  const [searchState, setSearchState] = useState({});

  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const leadModulePermission = useSelector(
    (state) => state.permissions.permissionsData
  );

  // console.log(leadModulePermission.lead_management, 'leadModulePermission');

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    let key = dataIndex + "__icontains";
    let value = selectedKeys[0];
    setSearchState({
      ...searchState,
      [key]: value,
    });
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const handleEdit = (id) => {
    navigate(`/drip-marketing-rule/edit-drip-marketing-rule/${id}`);
  };

  const handleDelete = (id) => {
  setTableLoading(true);

  deleteDripMarketingRuleService(id)
    .then(function (response) {
      if (response.data.success === "1") {
        message.success(response?.data?.message);

        setTimeout(() => {
          dripMarketingRuleGetApi(); // delay ke baad refresh
        }, 500);
      }
    })
    .catch(function (error) {
      if (error) {
        message.error(error?.response?.data?.message);
      }
    })
    .finally(() => setTableLoading(false));
};


  const onSelectChange = (newSelectedRowKeys) => {
    // console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
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
    onFilter: (value, record) => {
      const recordValue =
        dataIndex === "lead_source"
          ? record[dataIndex]?.name
          : record[dataIndex];
      return (
        recordValue === null ||
        (recordValue !== undefined &&
          recordValue.toString().toLowerCase().includes(value.toLowerCase()))
      );
    },
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: "Drip Marketing",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      ...getColumnSearchProps("name"),
      render: (value, record) => (
        <span
          className="cursor-pointer hover:text-orange-500 whitespace-nowrap"
          onClick={() =>
            leadModulePermission.lead_management === "edit" &&
            handleEdit(record.id)
          }
        >
          {value}
        </span>
      ),
    },

    // {
    //   title: "Event Type",
    //   dataIndex: "event_type",
    //   key: "event_type",
    //   sorter: (a, b) => a.event_type.localeCompare(b.event_type),
    //   ...getColumnSearchProps("event_type"),
    //   render: (v) => <span className="whitespace-nowrap">{v}</span>,
    // },

    // {
    //   title: "Delay Seconds",
    //   dataIndex: "delay_seconds",
    //   key: "delay_seconds",
    //   sorter: (a, b) => (a.delay_seconds ?? 0) - (b.delay_seconds ?? 0),
    //   render: (v) => (v ?? "-"),
    // },

    // {
    //   title: "Sub Status",
    //   dataIndex: "sub_status",
    //   key: "sub_status",
    //   sorter: (a, b) => a.sub_status.localeCompare(b.sub_status),
    //   ...getColumnSearchProps("sub_status"),
    //   render: (v) => <span className="whitespace-nowrap">{v}</span>,
    // },
    // {
    //   title: "Lead Status",
    //   dataIndex: "lead_status",
    //   key: "lead_status",
    //   sorter: (a, b) => a.lead_status.localeCompare(b.lead_status),
    //   ...getColumnSearchProps("lead_status"),
    //   render: (v) => <span className="whitespace-nowrap">{v}</span>,
    // },
    {
      title: "Email Template",
      dataIndex: "email_template",
      key: "email_template",

      sorter: (a, b) =>
        (a.email_template?.name || "").localeCompare(
          b.email_template?.name || ""
        ),

      ...getColumnSearchProps("email_template"),

      render: (email_template) => (
        <span className="whitespace-nowrap">
          {email_template?.name || "-"}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "is_active",
      key: "is_active",
      sorter: (a, b) => Number(a.is_active) - Number(b.is_active),
      render: (v) => (
        <Badge
          status={v ? "success" : "error"}
          text={v ? "Active" : "Inactive"}
        />
      ),
    },
  ];

  if (leadModulePermission.branch_management === "edit") {
    columns.push({
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Tooltip title="Edit">
            <MdOutlineEdit
              className="cursor-pointer text-lg hover:text-orange-500"
              onClick={() => handleEdit(record.id)}
            />
          </Tooltip>

          <Tooltip title="Delete">
            <MdDeleteOutline
              className="cursor-pointer text-lg text-red-500 hover:text-red-600"
              onClick={() => handleDelete(record.id)}
            />
          </Tooltip>
        </div>
      ),
    });
  }


  const dripMarketingRuleGetApi = () => {
    setTableLoading(true);

    getDripMarketingRuleService({
      ...searchState,
      current_page_number: page,
      count_per_page: PAGESIZE,
    }).then((response) => {
      setDripMarketingRuleData(response.data.data);
      setData(response.data);
    })
      .finally(() => {
        setTableLoading(false);
      });
  };

  useEffect(dripMarketingRuleGetApi, [
    page,
    searchState,
    leadModulePermission.lead_management,
  ]);

  return (
    <>
      <div className="mx-6 flex items-center justify-between mb-3">
        <div>
          <h1 className="dark:text-yellow-500 text-black font-semibold flex items-center gap-2 justify-self-start text-lg rounded ">
            Drip Marketing Rule
          </h1>
        </div>
        {leadModulePermission.lead_management === "edit" ? (
          <NavLink to="/drip-marketing-rule/add-drip-marketing-rule">
            <button className={"dark:text-yellow-500 dark:border-yellow-500 dark:hover:text-white text-black dark:hover:bg-yellow-500 bg-[#ffce00] hover:bg-orange-500 flex items-center gap-1  dark:bg-meta-4 shadow border px-3 py-1  rounded"}
            >
              Add Drip Marketing Rule
            </button>
          </NavLink>
        ) : null}
      </div>
      <TableWithPagination
        rowKey={(record) => record.id}
        loading={tableLoading}
        tableData={dripMarketingRuleData}
        tableColumns={columns}
        paginationData={data}
        paginationHandler={setPage}
        rowSelection={rowSelection}
      />
    </>
  );
};

export default DripMarketingRule;
