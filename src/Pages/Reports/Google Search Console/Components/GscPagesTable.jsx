import { Table, Pagination, Empty } from "antd";
import { useState, useMemo, useEffect } from "react";

const GscPagesTable = ({
    data = [],
    crmData = [],
    loading,
    pageFilter,
    setPageFilter
}) => {

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const normalizeUrl = (url) => {
        if (!url) return "";
        return url
            .toLowerCase()
            .replace(/^https?:\/\//, "")
            .replace(/^www\./, "")
            .replace(/\/$/, "")
            .trim();
    };

    const crmMap = useMemo(() => {
        const map = {};
        crmData.forEach((item) => {
            const key = normalizeUrl(item.page);
            map[key] = item;
        });
        return map;
    }, [crmData]);

    const mergedData = useMemo(() => {
        return data.map((row) => {
            const key = normalizeUrl(row.page);
            const crm = crmMap[key];

            return {
                ...row,
                total_lead: crm?.total_lead || 0,
            };
        });
    }, [data, crmMap]);

    const filteredData = useMemo(() => {
        if (!pageFilter) return mergedData;

        const cleanFilter = normalizeUrl(pageFilter);

        return mergedData.filter((row) => {
            const page = normalizeUrl(row.page);

            return (
                page.includes(cleanFilter) ||
                page.startsWith(cleanFilter) ||
                cleanFilter.includes(page)
            );
        });
    }, [mergedData, pageFilter]);

    const paginatedData = useMemo(() => {
        const start = (page - 1) * pageSize;
        return filteredData.slice(start, start + pageSize);
    }, [filteredData, page, pageSize]);

    const columns = [
        {
            title: "Page",
            dataIndex: "page",
            key: "page",
            width: 300,
            fixed: "left",
            ellipsis: true,
            render: (text) => (
                <div
                    style={{
                        maxWidth: 300,
                        minWidth: 250,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }}
                    title={text}
                >
                    <a href={text} target="_blank" rel="noreferrer">
                        {text}
                    </a>
                </div>
            ),
        },
        {
            title: "Clicks",
            dataIndex: "clicks",
            align: "center",
            fixed: "right",
            render: (val) => Number(val || 0).toLocaleString("en-IN"),
        },
        {
            title: "Impressions",
            dataIndex: "impressions",
            align: "center",
            fixed: "right",
            render: (val) => Number(val || 0).toLocaleString("en-IN"),
        },
        {
            title: "CTR (%)",
            dataIndex: "ctrPercent",
            align: "center",
            fixed: "right",
            render: (val) => `${Number(val || 0).toFixed(2)}%`,
        },
        {
            title: "Position",
            dataIndex: "position",
            align: "center",
            fixed: "right",
            render: (val) => Number(val || 0).toFixed(2),
        },
        {
            title: "CRM Leads",
            dataIndex: "total_lead",
            align: "center",
            fixed: "right",
            render: (val) => val || 0,
        },
    ];

    useEffect(() => {
        setPage(1);
    }, [data]);

    useEffect(() => {
        setPage(1);
    }, [pageFilter]);

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl mt-4">

            <Table
                size="small"
                columns={columns}
                dataSource={paginatedData}
                rowKey={(row, i) => i}
                pagination={false}
                scroll={{ x: "max-content" }}
                locale={{
                    emptyText: loading ? "Loading..." : <Empty />,
                }}
            />

            <div className="mt-4 flex justify-between items-center">
                <Pagination
                    current={page}
                    pageSize={pageSize}
                    total={filteredData.length}
                    showSizeChanger
                    showQuickJumper
                    size="small"
                    onChange={(p, s) => {
                        setPage(p);
                        setPageSize(s);
                    }}
                />

                <div className="text-sm text-black dark:text-yellow-500">
                    {filteredData.length === 0
                        ? "0 records"
                        : `${Math.min(page * pageSize, filteredData.length)} of ${filteredData.length} records`}
                </div>
            </div>
        </div>
    );
};

export default GscPagesTable;