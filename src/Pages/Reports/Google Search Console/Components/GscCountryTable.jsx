import { Table, Pagination, Empty, Spin } from "antd";
import { useState, useMemo, useEffect } from "react";

const GscCountryTable = ({ data = [], loading }) => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        setPage(1);
    }, [data]);

    const paginatedData = useMemo(() => {
        if (!Array.isArray(data)) return [];
        const start = (page - 1) * pageSize;
        return data.slice(start, start + pageSize);
    }, [data, page, pageSize]);

    const columns = [
        {
            title: "Country",
            dataIndex: "country",
            ellipsis: true,
        },
        {
            title: "Clicks",
            dataIndex: "clicks",
            align: "center",
            render: (val) => Number(val || 0).toLocaleString("en-IN"),
        },
        {
            title: "Impressions",
            dataIndex: "impressions",
            align: "center",
            render: (val) => Number(val || 0).toLocaleString("en-IN"),
        },
        {
            title: "CTR (%)",
            dataIndex: "ctrPercent",
            align: "center",
            render: (val) => `${Number(val || 0).toFixed(2)}%`,
        },
    ];

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl mt-4">

            <Table
                size="small"
                columns={columns}
                dataSource={paginatedData}
                rowKey={(row) => row.country}
                pagination={false}
                loading={loading}
                locale={{
                    emptyText: loading ? "Loading..." : <Empty />,
                }}
            />

            {/* PAGINATION */}
            <div className="mt-4 flex justify-between items-center">
                <Pagination
                    current={page}
                    pageSize={pageSize}
                    total={data.length}
                    showSizeChanger
                    showQuickJumper
                    size="small"
                    onChange={(p, s) => {
                        setPage(p);
                        setPageSize(s);
                    }}
                />

                <div className="text-sm text-black dark:text-yellow-500">
                    {data.length === 0
                        ? "0 records"
                        : `${Math.min(page * pageSize, data.length)} of ${data.length} records`}
                </div>
            </div>
        </div>
    );
};

export default GscCountryTable;