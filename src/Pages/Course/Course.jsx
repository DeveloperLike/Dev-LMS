import React, { useEffect, useState, useRef } from "react";
import { MdOutlineEdit } from "react-icons/md";
import { Badge, Button, Drawer, Grid, Input, message, Tooltip } from "antd";
import { useSelector } from "react-redux";
import { PAGESIZE } from "../../lib/Constants";
import TableWithPagination from "../../Components/CustomComponents/Table";
import {
  getCourseService,
  getSampleCourseExportService,
  patchCourseService,
} from "./ApiService";
import AddCourse from "./AddCourse";
import EditCourse from "./EditCourse";
import { CustomSelectInput } from "../../Components/CustomComponents/InputWithIcon";
import { GetColumnSearchPropsNew } from "../../Components/CustomComponents/TableColumnSearch";
import { IoReload } from "react-icons/io5";
import CourseImportFile from "./CourseImportFile";

const Course = () => {
  const [pageSize, setPageSize] = useState(PAGESIZE);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [courseData, setCourseData] = useState();
  const [page, setPage] = useState(1);
  const [data, setData] = useState({});
  const [searchState, setSearchState] = useState({});
  const [openImport, setOpenImport] = useState(false);
  const [sampleFile, setSampleFile] = useState();

  const modulePermission = useSelector(
    (state) => state.permissions.permissionsData
  );
  const { useBreakPoint } = Grid;
  const screens = useBreakPoint;

  let columns = [
    {
      title: "Course Name",
      dataIndex: "course_name",
      key: "course_name",
      fixed: screens?.md ? "left" : false,
      minWidth: "200px",
      ...GetColumnSearchPropsNew("course_name", setSearchState, searchState),
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
          render: (status, data) => (
            <div className="flex gap-2">
              {status === "verified" ? (
                <Badge status="success" />
              ) : (
                <Badge status="error" />
              )}

              <CustomSelectInput
                className="w-full min-w-[150px]"
                size="small"
                value={status === "verified" ? "Verified" : "Pending to Verify"}
                options={[
                  {
                    value: "verified",
                    label: <Badge status="success" text="Verified" />,
                  },
                  {
                    value: "Pending to verify",
                    label: <Badge status="error" text="Pending to verify" />,
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
              {status === "verified" ? (
                <Badge status="success" text="Verified" />
              ) : (
                <Badge status="error" text="Not Verified" />
              )}
            </div>
          ),
        },
    {
      title: "University",
      dataIndex: "university",
      key: "university",
      minWidth: "250px",
      ...GetColumnSearchPropsNew("university", setSearchState, searchState),
      render: (text, record) => (
        <p onClick={() => showEditDrawer(record.id)}>{text}</p>
      ),
    },
    {
      title: "Year",
      dataIndex: "year",
      key: "year",
      minWidth: "100px",
      ...GetColumnSearchPropsNew("year", setSearchState, searchState),
      render: (text, record) => (
        <p onClick={() => showEditDrawer(record.id)}>{text}</p>
      ),
    },
    {
      title: "Intake Session",
      dataIndex: "intake_session",
      key: "intake_session",
      minWidth: "160px",
      ...GetColumnSearchPropsNew("intake_session", setSearchState, searchState),
      render: (text, record) => (
        <p onClick={() => showEditDrawer(record.id)}>{text}</p>
      ),
    },
    {
      title: "Course Level",
      dataIndex: "course_level",
      key: "course_level",
      minWidth: "150px",
      ...GetColumnSearchPropsNew("course_level", setSearchState, searchState),
      render: (text, record) => (
        <p onClick={() => showEditDrawer(record.id)}>{text}</p>
      ),
    },
    {
      title: "Course Link",
      dataIndex: "course_link",
      key: "course_link",
      minWidth: "200px",
      ...GetColumnSearchPropsNew("course_link", setSearchState, searchState),
      render: (text, record) => (
        <p onClick={() => showEditDrawer(record.id)}>{text}</p>
      ),
    },
    {
      title: "Majors",
      dataIndex: "majors",
      key: "majors",
      minWidth: "100px",
      ...GetColumnSearchPropsNew("majors", setSearchState, searchState),
      render: (text, record) => (
        <p onClick={() => showEditDrawer(record.id)}>{text}</p>
      ),
    },
    {
      title: "Application Fee",
      dataIndex: "application_fee",
      key: "application_fee",
      minWidth: "160px",
      ...GetColumnSearchPropsNew(
        "application_fee",
        setSearchState,
        searchState
      ),
      render: (text, record) => (
        <p onClick={() => showEditDrawer(record.id)}>{text}</p>
      ),
    },
    {
      title: "Course Fee",
      dataIndex: "course_fee",
      key: "course_fee",
      minWidth: "140px",
      ...GetColumnSearchPropsNew("course_fee", setSearchState, searchState),
      render: (text, record) => (
        <p onClick={() => showEditDrawer(record.id)}>{text}</p>
      ),
    },
    {
      title: "Course Duration Months",
      dataIndex: "course_duration_months",
      key: "course_duration_months",
      minWidth: "220px",
      ...GetColumnSearchPropsNew(
        "course_duration_months",
        setSearchState,
        searchState
      ),
      render: (text, record) => (
        <p onClick={() => showEditDrawer(record.id)}>{text}</p>
      ),
    },
    {
      title: "English Proficiency Test Requirement",
      dataIndex: "english_proficiency_test_requirement",
      key: "english_proficiency_test_requirement",
      minWidth: "310px",
      ...GetColumnSearchPropsNew(
        "english_proficiency_test_requirement",
        setSearchState,
        searchState
      ),
      render: (text, record) => (
        <p onClick={() => showEditDrawer(record.id)}>{text}</p>
      ),
    },
    {
      title: "German Proficiency",
      dataIndex: "german_proficiency",
      key: "german_proficiency",
      minWidth: "190px",
      ...GetColumnSearchPropsNew(
        "german_proficiency",
        setSearchState,
        searchState
      ),
      render: (text, record) => (
        <p onClick={() => showEditDrawer(record.id)}>{text}</p>
      ),
    },
    {
      title: "MOI Acceptance",
      dataIndex: "moi_acceptance",
      key: "moi_acceptance",
      minWidth: "160px",
      ...GetColumnSearchPropsNew("moi_acceptance", setSearchState, searchState),
      render: (text, record) => (
        <p onClick={() => showEditDrawer(record.id)}>
          {text === true ? "Yes" : "No"}
        </p>
      ),
    },
    {
      title: "Application Start Date",
      dataIndex: "application_start_date",
      key: "application_start_date",
      minWidth: "200px",
      ...GetColumnSearchPropsNew(
        "application_start_date",
        setSearchState,
        searchState
      ),
      render: (text, record) => (
        <p onClick={() => showEditDrawer(record.id)}>{text}</p>
      ),
    },
    {
      title: "Deadline Date",
      dataIndex: "deadline_date",
      key: "deadline_date",
      minWidth: "150px",
      ...GetColumnSearchPropsNew("deadline_date", setSearchState, searchState),
      render: (text, record) => (
        <p onClick={() => showEditDrawer(record.id)}>{text}</p>
      ),
    },
    {
      title: "Deadline Link",
      dataIndex: "deadline_link",
      key: "deadline_link",
      minWidth: "100px",
      ...GetColumnSearchPropsNew("deadline_link", setSearchState, searchState),
      render: (text, record) => (
        <p onClick={() => showEditDrawer(record.id)}>{text}</p>
      ),
    },
    {
      title: "Application Mode",
      dataIndex: "application_mode",
      key: "application_mode",
      minWidth: "170px",
      ...GetColumnSearchPropsNew(
        "application_mode",
        setSearchState,
        searchState
      ),
      render: (text, record) => (
        <p onClick={() => showEditDrawer(record.id)}>{text}</p>
      ),
    },
    {
      title: "Post Requirement",
      dataIndex: "post_requirement",
      key: "post_requirement",
      minWidth: "170px",
      ...GetColumnSearchPropsNew(
        "post_requirement",
        setSearchState,
        searchState
      ),
      render: (text, record) => (
        <p onClick={() => showEditDrawer(record.id)}>{text}</p>
      ),
    },
    {
      title: "Pre Application Test",
      dataIndex: "pre_application_test",
      key: "pre_application_test",
      minWidth: "190px",
      ...GetColumnSearchPropsNew(
        "pre_application_test",
        setSearchState,
        searchState
      ),
      render: (text, record) => (
        <p onClick={() => showEditDrawer(record.id)}>{text}</p>
      ),
    },
    {
      title: "APS Required",
      dataIndex: "aps_required",
      key: "aps_required",
      minWidth: "150px",
      ...GetColumnSearchPropsNew("aps_required", setSearchState, searchState),
      render: (text, record) => (
        <p onClick={() => showEditDrawer(record.id)}>
          {text === true ? "Yes" : "No"}
        </p>
      ),
    },
    {
      title: "Additional Requirement",
      dataIndex: "additional_requirement",
      key: "additional_requirement",
      minWidth: "210px",
      ...GetColumnSearchPropsNew(
        "additional_requirement",
        setSearchState,
        searchState
      ),
      render: (text, record) => (
        <p onClick={() => showEditDrawer(record.id)}>{text}</p>
      ),
    },
    {
      title: "SOP Guidelines",
      dataIndex: "sop_guidelines",
      key: "sop_guidelines",
      minWidth: "160px",
      ...GetColumnSearchPropsNew("sop_guidelines", setSearchState, searchState),
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
  // Import drawer toggle
  const showImportDrawer = () => {
    setOpenImport(true);
  };

  const onImportClose = () => {
    setOpenImport(false);
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

  const getCourseApi = () => {
    getCourseService({
      ...searchState,
      current_page_number: page,
      count_per_page: pageSize,
    }).then((response) => {
      setCourseData(response.data.data);
      setData(response.data);
    });
  };
  const handleSelectInput = (e, id) => {
    patchCourseService(e, id).then((response) => {
      if (response.data.success === "1") {
        getCourseApi();
        message.success(response.data.message);
      }
    });
  };

  const reloadFunction = () => {
    getCourseService({
      ...searchState,
      current_page_number: page,
      count_per_page: pageSize,
    }).then((response) => {
      setCourseData(response.data.data);
      setData(response.data);
      if (response.data.success === "1") {
        message.success(response?.data?.message);
      }
    });
  };

  useEffect(getCourseApi, [
    page,
    searchState,
    modulePermission.lead_management,
    pageSize,
  ]);
  useEffect(() => {
    getSampleCourseExportService().then((response) => {
      setSampleFile(response.data.data);
      // console.log(response.data.data);
    });
  }, []);

  return (
    <>
      <div className="mx-6 md:flex items-center justify-between mb-3">
        <div>
          <h1 className="  text-black font-semibold items-center gap-2 text-lg rounded ">
            Course
          </h1>
        </div>
        <div className="flex flex-wrap gap-1 md:gap-2">
          {modulePermission.user_group === "admin" && (
            <button
              onClick={showDrawer}
              className=" bg-[#ffce00] text-white hover:bg-orange-500 gap-1  dark:bg-meta-4 shadow border px-3 py-1  rounded"
            >
              Add Course
            </button>
          )}

          {/* <div className="flex gap-2"> */}
            <button
              className="bg-[#ffce00] text-white hover:bg-orange-500 shadow border px-3 py-1 rounded"
              onClick={reloadFunction}
            >
              <IoReload />
            </button>

            <a href={sampleFile} download={sampleFile}>
              <button className="bg-[#ffce00] text-white hover:bg-orange-500 shadow border px-3 py-1 rounded">
                Download Sample File
              </button>
            </a>

            <button
              className="bg-[#ffce00] text-white hover:bg-orange-500 shadow border px-3 py-1 rounded"
              onClick={showImportDrawer}
            >
              Import
            </button>
          {/* </div> */}
        </div>

        {/* Add Course section */}
        <Drawer
          title="Add Course"
          placement="right"
          width={screens?.md && 400}
          onClose={onClose}
          open={open}
        >
          <AddCourse getCourseApi={getCourseApi} setOpen={setOpen} />
        </Drawer>
        {/* Add Course section */}

        {/* Edit Course section */}
        {selectedData && (
          <Drawer
            title="Edit Course"
            placement="right"
            width={screens?.md && 400}
            onClose={onEditClose}
            open={editOpen}
          >
            <EditCourse
              id={selectedData}
              setEditOpen={setEditOpen}
              getCourseApi={getCourseApi}
            />
          </Drawer>
        )}
        {/* Edit Course section */}
      </div>

      {/* Import University Drawer */}
      <Drawer
        title="Import Course"
        placement="right"
        width={screens?.md && 400}
        onClose={onImportClose}
        open={openImport}
      >
        <CourseImportFile
          getImportApi={getCourseApi}
          setOpenImport={setOpenImport}
        />
      </Drawer>

      <TableWithPagination
        pageSize={pageSize}
        setPageSize={setPageSize}
        tableData={courseData}
        tableColumns={columns}
        paginationData={data}
        paginationHandler={setPage}
      />
    </>
  );
};

export default Course;
