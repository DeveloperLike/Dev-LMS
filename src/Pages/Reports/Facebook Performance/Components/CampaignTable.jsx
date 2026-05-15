import { Table, Pagination, Spin, Empty, Tabs } from "antd";
import { useState, useMemo, useEffect } from "react";

const CampaignTable = ({ campaigns = [], loading, activeTab, setActiveTab }) => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Reset page when data changes
    useEffect(() => {
        setPage(1);
    }, [campaigns]);

    // Pagination logic
    const paginatedData = useMemo(() => {
        if (!Array.isArray(campaigns)) return [];

        const start = (page - 1) * pageSize;
        return campaigns.slice(start, start + pageSize);
    }, [campaigns, page, pageSize]);

    // Columns
    const columns = [
        // {
        //     title: "Account",
        //     dataIndex: "accountName",
        //     key: "accountName",
        //     ellipsis: true,
        // },
        {
            title:
                activeTab === "campaign"
                    ? "Campaign"
                    : activeTab === "adset"
                        ? "Ad Set Name"
                        : "Ad Name",
            dataIndex: "name",
            key: "name",
            ellipsis: true,
        },
        {
            title: "Spend",
            dataIndex: "spend",
            key: "spend",
            align: "center",
            sorter: (a, b) => (a.spend || 0) - (b.spend || 0),
            render: (val) =>
                `₹${Number(val || 0).toLocaleString("en-IN")}`,
        },
        {
            title: "Impressions",
            dataIndex: "impressions",
            key: "impressions",
            align: "center",
            sorter: (a, b) =>
                (a.impressions || 0) - (b.impressions || 0),
            render: (val) =>
                Number(val || 0).toLocaleString("en-IN"),
        },
        {
            title: "Clicks",
            dataIndex: "clicks",
            key: "clicks",
            align: "center",
            sorter: (a, b) => (a.clicks || 0) - (b.clicks || 0),
            render: (val) =>
                Number(val || 0).toLocaleString("en-IN"),
        },
        {
            title: "CTR (%)",
            dataIndex: "ctr",
            key: "ctr",
            align: "center",
            sorter: (a, b) => (a.ctr || 0) - (b.ctr || 0),
            render: (val) => Number(val || 0).toFixed(2),
        },
        {
            title: "CPC",
            dataIndex: "cpc",
            key: "cpc",
            align: "center",
            sorter: (a, b) => (a.cpc || 0) - (b.cpc || 0),
            render: (val) => `₹${Number(val || 0).toFixed(2)}`,
        },
        {
            title: "Meta Leads",
            dataIndex: "leads",
            key: "leads",
            align: "center",
            sorter: (a, b) => (a.leads || 0) - (b.leads || 0),
            render: (val) =>
                Number(val || 0).toLocaleString("en-IN"),
        },
        {
            title: "CRM Leads",
            dataIndex: "crm_leads",
            key: "crm_leads",
            align: "center",
            sorter: (a, b) => (a.crm_leads || 0) - (b.crm_leads || 0),
            render: (val) =>
                Number(val || 0).toLocaleString("en-IN"),
        },
        {
            title: "CPCL",
            dataIndex: "cpcl",
            key: "cpcl",
            align: "center",
            sorter: (a, b) => {
                const aVal = a.crm_leads ? a.spend / a.crm_leads : 0;
                const bVal = b.crm_leads ? b.spend / b.crm_leads : 0;
                return aVal - bVal;
            },
            render: (_, record) => {
                if (!record.crm_leads || record.crm_leads === 0) {
                    return "0";
                }

                const cpcl = record.spend / record.crm_leads;
                return `₹${cpcl.toFixed(2)}`;
            },
        }
    ];

    const totals = useMemo(() => {
        const totalObj = {};

        columns.forEach((col) => {
            if (!col.dataIndex || col.dataIndex === "name") return;

            totalObj[col.dataIndex] = campaigns.reduce(
                (sum, row) => sum + Number(row[col.dataIndex] || 0),
                0
            );
        });

        return totalObj;
    }, [campaigns, columns]);

    return (
        <div className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">

            <Spin spinning={loading}>

                <Tabs
                    activeKey={activeTab}
                    onChange={(key) => setActiveTab(key)}
                    items={[
                        { key: "campaign", label: <strong>Campaign</strong> },
                        { key: "adset", label: <strong>Ad Set Name</strong> },
                        { key: "ad", label: <strong>Ad Name</strong> },
                    ]}
                    className="mb-4"
                />

                <Table
                    size="small"
                    rowKey="id"
                    columns={columns}
                    dataSource={paginatedData}
                    pagination={false}
                    scroll={{ x: "max-content" }}
                    locale={{
                        emptyText: loading ? (
                            "Loading..."
                        ) : (
                            <Empty description="No campaign data available" />
                        ),
                    }}
                    summary={() => {
                        return (
                            <Table.Summary fixed="bottom">
                                <Table.Summary.Row style={{ fontWeight: "bold" }}>
                                    {columns.map((col, index) => {
                                        if (col.dataIndex === "name") {
                                            return (
                                                <Table.Summary.Cell key={col.key} index={index}>
                                                    <strong>Total</strong>
                                                </Table.Summary.Cell>
                                            );
                                        }

                                        if (col.dataIndex === "ctr") {
                                            const totalCTR =
                                                totals.impressions
                                                    ? ((totals.clicks / totals.impressions) * 100).toFixed(2)
                                                    : 0;

                                            return (
                                                <Table.Summary.Cell key={col.key} index={index} align="center">
                                                    <strong>{totalCTR}</strong>
                                                </Table.Summary.Cell>
                                            );
                                        }

                                        if (col.dataIndex === "cpc") {
                                            const totalCPC =
                                                totals.clicks
                                                    ? (totals.spend / totals.clicks).toFixed(2)
                                                    : 0;

                                            return (
                                                <Table.Summary.Cell key={col.key} index={index} align="center">
                                                    <strong>₹{totalCPC}</strong>
                                                </Table.Summary.Cell>
                                            );
                                        }

                                        if (col.dataIndex === "spend") {
                                            return (
                                                <Table.Summary.Cell key={col.key} index={index} align="center">
                                                    <strong>
                                                        ₹{(totals.spend || 0).toLocaleString("en-IN")}
                                                    </strong>
                                                </Table.Summary.Cell>
                                            );
                                        }

                                        if (col.dataIndex === "impressions") {
                                            return (
                                                <Table.Summary.Cell key={col.key} index={index} align="center">
                                                    <strong>
                                                        {(totals.impressions || 0).toLocaleString("en-IN")}
                                                    </strong>
                                                </Table.Summary.Cell>
                                            );
                                        }

                                        if (col.dataIndex === "cpcl") {
                                            const totalCPCL =
                                                totals.crm_leads && totals.crm_leads !== 0
                                                    ? (totals.spend / totals.crm_leads).toFixed(2)
                                                    : 0;

                                            return (
                                                <Table.Summary.Cell key={col.key} index={index} align="center">
                                                    <strong>₹{totalCPCL}</strong>
                                                </Table.Summary.Cell>
                                            );
                                        }

                                        return (
                                            <Table.Summary.Cell key={col.key} index={index} align="center">
                                                <strong>{totals[col.dataIndex] || 0}</strong>
                                            </Table.Summary.Cell>
                                        );
                                    })}
                                </Table.Summary.Row>
                            </Table.Summary>
                        );
                    }}
                />

                {/* PAGINATION */}
                <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <Pagination
                        current={page}
                        pageSize={pageSize}
                        total={campaigns.length}
                        showSizeChanger
                        showQuickJumper
                        size="small"
                        onChange={(p, s) => {
                            setPage(p);
                            setPageSize(s);
                        }}
                    />

                    <div className="text-sm text-black dark:text-yellow-500 whitespace-nowrap">
                        {campaigns.length === 0
                            ? "0 records"
                            : `${Math.min(
                                page * pageSize,
                                campaigns.length
                            )} of ${campaigns.length} records`}
                    </div>
                </div>
            </Spin>
        </div>
    );
};

export default CampaignTable;