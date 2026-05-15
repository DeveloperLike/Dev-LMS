import React, { useEffect, useState } from "react";
import { MdOutlineEdit } from "react-icons/md";
import { Badge, Drawer, Grid, message, Tooltip } from "antd";
import { useSelector } from "react-redux";
import TableWithPagination from "../../../Components/CustomComponents/Table";
import AddDocument from "./AddDocument";
import EditDocument from "./EditDocument";
import { getDocumentService, patchDocumentService } from "./ApiService";
import { PAGESIZE } from "../../../lib/Constants";
import { CustomSelectInput } from "../../../Components/CustomComponents/InputWithIcon";

const Document = () => {
  const [pageSize, setPageSize] = useState(PAGESIZE);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [documentData, setDocumentData] = useState();
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
      title: "Title",
      dataIndex: "title",
      fixed: screens?.md ? "left" : false,
      key: "title",
      minWidth: "150px",
      render: (text, record) => (
        <p className="font-medium" onClick={() => showEditDrawer(record.id)}>
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
          dataIndex: "status",
          key: "status",
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

  modulePermission.lead_management === "edit" &&
    columns.push({
      title: "Actions",
      dataIndex: "id",
      key: "id",
      width: "10%",
      render: (id) => (
        <>
          {modulePermission.lead_management === "edit" ? (
            <Tooltip placement="top" title={"Edit Details"}>
              <MdOutlineEdit
                onClick={() => showEditDrawer(id)}
                className="hover:text-orange-500 text-lg"
              />
            </Tooltip>
          ) : (
            <MdOutlineEdit className=" text-lg opacity-60 cursor-not-allowed" />
          )}
        </>
      ),
    });

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

  const getDocumentApi = () => {
    getDocumentService({
      ...searchState,
      current_page_number: page,
      count_per_page: pageSize,
    }).then((response) => {
      setDocumentData(response.data.data);
      setData(response.data);
    });
  };

  const handleSelectInput = (e, id) => {
    patchDocumentService(e, id).then((response) => {
      if (response.data.success === "1") {
        getDocumentApi();
        message.success(response?.data?.message);
      }
    });
  };

  useEffect(getDocumentApi, [
    page,
    searchState,
    modulePermission.lead_management,
    pageSize,
  ]);

  return (
    <>
      <div className="mx-6 flex items-center justify-between mb-3">
        <div>
          <h1 className="  text-black font-semibold items-center gap-2 text-lg rounded ">
            Document
          </h1>
        </div>
        <div className="flex gap-3">
          {modulePermission.user_group === "admin" && (
            <button
              onClick={showDrawer}
              className=" bg-[#ffce00] text-white hover:bg-orange-500 gap-1  dark:bg-meta-4 shadow border px-3 py-1  rounded"
            >
              Add Document
            </button>
          )}
        </div>

        {/* Add Document section */}
        <Drawer
          title="Add Document"
          placement="right"
          width={screens?.md && 400}
          onClose={onClose}
          open={open}
        >
          <AddDocument getDocumentApi={getDocumentApi} setOpen={setOpen} />
        </Drawer>
        {/* Add Document section */}

        {/* Edit Document section */}
        {selectedData && (
          <Drawer
            title="Edit Document"
            placement="right"
            width={screens?.md && 400}
            onClose={onEditClose}
            open={editOpen}
          >
            <EditDocument
              id={selectedData}
              setEditOpen={setEditOpen}
              getDocumentApi={getDocumentApi}
            />
          </Drawer>
        )}
        {/* Edit Document section */}
      </div>

      <TableWithPagination
        pageSize={pageSize}
        setPageSize={setPageSize}
        tableData={documentData}
        tableColumns={columns}
        paginationData={data}
        paginationHandler={setPage}
      />
    </>
  );
};

export default Document;
