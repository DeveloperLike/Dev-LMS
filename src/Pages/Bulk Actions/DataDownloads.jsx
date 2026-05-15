import React, { useEffect, useState } from "react";
import { Drawer, Grid, Pagination, Row, Table, Tooltip } from "antd";
import { useSelector } from "react-redux";
import LoadSkeleton from "../../Components/CustomComponents/Skeleton";
import { PAGESIZE } from "../../lib/Constants";
import { MdDownload } from "react-icons/md";
import { getExportService } from "./ApiService";
import ExportFile from "./ExportFile";
import { GetColumnSearchProps } from "../../Components/CustomComponents/TableColumnSearch";

const DataDownloads = ({
  openExport,
  setOpenExport,
  exportData,
  setExportData,
  exportPage,
  setExportPage,
}) => {
  const [pageSize, setPageSize] = useState(PAGESIZE);
  const [data, setData] = useState({});
  const [searchState, setSearchState] = useState({});
  const modulePermission = useSelector(
    (state) => state.permissions.permissionsData
  );
  const { useBreakPoint } = Grid;
  const screens = useBreakPoint;

  const onShowSizeChange = (current, newPageSize) => {
    setPageSize(newPageSize);
    setExportPage(1, newPageSize);
  };

  const columns = [
    {
      title: "DOWNLOADED BY",
      dataIndex: "export_by",
      fixed: screens?.md ? "left" : false,
      key: "export_by",
      width: "20%",
      ...GetColumnSearchProps("export_by", setSearchState, searchState),
      render: (text, record) => <p className="font-medium">{text}</p>,
    },
    {
      title: "DOWNLOADED FROM",
      dataIndex: "export_from",
      key: "export_from",
      width: "20%",
    },
    {
      title: "DOWNLOAD DATE",
      dataIndex: "datetime",
      key: "datetime",
      width: "20%",
      sorter: (a, b) => a.datetime.length - b.datetime.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "TOTAL RECORDS",
      dataIndex: "total_records",
      key: "total_records",
      width: "15%",
    },
    {
      title: "DOWNLOAD STATUS",
      dataIndex: "status",
      key: "status",
      width: "15%",
      render: (status) => (
        <>
          {status === "downloaded" ? (
            <p className="bg-success text-success inline-flex bg-opacity-10 rounded-full  py-1 px-3 text-sm font-medium">
              Completed
            </p>
          ) : (
            <p className="bg-danger text-danger inline-flex rounded-full bg-opacity-10  py-1 px-3 text-sm font-medium">
              Pending
            </p>
          )}
        </>
      ),
    },
  ];

  modulePermission.lead_management === "edit" &&
    columns.push({
      title: "Actions",
      dataIndex: "media",
      key: "media",
      width: "10%",
      render: (media, record) => (
        <>
          {modulePermission.lead_management === "edit" &&
            record.status === "downloaded" && (
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

  const handleCancel = () => {
    setOpenExport(false);
  };

  const getExportApi = () => {
    getExportService({
      ...searchState,
      current_page_number: exportPage,
      count_per_page: pageSize,
    }).then((response) => {
      setExportData(response.data.data);
      setData(response.data);
    });
  };

  useEffect(getExportApi, [
    exportPage,
    searchState,
    modulePermission.lead_management,
    pageSize,
  ]);

  return (
    <>
      {/* export file drawer starts from here */}

      <div className="float-right mb-3">
        <Drawer
          title="Export File"
          placement="right"
          width={400}
          onClose={handleCancel}
          open={openExport}
        >
          <ExportFile
            getExportApi={getExportApi}
            setOpenExport={setOpenExport}
          />
        </Drawer>
      </div>

      {/* export file drawer ends here */}

      {exportData === undefined ? (
        <LoadSkeleton />
      ) : (
        exportData && (
          <Table
            columns={columns.map((col) => ({
              ...col,
              className: "whitespace-nowrap",
            }))}
            scroll={{ x: "max-content" }}
            dataSource={exportData}
            pagination={false}
          />
        )
      )}
      <div className="flex justify-between items-center mt-4">
        <Pagination
          current={exportPage}
          total={data.data_count}
          size="small"
          showQuickJumper
          pageSize={pageSize}
          responsive
          showSizeChanger
          onShowSizeChange={onShowSizeChange}
          onChange={(page) => {
            setExportPage(page);
          }}
        />
        <div className="text-sm text-black dark:text-yellow-500">
          {data.current_page_data_count} of {data.data_count} records
        </div>
      </div>
    </>
  );
};

export default DataDownloads;
