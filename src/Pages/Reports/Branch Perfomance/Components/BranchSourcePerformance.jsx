import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Table, Spin, Empty, Pagination, Tabs } from "antd";
import { useSelector } from "react-redux";
import { getProfileService } from "../../../Profile/ApiService";
import { getLeadCounsellorDropdownService } from "../../ApiService";
import { removeZeroColumns, sortColumnsByTotal } from "../../hook";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useLeadConversion } from "../../hook";
import { useRegisteredPercentage } from "../../hook";
import {
    getBranchSourceQuery,
    getCounsellorSourceQuery,
    getBranchRegisteredAtQuery,
    getCounsellorRegisteredAtQuery
} from "../Queries/BranchPerfomanceQueries";
import { baseurl } from "../../../../lib/Constants";


dayjs.extend(utc);
dayjs.extend(timezone);

const CLUSTER_MAPPING = {
    "Delhi 2": "Aman",
    "Faridabad": "Aman",
    "Ghaziabad": "Aman",

    "Delhi": "Amit",
    "Jaipur": "Amit",
    "Lucknow": "Amit",

    "Bangalore Hebbal": "Kusuma",
    "Bangalore-BTM": "Kusuma",

    "Chennai": "Sai Nath",
    "Dubai": "Sai Nath",
    "Mangalore": "Sai Nath",

    "Gurugram": "North",
    "Chandigarh": "North",
    "Noida": "North",

    "Hyderabad": "Pradeep",
    "Bangalore-Indiranagar": "Pradeep",

    "Coimbatore": "Puneet",
    "Kochi": "Puneet",

    "Mumbai-Andheri": "West",
    "Navi Mumbai": "West",
    "Pune": "West",
    "Pune 2": "West",
    "Thane": "West",
};

function BranchSourcePerformance({
    startDate,
    endDate,
    counsellor,
    leadSource,
    sourceGroup,
    branch,
    role,
    onTotalsChange,
}) {

    const BASE_URL = baseurl;

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [activeTab, setActiveTab] = useState("branch");

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [loginUser, setLoginUser] = useState(null);
    const [allowedUsernames, setAllowedUsernames] = useState([]);
    const { getMqlData, getSqlData, } = useLeadConversion();
    const { renderPercent } = useRegisteredPercentage();

    const leadModulePermission = useSelector(
        (state) => state.permissions.permissionsData
    );

    const isAdmin = leadModulePermission?.user_group === "admin";

    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await getProfileService();
                setLoginUser(res?.data?.data?.username || null);
            } catch (err) {
                console.error("Profile Fetch Error:", err);
            }
        };
        getUser();
    }, []);

    useEffect(() => {
        const fetchCounsellors = async () => {
            try {
                const res = await getLeadCounsellorDropdownService();
                const usernames = (res?.data?.data || []).map(item => item.username);
                setAllowedUsernames(usernames);
            } catch (err) {
                console.error("Counsellor fetch error", err);
            }
        };
        fetchCounsellors();
    }, []);

    const fetchData = async () => {

        if (!loginUser) return;

        setLoading(true);

        try {

            const sourceRes = await axios.post(
                `${BASE_URL}/mondayMeetings/get-crm-records`,
                {
                    query: `
                    SELECT DISTINCT COALESCE(source_group,'Others') AS source_group
                    FROM lead_management_leadsource
                    ORDER BY source_group
                `
                }
            );

            const sourceGroups =
                Array.isArray(sourceRes?.data)
                    ? sourceRes.data
                    : sourceRes?.data?.data || [];


            let conditions = [];

            const regStartDate = startDate
                ? dayjs(startDate)
                    .tz("Asia/Kolkata")
                    .startOf("day")
                    .format("YYYY-MM-DD")
                : dayjs()
                    .tz("Asia/Kolkata")
                    .startOf("day")
                    .format("YYYY-MM-DD");

            const regEndDate = endDate
                ? dayjs(endDate)
                    .tz("Asia/Kolkata")
                    .endOf("day")
                    .format("YYYY-MM-DD")
                : dayjs()
                    .tz("Asia/Kolkata")
                    .endOf("day")
                    .format("YYYY-MM-DD");

            if (role?.length > 0) {
                const values = role.map(r => `'${r}'`).join(",");

                conditions.push(`
                            assign_to_id IN (
                                SELECT username 
                                FROM user_management_user
                                WHERE role_id IN (${values})
                            )
                        `);
            }

            const users = counsellor?.length ? counsellor : allowedUsernames;

            if (users.length > 0) {
                const values = users.map(u => `'${u}'`).join(",");
                conditions.push(`assign_to_id IN (${values})`);
            } else if (!isAdmin && loginUser) {
                conditions.push(`assign_to_id = '${loginUser}'`);
            }

            if (startDate && endDate) {
                const startUTC = dayjs(startDate)
                    .tz("Asia/Kolkata")
                    .startOf("day")
                    .utc()
                    .format("YYYY-MM-DD HH:mm:ss");

                const endUTC = dayjs(endDate)
                    .tz("Asia/Kolkata")
                    .endOf("day")
                    .utc()
                    .format("YYYY-MM-DD HH:mm:ss");

                conditions.push(`created_at BETWEEN '${startUTC}' AND '${endUTC}'`);
            }

            if (leadSource?.length > 0) {
                const values = leadSource.map(id => `'${id}'`).join(",");
                conditions.push(`lead_source_id IN (${values})`);
            }

            if (sourceGroup?.length > 0) {
                const values = sourceGroup.map(g => `'${g}'`).join(",");
                conditions.push(`
                lead_source_id IN (
                    SELECT id FROM lead_management_leadsource
                    WHERE COALESCE(source_group,'Others') IN (${values})
                )
            `);
            }

            if (branch?.length > 0) {
                const values = branch.map(b => `'${b}'`).join(",");
                conditions.push(`
                assign_to_id IN (
                    SELECT user_id FROM user_management_user_branch
                    WHERE branch_id IN (${values})
                )
            `);
            }

            const whereClause = conditions.length
                ? `WHERE ${conditions.join(" AND ")}`
                : "";

            const regConditions = conditions.filter(
                c => !c.includes("created_at")
            );

            const whereClauseWithoutDate = regConditions.length
                ? `WHERE ${regConditions.join(" AND ")}`
                : "";

            const query =
                activeTab === "branch"
                    ? getBranchSourceQuery({ whereClause, sourceGroups })
                    : getCounsellorSourceQuery({ whereClause, sourceGroups });

            const regQuery =
                activeTab === "branch"
                    ? getBranchRegisteredAtQuery({
                        whereClauseWithoutDate,
                        sourceGroups,
                        regStartDate,
                        regEndDate
                    })
                    : getCounsellorRegisteredAtQuery({
                        whereClauseWithoutDate,
                        sourceGroups,
                        regStartDate,
                        regEndDate
                    });

            const res = await axios.post(
                `${BASE_URL}/mondayMeetings/get-crm-records`,
                { query }
            );

            const result =
                Array.isArray(res?.data)
                    ? res.data
                    : res?.data?.data || [];

            const regRes = await axios.post(
                `${BASE_URL}/mondayMeetings/get-crm-records`,
                { query: regQuery }
            );

            const regResult =
                Array.isArray(regRes?.data)
                    ? regRes.data
                    : regRes?.data?.data || [];

            const regMap = {};

            regResult.forEach((r) => {
                const key =
                    activeTab === "branch"
                        ? r.branch_name
                        : r.user_name;

                regMap[key] = r;
            });

            const mergedResult = result.map((row) => {
                const key =
                    activeTab === "branch"
                        ? row.branch_name
                        : row.user_name;

                return {
                    ...row,
                    ...regMap[key],

                    total_registered_at:
                        regMap[key]?.total_registered_at || 0,

                    ...Object.fromEntries(
                        sourceGroups.map((group) => {
                            const safeKey = group.source_group
                                .replace(/\s+/g, "_")
                                .replace(/[^a-zA-Z0-9_]/g, "");

                            return [
                                `${safeKey}_registered_at`,
                                regMap[key]?.[`${safeKey}_registered_at`] || 0
                            ];
                        })
                    )
                };
            });

            const updatedData = mergedResult.map(row => ({
                ...row,
                cluster_head:
                    activeTab === "branch"
                        ? CLUSTER_MAPPING[row.branch_name] || "Others"
                        : row.user_name
            }));

            const clusterTotals = {};

            updatedData.forEach(row => {
                const cluster = row.cluster_head || "Others";
                clusterTotals[cluster] = (clusterTotals[cluster] || 0) + Number(row.total_lead || 0);
            });

            const sortedClusters = Object.entries(clusterTotals)
                .sort((a, b) => b[1] - a[1])
                .map(([cluster]) => cluster);

            const sortedData = [...updatedData].sort((a, b) => {
                const clusterDiff =
                    sortedClusters.indexOf(a.cluster_head) -
                    sortedClusters.indexOf(b.cluster_head);

                if (clusterDiff !== 0) return clusterDiff;

                return (b.total_lead || 0) - (a.total_lead || 0);
            });

            const addClusterSubtotals = (data) => {
                const result = [];
                let currentCluster = null;
                let subtotal = {};

                const initSubtotal = () => ({});

                data.forEach((row, index) => {
                    if (currentCluster !== row.cluster_head) {
                        if (currentCluster !== null) {
                            result.push({
                                ...subtotal,
                                cluster_head: `${currentCluster} Total`,
                                [activeTab === "branch" ? "branch_name" : "user_name"]: "",
                                isSubtotal: true,
                            });
                        }

                        currentCluster = row.cluster_head;
                        subtotal = initSubtotal();
                    }

                    Object.keys(row).forEach((key) => {
                        if (
                            key !== "branch_name" &&
                            key !== "cluster_head" &&
                            key !== "isSubtotal"
                        ) {
                            subtotal[key] = (subtotal[key] || 0) + Number(row[key] || 0);
                        }
                    });

                    result.push(row);

                    if (index === data.length - 1) {
                        result.push({
                            ...subtotal,
                            cluster_head: `${currentCluster} Total`,
                            [activeTab === "branch" ? "branch_name" : "user_name"]: "",
                            isSubtotal: true,
                        });
                    }
                });

                return result;
            };

            const finalData =
                activeTab === "branch"
                    ? addClusterSubtotals(sortedData)
                    : sortedData;
            setData(finalData);

            const dynamicColumns = [
                ...(activeTab === "branch"
                    ? [{
                        title: "Cluster Head",
                        dataIndex: "cluster_head",
                        fixed: "left",
                        align: "left",
                        render: (text, row) =>
                            row.isSubtotal ? <strong>{text}</strong> : text,
                    }]
                    : []),
                {
                    title: activeTab === "branch" ? "Branch" : "Counsellor",
                    dataIndex: activeTab === "branch" ? "branch_name" : "user_name",
                    fixed: "left",
                    width: 250,
                    align: "left"
                },
                {
                    title: "Total Lead",
                    className: "group-divider",
                    fixed: "left",
                    children: [
                        {
                            title: "Lead",
                            dataIndex: "total_lead",
                            align: "center",
                        },
                        {
                            title: "MQL",
                            dataIndex: "total_mql",
                            align: "center",
                        },
                        {
                            title: "MQL %",
                            dataIndex: "total_mql_pct",
                            align: "center",
                            render: (_, row) => {
                                const { percent, color } = getMqlData(row.total_mql, row.total_lead);

                                return percent !== null ? (
                                    <span className={color}>{percent}%</span>
                                ) : "0%";
                            },
                        },
                        {
                            title: "SQL",
                            dataIndex: "total_sql",
                            align: "center",
                        },
                        {
                            title: "SQL %",
                            dataIndex: "total_sql_pct",
                            align: "center",
                            render: (_, row) => {
                                const { percent, color } = getSqlData(row.total_sql, row.total_mql);

                                return percent !== null ? (
                                    <span className={color}>{percent}%</span>
                                ) : "0%";
                            },
                        },
                        {
                            title: "Reg From",
                            dataIndex: "total_registered",
                            align: "center",
                        },
                        {
                            title: "Reg At",
                            dataIndex: "total_registered_at",
                            align: "center",
                        },
                        {
                            title: "Lead → Reg %",
                            dataIndex: "total_registered_pct",
                            align: "center",
                            className: "group-divider",
                            render: (_, row) => {
                                const percent = row.total_lead
                                    ? (row.total_registered / row.total_lead) * 100
                                    : 0;

                                return renderPercent(percent);
                            },
                        },
                    ],
                },
            ];

            sourceGroups.forEach((group) => {
                const key = group.source_group
                    .replace(/\s+/g, "_")
                    .replace(/[^a-zA-Z0-9_]/g, "");

                dynamicColumns.push({
                    title: group.source_group,
                    className: "group-header",
                    children: [
                        {
                            title: "Lead",
                            dataIndex: `${key}_total`,
                            align: "center",
                        },
                        {
                            title: "MQL",
                            dataIndex: `${key}_mql`,
                            align: "center",
                        },
                        {
                            title: "MQL %",
                            align: "center",
                            dataIndex: `${key}_mql_pct`,
                            render: (_, row) => {
                                const { percent, color } = getMqlData(
                                    row[`${key}_mql`],
                                    row[`${key}_total`]
                                );

                                return percent !== null ? (
                                    <span className={color}>{percent}%</span>
                                ) : "0%";
                            },
                        },
                        {
                            title: "SQL",
                            dataIndex: `${key}_sql`,
                            align: "center",
                        },
                        {
                            title: "SQL %",
                            align: "center",
                            dataIndex: `${key}_sql_pct`,
                            render: (_, row) => {
                                const { percent, color } = getSqlData(
                                    row[`${key}_sql`],
                                    row[`${key}_mql`]
                                );

                                return percent !== null ? (
                                    <span className={color}>{percent}%</span>
                                ) : "0%";
                            },
                        },
                        {
                            title: "Reg From",
                            dataIndex: `${key}_registered`,
                            align: "center",
                        },
                        {
                            title: "Reg At",
                            dataIndex: `${key}_registered_at`,
                            align: "center",
                        },
                        {
                            title: "Lead → Reg %",
                            dataIndex: `${key}_registered_pct`,
                            align: "center",
                            className: "group-divider",
                            render: (_, row) => {
                                const percent = row[`${key}_total`]
                                    ? (row[`${key}_registered`] / row[`${key}_total`]) * 100
                                    : 0;

                                return renderPercent(percent);
                            },
                        },
                    ]
                });
            });

            const filteredColumns = removeZeroColumns(dynamicColumns, finalData);

            const fixedColumns =
                activeTab === "branch"
                    ? filteredColumns.slice(0, 2)
                    : filteredColumns.slice(0, 1);

            const dynamicCols =
                activeTab === "branch"
                    ? filteredColumns.slice(2)
                    : filteredColumns.slice(1);

            const sortedDynamic = sortColumnsByTotal(dynamicCols, updatedData);

            const sortedColumns = [...fixedColumns, ...sortedDynamic];

            setColumns(sortedColumns);
            setColumns(sortedColumns);

        } catch (err) {
            console.error("Branch Source Performance Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (loginUser && allowedUsernames.length > 0) {
            fetchData();
        }
    }, [
        loginUser,
        startDate,
        endDate,
        counsellor,
        leadSource,
        sourceGroup,
        branch,
        role,
        allowedUsernames,
        activeTab
    ]);

    const paginatedData = useMemo(
        () => data.slice((page - 1) * pageSize, page * pageSize),
        [data, page, pageSize]
    );

    const totals = useMemo(() => {
        const totalObj = {};

        const processColumns = (cols) => {
            cols.forEach(col => {
                if (col.children) {
                    processColumns(col.children);
                } else if (
                    col.dataIndex !== "branch_name" &&
                    col.dataIndex !== "cluster_head" &&
                    !col.dataIndex?.includes("_pct")
                ) {
                    totalObj[col.dataIndex] = data
                        .filter(row => !row.isSubtotal)
                        .reduce(
                            (sum, row) => sum + Number(row[col.dataIndex] || 0),
                            0
                        );
                }
            });
        };

        processColumns(columns);
        return totalObj;
    }, [data, columns]);

    useEffect(() => {
        if (onTotalsChange) {
            onTotalsChange({
                total_lead: totals?.total_lead,
                total_mql: totals?.total_mql,
                total_sql: totals?.total_sql,
            });
        }
    }, [totals]);

    return (
        <div className="rounded-lg p-4">

            <Spin spinning={loading}>

                <Tabs
                    activeKey={activeTab}
                    onChange={(key) => {
                        setActiveTab(key);
                        setPage(1);
                    }}
                    className="mb-2"
                    items={[
                        {
                            key: "branch",
                            label: <strong>Branch</strong>,
                        },
                        {
                            key: "user",
                            label: <strong>Counsellor</strong>,
                        }
                    ]}
                />

                <Table
                    size="small"
                    rowKey={(row, index) =>
                        activeTab === "branch"
                            ? `${row.cluster_head}-${row.branch_name}`
                            : `${row.user_name}-${index}`
                    }
                    columns={columns}
                    dataSource={paginatedData}
                    pagination={false}
                    scroll={{ x: "max-content" }}
                    locale={{
                        emptyText: <Empty description="No branch performance data available" />
                    }}
                    rowClassName={(row) =>
                        row.isSubtotal ? "total-row" : ""
                    }
                    summary={() => {
                        const cells = [];

                        const processColumns = (cols) => {
                            cols.forEach((col) => {
                                if (col.children) {
                                    processColumns(col.children);
                                } else {
                                    const dataIndex = col.dataIndex || "";

                                    cells.push(
                                        <Table.Summary.Cell
                                            key={`${dataIndex}-${cells.length}`}
                                            index={cells.length}
                                            align={col.align || "center"}
                                            className={
                                                dataIndex.includes("_registered_pct") ? "group-divider" : ""
                                            }
                                        >
                                            {
                                                // ===== LABEL COLUMNS =====
                                                dataIndex === "cluster_head" ? (
                                                    <strong>Grand Total</strong>
                                                ) : dataIndex === "branch_name" ? (
                                                    <strong></strong>
                                                ) : dataIndex === "user_name" ? (
                                                    <strong>Grand Total</strong>
                                                )

                                                    // ===== MQL % =====
                                                    : col.title === "MQL %" ? (() => {
                                                        const parentKey = dataIndex.replace("_mql_pct", "");

                                                        const mqlKey = parentKey
                                                            ? `${parentKey}_mql`
                                                            : "total_mql";

                                                        const totalKey =
                                                            parentKey && parentKey !== "total"
                                                                ? `${parentKey}_total`
                                                                : "total_lead";

                                                        const { percent, color } = getMqlData(
                                                            totals[mqlKey],
                                                            totals[totalKey]
                                                        );

                                                        return (
                                                            <strong className={color}>
                                                                {percent !== null ? `${percent}%` : "0%"}
                                                            </strong>
                                                        );
                                                    })()

                                                        // ===== SQL % =====
                                                        : col.title === "SQL %" ? (() => {
                                                            const parentKey = dataIndex.replace("_sql_pct", "");

                                                            const sqlKey = parentKey
                                                                ? `${parentKey}_sql`
                                                                : "total_sql";

                                                            const mqlKey =
                                                                parentKey && parentKey !== "total"
                                                                    ? `${parentKey}_mql`
                                                                    : "total_mql";

                                                            const { percent, color } = getSqlData(
                                                                totals[sqlKey],
                                                                totals[mqlKey]
                                                            );

                                                            return (
                                                                <strong className={color}>
                                                                    {percent !== null ? `${percent}%` : "0%"}
                                                                </strong>
                                                            );
                                                        })()

                                                            // ===== LEAD → REG % =====
                                                            : col.title === "Lead → Reg %" ? (() => {
                                                                const parentKey = dataIndex.replace("_registered_pct", "");

                                                                const totalLead =
                                                                    parentKey && totals[`${parentKey}_total`] !== undefined
                                                                        ? totals[`${parentKey}_total`]
                                                                        : totals["total_lead"];

                                                                const totalRegistered =
                                                                    parentKey && totals[`${parentKey}_registered`] !== undefined
                                                                        ? totals[`${parentKey}_registered`]
                                                                        : totals["total_registered"];

                                                                const percent = totalLead
                                                                    ? (totalRegistered / totalLead) * 100
                                                                    : 0;

                                                                return <strong>{renderPercent(percent)}</strong>;
                                                            })()

                                                                // ===== NORMAL NUMBERS =====
                                                                : (
                                                                    <strong>{totals[dataIndex] || 0}</strong>
                                                                )
                                            }
                                        </Table.Summary.Cell>
                                    );
                                }
                            });
                        };

                        processColumns(columns);

                        return (
                            <Table.Summary fixed="bottom">
                                <Table.Summary.Row>
                                    {cells}
                                </Table.Summary.Row>
                            </Table.Summary>
                        );
                    }}
                />

                <div className="flex justify-between items-center mt-3">
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
                    <div className="text-sm dark:text-yellow-500 text-black">
                        {Math.min(page * pageSize, data.length)} of {data.length} records
                    </div>
                </div>

            </Spin>
        </div>
    );
}

export default BranchSourcePerformance;