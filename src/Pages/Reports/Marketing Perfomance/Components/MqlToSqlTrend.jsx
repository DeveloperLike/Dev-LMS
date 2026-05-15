import React, { useEffect, useState } from "react";
import { Tabs, Select } from "antd";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
    Legend,
    AreaChart,
    Area,
    Bar,
    ComposedChart,
} from "recharts";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useSelector } from "react-redux";
import { getProfileService } from "../../../Profile/ApiService";
import { getLeadCounsellorDropdownService } from "../../ApiService";
import { LoadingOutlined } from "@ant-design/icons";
import { YgApi } from "../../../../lib/Constants";

dayjs.extend(utc);
dayjs.extend(timezone);

function MqlToSqlTrend({
    startDate,
    endDate,
    counsellor,
    leadSource,
    sourceGroup,
    branch,
    role,
}) {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [type, setType] = useState("daily");
    const { Option } = Select;
    const [loginUser, setLoginUser] = useState(null);
    const [allowedUsernames, setAllowedUsernames] = useState([]);

    const leadModulePermission = useSelector(
        (state) => state.permissions.permissionsData
    );

    const isAdmin = leadModulePermission?.user_group === "admin";

    const [selectedSourceGroup, setSelectedSourceGroup] = useState([]);
    const [sourceGroupOptions, setSourceGroupOptions] = useState([]);

    const isDark = document.documentElement.classList.contains("dark");

    const theme = {
        grid: isDark ? "#374151" : "#E5E7EB",
        axis: isDark ? "#9CA3AF" : "#6B7280",
        axisLine: isDark ? "#4B5563" : "#E5E7EB",
        tooltipBg: isDark ? "#111827" : "#ffffff",
        tooltipBorder: isDark ? "#374151" : "#E5E7EB",
        tooltipText: isDark ? "#D1D5DB" : "#374151",

        mql: isDark ? "#2563eb" : "#3b82f6",
        sql: isDark ? "#10b981" : "#22c55e",
        conversion: isDark ? "#F59E0B" : "#D97706",
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await getProfileService();
                setLoginUser(res?.data?.data?.username || null);
            } catch (err) {
                console.error("Profile error", err);
            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        const fetchCounsellors = async () => {
            try {
                const res = await getLeadCounsellorDropdownService();

                const usernames = (res?.data?.data || []).map(
                    (item) => item.username
                );

                setAllowedUsernames(usernames);
            } catch (err) {
                console.error("Counsellor fetch error", err);
            }
        };

        fetchCounsellors();
    }, []);

    const buildConditions = ({
        includeSelectedSourceGroup = true,
        includeSourceGroupFilter = true,
    } = {}) => {
        const conditions = [];

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

            conditions.push(`
                lml.created_at BETWEEN '${startUTC}' AND '${endUTC}'
            `);
        }

        const users = counsellor?.length
            ? counsellor
            : allowedUsernames;

        if (users.length > 0) {
            const values = users.map((u) => `'${u}'`).join(",");

            conditions.push(`
                lml.assign_to_id IN (${values})
            `);
        } else if (!isAdmin && loginUser) {
            conditions.push(`
                lml.assign_to_id = '${loginUser}'
            `);
        }

        if (role?.length) {
            const values = role.map((r) => `'${r}'`).join(",");

            conditions.push(`
                lml.assign_to_id IN (
                    SELECT username
                    FROM user_management_user
                    WHERE role_id IN (${values})
                )
            `);
        }

        if (leadSource?.length) {
            conditions.push(`
                lml.lead_source_id IN (${leadSource
                    .map((l) => `'${l}'`)
                    .join(",")})
            `);
        }

        if (includeSourceGroupFilter && sourceGroup?.length) {
            conditions.push(`
                lmls.source_group IN (${sourceGroup
                    .map((s) => `'${s}'`)
                    .join(",")})
            `);
        }

        if (
            includeSelectedSourceGroup &&
            selectedSourceGroup?.length
        ) {
            conditions.push(`
            lmls.source_group IN (${selectedSourceGroup
                    .map((s) => `'${s}'`)
                    .join(",")})
        `);
        }

        if (branch?.length) {
            const values = branch.map((b) => `'${b}'`).join(",");

            conditions.push(`
                lml.assign_to_id IN (
                    SELECT user_id
                    FROM user_management_user_branch
                    WHERE branch_id IN (${values})
                )
            `);
        }

        conditions.push(`lml.assign_to_id IS NOT NULL`);

        return conditions;
    };

    const buildWhereClause = (options = {}) => {
        const conditions = buildConditions(options);

        return conditions.length
            ? `WHERE ${conditions.join(" AND ")}`
            : "";
    };

    const fetchData = async (groupBy) => {
        try {
            setLoading(true);

            let groupColumn = "";
            let labelColumn = "";

            if (groupBy === "daily") {
                groupColumn = `
                   DATE(lml.created_at AT TIME ZONE 'Asia/Kolkata')
               `;

                labelColumn = groupColumn;
            }

            if (groupBy === "weekly") {
                groupColumn = `
                   DATE_TRUNC(
                       'week',
                       lml.created_at AT TIME ZONE 'Asia/Kolkata'
                   )
               `;

                labelColumn = `
                   TO_CHAR(
                       ${groupColumn},
                       'YYYY-MM-DD'
                   )
               `;
            }

            if (groupBy === "monthly") {
                groupColumn = `
                   DATE_TRUNC(
                       'month',
                       lml.created_at AT TIME ZONE 'Asia/Kolkata'
                   )
               `;

                labelColumn = `
                   TO_CHAR(
                       ${groupColumn},
                       'Mon YYYY'
                   )
               `;
            }

            const whereClause = buildWhereClause();

            const res = await fetch(
                `${YgApi}/mondayMeetings/get-crm-records`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        query: `
                           SELECT
                               ${groupColumn} AS sort_date,
                               ${labelColumn} AS label,
   
                               COUNT(*) AS total,
   
                               COUNT(*) FILTER (
                                   WHERE lml.interest_count > 0
                               ) AS mql,
   
                               COUNT(*) FILTER (
                                   WHERE (
                                       lml.visit_count > 0
                                       OR lml.vc_count > 0
                                   )
                               ) AS sql
   
                           FROM lead_management_lead lml
   
                           LEFT JOIN lead_management_leadsource lmls
                           ON lml.lead_source_id = lmls.id
   
                           ${whereClause}
   
                           GROUP BY sort_date, label
   
                           ORDER BY sort_date ASC
                       `,
                    }),
                }
            );

            const result = await res.json();

            if (!Array.isArray(result)) {
                setData([]);
                return;
            }

            const formatted = result.map((item) => {
                const total = Number(item.total) || 0;
                const mql = Number(item.mql) || 0;
                const sql = Number(item.sql) || 0;

                return {
                    label: item.label,
                    total,
                    mqlPercent: total ? (mql * 100) / total : 0,
                    sqlPercent: total ? (sql * 100) / total : 0,
                    conversion: mql ? (sql * 100) / mql : 0,
                };
            });

            setData(formatted);
        } catch (err) {
            console.error("Trend API error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchSourceGroups = async () => {
            try {
                const conditions = buildConditions({
                    includeSelectedSourceGroup: false,
                    includeSourceGroupFilter: true,
                });

                conditions.push(`lmls.source_group IS NOT NULL`);

                const whereClause = conditions.length
                    ? `WHERE ${conditions.join(" AND ")}`
                    : "";

                const res = await fetch(
                    `${YgApi}/mondayMeetings/get-crm-records`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            query: `
                                SELECT DISTINCT lmls.source_group
                                FROM lead_management_lead lml
                                LEFT JOIN lead_management_leadsource lmls
                                ON lml.lead_source_id = lmls.id
                                ${whereClause}
                                ORDER BY lmls.source_group
                            `,
                        }),
                    }
                );

                const result = await res.json();

                const groups = result
                    .map((i) => i.source_group)
                    .filter(Boolean);

                setSourceGroupOptions(groups);
            } catch (error) {
                console.error(error);
            }
        };

        if (!loginUser) return;

        fetchSourceGroups();
    }, [
        loginUser,
        allowedUsernames,
        startDate,
        endDate,
        JSON.stringify(counsellor),
        JSON.stringify(leadSource),
        JSON.stringify(sourceGroup),
        JSON.stringify(branch),
        JSON.stringify(role),
    ]);

    useEffect(() => {
        if (sourceGroup?.length) {
            setSelectedSourceGroup(sourceGroup);
        } else {
            setSelectedSourceGroup([]);
        }
    }, [JSON.stringify(sourceGroup)]);

    useEffect(() => {
        if (!loginUser) return;

        fetchData(type);
    }, [
        type,
        loginUser,
        allowedUsernames,
        startDate,
        endDate,
        JSON.stringify(counsellor),
        JSON.stringify(leadSource),
        JSON.stringify(sourceGroup),
        JSON.stringify(branch),
        JSON.stringify(role),
        selectedSourceGroup,
    ]);

    return (
        <>
            <div className="p-4 pb-0">

                {/* Heading */}
                <div className="flex items-center gap-2 mb-3">

                    <h3 className="font-semibold text-gray-900 dark:text-white">
                        MQL → SQL % Trend
                    </h3>


                    {loading && (
                        <div className="flex items-center gap-1 text-xs text-black dark:text-yellow-400">
                            <LoadingOutlined spin />

                            <span>Updating...</span>
                        </div>
                    )}
                </div>

                {/* Tabs + Filter */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

                    <Tabs
                        activeKey={type}
                        onChange={(key) => setType(key)}
                        className="flex-1 min-w-0 custom-tabs"
                        items={[
                            {
                                key: "daily",
                                label: (
                                    <strong
                                        className={
                                            type === "daily"
                                                ? "font-semibold"
                                                : ""
                                        }
                                    >
                                        Daily
                                    </strong>
                                ),
                            },
                            {
                                key: "weekly",
                                label: (
                                    <strong
                                        className={
                                            type === "weekly"
                                                ? "font-semibold"
                                                : ""
                                        }
                                    >
                                        Weekly
                                    </strong>
                                ),
                            },
                            {
                                key: "monthly",
                                label: (
                                    <strong
                                        className={
                                            type === "monthly"
                                                ? "font-semibold"
                                                : ""
                                        }
                                    >
                                        Monthly
                                    </strong>
                                ),
                            },
                        ]}
                    />

                    <div className="w-full md:w-[240px] md:min-w-[240px] pb-2">
                        <Select
                            mode="multiple"
                            allowClear
                            placeholder="All Sources"
                            value={selectedSourceGroup}
                            onChange={(val) => setSelectedSourceGroup(val)}
                            className="w-full"
                            size="middle"
                            maxTagCount="responsive"
                        >
                            {sourceGroupOptions.map((sg) => (
                                <Option key={sg} value={sg}>
                                    {sg}
                                </Option>
                            ))}
                        </Select>
                    </div>
                </div>
            </div>

            <div className="h-[350px] w-full rounded-xl p-3">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                        data={data}
                        margin={{
                            top: 20,
                            right: 50,
                            left: 0,
                            bottom: 10,
                        }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke={theme.grid}
                            vertical={false}
                        />

                        <XAxis
                            dataKey="label"
                            stroke={theme.axis}
                            tick={{
                                fontSize: 12,
                                fill: theme.axis,
                            }}
                            axisLine={{
                                stroke: theme.axisLine,
                            }}
                            tickLine={false}
                            minTickGap={30}
                            tickFormatter={(value) => {
                                if (!value) return "";

                                if (type === "monthly") return value;

                                return value.slice(5);
                            }}
                        />

                        <YAxis
                            yAxisId="left"
                            stroke={theme.axis}
                            tick={{
                                fontSize: 12,
                                fill: theme.axis,
                            }}
                            tickFormatter={(v) => `${Math.round(v)}%`}
                            domain={[
                                0,
                                () => {
                                    const maxValue = Math.max(
                                        ...data.map((d) =>
                                            Math.max(
                                                d.mqlPercent || 0,
                                                d.sqlPercent || 0,
                                                d.conversion || 0
                                            )
                                        )
                                    );

                                    if (maxValue <= 10) return 10;
                                    if (maxValue <= 20) return 20;
                                    if (maxValue <= 30) return 30;
                                    if (maxValue <= 40) return 40;
                                    if (maxValue <= 50) return 50;
                                    if (maxValue <= 60) return 60;
                                    if (maxValue <= 70) return 70;
                                    if (maxValue <= 80) return 80;
                                    if (maxValue <= 90) return 90;

                                    return 100;
                                },
                            ]}
                            axisLine={{
                                stroke: theme.axisLine,
                            }}
                            tickLine={false}
                        />

                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            width={60}
                            stroke={isDark ? "#A78BFA" : "#7C3AED"}
                            tick={{
                                fontSize: 11,
                                fill: isDark ? "#C4B5FD" : "#7C3AED",
                            }}
                            axisLine={{
                                stroke: isDark ? "#6D28D9" : "#7C3AED",
                                strokeWidth: 1,
                            }}
                            tickLine={false}
                            tickFormatter={(v) => {
                                if (v >= 10000000) {
                                    return `${(v / 10000000).toFixed(1)}Cr`;
                                }

                                if (v >= 100000) {
                                    return `${(v / 100000).toFixed(1)}L`;
                                }

                                if (v >= 1000) {
                                    return `${(v / 1000).toFixed(0)}K`;
                                }

                                return v;
                            }}
                        />

                        <Tooltip
                            cursor={{
                                stroke: isDark ? "#94A3B8" : "#64748B",
                                strokeWidth: 1,
                                strokeDasharray: "4 4",
                            }}
                            content={({ active, payload, label }) => {
                                if (!active || !payload || !payload.length) {
                                    return null;
                                }

                                const chartData = payload[0]?.payload;

                                const formatLead = (num) => {
                                    if (num >= 10000000) {
                                        return `${(num / 10000000).toFixed(1)}Cr`;
                                    }

                                    if (num >= 100000) {
                                        return `${(num / 100000).toFixed(1)}L`;
                                    }

                                    if (num >= 1000) {
                                        return `${(num / 1000).toFixed(1)}K`;
                                    }

                                    return num;
                                };

                                return (
                                    <div
                                        className="
                                        min-w-[200px]
                                        rounded-2xl
                                        border
                                        backdrop-blur-md
                                        shadow-2xl
                                        px-4
                                        py-3
                                    "
                                        style={{
                                            background: isDark
                                                ? "rgba(15,23,42,0.95)"
                                                : "rgba(255,255,255,0.96)",
                                            borderColor: theme.tooltipBorder,
                                            color: theme.tooltipText,
                                        }}
                                    >
                                        {/* Header */}
                                        <div className="mb-3 border-b border-gray-700/30 pb-2">
                                            <div className="text-xs opacity-70 mb-1">
                                                Timeline
                                            </div>

                                            <div className="font-semibold text-sm">
                                                {label}
                                            </div>
                                        </div>

                                        {/* Total Leads */}
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className="w-2.5 h-2.5 rounded-sm"
                                                    style={{
                                                        background: isDark
                                                            ? "#8B5CF6"
                                                            : "#7C3AED",
                                                    }}
                                                />

                                                <span className="text-xs opacity-80">
                                                    Total Leads
                                                </span>
                                            </div>

                                            <span
                                                className="font-semibold text-sm"
                                                style={{
                                                    color: isDark
                                                        ? "#A78BFA"
                                                        : "#6D28D9",
                                                }}
                                            >
                                                {formatLead(chartData.total)}
                                            </span>
                                        </div>

                                        {/* Divider */}
                                        <div className="border-t border-gray-700/20 my-2" />

                                        {/* Metrics */}
                                        <div className="space-y-2">

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className="w-2.5 h-2.5 rounded-full"
                                                        style={{
                                                            background: theme.mql,
                                                        }}
                                                    />

                                                    <span className="text-xs">
                                                        Lead → MQL
                                                    </span>
                                                </div>

                                                <span
                                                    className="font-semibold text-xs"
                                                    style={{
                                                        color: theme.mql,
                                                    }}
                                                >
                                                    {chartData.mqlPercent.toFixed(0)}%
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className="w-2.5 h-2.5 rounded-full"
                                                        style={{
                                                            background: theme.sql,
                                                        }}
                                                    />

                                                    <span className="text-xs">
                                                        Lead → SQL
                                                    </span>
                                                </div>

                                                <span
                                                    className="font-semibold text-xs"
                                                    style={{
                                                        color: theme.sql,
                                                    }}
                                                >
                                                    {chartData.sqlPercent.toFixed(0)}%
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className="w-2.5 h-2.5 rounded-full"
                                                        style={{
                                                            background:
                                                                theme.conversion,
                                                        }}
                                                    />

                                                    <span className="text-xs">
                                                        MQL → SQL
                                                    </span>
                                                </div>

                                                <span
                                                    className="font-semibold text-xs"
                                                    style={{
                                                        color: theme.conversion,
                                                    }}
                                                >
                                                    {chartData.conversion.toFixed(0)}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }}
                        />

                        <Legend
                            content={({ payload }) => (
                                <div className="flex gap-4 text-xs justify-center">
                                    {payload.map(
                                        (entry, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center gap-1"
                                            >
                                                <span
                                                    style={{
                                                        width: 10,
                                                        height: 10,
                                                        backgroundColor:
                                                            entry.color,
                                                        display:
                                                            "inline-block",
                                                    }}
                                                />

                                                <span>
                                                    {entry.value}
                                                </span>
                                            </div>
                                        )
                                    )}
                                </div>
                            )}
                        />

                        <Bar
                            dataKey="total"
                            name="Total Leads"
                            yAxisId="right"
                            radius={[6, 6, 0, 0]}
                            fill={isDark ? "#8B5CF6" : "#7C3AED"}
                            opacity={0.3}
                            barSize={type === "daily" ? 8 : 22}
                        />

                        <Area
                            yAxisId="left"
                            type="monotone"
                            dataKey="mqlPercent"
                            stroke={theme.mql}
                            fill={theme.mql}
                            fillOpacity={0.15}
                            strokeWidth={2.5}
                            dot={false}
                            name="Lead → MQL"
                        />

                        <Area
                            yAxisId="left"
                            type="monotone"
                            dataKey="sqlPercent"
                            stroke={theme.sql}
                            fill={theme.sql}
                            fillOpacity={0.12}
                            strokeWidth={2}
                            dot={false}
                            name="Lead → SQL"
                        />

                        <Area
                            yAxisId="left"
                            type="monotone"
                            dataKey="conversion"
                            stroke={theme.conversion}
                            fill={theme.conversion}
                            fillOpacity={0.12}
                            strokeWidth={2}
                            dot={false}
                            name="MQL → SQL"
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </>
    );
}
export default MqlToSqlTrend;