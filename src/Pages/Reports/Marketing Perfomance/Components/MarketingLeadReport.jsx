import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Table, Spin, Empty, Pagination } from "antd";
import { useSelector } from "react-redux";
import { getProfileService } from "../../../Profile/ApiService";
import { getLeadCounsellorDropdownService } from "../../ApiService";
import { removeZeroColumns, sortColumnsByTotal } from "../../hook";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useRegisteredPercentage } from "../../hook";
import {
    getMarketingLeadQuery,
    getMarketingRegisteredAtQuery
} from "../Queries/MarketingPerfomanceQueries";

import { YgApi } from "../../../../lib/Constants";

dayjs.extend(utc);
dayjs.extend(timezone);

function MarketingLeadReport({ startDate, endDate, counsellor, leadSource, sourceGroup, branch, role }) {

    const BASE_URL = YgApi;

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [loginUser, setLoginUser] = useState(null);
    const [allowedUsernames, setAllowedUsernames] = useState([]);
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

            const regConditions = conditions.filter(
                c => !c.includes("created_at")
            );

            const whereClauseWithoutDate = regConditions.length
                ? `WHERE ${regConditions.join(" AND ")}`
                : "";

            const whereClause = conditions.length
                ? `WHERE ${conditions.join(" AND ")}`
                : "";

            const query = getMarketingLeadQuery({
                whereClause,
                sourceGroups
            });

            const regQuery = getMarketingRegisteredAtQuery({
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

            setData(result);

            const regMap = {};

            regResult.forEach((r) => {
                regMap[r.branch_name] = r;
            });

            const mergedResult = result.map((row) => ({
                ...row,
                ...regMap[row.branch_name],

                total_registered_at:
                    regMap[row.branch_name]?.total_registered_at || 0,

                ...Object.fromEntries(
                    sourceGroups.map((group) => {
                        const key = group.source_group
                            .replace(/\s+/g, "_")
                            .replace(/[^a-zA-Z0-9_]/g, "");

                        return [
                            `${key}_registered_at`,
                            regMap[row.branch_name]?.[`${key}_registered_at`] || 0
                        ];
                    })
                )
            }));

            setData(mergedResult);

            const dynamicColumns = [
                {
                    title: "Branch",
                    dataIndex: "branch_name",
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
                            title: "DNP",
                            dataIndex: "total_dnp",
                            align: "center",
                        },
                        {
                            title: "Junk",
                            dataIndex: "total_junk",
                            align: "center",
                        },
                        {
                            title: "Marketing Junk",
                            dataIndex: "total_marketing_junk",
                            align: "center",
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
                            render: (_, r) => {
                                const percent = r.total_lead
                                    ? (r.total_registered / r.total_lead) * 100
                                    : 0;

                                return renderPercent(percent);
                            },
                            align: "center",
                            className: "group-divider",
                        }
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
                            title: "DNP",
                            dataIndex: `${key}_dnp`,
                            align: "center",
                        },
                        {
                            title: "Junk",
                            dataIndex: `${key}_junk`,
                            align: "center",
                        },
                        {
                            title: "Marketing Junk",
                            dataIndex: `${key}_marketing_junk`,
                            align: "center",
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
                            render: (_, r) => {
                                const percent = r[`${key}_total`]
                                    ? (r[`${key}_registered`] / r[`${key}_total`]) * 100
                                    : 0;

                                return renderPercent(percent);
                            },
                            className: "group-divider",
                            align: "center",
                        }
                    ]
                });
            });

            const filteredColumns = removeZeroColumns(dynamicColumns, result);
            const fixedColumns = filteredColumns.slice(0, 2);
            const dynamicCols = filteredColumns.slice(2);

            const sortedDynamic = sortColumnsByTotal(dynamicCols, result);

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
        allowedUsernames
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
                    !col.dataIndex.includes("registered_pct")
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

    return (
        <div className="p-4">

            <Spin spinning={loading}>

                <Table
                    size="small"
                    rowKey={(row) => row.branch_name}
                    columns={columns}
                    dataSource={paginatedData}
                    pagination={false}
                    scroll={{ x: "max-content" }}
                    locale={{
                        emptyText: <Empty description="No Marketing Lead Report data available" />
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
                                    cells.push(
                                        <Table.Summary.Cell
                                            key={`${col.dataIndex}-${cells.length}`}
                                            index={cells.length}
                                            align={col.align || "center"}
                                            className={
                                                col.dataIndex?.includes("registered_pct")
                                                    ? "group-divider"
                                                    : ""
                                            }
                                        >
                                            {
                                                col.dataIndex === "branch_name"
                                                    ? <strong>Grand Total</strong>
                                                    : col.dataIndex?.includes("registered_pct")
                                                        ? (() => {
                                                            const prefix = col.dataIndex.replace("_registered_pct", "");

                                                            const totalLead =
                                                                totals[`${prefix}_total`] ?? totals["total_lead"];

                                                            const totalRegistered =
                                                                totals[`${prefix}_registered`] ?? totals["total_registered"];

                                                            const percent = totalLead
                                                                ? (totalRegistered / totalLead) * 100
                                                                : 0;

                                                            return <strong>{renderPercent(percent)}</strong>;
                                                        })()
                                                        : <strong>{totals[col.dataIndex] || 0}</strong>
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

export default MarketingLeadReport;