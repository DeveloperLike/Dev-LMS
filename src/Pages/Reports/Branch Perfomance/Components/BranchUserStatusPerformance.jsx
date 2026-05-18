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
import { getBranchUserStatusQuery } from "../Queries/BranchPerfomanceQueries";
import { baseurl } from "../../../../lib/Constants.jsx";

dayjs.extend(utc);
dayjs.extend(timezone);

function BranchUserStatusPerformance({ startDate, endDate, counsellor, leadSource, sourceGroup, branch, role }) {

    const BASE_URL = baseurl;

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [loginUser, setLoginUser] = useState(null);
    const [allowedUsernames, setAllowedUsernames] = useState([]);

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

            const statusRes = await axios.post(
                `${BASE_URL}/mondayMeetings/get-crm-records`,
                {
                    query: `SELECT name FROM lead_management_leadstatus ORDER BY name`
                }
            );

            const statuses =
                Array.isArray(statusRes?.data)
                    ? statusRes.data
                    : statusRes?.data?.data || [];

            let conditions = [];

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
                    WHERE source_group IN (${values})
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


            const query = getBranchUserStatusQuery({ whereClause, statuses });

            const res = await axios.post(
                `${BASE_URL}/mondayMeetings/get-crm-records`,
                { query }
            );

            const result =
                Array.isArray(res?.data)
                    ? res.data
                    : res?.data?.data || [];

            const sortedResult = [...result].sort(
                (a, b) => (b.total_lead || 0) - (a.total_lead || 0)
            );

            setData(sortedResult);

            const dynamicColumns = [
                {
                    title: "Counsellor",
                    dataIndex: "user_name",
                    fixed: "left",
                    width: 250,
                    align: "left",
                },
                {
                    title: "Total Lead",
                    dataIndex: "total_lead",
                    align: "center",
                    fixed: "left",
                    width: 120,
                },
            ];

            statuses.forEach((status) => {
                const key = status.name
                    .replace(/\s+/g, "_")
                    .replace(/[^a-zA-Z0-9_]/g, "");

                dynamicColumns.push({
                    title: status.name,
                    dataIndex: key,
                    align: "center",
                });
            });

            const filteredColumns = removeZeroColumns(dynamicColumns, result);

            const fixedColumns = ["user_name", "total_lead"];

            const leftColumns = filteredColumns.filter(col =>
                fixedColumns.includes(col.dataIndex)
            );

            const dynamicCols = filteredColumns.filter(col =>
                !fixedColumns.includes(col.dataIndex)
            );

            const sortedDynamic = sortColumnsByTotal(
                dynamicCols,
                result,
                []
            );

            setColumns([...leftColumns, ...sortedDynamic]);

        } catch (err) {
            console.error("Branch Lead Performance Error:", err);
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
        columns.forEach(col => {
            if (col.dataIndex !== "user_name") {
                totalObj[col.dataIndex] = data.reduce(
                    (sum, row) => sum + Number(row[col.dataIndex] || 0),
                    0
                );
            }
        });
        return totalObj;
    }, [data, columns]);

    return (
        <div className="rounded-lg p-4">

            <Spin spinning={loading}>

                <Table
                    size="small"
                    rowKey="user_name"
                    columns={columns}
                    dataSource={paginatedData}
                    pagination={false}
                    scroll={{ x: "max-content" }}
                    locale={{
                        emptyText: <Empty description="No branch performance data available" />
                    }}
                    summary={() => (
                        <Table.Summary fixed="bottom">
                            <Table.Summary.Row>
                                {columns.map((col, index) => (
                                    <Table.Summary.Cell
                                        key={col.dataIndex}
                                        index={index}
                                        align={col.align || "center"}
                                    >
                                        {col.dataIndex === "user_name"
                                            ? <strong>Total</strong>
                                            : <strong>{totals[col.dataIndex] || 0}</strong>
                                        }
                                    </Table.Summary.Cell>
                                ))}
                            </Table.Summary.Row>
                        </Table.Summary>
                    )}
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

export default BranchUserStatusPerformance;