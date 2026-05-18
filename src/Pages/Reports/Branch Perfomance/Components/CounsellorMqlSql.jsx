import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Table, Spin, Empty, Pagination } from "antd";
import { useSelector } from "react-redux";
import { getProfileService } from "../../../Profile/ApiService";
import { getLeadCounsellorDropdownService } from "../../ApiService";
import { removeZeroColumns, useLeadConversion } from "../../hook";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { getCounsellorMqlSqlQuery } from "../Queries/BranchPerfomanceQueries";
import { baseurl } from "../../../../lib/Constants";

dayjs.extend(utc);
dayjs.extend(timezone);

function CounsellorMqlSql({ startDate, endDate, counsellor, leadSource, sourceGroup, branch, role }) {

    const BASE_URL = baseurl;

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [loginUser, setLoginUser] = useState(null);
    const [allowedUsernames, setAllowedUsernames] = useState([]);

    const { getMqlData, getSqlData } = useLeadConversion();

    const leadModulePermission = useSelector(
        (state) => state.permissions.permissionsData
    );

    const isAdmin = leadModulePermission?.user_group === "admin";

    /* ---------------- GET USER ---------------- */
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

    /* ---------------- FETCH COUNSELLORS ---------------- */
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

            const conditions = [];

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
                conditions.push(`lml.assign_to_id IN (${values})`);
            } else if (!isAdmin && loginUser) {
                conditions.push(`lml.assign_to_id='${loginUser}'`);
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

                conditions.push(`lml.created_at BETWEEN '${startUTC}' AND '${endUTC}'`);
            }

            if (leadSource?.length > 0) {
                const values = leadSource.map(id => `'${id}'`).join(",");
                conditions.push(`lml.lead_source_id IN (${values})`);
            }

            if (sourceGroup?.length > 0) {
                const values = sourceGroup.map(g => `'${g}'`).join(",");
                conditions.push(`COALESCE(lmls.source_group,'Others') IN (${values})`);
            }

            if (branch?.length > 0) {
                const values = branch.map(b => `'${b}'`).join(",");
                conditions.push(`bmb.id IN (${values})`);
            }

            const whereClause = conditions.length
                ? `WHERE ${conditions.join(" AND ")}`
                : "";

            /* -------- QUERY -------- */
            const query = getCounsellorMqlSqlQuery({ whereClause });
            /* -------- QUERY -------- */

            const res = await axios.post(
                `${BASE_URL}/mondayMeetings/get-crm-records`,
                { query }
            );

            const result =
                Array.isArray(res?.data)
                    ? res.data
                    : res?.data?.data || [];

            setData(result);

        } catch (err) {
            console.error("Counsellor MQL SQL Error:", err);
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

    /* ---------------- PAGINATION ---------------- */
    const paginatedData = useMemo(
        () => data.slice((page - 1) * pageSize, page * pageSize),
        [data, page, pageSize]
    );

    /* ---------------- COLUMNS ---------------- */
    const baseColumns = [
        {
            title: "Counsellor",
            dataIndex: "user_name",
            fixed: "left",
            width: 250,
            align: "left"
        },
        {
            title: "Total Lead",
            dataIndex: "total_lead",
            align: "center",
            width: 150
        },
        {
            title: "MQL",
            dataIndex: "mql",
            align: "center",
            render: (value, record) => {
                const d = getMqlData(value, record.total_lead);
                return (
                    <>
                        {d.value}
                        {d.percent !== null && (
                            <span className={`${d.color} ml-1`}>({d.percent}%)</span>
                        )}
                    </>
                );
            }
        },
        {
            title: "SQL",
            dataIndex: "sql",
            align: "center",
            render: (value, record) => {
                const d = getSqlData(value, record.mql);
                return (
                    <>
                        {d.value}
                        {d.percent !== null && (
                            <span className={`${d.color} ml-1`}>({d.percent}%)</span>
                        )}
                    </>
                );
            }
        }
    ];

    const columns = useMemo(() => removeZeroColumns(baseColumns, data), [data]);

    /* ---------------- TOTALS ---------------- */
    const totals = useMemo(() => {
        return data.reduce(
            (acc, row) => {
                acc.total_lead += Number(row.total_lead || 0);
                acc.mql += Number(row.mql || 0);
                acc.sql += Number(row.sql || 0);
                return acc;
            },
            { total_lead: 0, mql: 0, sql: 0 }
        );
    }, [data]);

    /* ---------------- UI ---------------- */
    return (
        <div className="rounded-lg p-4 shadow-default bg-white dark:bg-boxdark">

            <Spin spinning={loading}>

                <Table
                    size="small"
                    rowKey="user_name"
                    columns={columns}
                    dataSource={paginatedData}
                    pagination={false}
                    scroll={{ x: "max-content" }}
                    locale={{
                        emptyText: <Empty description="No Counsellor MQL SQL data available" />
                    }}
                    summary={() => (
                        <Table.Summary fixed="bottom">
                            <Table.Summary.Row>
                                {columns.map((col, index) => {

                                    if (col.dataIndex === "user_name") {
                                        return <Table.Summary.Cell key={index}><strong>Total</strong></Table.Summary.Cell>;
                                    }

                                    if (col.dataIndex === "total_lead") {
                                        return <Table.Summary.Cell key={index} align="center"><strong>{totals.total_lead}</strong></Table.Summary.Cell>;
                                    }

                                    if (col.dataIndex === "mql") {
                                        const d = getMqlData(totals.mql, totals.total_lead);
                                        return <Table.Summary.Cell key={index} align="center"><strong>{d.value}</strong> <span className={d.color}>({d.percent}%)</span></Table.Summary.Cell>;
                                    }

                                    if (col.dataIndex === "sql") {
                                        const d = getSqlData(totals.sql, totals.mql);
                                        return <Table.Summary.Cell key={index} align="center"><strong>{d.value}</strong> <span className={d.color}>({d.percent}%)</span></Table.Summary.Cell>;
                                    }

                                    return null;
                                })}
                            </Table.Summary.Row>
                        </Table.Summary>
                    )}
                />

                <div className="flex justify-between mt-3">
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

export default CounsellorMqlSql;