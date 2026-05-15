import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Table, Spin, Empty, Pagination, Tabs } from "antd";
import { useSelector } from "react-redux";
import { getProfileService } from "../../../Profile/ApiService";
import { getLeadCounsellorDropdownService } from "../../ApiService";
import { removeZeroColumns, sortColumnsByTotal, useLeadConversion } from "../../hook";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { getFacebookCampaignQuery } from "../Queries/MarketingPerfomanceQueries";
import { YgApi } from "../../../../lib/Constants";

dayjs.extend(utc);
dayjs.extend(timezone);

function FacebookCampaignPerformance({ startDate, endDate, counsellor, leadSource, sourceGroup, branch, role }) {

    const BASE_URL = YgApi;

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [loginUser, setLoginUser] = useState(null);
    const [allowedUsernames, setAllowedUsernames] = useState([]);
    const [activeTab, setActiveTab] = useState("campaign");
    const { getMqlColor, getSqlColor } = useLeadConversion();

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

            const groupByMap = {
                campaign: "campaign",
                adset: "adset_name",
                ad: "ad_name",
                form: "form_name",
            };

            const query = getFacebookCampaignQuery({
                whereClause,
                statuses,
                groupBy: groupByMap[activeTab],
            });

            const res = await axios.post(
                `${BASE_URL}/mondayMeetings/get-crm-records`,
                { query }
            );

            const result =
                Array.isArray(res?.data)
                    ? res.data
                    : res?.data?.data || [];

            const sortedResult = [...result].sort(
                (a, b) => Number(b.total_lead || 0) - Number(a.total_lead || 0)
            );

            const enrichedResult = sortedResult.map(row => {
                const totalLead = Number(row.total_lead || 0);
                const mql = Number(row.mql || 0);
                const sql = Number(row.sql || 0);

                return {
                    ...row,
                    lead_to_mql_pct: totalLead ? (mql / totalLead) * 100 : 0,
                    lead_to_sql_pct: totalLead ? (sql / totalLead) * 100 : 0,
                    mql_to_sql_pct: mql ? (sql / mql) * 100 : 0,
                };
            });

            setData(enrichedResult);

            const crmMap = {};
            sortedResult.forEach((item) => {
                const key = (item.name || "Others").trim().toLowerCase();
                crmMap[key] = item.total_lead || 0;
            });

            const getPrimaryColumn = () => ({
                title:
                    activeTab === "campaign"
                        ? "Campaign"
                        : activeTab === "adset"
                            ? "Ad Set Name"
                            : activeTab === "ad"
                                ? "Ad Name"
                                : "Form Name",

                dataIndex: "name",
                fixed: "left",
                width: 350,
            });

            const primaryColumn = getPrimaryColumn();

            const dynamicColumns = [
                primaryColumn,

                {
                    title: "Total Lead",
                    dataIndex: "total_lead",
                    align: "center",
                    fixed: "left",
                    render: (val) => Number(val || 0)
                },

                {
                    title: "MQL",
                    dataIndex: "mql",
                    align: "center",
                    fixed: "left",
                    render: (val) => Number(val || 0)
                },

                {
                    title: "SQL",
                    dataIndex: "sql",
                    align: "center",
                    fixed: "left",
                    render: (val) => Number(val || 0)
                },

                {
                    title: "Lead → MQL %",
                    dataIndex: "lead_to_mql_pct",
                    align: "center",
                    fixed: "left",
                    render: (val) => {
                        const percent = Number(val || 0);
                        const color = getMqlColor(percent);

                        return <span className={`${color} font-semibold`}>
                            {percent.toFixed(0)}%
                        </span>;
                    }
                },

                {
                    title: "Lead → SQL %",
                    dataIndex: "lead_to_sql_pct",
                    align: "center",
                    fixed: "left",
                    render: (val) => {
                        const percent = Number(val || 0);
                        const color = getSqlColor(percent);

                        return <span className={`${color} font-semibold`}>
                            {percent.toFixed(0)}%
                        </span>;
                    }
                },

                {
                    title: "MQL → SQL %",
                    dataIndex: "mql_to_sql_pct",
                    align: "center",
                    fixed: "left",
                    render: (val) => {
                        const percent = Number(val || 0);
                        const color = getSqlColor(percent);

                        return <span className={`${color} font-semibold`}>
                            {percent.toFixed(0)}%
                        </span>;
                    }
                },
            ];

            statuses.forEach((status) => {
                if (status.name === "Campaign") return;

                const key = status.name
                    .replace(/\s+/g, "_")
                    .replace(/[^a-zA-Z0-9_]/g, "");

                dynamicColumns.push({
                    title: status.name,
                    dataIndex: key,
                    align: "center",
                });
            });

            const alwaysKeep = [
                "mql",
                "sql",
                "lead_to_mql_pct",
                "lead_to_sql_pct",
                "mql_to_sql_pct"
            ];

            const filteredColumns = removeZeroColumns(dynamicColumns, enrichedResult, alwaysKeep);

            const primaryCol = filteredColumns.find(
                col => col.dataIndex === "name"
            );

            const totalLeadCol = filteredColumns.find(
                col => col.dataIndex === "total_lead"
            );

            const mqlCol = filteredColumns.find(col => col.dataIndex === "mql");
            const sqlCol = filteredColumns.find(col => col.dataIndex === "sql");

            const percentCols = filteredColumns.filter(col =>
                ["lead_to_mql_pct", "lead_to_sql_pct", "mql_to_sql_pct"].includes(col.dataIndex)
            );

            const otherColumns = filteredColumns.filter(col =>
                ![
                    "name",
                    "total_lead",
                    "mql",
                    "sql",
                    "lead_to_mql_pct",
                    "lead_to_sql_pct",
                    "mql_to_sql_pct"
                ].includes(col.dataIndex)
            );

            const sortedOtherColumns = sortColumnsByTotal(
                otherColumns,
                enrichedResult,
                []
            );

            setColumns([
                primaryCol,
                totalLeadCol,
                mqlCol,
                percentCols.find(c => c.dataIndex === "lead_to_mql_pct"),
                sqlCol,
                percentCols.find(c => c.dataIndex === "lead_to_sql_pct"),
                percentCols.find(c => c.dataIndex === "mql_to_sql_pct"),
                ...sortedOtherColumns
            ].filter(Boolean));

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
        allowedUsernames,
        activeTab
    ]);

    const primaryKeyMap = {
        campaign: "campaign",
        adset: "adset_name",
        ad: "ad_name",
        form: "form_name",
    };

    const primaryKey = primaryKeyMap[activeTab];

    const paginatedData = useMemo(
        () => data.slice((page - 1) * pageSize, page * pageSize),
        [data, page, pageSize]
    );

    const totals = useMemo(() => {
        const totalObj = {};

        columns.forEach(col => {

            if (["lead_source_name", primaryKey].includes(col.dataIndex)) return;

            if (col.dataIndex === "lead_to_mql_pct") {
                const totalLead = data.reduce((s, r) => s + Number(r.total_lead || 0), 0);
                const totalMql = data.reduce((s, r) => s + Number(r.mql || 0), 0);
                totalObj[col.dataIndex] = totalLead
                    ? ((totalMql / totalLead) * 100).toFixed(0) + "%"
                    : "0%";
                return;
            }

            if (col.dataIndex === "lead_to_sql_pct") {
                const totalLead = data.reduce((s, r) => s + Number(r.total_lead || 0), 0);
                const totalSql = data.reduce((s, r) => s + Number(r.sql || 0), 0);
                totalObj[col.dataIndex] = totalLead
                    ? ((totalSql / totalLead) * 100).toFixed(0) + "%"
                    : "0%";
                return;
            }

            if (col.dataIndex === "mql_to_sql_pct") {
                const totalMql = data.reduce((s, r) => s + Number(r.mql || 0), 0);
                const totalSql = data.reduce((s, r) => s + Number(r.sql || 0), 0);
                totalObj[col.dataIndex] = totalMql
                    ? ((totalSql / totalMql) * 100).toFixed(0) + "%"
                    : "0%";
                return;
            }

            totalObj[col.dataIndex] = data.reduce(
                (sum, row) => sum + Number(row[col.dataIndex] || 0),
                0
            );
        });

        return totalObj;
    }, [data, columns]);


    return (
        <div className="p-4">

            <Spin spinning={loading}>

                <Tabs
                    className="mb-4"
                    activeKey={activeTab}
                    onChange={(key) => {
                        setActiveTab(key);
                        setPage(1);
                    }}
                    items={[
                        { key: "campaign", label: "Campaign" },
                        { key: "adset", label: "Ad Set Name" },
                        { key: "ad", label: "Ad Name" },
                        { key: "form", label: "Form Name" },
                    ]}
                />

                <Table
                    size="small"
                    rowKey={(row) => row.name + "_" + row.total_lead}
                    columns={columns}
                    dataSource={paginatedData}
                    pagination={false}
                    scroll={{ x: "max-content" }}
                    locale={{
                        emptyText: <Empty description="No Source Campaign Performance data available" />
                    }}
                    summary={() => (
                        <Table.Summary fixed="bottom">
                            <Table.Summary.Row>
                                {columns.map((col, index) => (
                                    <Table.Summary.Cell
                                        key={col.dataIndex}
                                        index={index}
                                        align={col.align || "left"}
                                    >
                                        {col.dataIndex === "name"
                                            ? <strong>Total</strong>
                                            : <strong>{totals[col.dataIndex] || 0}</strong>}
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

export default FacebookCampaignPerformance;