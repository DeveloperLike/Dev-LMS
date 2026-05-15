import React, { useEffect, useState, useRef } from "react";
import { MdOutlineEdit } from "react-icons/md";
import { Button, Drawer, Input, message, Tooltip } from "antd";
import { useSelector } from "react-redux";
import { PAGESIZE } from "../../lib/Constants";
import TableWithPagination from "../../Components/CustomComponents/Table";
import { getVisaApplicationService } from "./ApiService";
import AddVisaApplication from "./AddVisaApplication";
import EditVisaApplication from "./EditVisaApplication";

const VisaApplication = () => {
  const [pageSize, setPageSize] = useState(PAGESIZE);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [visaManagementData, setVisaManagementData] = useState();
  const [page, setPage] = useState(1);
  const [data, setData] = useState({});
  const [searchState, setSearchState] = useState({});
  const modulePermission = useSelector(
    (state) => state.permissions.permissionsData
  );

  let columns = [
    {
      title: "Application id",
      dataIndex: "application_id",
      fixed: "left",
      key: "application_id",
      width: "20%",
      minWidth: "160px",
      render: (text, record) => (
        <p className="font-medium" onClick={() => showEditDrawer(record.id)}>
          {text}
        </p>
      ),
    },
    {
      title: "Visa id",
      dataIndex: "visa_id",
      key: "visa_id",
      width: "10%",
      minWidth: "100px",
      render: (text, record) => (
        <p onClick={() => showEditDrawer(record.id)}>{text}</p>
      ),
    },
    {
      title: "VFS Region",
      dataIndex: "vfs_region",
      key: "vfs_region",
      minWidth: "110px",
      render: (text, record) => (
        <p onClick={() => showEditDrawer(record.id)}>{text}</p>
      ),
    },
    {
      title: "BA Status",
      dataIndex: "ba_status",
      key: "ba_status",
      minWidth: "100px",
      render: (text, record) => (
        <p onClick={() => showEditDrawer(record.id)}>{text}</p>
      ),
    },
    {
      title: "BA Company",
      dataIndex: "ba_company",
      key: "ba_company",
      minWidth: "120px",
      render: (text, record) => (
        <p onClick={() => showEditDrawer(record.id)}>{text}</p>
      ),
    },
    {
      title: "Visa Document Status",
      dataIndex: "visa_document_status",
      key: "visa_document_status",
      minWidth: "170px",
      render: (text, record) => (
        <p onClick={() => showEditDrawer(record.id)}>{text}</p>
      ),
    },
    {
      title: "Visa File Status",
      dataIndex: "visa_file_status",
      key: "visa_file_status",
      minWidth: "130px",
      render: (text, record) => (
        <p onClick={() => showEditDrawer(record.id)}>{text}</p>
      ),
    },
    {
      title: "Visa Waitlisted On",
      dataIndex: "visa_waitlisted_on",
      key: "visa_waitlisted_on",
      minWidth: "150px",
      render: (text, record) => (
        <p onClick={() => showEditDrawer(record.id)}>{text}</p>
      ),
    },
    {
      title: "Visa Appointment Date",
      dataIndex: "visa_appointment_date",
      key: "visa_appointment_date",
      minWidth: "180px",
      render: (text, record) => (
        <p onClick={() => showEditDrawer(record.id)}>{text}</p>
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

  // const showEditDrawer = (id) => {
  //   showEditDrawer(id);
  // };

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

  const getVisaApplicationApi = () => {
    getVisaApplicationService({
      ...searchState,
      current_page_number: page,
      count_per_page: pageSize,
    }).then((response) => {
      setVisaManagementData(response.data.data);
      setData(response.data);
    });
  };

  useEffect(getVisaApplicationApi, [
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
            Visa Application
          </h1>
        </div>
        <div className="flex gap-3">
          {modulePermission.user_group === "admin" && (
            <button
              onClick={showDrawer}
              className=" bg-[#ffce00] text-white hover:bg-orange-500 gap-1  dark:bg-meta-4 shadow border px-3 py-1  rounded"
            >
              Add Visa Application
            </button>
          )}
        </div>

        {/* Add Visa Application section */}
        <Drawer
          title="Add Visa Application"
          placement="right"
          width={400}
          onClose={onClose}
          open={open}
        >
          <AddVisaApplication
            getVisaApplicationApi={getVisaApplicationApi}
            setOpen={setOpen}
          />
        </Drawer>
        {/* Add Visa Application section */}

        {/* Edit Visa Application section */}
        {selectedData && (
          <Drawer
            title="Edit Visa Application"
            placement="right"
            width={400}
            onClose={onEditClose}
            open={editOpen}
          >
            <EditVisaApplication
              id={selectedData}
              setEditOpen={setEditOpen}
              getVisaApplicationApi={getVisaApplicationApi}
            />
          </Drawer>
        )}
        {/* Edit Visa Application section */}
      </div>

      <TableWithPagination
        pageSize={pageSize}
        setPageSize={setPageSize}
        tableData={visaManagementData}
        tableColumns={columns}
        paginationData={data}
        paginationHandler={setPage}
      />
    </>
  );
};

export default VisaApplication;
