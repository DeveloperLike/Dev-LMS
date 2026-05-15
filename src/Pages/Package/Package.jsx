import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Badge,
  Button,
  Drawer,
  Grid,
  Input,
  message,
  Pagination,
  Space,
  Table,
  Tooltip,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { MdOutlineEdit } from "react-icons/md";
import LoadSkeleton from "../../Components/CustomComponents/Skeleton";
import { CustomSelectInput } from "../../Components/CustomComponents/InputWithIcon";
import Highlighter from "react-highlight-words";
import { useDispatch, useSelector } from "react-redux";
import { notificationFun } from "../../lib/redux/NotificationSlice";
import { LuIndianRupee } from "react-icons/lu";
import { getPackagelistService, patchPackageListService } from "./ApiService";
import { PAGESIZE } from "../../lib/Constants";
import ViewPackage from "./ViewPackage";
import TableWithPagination from "../../Components/CustomComponents/Table";
import { GetColumnSearchProps } from "../../Components/CustomComponents/TableColumnSearch";
import { RxCross1 } from "react-icons/rx";

const Package = ({ mode }) => {
  const [pageSize, setPageSize] = useState(PAGESIZE);
  const [open, setOpen] = useState(false);
  const [packageData, setPackageData] = useState();
  const [page, setPage] = useState(1);
  const [data, setData] = useState({});
  const [searchState, setSearchState] = useState({});
  const [selectedData, setSelectedData] = useState(null);
  const navigate = useNavigate();

  const packageModulePermission = useSelector(
    (state) => state.permissions.permissionsData
  );
  const { useBreakPoint } = Grid;
  const screens = useBreakPoint;

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      fixed: screens?.md ? "left" : false,
      key: "name",
      width: "30%",
      ...GetColumnSearchProps("name", setSearchState, searchState),
      render: (text, record) => (
        <p className="font-medium" onClick={() => showDrawer(record.id)}>
          {text}
        </p>
      ),
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      width: "20%",
      render: (text, record) => (
        <p onClick={() => showDrawer(record.id)}>{text}</p>
      ),
      sorter: (a, b) => a.code.length - b.code.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      width: "15%",
      render: (text, record) => (
        <div
          className="flex items-center gap-1"
          onClick={() => showDrawer(record.id)}
        >
          <LuIndianRupee />
          {text}
        </div>
      ),
    },
    {
      title: "GST%",
      dataIndex: "gst",
      key: "gst",
      width: "10%",
      render: (text, record) => (
        <div
          className="flex items-center gap-1"
          onClick={() => showDrawer(record.id)}
        >
          {text}%
        </div>
      ),
    },
    packageModulePermission.package_management === "edit"
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

  packageModulePermission.package_management === "edit" &&
    columns.push({
      title: "Actions",
      dataIndex: "id",
      key: "id",
      width: "15%",
      render: (id) => (
        <>
          <Tooltip placement="top" title={"Edit Details"}>
            <MdOutlineEdit
              onClick={() => navigate(`/package/edit-package/${id}`)}
              className="hover:text-orange-500 text-lg"
            />
          </Tooltip>
        </>
      ),
    });

  const showDrawer = (id) => {
    setOpen(true);
    setSelectedData(id);
  };
  const onClose = () => {
    setOpen(false);
  };

  const packageGetApi = () => {
    getPackagelistService({
      ...searchState,
      current_page_number: page,
      count_per_page: pageSize,
    }).then((response) => {
      setPackageData(response.data.data);
      setData(response.data);
    });
  };

  const handleSelectInput = (e, id) => {
    patchPackageListService(e, id)
      .then((response) => {
        if (response.data.success === "1") {
          packageGetApi();
          message.success(response?.data?.message);
        }
      })
      .catch(function (error) {
        if (error) {
          message.error(error?.response?.data?.message);
        }
      });
  };

  useEffect(packageGetApi, [page, searchState, pageSize]);

  return (
    <>
      <div className="mx-6 flex items-center justify-between mb-3">
        <h1 className={` ${mode === "dark" ? "text-yellow-500" : "text-black"} font-semibold text-lg`}>Package</h1>
        {packageModulePermission.package_management === "edit" && (
          <button
            onClick={() => navigate("/package/add-package")}
            className={`${mode === "dark" ?
              "text-yellow-500 border-yellow-500 hover:text-white" : "text-black"} dark:hover:bg-yellow-500 bg-[#ffce00] hover:bg-orange-500 flex items-center gap-1  dark:bg-meta-4 shadow border px-3 py-1  rounded `}
          >
            Add Package
          </button>
        )}
      </div>

      {packageData === undefined ? (
        <LoadSkeleton />
      ) : (
        // <Table
        //   footer={null}
        //   rowHoverable={false}
        //   columns={columns}
        //   dataSource={packageData}
        //   pagination={false}
        // />
        <TableWithPagination
          pageSize={pageSize}
          setPageSize={setPageSize}
          tableData={packageData}
          tableColumns={columns}
          paginationData={data}
          paginationHandler={setPage}
        />
      )}
      <Drawer
        title="Package Details"
        placement="right"
        width={400}
        onClose={onClose}
        open={open}
      // className={mode === "dark"}
      >
        <ViewPackage id={selectedData} />
      </Drawer>
    </>
  );
};

export default Package;
