import React, { useEffect, useState } from "react";
import { MdOutlineEdit } from "react-icons/md";
import { Badge, Drawer, Grid, message, Tooltip } from "antd";
import { useSelector } from "react-redux";
import TableWithPagination from "../../Components/CustomComponents/Table";
import {
  getUniversityImportsService,
  getUniversitySampleService,
  getUniversityService,
  patchUniversityStatusService,
} from "./ApiService";
import AddUniversity from "./AddUniversity";
import EditUniversity from "./EditUniversity";
import UniversityImportFile from "./UniversityImportFile";
import { CustomSelectInput } from "../../Components/CustomComponents/InputWithIcon";
import { GetColumnSearchPropsNew } from "../../Components/CustomComponents/TableColumnSearch";
import { IoReload } from "react-icons/io5";
import { PAGESIZE } from "../../lib/Constants";

const University = () => {
  const [pageSize, setPageSize] = useState(PAGESIZE);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [universityData, setUniversityData] = useState();
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

  // Import drawer toggle
  const showImportDrawer = () => {
    setOpenImport(true);
  };

  const onImportClose = () => {
    setOpenImport(false);
  };

  // Drawer toggles
  const showDrawer = () => setOpen(true);
  const onClose = () => setOpen(false);

  const showEditDrawer = (id) => {
    setSelectedData(id);
    setEditOpen(true);
  };
  const onEditClose = () => {
    setEditOpen(false);
    setSelectedData(null);
  };

  const getUniversityApi = () => {
    getUniversityService({
      ...searchState,
      current_page_number: page,
      count_per_page: pageSize,
    }).then((response) => {
      setUniversityData(response.data.data);
      setData(response.data);
    });
  };

  const handleSelectInput = (e, id) => {
    patchUniversityStatusService(e, id).then((response) => {
      if (response.data.success === "1") {
        getUniversityApi();
        message.success(response.data.message);
      }
    });
  };

  const reloadFunction = () => {
    getUniversityService({
      ...searchState,
      current_page_number: page,
      count_per_page: pageSize,
    }).then((response) => {
      setUniversityData(response.data.data);
      setData(response.data);
      if (response.data.success === "1") {
        message.success(response?.data?.message);
      }
    });
  };

  useEffect(getUniversityApi, [
    page,
    searchState,
    modulePermission.lead_management,
    pageSize,
  ]);
  useEffect(() => {
    // getUniversityImportsService().then((response) => {
    //   setSampleFile(response.data.data);
    //   console.log(response.data.data);
    // });
    getUniversitySampleService().then((response) => {
      setSampleFile(response.data.data);
      console.log(response.data.data);
    });
  }, []);

  // Table Columns
  let columns = [
    {
      title: "University Name",
      dataIndex: "university_name",
      key: "university_name",
      fixed: screens?.md ? "left" : false,
      minWidth: "300px",
      ...GetColumnSearchPropsNew(
        "university_name",
        setSearchState,
        searchState
      ),
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
              <Badge status={status === "verified" ? "success" : "error"} />
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
                handler={(e) => handleSelectInput(e, data.id)}
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
              <Badge
                status={status === "verified" ? "success" : "error"}
                text={status === "verified" ? "Verified" : "Not Verified"}
              />
            </div>
          ),
        },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      minWidth: "150px",
      ...GetColumnSearchPropsNew("country", setSearchState, searchState),
      render: (text, record) => (
        <p onClick={() => showEditDrawer(record.id)}>{text}</p>
      ),
    },
    {
      title: "University Category",
      dataIndex: "university_category",
      key: "university_category",
      minWidth: "200px",
      ...GetColumnSearchPropsNew(
        "university_category",
        setSearchState,
        searchState
      ),
      render: (text, record) => (
        <p onClick={() => showEditDrawer(record.id)}>{text}</p>
      ),
    },
    {
      title: "University Type",
      dataIndex: "university_type",
      key: "university_type",
      minWidth: "180px",
      ...GetColumnSearchPropsNew(
        "university_type",
        setSearchState,
        searchState
      ),
      render: (text, record) => (
        <p onClick={() => showEditDrawer(record.id)}>{text}</p>
      ),
    },
    {
      title: "University Link",
      dataIndex: "university_link",
      key: "university_link",
      minWidth: "250px",
      ...GetColumnSearchPropsNew(
        "university_link",
        setSearchState,
        searchState
      ),
      render: (text, record) => (
        <p onClick={() => showEditDrawer(record.id)}>{text}</p>
      ),
    },
    {
      title: "Campus Location",
      dataIndex: "campus_location",
      key: "campus_location",
      minWidth: "180px",
      ...GetColumnSearchPropsNew(
        "campus_location",
        setSearchState,
        searchState
      ),
      render: (text, record) => (
        <p onClick={() => showEditDrawer(record.id)}>{text}</p>
      ),
    },
  ];

  if (modulePermission.lead_management === "edit") {
    columns.push({
      title: "Actions",
      dataIndex: "id",
      key: "id",
      width: "50px",
      render: (id) => (
        <Tooltip placement="top" title="Edit Details">
          <MdOutlineEdit
            onClick={() => showEditDrawer(id)}
            className="hover:text-orange-500 text-lg"
          />
        </Tooltip>
      ),
    });
  }

  return (
    <>
      <div className="mx-6 md:flex items-center justify-between mb-3">
        <div>
          <h1 className="text-black font-semibold text-lg">University</h1>
        </div>
        <div className="flex flex-wrap gap-1 md:gap-2">
          {modulePermission.user_group === "admin" && (
            <button
              onClick={showDrawer}
              className="bg-[#ffce00] text-white hover:bg-orange-500 shadow border px-3 py-1 rounded"
            >
              Add University
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
      </div>

      {/* Add University Drawer */}
      <Drawer
        title="Add University"
        placement="right"
        width={screens?.md && 400}
        onClose={onClose}
        open={open}
      >
        <AddUniversity getUniversityApi={getUniversityApi} setOpen={setOpen} />
      </Drawer>

      {/* Edit University Drawer */}
      {selectedData && (
        <Drawer
          title="Edit University"
          placement="right"
          width={screens?.md && 400}
          onClose={onEditClose}
          open={editOpen}
        >
          <EditUniversity
            id={selectedData}
            setEditOpen={setEditOpen}
            getUniversityApi={getUniversityApi}
          />
        </Drawer>
      )}

      {/* Import University Drawer */}
      <Drawer
        title="Import University"
        placement="right"
        width={screens?.md && 400}
        onClose={onImportClose}
        open={openImport}
      >
        <UniversityImportFile
          getImportApi={getUniversityApi}
          setOpenImport={setOpenImport}
        />
      </Drawer>

      <TableWithPagination
        pageSize={pageSize}
        setPageSize={setPageSize}
        tableData={universityData}
        tableColumns={columns}
        paginationData={data}
        paginationHandler={setPage}
      />
    </>
  );
};

export default University;
