import { Pagination, Table } from "antd";
import LoadSkeleton from "./Skeleton";
import { useEffect } from "react";

export const TabTables = ({
  loading,
  tableData,
  tableColumns,
  paginationData,
  paginationHandler,
  rowHoverable,
  rowSelection,
  rowKey,
  bordered,
  pageSize,
  setPageSize,

  containerClassName = "",
  tableClassName = "",
}) => {

  const onShowSizeChange = (current, newPageSize) => {
    setPageSize(newPageSize);
    paginationHandler(1, newPageSize);
  };

  useEffect(() => {
    console.log(containerClassName)
  }, []);

  return (
    <>
      <div
        className={`
          ${containerClassName === "mx-0 bg-none dark:bg-none" ? "" : "mx-6 bg-white dark:bg-boxdark"} rounded-lg p-4 shadow-default
          transition-colors duration-200
        `}
      >
        <div className="max-w-full overflow-x-auto">

          <Table
            loading={loading}
            size="small"
            columns={tableColumns.map((col) => ({
              ...col,
              className: "whitespace-nowrap",
            }))}
            dataSource={tableData || []}
            pagination={false}
            rowHoverable={rowHoverable}
            rowSelection={rowSelection}
            rowKey={rowKey}
            scroll={{ x: "max-content" }}
            locale={{
              emptyText: loading ? (
                <div className="pt-8 text-center text-gray-400">
                  Loading...
                </div>
              ) : (
                "No records found"
              ),
            }}
            className={`
              dark:text-white
              bg-white dark:bg-boxdark
              [&_.ant-table-tbody>tr>td]:bg-white
              dark:[&_.ant-table-tbody>tr>td]:bg-boxdark
              [&_.ant-table-empty]:bg-white
              dark:[&_.ant-table-empty]:bg-boxdark
              ${tableClassName}
            `}
          />

        </div>

        <div className="flex justify-between items-center mt-4">
          <Pagination
            defaultCurrent={paginationData.page}
            total={paginationData.data_count}
            pageSize={pageSize}
            size="small"
            showQuickJumper
            showSizeChanger
            onShowSizeChange={onShowSizeChange}
            responsive
            onChange={(page) => {
              paginationHandler(page, pageSize);
            }}
          />

          <div className="text-sm text-black dark:text-yellow-500">
            {paginationData.current_page_data_count} of{" "}
            {paginationData.data_count} records
          </div>
        </div>
      </div>
    </>
  );
};