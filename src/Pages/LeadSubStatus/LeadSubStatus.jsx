import React, { useEffect, useState, useRef } from "react";
import { MdOutlineEdit } from "react-icons/md";
import { SearchOutlined } from "@ant-design/icons";
import {
  Badge,
  Button,
  Drawer,
  Grid,
  Input,
  message,
  Space,
  Tooltip,
} from "antd";
import Highlighter from "react-highlight-words";
import {
  getLeadSubStatusService,
  patchLeadSubStatusService,
} from "./ApiService";
import TableWithPagination from "../../Components/CustomComponents/Table";
import { useSelector } from "react-redux";
import { CustomSelectInput } from "../../Components/CustomComponents/InputWithIcon";
import AddLeadSubStatus from "./AddLeadSubStatus";
import EditLeadSubStatus from "./EditLeadSubStatus";
import { PAGESIZE } from "../../lib/Constants";

const LeadSubStatus = ({ mode }) => {
  const [pageSize, setPageSize] = useState(PAGESIZE);

  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [leadSubStatusData, setLeadSubStatusData] = useState();
  const [page, setPage] = useState(1);
  const [data, setData] = useState({});
  const [searchState, setSearchState] = useState({});
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const leadModulePermission = useSelector(
    (state) => state.permissions.permissionsData
  );
  const { useBreakPoint } = Grid;
  const screens = useBreakPoint;

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
      record[dataIndex] === null ||
      (record[dataIndex] !== undefined &&
        record[dataIndex]
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase())),
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
  let columns = [
    {
      title: "Lead Sub Status",
      dataIndex: "name",
      fixed: screens?.md ? "left" : false,
      key: "name",
      width: "80%",
      //   ...getColumnSearchProps('name'),
      render: (text, record) => (
        <p
          className="font-medium"
          onClick={() =>
            leadModulePermission.lead_management === "edit" &&
            handleEdit(record.id)
          }
        >
          {text}
        </p>
      ),
    },
    leadModulePermission.lead_management === "edit"
      ? {
        title: "Status",
        dataIndex: "is_active",
        key: "is_active",
        width: "10%",
        render: (is_active, data) => (
          <div className="flex gap-2">
            {is_active === true ? (
              <Badge status="success" />
            ) : (
              <Badge status="error" />
            )}
            <CustomSelectInput
              className="w-full min-w-[100px]"
              size="small"
              value={is_active === true ? "Active" : "Inactive"}
              options={[
                {
                  value: true,
                  label: <Badge status="success" text="Active" />,
                },
                {
                  value: false,
                  label: <Badge status="error" text="Inactive" />,
                },
              ]}
              handler={(e) => {
                handleSelectInput(e, data.id);
              }}
            />
          </div>
        ),
      }
      : {
        title: "Status",
        dataIndex: "is_active",
        key: "is_active",
        width: "10%",
        render: (is_active) => (
          <div className="flex gap-2">
            {is_active === true ? (
              <Badge status="success" text="Active" />
            ) : (
              <Badge status="error" text="Inactive" />
            )}
          </div>
        ),
      },
  ];

  leadModulePermission.lead_management === "edit" &&
    columns.push({
      title: "Actions",
      dataIndex: "id",
      key: "id",
      width: "10%",
      render: (id) => (
        <>
          {leadModulePermission.lead_management === "edit" ? (
            <Tooltip placement="top" title={"Edit Details"}>
              <MdOutlineEdit
                onClick={() => handleEdit(id)}
                className="hover:text-orange-500 text-lg"
              />
            </Tooltip>
          ) : (
            <MdOutlineEdit className=" text-lg opacity-60 cursor-not-allowed" />
          )}
        </>
      ),
    });

  const handleEdit = (id) => {
    showEditDrawer(id);
  };

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const showEditDrawer = (id) => {
    setSelectedData(id);
    setEditOpen(true);
  };
  const onEditClose = () => {
    setEditOpen(false);
    setSelectedData(null);
  };

  const getLeadSubStatusApi = () => {
    setLeadSubStatusData(null);   // clear old data
    setTableLoading(true);       // start loader

    getLeadSubStatusService({
      ...searchState,
      current_page_number: page,
      count_per_page: pageSize,
    })
      .then((response) => {
        setLeadSubStatusData(response.data.data);
        setData(response.data);
      })
      .catch(() => {
        message.error("Failed to load lead sub status");
      })
      .finally(() => {
        setTableLoading(false);  // stop loader
      });
  };

  const handleSelectInput = (e, id) => {
    patchLeadSubStatusService(e, id).then((response) => {
      if (response.data.success === "1") {
        getLeadSubStatusApi();
        message.success(response?.data?.message);
      }
    });
  };

  useEffect(getLeadSubStatusApi, [
    page,
    searchState,
    leadModulePermission.lead_management,
    pageSize,
  ]);

  return (
    <>
      <div className="mx-6 flex items-center justify-between mb-3">
        <div>
          <h1 className={`${mode === "dark" ? "text-yellow-500" : "text-black"} font-semibold items-center gap-2 text-lg rounded `}>
            Lead Sub Status
          </h1>
        </div>
        <div className="flex gap-3">
          {leadModulePermission.lead_management === "edit" ? (
            <button
              onClick={showDrawer}
              className={` ${mode === "dark" ? "text-yellow-500 border-yellow-500 hover:text-black" : "text-black"} dark:hover:bg-yellow-500 bg-[#ffce00] hover:bg-orange-500 gap-1  dark:bg-meta-4 shadow border px-3 py-1  rounded`}
            >
              Add Lead Sub Status
            </button>
          ) : null}
        </div>

        {/* Add Lead Sub Status section */}
        <Drawer
          title="Add Lead Sub Status"
          placement="right"
          width={screens?.md && 400}
          onClose={onClose}
          open={open}
        >
          <AddLeadSubStatus
            getLeadSubStatusApi={getLeadSubStatusApi}
            setOpen={setOpen}
          />
        </Drawer>
        {/* Add Lead Sub Status section */}

        {/* Edit Lead Sub Status section */}
        {selectedData && (
          <Drawer
            title="Edit Lead Sub Status"
            placement="right"
            width={screens?.md && 400}
            onClose={onEditClose}
            open={editOpen}
          >
            <EditLeadSubStatus
              id={selectedData}
              setEditOpen={setEditOpen}
              getLeadSubStatusApi={getLeadSubStatusApi}
            />
          </Drawer>
        )}
        {/* Edit Lead Sub Status section */}
      </div>

      <TableWithPagination
        loading={tableLoading}
        pageSize={pageSize}
        setPageSize={setPageSize}
        tableData={leadSubStatusData}
        tableColumns={columns}
        paginationData={data}
        paginationHandler={setPage}
      />
    </>
  );
};

export default LeadSubStatus;
