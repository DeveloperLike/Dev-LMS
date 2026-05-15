import LoadSkeleton from "./Skeleton";
import { Table, Pagination } from "antd";

function TableWithPagination({
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
  showMargin,
}) {
  const onShowSizeChange = (current, newPageSize) => {
    setPageSize(newPageSize);
    paginationHandler(1, newPageSize);
  };

  return (
    <div className={`${showMargin === "margin" ? "" : "mx-6"} rounded-lg p-4 shadow-default bg-white dark:bg-boxdark transition-colors duration-200`}>
      <div className="max-w-full overflow-x-auto">

        {/* {tableData === undefined || tableData === null ? (
          <LoadSkeleton />
        ) : ( */}

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
          className="
    dark:text-white
    bg-white dark:bg-boxdark
    [&_.ant-table-tbody>tr>td]:bg-white
    dark:[&_.ant-table-tbody>tr>td]:bg-boxdark
    [&_.ant-table-empty]:bg-white
    dark:[&_.ant-table-empty]:bg-boxdark
  "
        />


      </div>

      <div className="flex justify-between items-center mt-4">
        <Pagination
          // defaultCurrent={paginationData.page}

          current={paginationData.page}

          total={loading ? 0 : paginationData?.data_count || 0}
          pageSize={pageSize}
          size="small"
          scroll={{ x: "max-content" }}
          showQuickJumper
          showSizeChanger
          onShowSizeChange={onShowSizeChange}
          responsive
          onChange={(page) => {
            paginationHandler(page, pageSize);
          }}
        />

        <div className="text-sm text-black dark:text-yellow-500">
          {loading ? 0 : paginationData?.current_page_data_count || 0} of{" "}
          {loading ? 0 : paginationData?.data_count || 0} records
        </div>
      </div>
    </div>
  );
}

export default TableWithPagination;
