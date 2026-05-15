import React, { useEffect, useState } from "react";
import { Badge, message, Modal, Row, Tooltip } from "antd";
import { MdOutlineEdit } from "react-icons/md";
import { Drawer } from "antd";
import { CustomSelectInput } from "../../Components/CustomComponents/InputWithIcon";
import { useSelector } from "react-redux";
import AddFormField from "./AddFormField";
import EditFormField from "./EditFormField";
import { MdDeleteOutline } from "react-icons/md";
import {
  deleteLeadFormFeildService,
  getLeadFormListService,
  patchLeadFormListService,
} from "./ApiService";
import TableWithPagination from "../../Components/CustomComponents/Table";
import { PAGESIZE } from "../../lib/Constants";
import { GetColumnSearchProps } from "../../Components/CustomComponents/TableColumnSearch";

const FormField = ({ mode }) => {
  const [pageSize, setPageSize] = useState(PAGESIZE);

  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedLeadData, setSelectedLeadData] = useState(null);
  const [leadData, setLeadData] = useState();
  const [page, setPage] = useState(1);
  const [data, setData] = useState({});
  const [searchState, setSearchState] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCodeMatch, setCodematch] = useState("");

  const formModulePermission = useSelector(
    (state) => state.permissions.permissionsData
  );

  let columns = [
    {
      title: "Field Name",
      dataIndex: "label",
      fixed: "left",
      key: "label",
      width: "35%",
      ...GetColumnSearchProps("label", setSearchState, searchState),
      render: (text, record) => (
        <p
          className="font-medium"
          onClick={() => {
            formModulePermission.lead_form_management === "edit" &&
              record.is_editable &&
              handleEdit(record.code);
          }}
        >
          {text}
        </p>
      ),
      sorter: (a, b) => a.label.length - b.label.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Field Code",
      dataIndex: "code",
      key: "code",
      width: "20%",
      render: (text, record) => (
        <p
          onClick={() => {
            formModulePermission.lead_form_management === "edit" &&
              record.is_editable &&
              handleEdit(record.code);
          }}
        >
          {text}
        </p>
      ),
      sorter: (a, b) => a.code.length - b.code.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Position",
      dataIndex: "position",
      key: "position",
      width: "10%",
      render: (text, record) => (
        <p
          onClick={() => {
            formModulePermission.lead_form_management === "edit" &&
              record.is_editable &&
              handleEdit(record.code);
          }}
        >
          {text}
        </p>
      ),
    },
    {
      title: "Required",
      dataIndex: "is_required",
      key: "is_required",
      width: "10%",
      render: (is_required, record) => (
        <p
          onClick={() => {
            formModulePermission.lead_form_management === "edit" &&
              record.is_editable &&
              handleEdit(record.code);
          }}
        >
          {is_required === true ? (
            <p className="bg-success inline-flex text-success bg-opacity-10 rounded-full  py-1 px-3 text-sm font-medium">
              Yes
            </p>
          ) : (
            <p className="bg-danger inline-flex text-danger rounded-full bg-opacity-10  py-1 px-3 text-sm font-medium">
              No
            </p>
          )}
        </p>
      ),
    },
    {
      title: "Status",
      dataIndex: "is_active",
      key: "is_active",
      width: "10%",
      render: (is_active, data) =>
        formModulePermission.lead_form_management === "edit" &&
          data.is_editable ? (
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
                handleSelectInput(e, data.code);
              }}
            />
          </div>
        ) : (
          <div className="flex gap-2">
            {is_active === true ? (
              <Badge status="success" text="Active" />
            ) : (
              <Badge status="error" text="Inactive" />
            )}
          </div>
        ),
    },
    {
      title: "Actions",
      dataIndex: "code",
      key: "code",
      width: "15%",
      render: (code, data) => (
        <>
          {formModulePermission.lead_form_management === "edit" &&
            data.is_editable ? (
            <Row className="gap-4 w-[max-content]">
              <Tooltip placement="top" title={"Edit Field"}>
                <MdOutlineEdit
                  onClick={() => handleEdit(code)}
                  className="hover:text-orange-500 text-lg"
                />
              </Tooltip>
              <Tooltip placement="top" title={"Delete Field"}>
                <MdDeleteOutline
                  onClick={() => {
                    setCodematch(code);
                    setIsModalOpen(true);
                  }}
                  className="hover:text-orange-500 text-lg"
                />
                {code === isCodeMatch && (
                  <Modal
                    title="Do you want to delete this field?"
                    open={isModalOpen}
                    onOk={() => handleDelete(code)}
                    onCancel={() => setIsModalOpen(false)}
                  >
                    Do you want to delete this field?
                  </Modal>
                )}
              </Tooltip>
            </Row>
          ) : null}
        </>
      ),
    },
  ];

  const showEditDrawer = (code) => {
    setSelectedLeadData(code);
    setEditOpen(true);
  };

  const handleEdit = (code) => {
    showEditDrawer(code);
  };

  const handleDelete = (code) => {
    deleteLeadFormFeildService(code)
      .then((response) => {
        leadGetApi();
        message.success(response?.data?.message);
      })
      .catch(function (error) {
        if (error) {
          message.error(error?.response?.data?.message);
        }
      });
    setIsModalOpen(false);
  };

  const onEditClose = () => {
    setEditOpen(false);
    setSelectedLeadData(null);
  };

  const leadGetApi = () => {
    setLeadData(null);        // clear old data
    setTableLoading(true);   // start loader

    getLeadFormListService({
      ...searchState,
      current_page_number: page,
      count_per_page: pageSize,
    })
      .then((response) => {
        setLeadData(response.data.data);
        setData(response.data);
      })
      .catch(() => {
        message.error("Failed to load leads");
      })
      .finally(() => {
        setTableLoading(false); // stop loader
      });
  };

  const handleSelectInput = (e, id) => {
    patchLeadFormListService(e, id).then((response) => {
      if (response.data.success === "1") {
        leadGetApi();
        message.success(response.data.message);
      }
    });
  };

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    leadGetApi();
  }, [page, searchState, formModulePermission.lead_form_management, pageSize]);

  return (
    <>
      <div className="mx-6 flex items-center justify-between mb-3">
        <div>
          <h1 className={`${mode === "dark" ? "text-yellow-500" : "text-black"} font-semibold flex items-center gap-2 justify-self-start text-lg rounded`}>
            Form Fields
          </h1>
          {/* <p className="text-sm font-thin ">Manage your lead form</p> */}
        </div>
        {formModulePermission.lead_form_management === "edit" && (
          <button
            onClick={showDrawer}
            className={`${mode === "dark" ? "text-yellow-500 border-yellow-500 hover:text-white" : "text-black"} dark:hover:bg-yellow-500 bg-[#ffce00] hover:bg-orange-500 dark:bg-meta-4 shadow border px-3 py-1 rounded`}
          >
            Add Field
          </button>
        )}
        {/* Add lead Drawer section */}
        <Drawer
          title="Add new field"
          placement="right"
          width={400}
          onClose={onClose}
          open={open}
        >
          <AddFormField leadGetApi={leadGetApi} setOpen={setOpen} />
        </Drawer>
        {/* Add lead Drawer section */}

        {/* Edit lead Drawer section */}
        {selectedLeadData && (
          <Drawer
            title="Edit form fields "
            placement="right"
            onClose={onEditClose}
            open={editOpen}
          >
            <EditFormField
              code={selectedLeadData}
              setEditOpen={setEditOpen}
              leadGetApi={leadGetApi}
            />
          </Drawer>
        )}
        {/* Edit lead Drawer section */}
      </div>

      <TableWithPagination
        loading={tableLoading}
        pageSize={pageSize}
        setPageSize={setPageSize}
        tableData={leadData}
        tableColumns={columns}
        paginationData={data}
        paginationHandler={setPage}
      />
    </>
  );
};

export default FormField;
