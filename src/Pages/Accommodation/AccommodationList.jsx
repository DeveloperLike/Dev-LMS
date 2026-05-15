import React, { useEffect, useState } from "react";
import { Badge, Card, Drawer, Grid, message, Table, Tooltip } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {
  getStudentAccommodationListService,
  patchAccommodationService,
} from "./ApiService";
import { PrimaryButton } from "../../Components/CustomComponents/ButtonUi";
import LoadSkeleton from "../../Components/CustomComponents/Skeleton";
import { CustomSelectInput } from "../../Components/CustomComponents/InputWithIcon";
import { MdOutlineEdit } from "react-icons/md";
import { PAGESIZE } from "../../lib/Constants";
import TableWithPagination from "../../Components/CustomComponents/Table";
import { GetColumnSearchProps } from "../../Components/CustomComponents/TableColumnSearch";
import AddAccommodation from "./AddAccommodation";
import EditAccommodation from "./EditAccommodation";
dayjs.extend(customParseFormat);

const AccommodationList = () => {
  const [data, setData] = useState({});
  const [editOpen, setEditOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [pageSize, setPageSize] = useState(PAGESIZE);
  const [page, setPage] = useState(1);
  const [AccommodationData, setAccommodation] = useState(undefined);
  const [searchState, setSearchState] = useState({});
  const [selectedData, setSelectedData] = useState();
  const { useBreakPoint } = Grid;
  const screens = useBreakPoint;

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const showEditDrawer = (id) => {
    setSelectedData(id);
    // console.log(id, "id");
    setEditOpen(true);
  };
  const onEditClose = () => {
    setEditOpen(false);
    // setSelectedData(null);
  };

  const getListApi = () => {
    getStudentAccommodationListService({
      ...searchState,
      current_page_number: page,
      count_per_page: pageSize,
    }).then((response) => {
      setData(response.data);
      setAccommodation(response.data.data);
    });
  };

  const handleSelectInput = (e, id) => {
    patchAccommodationService(e, id).then((response) => {
      if (response.data.success === "1") {
        getListApi();
        message.success(response.data.message);
      }
    });
  };

  let columns = [
    {
      title: "Title",
      dataIndex: "title",
      fixed: screens?.md ? "left" : false,
      key: "title",
      minWidth: "120px",
      ...GetColumnSearchProps("title", setSearchState, searchState),
      render: (text, record) => (
        <p
          className="font-medium capitalize"
          onClick={() => showEditDrawer(record.id)}
        >
          {text}
        </p>
      ),
    },
    {
      title: "Accommodation Preference",
      dataIndex: "accommodation_preference",
      key: "accommodation_preference",
      minWidth: "260px",
      ...GetColumnSearchProps(
        "accommodation_preference",
        setSearchState,
        searchState
      ),
      render: (text, record) => (
        <p className="capitalize" onClick={() => showEditDrawer(record.id)}>
          {text}
        </p>
      ),
    },
    {
      title: "University",
      dataIndex: "university",
      key: "university",
      minWidth: "210px",
      ...GetColumnSearchProps("university", setSearchState, searchState),
      render: (text, record) => (
        <p className="capitalize" onClick={() => showEditDrawer(record.id)}>
          {text}
        </p>
      ),
    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
      minWidth: "120px",
      ...GetColumnSearchProps("city", setSearchState, searchState),
      render: (text, record) => (
        <p className="capitalize" onClick={() => showEditDrawer(record.id)}>
          {text}
        </p>
      ),
    },
    {
      title: "Location Type",
      dataIndex: "location_type",
      key: "location_type",
      minWidth: "150px",
      ...GetColumnSearchProps("location_type", setSearchState, searchState),
      render: (text, record) => (
        <p className="capitalize" onClick={() => showEditDrawer(record.id)}>
          {text}
        </p>
      ),
    },
    {
      title: "Proximity",
      dataIndex: "proximity",
      key: "proximity",
      minWidth: "120px",
      render: (text, record) => (
        <p className="capitalize" onClick={() => showEditDrawer(record.id)}>
          {text}
        </p>
      ),
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      minWidth: "120px",
      render: (text, record) => (
        <p className="capitalize" onClick={() => showEditDrawer(record.id)}>
          {text}
        </p>
      ),
    },
    {
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
    },
    {
      title: "Actions",
      dataIndex: "id",
      key: "id",
      width: "15%",
      render: (id) => (
        <>
          <Tooltip placement="top" title={"Edit Details"}>
            <MdOutlineEdit
              onClick={() => showEditDrawer(id)}
              className="hover:text-orange-500 text-lg"
            />
          </Tooltip>
        </>
      ),
    },
  ];

  useEffect(getListApi, [searchState, page, pageSize]);

  return (
    <>
      <div className="mx-6 flex items-center justify-between mb-3">
        <div>
          <h1 className="  text-black font-semibold flex items-center gap-2 justify-self-start text-lg rounded ">
            Accommodation
          </h1>
        </div>
        <PrimaryButton
          title={"Add Accommodation"}
          onClick={showDrawer}
          type={"primary"}
        />
        {/* Add Branch section */}
        <Drawer
          title="Add Accomodation"
          placement="right"
          width={screens?.md && 400}
          onClose={onClose}
          open={open}
        >
          <AddAccommodation getListApi={getListApi} setOpen={setOpen} />
        </Drawer>
        {/* Add Branch section */}
      </div>

      <TableWithPagination
        pageSize={pageSize}
        setPageSize={setPageSize}
        tableData={AccommodationData}
        tableColumns={columns}
        paginationData={data}
        paginationHandler={setPage}
      />

      <Drawer
        title="Edit Accommodation"
        placement="right"
        width={screens?.md && 400}
        onClose={onEditClose}
        open={editOpen}
      >
        <EditAccommodation
          getListApi={getListApi}
          onEditClose={onEditClose}
          selectedData={selectedData}
        />
      </Drawer>
    </>
  );
};

export default AccommodationList;
