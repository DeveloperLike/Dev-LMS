import axios from "axios";
import { Empty, Spin, Table, Pagination, message } from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { buildCondition } from "../../hook";
import { getProfileService } from "../../../Profile/ApiService";
import { useSelector } from "react-redux";
import { getLeadCounsellorDropdownService } from "../../ApiService";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { YgApi } from "../../../../lib/Constants";
import { getCounsellorBranchJunkQuery } from "../Queries/BranchPerfomanceQueries";

dayjs.extend(utc);
dayjs.extend(timezone);

const BASE_URL = YgApi;

function BranchJunk({
    leadType,
    startDate,
    endDate,
    counsellor,
    sourceGroup,
    leadSource,
    branch,
    role,
}) {

    const permissions = useSelector(
        (state) => state.permissions.permissionsData
    );
    const isAdmin = permissions?.user_group === "admin";
    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState([]);
    const [loginUser, setLoginUser] = useState(null);
    const [allowedUsers, setAllowedUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalRows, setTotalRows] = useState(0);
    const [dynamicStatuses, setDynamicStatuses] = useState([]);
    const [grandTotals, setGrandTotals] = useState({
        totalleads: 0,
        junk: 0,
        mql: 0,
        sql: 0,
    });
    const startUTC = startDate
        ? dayjs(startDate)
            .tz("Asia/Kolkata")
            .startOf("day")
            .utc()
            .format("YYYY-MM-DD HH:mm:ss")
        : dayjs()
            .tz("Asia/Kolkata")
            .startOf("day")
            .utc()
            .format("YYYY-MM-DD HH:mm:ss");

    const endUTC = endDate
        ? dayjs(endDate)
            .tz("Asia/Kolkata")
            .endOf("day")
            .utc()
            .format("YYYY-MM-DD HH:mm:ss")
        : dayjs()
            .tz("Asia/Kolkata")
            .endOf("day")
            .utc()
            .format("YYYY-MM-DD HH:mm:ss");

    const fetchCrmQuery = async (query) => {

        try {

            const { data } = await axios.post(
                `${BASE_URL}/mondayMeetings/get-crm-records`,
                { query }
            );

            return data || [];

        } catch (error) {

            console.error(error);

            return [];
        }
    };

    const fetchCounsellors = async () => {

        try {

            const res = await getLeadCounsellorDropdownService();

            const usernames = (res?.data?.data || []).map(
                (i) => i.username
            );

            setAllowedUsers(usernames);

        } catch (error) {

            console.error(error);
        }
    };

    const fetchData = useCallback(async () => {

        if (
            !loginUser ||
            (!counsellor?.length && allowedUsers.length === 0)
        ) {
            return;
        }

        setLoading(true);

        try {

            let branchCondition = "";

            if (Array.isArray(branch) && branch.length > 0) {

                const values = branch
                    .map((b) => `'${b}'`)
                    .join(",");

                branchCondition = `
                    lml.assign_to_id IN (
                        SELECT user_id
                        FROM user_management_user_branch
                        WHERE branch_id IN (${values})
                    )
                `;
            }

            let conditions = [];

            conditions.push(`
                lml.created_at BETWEEN '${startUTC}'
                AND '${endUTC}'
            `);

            if (role?.length) {

                const values = role
                    .map((r) => `'${r}'`)
                    .join(",");

                conditions.push(`
                    lml.assign_to_id IN (
                        SELECT username
                        FROM user_management_user
                        WHERE role_id IN (${values})
                    )
                `);
            }

            if (sourceGroup?.length) {

                const values = sourceGroup
                    .map((s) => `'${s}'`)
                    .join(",");

                conditions.push(`
                lml.lead_source_id IN (
                    SELECT id
                    FROM lead_management_leadsource
                    WHERE source_group IN (${values})
                )
            `);

            }

            if (branchCondition) {
                conditions.push(branchCondition);
            }

            const users = counsellor?.length
                ? counsellor
                : allowedUsers;

            if (users?.length) {

                conditions.push(
                    buildCondition(
                        "lml.assign_to_id",
                        users,
                        false
                    )
                );

            } else if (!isAdmin && loginUser) {

                conditions.push(`
                    lml.assign_to_id='${loginUser}'
                `);
            }

            const whereClause =
                conditions.length > 0
                    ? "WHERE " + conditions.join(" AND ")
                    : "";

            const offset = (page - 1) * pageSize;

            const query = getCounsellorBranchJunkQuery({
                whereClause,
                pageSize,
                offset,
                leadType,
            });

            const result = await fetchCrmQuery(query);

            const data = Array.isArray(result)
                ? result
                : result?.data || [];

            const statusKeys = new Set();

            data.forEach((item) => {

                const statuses =
                    item.lead_status_counts || {};

                Object.keys(statuses).forEach((key) => {
                    statusKeys.add(key);
                });

            });

            setDynamicStatuses([...statusKeys]);

            setRows(data);

            setTotalRows(data?.[0]?.total_count || 0);

            setGrandTotals({
                totalleads: data?.[0]?.grand_totalleads || 0,
                junk: data?.[0]?.grand_junk || 0,
                mql: data?.[0]?.grand_mql || 0,
                sql: data?.[0]?.grand_sql || 0,
            });

        } catch (error) {

            console.error(error);

            message.error(
                "Failed to fetch junk report"
            );
        }

        setLoading(false);

    }, [
        leadType,
        startUTC,
        leadSource,
        sourceGroup,
        counsellor,
        branch,
        role,
        allowedUsers,
        loginUser,
        isAdmin,
        page,
        pageSize,
    ]);

    const columns = useMemo(() => {

        const statusTotals =
            rows?.[0]?.grand_status_counts || {};

        const sortedStatuses = [...dynamicStatuses].sort(
            (a, b) => {

                const aTotal = Number(
                    statusTotals[a] || 0
                );

                const bTotal = Number(
                    statusTotals[b] || 0
                );

                return bTotal - aTotal;

            }
        );

        const dynamicColumns = sortedStatuses.map(
            (status) => ({
                title: status,
                align: "center",
                onHeaderCell: () => ({
                    style: {
                        whiteSpace: "nowrap",
                    },
                }),

                render: (_, row) => {

                    return (
                        <span className={row.isSubtotal ? "font-bold dark:text-white text-black" : ""}>
                            {row?.lead_status_counts?.[status] || 0}
                        </span>
                    );
                },
            })
        );

        return [

            {
                title: "Branch",
                dataIndex: "branch",

                fixed: "left",
                render: (text, row) => (
                    <span className={row.isSubtotal ? "font-bold dark:text-white text-black" : ""}>
                        {text}
                    </span>
                ),
            },

            {
                title: "Counsellor",
                dataIndex: "counsellor",
                fixed: "left",
                render: (text, row) => (
                    <span className={row.isSubtotal ? "font-bold dark:text-white text-black" : ""}>
                        {text}
                    </span>
                ),
            },

            {
                title: "Total Lead",
                dataIndex: "totalleads",
                align: "center",
                fixed: "left",
                render: (text, row) => (
                    <span className={row.isSubtotal ? "font-bold dark:text-white text-black" : ""}>
                        {text}
                    </span>
                ),
            },

            {
                title: "Junk",
                dataIndex: "junk",
                align: "center",
                fixed: "left",
                render: (text, row) => (
                    <span className={row.isSubtotal ? "font-bold dark:text-white text-black" : ""}>
                        {text}
                    </span>
                ),
            },

            {
                title: "Junk %",
                align: "center",
                fixed: "left",
                render: (_, row) => {

                    const denominator = row.totalleads || 0;

                    const percent =
                        denominator > 0
                            ? (
                                (row.junk / denominator) * 100
                            ).toFixed(1)
                            : 0;

                    return (
                        <span className={row.isSubtotal ? "font-bold dark:text-white text-black" : ""}>
                            {percent}%
                        </span>
                    );
                },
            },

            ...dynamicColumns,

        ];

    }, [dynamicStatuses, rows, grandTotals]);

    useEffect(() => {

        fetchCounsellors();

    }, []);

    useEffect(() => {

        getProfileService().then((res) =>
            setLoginUser(
                res?.data?.data?.username || null
            )
        );

    }, []);

    useEffect(() => {

        if (!loginUser) return;

        fetchData();

    }, [fetchData, loginUser]);

    return (
        <div className="p-4">

            <Spin spinning={loading}>

                <Table
                    columns={columns}
                    dataSource={(() => {

                        const groupedData = [];
                        const groupTotals = {};

                        rows.forEach((row) => {

                            const group = row.branch;

                            if (!groupTotals[group]) {

                                groupTotals[group] = {
                                    key: `subtotal-${group}`,
                                    isSubtotal: true,
                                    branch: `${group} Total`,
                                    counsellor: "",
                                    totalleads: 0,
                                    junk: 0,
                                    lead_status_counts: {},
                                };
                            }

                            groupTotals[group].totalleads += Number(
                                row.totalleads || 0
                            );

                            groupTotals[group].junk += Number(
                                row.junk || 0
                            );

                            Object.entries(
                                row.lead_status_counts || {}
                            ).forEach(([key, value]) => {

                                groupTotals[group]
                                    .lead_status_counts[key] =
                                    (
                                        groupTotals[group]
                                            .lead_status_counts[key] || 0
                                    ) + Number(value || 0);

                            });

                        });

                        const groupedRows = {};

                        rows.forEach((row) => {

                            const group = row.branch;

                            if (!groupedRows[group]) {
                                groupedRows[group] = [];
                            }

                            groupedRows[group].push(row);

                        });

                        Object.keys(groupedRows)
                            .sort((a, b) => {

                                const aTotal =
                                    groupTotals[a]?.junk || 0;

                                const bTotal =
                                    groupTotals[b]?.junk || 0;

                                return bTotal - aTotal;

                            })
                            .forEach((group) => {

                                groupedData.push(
                                    ...groupedRows[group]
                                );

                                groupedData.push(
                                    groupTotals[group]
                                );

                            });

                        return groupedData;

                    })()}
                    rowClassName={(row) =>
                        row.isSubtotal ? "total-row" : ""
                    }
                    pagination={false}
                    size="small"
                    scroll={{ x: "max-content" }}
                    rowKey={(r, index) =>
                        r.key || `${r.branch}-${r.counsellor}-${index}`
                    }
                    locale={{
                        emptyText: (
                            <Empty description="No junk data available" />
                        ),
                    }}
                    summary={() => {

                        const totals = {
                            totalleads: Number(
                                grandTotals.totalleads || 0
                            ),

                            junk: Number(
                                grandTotals.junk || 0
                            ),
                        };

                        const dynamicTotals = {};

                        Object.entries(
                            rows?.[0]?.grand_status_counts || {}
                        ).forEach(([key, value]) => {

                            dynamicTotals[key] = Number(value || 0);

                        });

                        return (

                            <Table.Summary fixed>

                                <Table.Summary.Row>

                                    {columns.map((col, index) => {

                                        if (col.dataIndex === "branch") {

                                            return (
                                                <Table.Summary.Cell
                                                    key={index}
                                                    index={index}
                                                    align="left"
                                                >
                                                    <span className="font-bold text-black dark:text-white">
                                                        Grand Total
                                                    </span>
                                                </Table.Summary.Cell>
                                            );
                                        }

                                        if (col.dataIndex === "counsellor") {

                                            return (
                                                <Table.Summary.Cell
                                                    key={index}
                                                    index={index}
                                                    align="center"
                                                />
                                            );
                                        }

                                        if (col.dataIndex === "totalleads") {

                                            return (
                                                <Table.Summary.Cell
                                                    key={index}
                                                    index={index}
                                                    align="center"
                                                >
                                                    <span className="font-bold text-black dark:text-white">
                                                        {totals.totalleads}
                                                    </span>
                                                </Table.Summary.Cell>
                                            );
                                        }

                                        if (col.dataIndex === "junk") {

                                            return (
                                                <Table.Summary.Cell
                                                    key={index}
                                                    index={index}
                                                    align="center"
                                                >
                                                    <span className="font-bold text-black dark:text-white">
                                                        {totals.junk}
                                                    </span>
                                                </Table.Summary.Cell>
                                            );
                                        }

                                        if (col.title === "Junk %") {

                                            const denominator = totals.totalleads || 0;

                                            const percent =
                                                denominator > 0
                                                    ? (
                                                        (
                                                            totals.junk /
                                                            denominator
                                                        ) * 100
                                                    ).toFixed(1)
                                                    : 0;

                                            return (
                                                <Table.Summary.Cell
                                                    key={index}
                                                    index={index}
                                                    align="center"
                                                >
                                                    <span className="font-bold text-black dark:text-white">
                                                        {percent}%
                                                    </span>
                                                </Table.Summary.Cell>
                                            );
                                        }

                                        return (
                                            <Table.Summary.Cell
                                                key={index}
                                                index={index}
                                                align="center"
                                            >
                                                <span className="font-bold text-black dark:text-white">
                                                    {
                                                        dynamicTotals[
                                                        col.title
                                                        ] || 0
                                                    }
                                                </span>
                                            </Table.Summary.Cell>
                                        );

                                    })}

                                </Table.Summary.Row>

                            </Table.Summary>

                        );
                    }}
                />

                <div className="flex justify-between items-center mt-3">

                    <Pagination
                        current={page}
                        pageSize={pageSize}
                        total={totalRows}
                        showSizeChanger
                        showQuickJumper
                        size="small"
                        onChange={(p, s) => {
                            setPage(p);
                            setPageSize(s);
                        }}
                    />

                    <span className="text-sm text-black dark:text-yellow-500">
                        {Math.min(page * pageSize, totalRows)} of {totalRows} records
                    </span>

                </div>

            </Spin>

        </div>
    );
}

export default BranchJunk;