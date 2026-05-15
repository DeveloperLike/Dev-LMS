import React, { useEffect, useState, useRef } from "react";
import { MdDeleteOutline, MdOutlineEdit } from "react-icons/md";
import { Badge, Drawer, Grid, message, Modal, Row, Table, Tooltip } from "antd";
import { useSelector } from "react-redux";
import {
  deleteMappedDocumentService,
  getMappedDocumentService,
  patchMappedDocumentService,
} from "./ApiService";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { PAGESIZE } from "../../../lib/Constants";
import TableWithPagination from "../../../Components/CustomComponents/Table";
import { CustomSelectInput } from "../../../Components/CustomComponents/InputWithIcon";
import AddDocuments from "./AddDocuments";
import EditDocuments from "./EditDocuments";

const Documents = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [documentsData, setDocumentsData] = useState();
  const [mappedDocumentId, setMappedDocumentId] = useState("");
  const { id } = useParams();

  const modulePermission = useSelector(
    (state) => state.permissions.permissionsData
  );
  const { useBreakPoint } = Grid;
  const screens = useBreakPoint;

  let columns = [
    {
      title: "Position",
      dataIndex: "position",
      fixed: screens?.md ? "left" : false,
      key: "position",
      width: "10%",
      minWidth: "50px",
      render: (text, record) => (
        <p className="font-medium" onClick={() => showEditDrawer(record.id)}>
          {text}
        </p>
      ),
    },
    {
      title: "Document",
      dataIndex: "document",
      key: "document",
      width: "10%",
      minWidth: "250px",
      render: (text, record) => (
        <p onClick={() => showEditDrawer(record.id)}>{text}</p>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: "10%",
      minWidth: "250px",
      render: (text, record) => (
        <p onClick={() => showEditDrawer(record.id)}>{text}</p>
      ),
    },
    {
      title: "Required",
      dataIndex: "is_required",
      key: "is_required",
      width: "10%",
      minWidth: "100px",
      render: (text, record) => (
        <p
          onClick={() =>
            modulePermission.lead_management === "edit" &&
            showEditDrawer(record.id)
          }
        >
          {text === true ? "Yes" : "No"}
        </p>
      ),
    },
    modulePermission.lead_management === "edit"
      ? {
          title: "Status",
          dataIndex: "status",
          key: "status",
          width: "10%",
          minWidth: "80px",
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
          minWidth: "80px",
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
      minWidth: "100px",
      render: (id) => (
        <>
          {setMappedDocumentId(id)}
          {modulePermission.lead_management === "edit" ? (
            <Row className="gap-4 w-[max-content]">
              <Tooltip placement="top" title={"Edit Document"}>
                <MdOutlineEdit
                  onClick={() => showEditDrawer(id)}
                  className="hover:text-orange-500 text-lg"
                />
              </Tooltip>
              <Tooltip placement="top" title={"Remove Document"}>
                <MdDeleteOutline
                  onClick={() => {
                    setIsModalOpen(true);
                  }}
                  className="hover:text-orange-500 text-lg"
                />
              </Tooltip>
            </Row>
          ) : (
            <MdOutlineEdit className=" text-lg opacity-60 cursor-not-allowed" />
          )}
        </>
      ),
    });

  const handleDelete = (documentId) => {
    deleteMappedDocumentService(id, documentId)
      .then((response) => {
        getMappedDocumentsApi();
        message.success(response?.data?.message);
      })
      .catch(function (error) {
        if (error) {
          message.error(error?.response?.data?.message);
        }
      });
    setIsModalOpen(false);
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

  const getMappedDocumentsApi = () => {
    getMappedDocumentService(id, {}).then((response) => {
      setDocumentsData(response.data.data);
    });
  };
  const handleSelectInput = (e, documentId) => {
    patchMappedDocumentService(e, id, documentId).then((response) => {
      if (response.data.success === "1") {
        getMappedDocumentsApi();
        message.success(response?.data?.message);
      }
    });
  };

  useEffect(getMappedDocumentsApi, [modulePermission.lead_management]);

  return (
    <>
      <div className="mx-6 flex items-center justify-between mb-3">
        <div>
          <h1 className="  text-black font-semibold items-center gap-2 text-lg rounded ">
            Documents
          </h1>
        </div>
        <div className="flex gap-3">
          {modulePermission.lead_management === "edit" ? (
            <button
              onClick={showDrawer}
              className=" bg-[#ffce00] text-white hover:bg-orange-500 gap-1  dark:bg-meta-4 shadow border px-3 py-1  rounded"
            >
              Add Documents
            </button>
          ) : null}
          <NavLink to="/document-category">
            <button className="underline block">Back</button>
          </NavLink>
        </div>

        {/* Add Documents section */}
        <Drawer
          title="Add Document"
          placement="right"
          width={screens?.md && 400}
          onClose={onClose}
          open={open}
        >
          <AddDocuments
            getMappedDocumentsApi={getMappedDocumentsApi}
            setOpen={setOpen}
            id={id}
          />
        </Drawer>
        {/* Add Documents section */}

        {/* Edit Documents section */}
        {selectedData && (
          <Drawer
            title="Edit Document"
            placement="right"
            width={screens?.md && 400}
            onClose={onEditClose}
            open={editOpen}
          >
            <EditDocuments
              categoryId={id}
              documentId={selectedData}
              setEditOpen={setEditOpen}
              getMappedDocumentsApi={getMappedDocumentsApi}
            />
          </Drawer>
        )}
        {/* Edit Documents section */}

        {/* Delete Documents section */}

        <Modal
          title="Do you want to delete this Document?"
          open={isModalOpen}
          onOk={() => handleDelete(mappedDocumentId)}
          onCancel={() => setIsModalOpen(false)}
        >
          Do you want to delete this Document?
        </Modal>
        {/* Delete Documents section */}
      </div>
      <Table
        dataSource={documentsData}
        columns={columns.map((col) => ({
          ...col,
          className: "whitespace-nowrap",
        }))}
        scroll={{ x: "max-content" }}
        pagination={false}
        className="max-w-full overflow-x-auto mx-6 rounded-lg border border-stroke bg-white p-4"
      />
    </>
  );
};

export default Documents;
