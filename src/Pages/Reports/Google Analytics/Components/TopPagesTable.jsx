import { Table, Pagination, Empty, Tabs } from "antd";
import { useState, useMemo, useEffect } from "react";

const TopPagesTable = ({ data = [], cityData = [], summary = {}, loading }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [activeTab, setActiveTab] = useState("pages");

    /* ================= PAGINATION LOGIC ================= */
    const paginatedData = useMemo(() => {
        const sorted = [...data].sort(
            (a, b) => (b.newUsers || 0) - (a.newUsers || 0)
        );

        const startIndex = (currentPage - 1) * pageSize;
        return sorted.slice(startIndex, startIndex + pageSize);
    }, [data, currentPage, pageSize]);

    const paginatedCityData = useMemo(() => {
        const sorted = [...cityData].sort(
            (a, b) => (b.newUsers || 0) - (a.newUsers || 0)
        );

        const startIndex = (currentPage - 1) * pageSize;
        return sorted.slice(startIndex, startIndex + pageSize);
    }, [cityData, currentPage, pageSize]);

    useEffect(() => {
        setCurrentPage(1);
    }, [data, cityData, activeTab]);

    /* ================= TABLE COLUMNS ================= */
    const columns = [
        {
            title: "Landing Page",
            dataIndex: "page",
            key: "page",
            ellipsis: true,
            render: (text) => (
                <div title={text} className="truncate max-w-[250px]">
                    {text}
                </div>
            ),
        },
        {
            title: "New Users",
            dataIndex: "newUsers",
            key: "newUsers",
            align: "center",
        },
        {
            title: "Active Users",
            dataIndex: "activeUsers",
            key: "activeUsers",
            align: "center",
        },
        {
            title: "Views",
            dataIndex: "views",
            key: "views",
            align: "center",
        },
        {
            title: "Sessions",
            dataIndex: "sessions",
            key: "sessions",
            align: "center",
        },
        {
            title: "Avg Duration",
            dataIndex: "avgSessionDuration",
            key: "avgSessionDuration",
            align: "center",
        }
    ];

    const cityColumns = [
        {
            title: "Country",
            dataIndex: "country",
            key: "country",
        },
        {
            title: "City",
            dataIndex: "city",
            key: "city",
        },
        {
            title: "New Users",
            dataIndex: "newUsers",
            key: "newUsers",
            align: "center",
        },
        {
            title: "Active Users",
            dataIndex: "activeUsers",
            key: "activeUsers",
            align: "center",
        },
        {
            title: "Total Users",
            dataIndex: "totalUsers",
            key: "totalUsers",
            align: "center",
        },
    ];

    const citySummary = useMemo(() => {
        return cityData.reduce(
            (acc, item) => {
                acc.newUsers += item.newUsers || 0;
                acc.activeUsers += item.activeUsers || 0;
                acc.totalUsers += item.totalUsers || 0;
                return acc;
            },
            { newUsers: 0, activeUsers: 0, totalUsers: 0 }
        );
    }, [cityData]);

    const totalRecords =
        activeTab === "pages" ? data.length : cityData.length;

    return (
        <div className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex flex-col">

            <div className="p-4">
                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={[
                        { key: "pages", label: <strong>Landing Pages</strong> },
                        { key: "cities", label: <strong>Active Users by City</strong> },
                    ]}
                />
            </div>

            {/* TABLE */}
            <div className="p-2">
                <Table
                    size="small"
                    columns={activeTab === "pages" ? columns : cityColumns}
                    dataSource={
                        activeTab === "pages"
                            ? paginatedData
                            : paginatedCityData
                    }
                    rowKey={(row, index) =>
                        activeTab === "pages"
                            ? row.page
                            : `${row.country}-${row.city}-${index}`
                    }
                    pagination={false}
                    locale={{
                        emptyText: loading ? "Loading..." : <Empty />,
                    }}
                    summary={() => {
                        if (activeTab === "pages") {
                            return (
                                <Table.Summary.Row className="bg-gray-100 dark:bg-[#141414] font-semibold">
                                    <Table.Summary.Cell index={0}>
                                        <strong>Total</strong>
                                    </Table.Summary.Cell>

                                    <Table.Summary.Cell align="center">
                                        {summary?.newUsers?.toLocaleString() || 0}
                                    </Table.Summary.Cell>

                                    <Table.Summary.Cell align="center">
                                        {summary?.activeUsers?.toLocaleString() || 0}
                                    </Table.Summary.Cell>

                                    <Table.Summary.Cell align="center">
                                        {summary?.views?.toLocaleString() || 0}
                                    </Table.Summary.Cell>

                                    <Table.Summary.Cell align="center">
                                        {summary?.sessions?.toLocaleString() || 0}
                                    </Table.Summary.Cell>

                                    <Table.Summary.Cell align="center">
                                        {summary?.avgSessionDuration || "0s"}
                                    </Table.Summary.Cell>
                                </Table.Summary.Row>
                            );
                        }

                        if (activeTab === "cities") {
                            return (
                                <Table.Summary.Row className="bg-gray-100 dark:bg-[#141414] font-semibold">
                                    <Table.Summary.Cell index={0}>
                                        <strong>Total</strong>
                                    </Table.Summary.Cell>

                                    <Table.Summary.Cell />

                                    <Table.Summary.Cell align="center">
                                        {citySummary.newUsers.toLocaleString()}
                                    </Table.Summary.Cell>

                                    <Table.Summary.Cell align="center">
                                        {citySummary.activeUsers.toLocaleString()}
                                    </Table.Summary.Cell>

                                    <Table.Summary.Cell align="center">
                                        {citySummary.totalUsers.toLocaleString()}
                                    </Table.Summary.Cell>
                                </Table.Summary.Row>
                            );
                        }

                        return null;
                    }}
                />
            </div>

            {/* PAGINATION */}
            <div className="px-4 pb-4 flex flex-col sm:flex-row justify-between items-center gap-3">

                <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={
                        activeTab === "pages"
                            ? data.length
                            : cityData.length
                    }
                    showSizeChanger
                    showQuickJumper
                    size="small"
                    onChange={(page, size) => {
                        setCurrentPage(page);
                        setPageSize(size);
                    }}
                />

                <div className="text-sm text-black dark:text-yellow-400 pb-4">
                    {totalRecords === 0
                        ? "0 records"
                        : `${Math.min(currentPage * pageSize, totalRecords)} of ${totalRecords} records`}
                </div>
            </div>
        </div>
    );
};

export default TopPagesTable;