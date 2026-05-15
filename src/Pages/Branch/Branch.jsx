import React, { useEffect, useState, useRef } from "react";
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
import { SearchOutlined } from "@ant-design/icons";
import { MdOutlineEdit } from "react-icons/md";
import { CustomSelectInput } from "../../Components/CustomComponents/InputWithIcon";
import Highlighter from "react-highlight-words";
import { useDispatch, useSelector } from "react-redux";
import { notificationFun } from "../../lib/redux/NotificationSlice";
import { patchBranchService, getBranchService } from "./ApiService";
import TableWithPagination from "../../Components/CustomComponents/Table";
import AddBranch from "./AddBranch";
import EditBranch from "./EditBranch";
import { PAGESIZE } from "../../lib/Constants";
import { branchDataRedux } from "../../lib/redux/DashboardRedux/branchRedux";
import { GetColumnSearchProps } from "../../Components/CustomComponents/TableColumnSearch";

const Branch = ({ mode }) => {
  const [pageSize, setPageSize] = useState(PAGESIZE);

  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [branchData, setBranchData] = useState(undefined);
  const [page, setPage] = useState(1);
  const [data, setData] = useState({});
  const [searchState, setSearchState] = useState({});
  const dispatchbranch = useDispatch();
  const { useBreakPoint } = Grid;
  const screens = useBreakPoint;

  const branchModulePermission = useSelector(
    (state) => state.permissions.permissionsData
  );

  let columns = [
    {
      title: "Branch",
      dataIndex: "name",
      fixed: screens?.md ? "left" : false,
      key: "name",
      width: "25%",
      ...GetColumnSearchProps("name", setSearchState, searchState),
      render: (text, record) => (
        <p
          className="font-medium"
          onClick={() =>
            branchModulePermission.branch_management === "edit" &&
            handleEdit(record.id)
          }
        >
          {text}
        </p>
      ),
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Branch Type",
      dataIndex: "branch_type",
      key: "branch_type",
      width: "25%",
      render: (text, record) => (
        <p
          onClick={() =>
            branchModulePermission.branch_management === "edit" &&
            handleEdit(record.id)
          }
        >
          {text === "franchise" ? "Franchise" : "Self Owned"}
        </p>
      ),
      sorter: (a, b) => a.branch_type.length - b.branch_type.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Branch Number",
      dataIndex: "branch_number",
      key: "branch_number",
      width: "25%",
      ...GetColumnSearchProps("branch_number", setSearchState, searchState),
      render: (text, record) => (
        <p
          onClick={() =>
            branchModulePermission.branch_management === "edit" &&
            handleEdit(record.id)
          }
        >
          {text === null || undefined ? "-" : text}
        </p>
      ),
    },
    branchModulePermission.branch_management === "edit"
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

  branchModulePermission.branch_management === "edit" &&
    columns.push({
      title: "Actions",
      dataIndex: "id",
      key: "id",
      width: "15%",
      render: (id) => (
        <>
          <Tooltip placement="top" title={"Edit Details"}>
            <MdOutlineEdit
              onClick={() => handleEdit(id)}
              className="hover:text-orange-500 text-lg"
            />
          </Tooltip>
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

  const branchGetApi = () => {
    setBranchData(null);       // clear old data
    setTableLoading(true);    // start loader

    getBranchService({
      ...searchState,
      current_page_number: page,
      count_per_page: pageSize,
    })
      .then((response) => {
        setBranchData(response.data.data);
        dispatchbranch(branchDataRedux(response.data.data));
        setData(response.data);
      })
      .catch(() => {
        message.error("Failed to load branches");
      })
      .finally(() => {
        setTableLoading(false); // stop loader
      });
  };

  const handleSelectInput = (e, id) => {
    patchBranchService(e, id).then((response) => {
      if (response.data.success === "1") {
        branchGetApi();
        message.success(response.data.message);
      }
    });
  };

  useEffect(branchGetApi, [
    page,
    searchState,
    branchModulePermission.branch_management,
    pageSize,
  ]);

  return (
    <>
      <div className="mx-6 flex items-center justify-between mb-3">
        <div>
          <h1 className={` ${mode === "dark" ? "text-yellow-500" : "text-black"} font-semibold flex items-center gap-2 justify-self-start text-lg rounded `}>
            Branch
          </h1>
        </div>
        {branchModulePermission.branch_management === "edit" ? (
          <button
            onClick={showDrawer}
            className={`${mode === "dark" ?
              "text-yellow-500 border-yellow-500 hover:text-white" : "text-black"} dark:hover:bg-yellow-500 dark:bg-meta-4 bg-[#ffce00]  hover:bg-orange-500 flex items-center gap-1 shadow border px-3 py-1  rounded`}
          >
            Add Branch
          </button>
        ) : null}
        {/* Add Branch section */}
        <Drawer
          title="Add Branch"
          placement="right"
          width={screens?.md && 400}
          onClose={onClose}
          open={open}
        >
          <AddBranch branchGetApi={branchGetApi} setOpen={setOpen} />
        </Drawer>
        {/* Add Branch section */}

        {/* Edit Branch section */}
        {selectedData && (
          <Drawer
            title="Edit Branch"
            placement="right"
            width={screens?.md && 400}
            onClose={onEditClose}
            open={editOpen}
          >
            <EditBranch
              id={selectedData}
              setEditOpen={setEditOpen}
              branchGetApi={branchGetApi}
            />
          </Drawer>
        )}
        {/* Edit Branch section */}
      </div>

      <TableWithPagination
        loading={tableLoading}
        pageSize={pageSize}
        setPageSize={setPageSize}
        tableData={branchData}
        tableColumns={columns}
        paginationData={data}
        paginationHandler={setPage}
      />
    </>
  );
};

export default Branch;
