import React, { useEffect, useRef, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import {
  Badge,
  Button,
  Drawer,
  Grid,
  Input,
  message,
  Pagination,
  Row,
  Space,
  Table,
  Tooltip,
} from "antd";
import Highlighter from "react-highlight-words";
import { boolean } from "zod";
import { useDispatch, useSelector } from "react-redux";
import LoadSkeleton from "../../Components/CustomComponents/Skeleton";
import { PAGESIZE } from "../../lib/Constants";
import { getImportService } from "./ApiService";
import ImportFile from "./ImportFile";
import { MdDownload } from "react-icons/md";

const BulkUpload = ({
  openImport,
  setOpenImport,
  importData,
  setImportData,
  importPage,
  setImportPage,
}) => {
  const [pageSize, setPageSize] = useState(PAGESIZE);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [data, setData] = useState({});
  const [searchState, setSearchState] = useState({});
  const searchInput = useRef(null);
  const dispatch = useDispatch();
  const modulePermission = useSelector(
    (state) => state.permissions.permissionsData
  );
  const { useBreakPoint } = Grid;
  const screens = useBreakPoint;

  const onShowSizeChange = (current, newPageSize) => {
    setPageSize(newPageSize);
    setImportPage(1, newPageSize);
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    let key = dataIndex + "__icontains";
    let value = selectedKeys[0];
    setSearchState({
      ...searchState,
      [key]: value,
    });
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text || boolean ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  let columns = [
    {
      title: "FILE NAME",
      dataIndex: "file_name",
      fixed: screens?.md ? "left" : false,
      key: "file_name",
      width: "20%",
      render: (text, record) => <p className="font-medium">{text}</p>,
    },
    {
      title: "UPLOAD DATE",
      dataIndex: "datetime",
      key: "datetime",
      width: "20%",
      sorter: (a, b) => a.datetime.length - b.datetime.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "UPLOADED BY",
      dataIndex: "uploaded_by",
      key: "uploaded_by",
      width: "20%",
    },
    // {
    //   title: "TOTAL RECORDS",
    //   dataIndex: "total_records",
    //   key: "total_records",
    //   width: "5%",
    // },
    {
      title: "IMPORTED/UPDATED RECORDS",
      dataIndex: "imported_records",
      key: "imported_records",
      width: "5%",
    },
    {
      title: "SKIPPED RECORDS",
      dataIndex: "skipped_records",
      key: "skipped_records",
      width: "5%",
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      width: "15%",
      render: (status) => (
        <div className="flex gap-2 ">
          {status === "completed" ? (
            <p className="bg-success text-success items-center inline-flex bg-opacity-10 rounded-full  py-1 px-3 text-sm font-medium">
              Completed{" "}
            </p>
          ) : status === "in_process" ? (
            <p className="bg-blue-100 text-blue-700 rounded-full py-1 px-3 text-sm font-medium">
              In process
            </p>
          ) : (
            <p className="bg-danger text-danger items-center inline-flex rounded-full bg-opacity-10  py-1 px-3 text-sm font-medium">
              Pending
            </p>
          )}
        </div>
      ),
    },
  ];

  modulePermission.lead_management === "edit" &&
    columns.push({
      title: "Actions",
      dataIndex: "file",
      key: "file",
      width: "10%",
      render: (media, record) => (
        <>
          {modulePermission.lead_management === "edit" && (
            <Row className="gap-4">
              <Tooltip placement="top" title={"Download"}>
                <a href={media} download={media}>
                  <MdDownload className="hover:text-orange-500 text-lg" />
                </a>
              </Tooltip>
            </Row>
          )}
        </>
      ),
    });

  const onClose = () => {
    setOpenImport(false);
  };

  const getImportApi = () => {
    getImportService({
      ...searchState,
      current_page_number: importPage,
      count_per_page: pageSize,
    }).then((response) => {
      setImportData(response.data.data);
      setData(response.data);
    });
  };

  useEffect(getImportApi, [
    importPage,
    searchState,
    modulePermission.lead_management,
    pageSize,
  ]);
  return (
    <>
      <div className="float-right mb-3">
        {/* Import File Drawer section */}

        <Drawer
          title="Import File"
          placement="right"
          width={400}
          onClose={onClose}
          open={openImport}
        >
          <ImportFile
            getImportApi={getImportApi}
            setOpenImport={setOpenImport}
          />
        </Drawer>

        {/* Import File Drawer section */}
      </div>
      {importData === undefined ? (
        <LoadSkeleton />
      ) : (
        importData && (
          <Table
            columns={columns.map((col) => ({
              ...col,
              className: "whitespace-nowrap",
            }))}
            scroll={{ x: "max-content" }}
            dataSource={importData}
            pagination={false}
          />
        )
      )}
      <div className="flex justify-between items-center mt-4">
        <Pagination
          current={importPage}
          total={data.data_count}
          size="small"
          showQuickJumper
          pageSize={pageSize}
          responsive
          showSizeChanger
          onShowSizeChange={onShowSizeChange}
          onChange={(page) => {
            setImportPage(page);
          }}
        />
        <div className="text-sm text-black dark:text-yellow-500">
          {data.current_page_data_count} of {data.data_count} records
        </div>
      </div>
    </>
  );
};

export default BulkUpload;
