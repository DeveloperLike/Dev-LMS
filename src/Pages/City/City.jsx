import React, { useEffect, useState, useRef } from "react";
import { MdOutlineEdit } from "react-icons/md";
import { Badge, Drawer, Grid, message, Tooltip } from "antd";
import Highlighter from "react-highlight-words";
import { getCityListService, patchCityService } from "./ApiService";
import TableWithPagination from "../../Components/CustomComponents/Table";
import { useSelector } from "react-redux";
import AddCity from "./AddCity";
import EditCity from "./EditCity";
import { CustomSelectInput } from "../../Components/CustomComponents/InputWithIcon";
import { PAGESIZE } from "../../lib/Constants";
import { GetColumnSearchProps } from "../../Components/CustomComponents/TableColumnSearch";

const City = ({ mode }) => {
  const [pageSize, setPageSize] = useState(PAGESIZE);

  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [cityData, setCityData] = useState();
  const [page, setPage] = useState(1);
  const [data, setData] = useState({});
  const [searchState, setSearchState] = useState({});

  const cityModulePermission = useSelector(
    (state) => state.permissions.permissionsData
  );
  const { useBreakPoint } = Grid;
  const screens = useBreakPoint;

  let columns = [
    {
      title: "City",
      dataIndex: "name",
      fixed: screens?.md ? "left" : false,
      key: "name",
      width: "80%",
      ...GetColumnSearchProps("name", setSearchState, searchState),

      render: (text, record) => (
        <p
          className="font-medium"
          onClick={() =>
            cityModulePermission.city_management === "edit" &&
            handleEdit(record.id)
          }
        >
          {text}
        </p>
      ),
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ["descend", "ascend"],
    },
    cityModulePermission.city_management === "edit"
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

  cityModulePermission.city_management === "edit" &&
    columns.push({
      title: "Actions",
      dataIndex: "id",
      key: "id",
      width: "20%",
      render: (id) => (
        <>
          {cityModulePermission.city_management === "edit" ? (
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

  const cityGetApi = () => {
    setCityData(null);        // clear old data
    setTableLoading(true);   // start loader

    getCityListService({
      ...searchState,
      current_page_number: page,
      count_per_page: pageSize,
    })
      .then((response) => {
        setCityData(response.data.data);
        setData(response.data);
      })
      .catch(() => {
        message.error("Failed to load cities");
      })
      .finally(() => {
        setTableLoading(false); // stop loader
      });
  };

  const handleSelectInput = (e, id) => {
    patchCityService(e, id).then((response) => {
      if (response.data.success === "1") {
        cityGetApi();
        message.success(response.data.message);
      }
    });
  };

  useEffect(cityGetApi, [
    page,
    searchState,
    cityModulePermission.city_management,
    pageSize,
  ]);

  return (
    <>
      <div className="mx-6 flex items-center justify-between mb-3">
        <div>
          <h1 className={`${mode === "dark" ? "text-yellow-500" : "text-black"} font-semibold flex items-center gap-2 justify-self-start text-lg rounded `}>
            City
          </h1>
          {/* <p className="text-sm font-thin ">Manage your cities</p> */}
        </div>
        {cityModulePermission.city_management === "edit" ? (
          <button
            onClick={showDrawer}
            className={` ${mode === "dark" ? "text-yellow-500 border-yellow-500 hover:text-white" : "text-black"} dark:hover:bg-yellow-500 bg-[#ffce00] hover:bg-orange-500 flex items-center gap-1  dark:bg-meta-4 shadow border px-3 py-1 rounded `}
          >
            Add City
          </button>
        ) : null}

        {/* Add City section */}
        <Drawer
          title="Add City"
          placement="right"
          width={screens?.md && 400}
          onClose={onClose}
          open={open}
        >
          <AddCity cityGetApi={cityGetApi} setOpen={setOpen} />
        </Drawer>
        {/* Add City section */}

        {/* Edit City section */}
        {selectedData && (
          <Drawer
            title="Edit City"
            placement="right"
            width={screens?.md && 400}
            onClose={onEditClose}
            open={editOpen}
          >
            <EditCity
              id={selectedData}
              setEditOpen={setEditOpen}
              cityGetApi={cityGetApi}
            />
          </Drawer>
        )}
        {/* Edit City section */}
      </div>

      <TableWithPagination
        loading={tableLoading}
        tableData={cityData}
        tableColumns={columns}
        paginationData={data}
        paginationHandler={setPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
      />
    </>
  );
};

export default City;
