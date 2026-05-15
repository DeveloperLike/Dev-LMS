import React, { useEffect, useState } from "react";
import { MdOutlineEdit } from "react-icons/md";
import { Badge, Drawer, Grid, message, Tooltip } from "antd";
import { getLeadCategoryService, patchLeadCategoryService } from "./ApiService";
import { useSelector } from "react-redux";
import { CustomSelectInput } from "../../../Components/CustomComponents/InputWithIcon";
import { PAGESIZE } from "../../../lib/Constants";
import { GetColumnSearchProps } from "../../../Components/CustomComponents/TableColumnSearch";
import TableWithPagination from "../../../Components/CustomComponents/Table";
import AddLeadCategory from "./AddLeadCategory";
import EditLeadCategory from "./EditLeadCategory";

const LeadCategory = () => {
  const [pageSize, setPageSize] = useState(PAGESIZE);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [leadCategoryData, setLeadCategoryData] = useState();
  const [page, setPage] = useState(1);
  const [data, setData] = useState({});
  const [searchState, setSearchState] = useState({});

  const modulePermission = useSelector(
    (state) => state.permissions.permissionsData
  );
  const { useBreakPoint } = Grid;
  const screens = useBreakPoint;

  let columns = [
    {
      title: "Lead Category",
      dataIndex: "title",
      fixed: screens?.md ? "left" : false,
      key: "title",
      ...GetColumnSearchProps("title", setSearchState, searchState),
      render: (text, record) => (
        <p
          className="font-medium"
          onClick={() =>
            modulePermission.lead_management === "edit" && handleEdit(record.id)
          }
        >
          {text}
        </p>
      ),
    },
    {
      title: "Created at",
      dataIndex: "created_at",
      key: "created_at",
      ...GetColumnSearchProps("created_at", setSearchState, searchState),
      render: (text, record) => (
        <p
          onClick={() =>
            modulePermission.lead_management === "edit" && handleEdit(record.id)
          }
        >
          {text}
        </p>
      ),
    },
    {
      title: "Updated at",
      dataIndex: "updated_at",
      key: "updated_at",
      ...GetColumnSearchProps("updated_at", setSearchState, searchState),
      render: (text, record) => (
        <p
          onClick={() =>
            modulePermission.lead_management === "edit" && handleEdit(record.id)
          }
        >
          {text}
        </p>
      ),
    },
    modulePermission.lead_management === "edit"
      ? {
          title: "Status",
          dataIndex: "status",
          key: "status",
          width: "10%",
          render: (status, data) => (
            <div className="flex gap-2">
              {status === true ? (
                <Badge status="success" />
              ) : (
                <Badge status="error" />
              )}

              <CustomSelectInput
                className="w-full min-w-[100px]"
                size="small"
                value={status === true ? "Active" : "Inactive"}
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
          dataIndex: "status",
          key: "status",
          width: "10%",
          render: (status) => (
            <div className="flex gap-2">
              {status === true ? (
                <Badge status="success" text="Active" />
              ) : (
                <Badge status="error" text="Inactive" />
              )}
            </div>
          ),
        },
  ];

  modulePermission.lead_management === "edit" &&
    columns.push({
      title: "Actions",
      dataIndex: "id",
      key: "id",
      width: "20%",
      render: (id) => (
        <>
          {modulePermission.lead_management === "edit" ? (
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

  const leadCategoryGetApi = () => {
    getLeadCategoryService({
      ...searchState,
      current_page_number: page,
      count_per_page: pageSize,
    }).then((response) => {
      setLeadCategoryData(response.data.data);
      setData(response.data);
    });
  };

  const handleSelectInput = (e, id) => {
    patchLeadCategoryService(e, id).then((response) => {
      if (response.data.success === "1") {
        leadCategoryGetApi();
        message.success(response.data.message);
      }
    });
  };

  useEffect(leadCategoryGetApi, [
    page,
    searchState,
    modulePermission.lead_management,
    pageSize,
  ]);

  return (
    <>
      <div className="mx-6 flex items-center justify-between mb-3">
        <div>
          <h1 className="  text-black font-semibold flex items-center gap-2 justify-self-start text-lg rounded ">
            Lead Category
          </h1>
        </div>
        {modulePermission.lead_management === "edit" ? (
          <button
            onClick={showDrawer}
            className=" bg-[#ffce00] text-white hover:bg-orange-500 flex items-center gap-1  dark:bg-meta-4 shadow border px-3 py-1  rounded"
          >
            Add Lead Category
          </button>
        ) : null}

        {/* Add Lead Category section */}
        <Drawer
          title="Add Lead Category"
          placement="right"
          width={screens?.md && 400}
          onClose={onClose}
          open={open}
        >
          <AddLeadCategory
            leadCategoryGetApi={leadCategoryGetApi}
            setOpen={setOpen}
          />
        </Drawer>
        {/* Add Lead Category section */}

        {/* Edit Lead Category section */}
        {selectedData && (
          <Drawer
            title="Edit Lead Category"
            placement="right"
            width={screens?.md && 400}
            onClose={onEditClose}
            open={editOpen}
          >
            <EditLeadCategory
              id={selectedData}
              setEditOpen={setEditOpen}
              leadCategoryGetApi={leadCategoryGetApi}
            />
          </Drawer>
        )}
        {/* Edit Lead Category section */}
      </div>

      <TableWithPagination
        tableData={leadCategoryData}
        tableColumns={columns}
        paginationData={data}
        paginationHandler={setPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
      />
    </>
  );
};

export default LeadCategory;
