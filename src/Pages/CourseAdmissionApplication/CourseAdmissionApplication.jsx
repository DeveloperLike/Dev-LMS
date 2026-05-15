import React, { useEffect, useState } from "react";
import { MdOutlineEdit } from "react-icons/md";
import { Drawer, Tooltip } from "antd";
import { useSelector } from "react-redux";
import { PAGESIZE } from "../../lib/Constants";
import TableWithPagination from "../../Components/CustomComponents/Table";
import { getCourseAdmissionApplicationService } from "./ApiService";
import AddCourseAdmissionApplication from "./AddCourseAdmissionApplication";
import EditCourseAdmissionApplication from "./EditCourseAdmissionApplication";

const CourseAdmissionApplication = () => {
  const [pageSize, setPageSize] = useState(PAGESIZE);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [courseAdmissionApplicationData, setCourseAdmissionApplicationData] =
    useState();
  const [page, setPage] = useState(1);
  const [data, setData] = useState({});
  const [searchState, setSearchState] = useState({});
  const modulePermission = useSelector(
    (state) => state.permissions.permissionsData
  );

  let columns = [
    {
      title: "Course",
      dataIndex: "course",
      fixed: "left",
      key: "course",
      minWidth: "120px",
      render: (text, record) => (
        <p className="font-medium" onClick={() => showEditDrawer(record.id)}>
          {text}
        </p>
      ),
    },
    {
      title: "Student",
      dataIndex: "student",
      key: "student",
      minWidth: "160px",
      render: (text, record) => (
        <p onClick={() => showEditDrawer(record.id)}>{text}</p>
      ),
    },
    {
      title: "Suggested By",
      dataIndex: "suggestedBy",
      key: "suggestedBy",
      minWidth: "120px",
      render: (text, record) => (
        <p onClick={() => showEditDrawer(record.id)}>{text}</p>
      ),
    },
    {
      title: "Approved By Student",
      dataIndex: "ApprovedByStudent",
      key: "ApprovedByStudent",
      minWidth: "100px",
      render: (text, record) => (
        <p onClick={() => showEditDrawer(record.id)}>{text}</p>
      ),
    },
    {
      title: "Application Status",
      dataIndex: "application_status",
      key: "application_status",
      minWidth: "120px",
      render: (text, record) => (
        <p onClick={() => showEditDrawer(record.id)}>{text}</p>
      ),
    },
    {
      title: "Eligibility",
      dataIndex: "eligibility",
      key: "eligibility",
      minWidth: "120px",
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

  const getCourseAdmissionApplicationApi = () => {
    getCourseAdmissionApplicationService({
      ...searchState,
      current_page_number: page,
      count_per_page: pageSize,
    }).then((response) => {
      setCourseAdmissionApplicationData(response.data.data);
      setData(response.data);
    });
  };

  useEffect(getCourseAdmissionApplicationApi, [
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
            Course Admission Application
          </h1>
        </div>
        <div className="flex gap-3">
          {modulePermission.user_group === "admin" && (
            <button
              onClick={showDrawer}
              className=" bg-[#ffce00] text-white hover:bg-orange-500 gap-1  dark:bg-meta-4 shadow border px-3 py-1  rounded"
            >
              Add Course Admission Application
            </button>
          )}
        </div>

        {/* Add Course Admission Application section */}
        <Drawer
          title="Add Course Admission Application"
          placement="right"
          width={400}
          onClose={onClose}
          open={open}
        >
          <AddCourseAdmissionApplication
            getCourseAdmissionApplicationApi={getCourseAdmissionApplicationApi}
            setOpen={setOpen}
          />
        </Drawer>
        {/* Add Course Admission Application section */}

        {/* Edit Course Admission Application section */}
        {selectedData && (
          <Drawer
            title="Edit Course Admission Application"
            placement="right"
            width={400}
            onClose={onEditClose}
            open={editOpen}
          >
            <EditCourseAdmissionApplication
              id={selectedData}
              setEditOpen={setEditOpen}
              getCourseAdmissionApplicationApi={
                getCourseAdmissionApplicationApi
              }
            />
          </Drawer>
        )}
        {/* Edit Course Admission Application section */}
      </div>

      <TableWithPagination
        pageSize={pageSize}
        setPageSize={setPageSize}
        tableData={courseAdmissionApplicationData}
        tableColumns={columns}
        paginationData={data}
        paginationHandler={setPage}
      />
    </>
  );
};

export default CourseAdmissionApplication;
