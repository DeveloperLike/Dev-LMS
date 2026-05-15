import React, { useEffect, useState, useRef } from "react";
import { IoAddOutline } from "react-icons/io5";
import { MdOutlineEdit } from "react-icons/md";
import { SearchOutlined } from "@ant-design/icons";
import { Badge, Drawer, Grid, message, Tooltip } from "antd";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { CustomSelectInput } from "../../Components/CustomComponents/InputWithIcon";
import { useDispatch, useSelector } from "react-redux";
import { getStateListService, patchStateListService } from "./ApiService";
import TableWithPagination from "../../Components/CustomComponents/Table";
import AddState from "./AddState";
import EditState from "./EditState";
import { PAGESIZE } from "../../lib/Constants";
import { GetColumnSearchProps } from "../../Components/CustomComponents/TableColumnSearch";

const State = ({ mode }) => {
  const [pageSize, setPageSize] = useState(PAGESIZE);
  const [tableLoading, setTableLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [stateData, setStateData] = useState();
  const [page, setPage] = useState(1);
  const [data, setData] = useState({});
  const [searchState, setSearchState] = useState({});

  const stateModulePermission = useSelector(
    (state) => state.permissions.permissionsData
  );
  const { useBreakPoint } = Grid;
  const screens = useBreakPoint;

  let columns = [
    {
      title: "State",
      dataIndex: "name",
      fixed: screens?.md ? "left" : false,
      key: "name",
      width: "80%",
      ...GetColumnSearchProps("name", setSearchState, searchState),
      render: (text, record) => (
        <p
          className="font-medium"
          onClick={() =>
            stateModulePermission.state_management === "edit" &&
            handleEdit(record.id)
          }
        >
          {text}
        </p>
      ),
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ["descend", "ascend"],
    },
    stateModulePermission.state_management === "edit"
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

  stateModulePermission.state_management === "edit" &&
    columns.push({
      title: "Actions",
      dataIndex: "id",
      key: "id",
      width: "15%",
      render: (id) => (
        <>
          {stateModulePermission.state_management === "edit" ? (
            <Tooltip placement="top" title={"Edit Details"}>
              <MdOutlineEdit
                onClick={() => handleEdit(id)}
                className="hover:text-orange-500 text-lg"
              />
            </Tooltip>
          ) : (
            <MdOutlineEdit className=" text-lg cursor-not-allowed opacity-60" />
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

  const stateGetApi = () => {
    setStateData(null);
    setTableLoading(true);

    getStateListService({
      ...searchState,
      current_page_number: page,
      count_per_page: pageSize,
    })
      .then((response) => {
        setStateData(response.data.data);
        setData(response.data);
      })
      .catch(() => {
        message.error("Failed to load states");
      })
      .finally(() => {
        setTableLoading(false);
      });
  };

  const handleSelectInput = (e, id) => {
    patchStateListService(e, id).then((response) => {
      if (response.data.success === "1") {
        stateGetApi();
        message.success(response.data.message);
      }
    });
  };

  useEffect(stateGetApi, [
    page,
    searchState,
    stateModulePermission.state_management,
    pageSize,
  ]);

  return (
    <>
      <div className="mx-6 flex items-center justify-between mb-3">
        <div>
          <h1 className={`${mode === "dark" ? "text-yellow-500" : "text-black"} font-semibold flex items-center gap-2 justify-self-start text-lg rounded`} >
            State
          </h1>
        </div>
        {stateModulePermission.state_management === "edit" ? (
          <button
            onClick={showDrawer}
            className={`${mode === "dark" ? "text-yellow-500 border-yellow-500 hover:text-white" : "text-black"} dark:hover:bg-yellow-500 bg-[#ffce00] hover:bg-orange-500 flex  dark:bg-meta-4 shadow border px-3 py-1 rounded`}
          >
            Add State
          </button>
        ) : null}

        {/* Add State section */}
        <Drawer
          title="Add State"
          placement="right"
          width={screens?.md && 400}
          onClose={onClose}
          open={open}
        >
          <AddState stateGetApi={stateGetApi} setOpen={setOpen} />
        </Drawer>
        {/* Add State section */}

        {/* Edit State section */}
        {selectedData && (
          <Drawer
            title="Edit State"
            placement="right"
            width={screens?.md && 400}
            onClose={onEditClose}
            open={editOpen}
          >
            <EditState
              id={selectedData}
              setEditOpen={setEditOpen}
              stateGetApi={stateGetApi}
            />
          </Drawer>
        )}
        {/* Edit State section */}
      </div>

      <TableWithPagination
        loading={tableLoading}
        pageSize={pageSize}
        setPageSize={setPageSize}
        tableData={stateData}
        tableColumns={columns}
        paginationData={data}
        paginationHandler={setPage}
      />
    </>
  );
};

export default State;
