import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
import { useEffect, useState } from "react";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useSelector } from "react-redux";
import { getProfileService } from "../../../Profile/ApiService";
import { getLeadCounsellorDropdownService } from "../../ApiService";
import { YgApi } from "../../../../lib/Constants";

const formatNumber = (num = 0) => {
    if (num >= 10000000) return (num / 10000000).toFixed(2) + "Cr";
    if (num >= 100000) return (num / 100000).toFixed(2) + "L";
    if (num >= 1000) return (num / 1000).toFixed(0) + "K";
    return num;
};

const MqlBySourceChart = ({
    startDate,
    endDate,
    counsellor = [],
    leadSource = [],
    sourceGroup = [],
    branch = [],
    role = [],
    colors = {},
}) => {

    const [data, setData] = useState([]);
    const [loginUser, setLoginUser] = useState(null);
    const [allowedUsernames, setAllowedUsernames] = useState([]);

    const leadModulePermission = useSelector(
        (state) => state.permissions.permissionsData
    );

    const isAdmin = leadModulePermission?.user_group === "admin";

    const gridColor = colors?.grid || "#374151";
    const textColor = colors?.text || "#9ca3af";

    const formatDate = (d) => {
        if (!d) return "";
        if (d.includes("-") && d.split("-")[0].length === 4) return d;

        const [day, month, year] = d.split("-");
        return `${year}-${month}-${day}`;
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
                const usernames = (res?.data?.data || []).map(item => item.username);
                setAllowedUsernames(usernames);
            } catch (err) {
                console.error("Counsellor fetch error", err);
            }
        };
        fetchCounsellors();
    }, []);

    const buildWhereClause = () => {
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

        const users = counsellor?.length ? counsellor : allowedUsernames;

        if (users.length > 0) {
            const values = users.map(u => `'${u}'`).join(",");
            conditions.push(`lml.assign_to_id IN (${values})`);
        } else if (!isAdmin && loginUser) {
            conditions.push(`lml.assign_to_id = '${loginUser}'`);
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
            conditions.push(
                `lml.lead_source_id IN (${leadSource.map((l) => `'${l}'`).join(",")})`
            );
        }

        if (sourceGroup?.length) {
            conditions.push(
                `lmls.source_group IN (${sourceGroup.map((s) => `'${s}'`).join(",")})`
            );
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

        return conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    };

    useEffect(() => {
        if (!loginUser || allowedUsernames.length === 0) return;

        const fetchChart = async () => {
            try {
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
                                COALESCE(lmls.source_group,'Others') AS name,
                                COUNT(DISTINCT lml.id) AS lead,
                                COUNT(DISTINCT lml.id) FILTER (
                                  WHERE lml.interest_count > 0
                                ) AS mql,
                                COUNT(DISTINCT lml.id) FILTER (
                                  WHERE (lml.visit_count > 0 OR lml.vc_count > 0)
                                ) AS sql
                              FROM lead_management_lead lml
                              LEFT JOIN lead_management_leadsource lmls
                                ON lml.lead_source_id = lmls.id
                              ${whereClause}
                              GROUP BY COALESCE(lmls.source_group,'Others')
                              HAVING COUNT(DISTINCT lml.id) > 0
                              ORDER BY mql DESC;
                            `,
                        }),
                    }
                );

                const result = await res.json();

                if (!Array.isArray(result)) {
                    console.error("Invalid API response:", result);
                    setData([]);
                    return;
                }

                const formatted = result.map((item) => ({
                    name: item.name,
                    lead: Number(item.lead) || 0,
                    mql: Number(item.mql) || 0,
                    sql: Number(item.sql) || 0,
                }));

                const dataWithPercent = formatted
                    .map((item) => ({
                        ...item,
                        mqlPercent: item.lead ? (item.mql * 100) / item.lead : 0,
                        sqlPercent: item.lead ? (item.sql * 100) / item.lead : 0,
                    }))
                    .filter((item) => item.mqlPercent > 0 || item.sqlPercent > 0)
                    .sort((a, b) => b.mqlPercent - a.mqlPercent);

                setData(dataWithPercent);

            } catch (err) {
                console.error("Chart API Error:", err);
            }
        };

        fetchChart();
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

    const dataWithPercent = data;
    const itemCount = dataWithPercent.length;

    const chartHeight =
        itemCount === 0
            ? 220
            : Math.min(Math.max(itemCount * 45, 220), 350);

    const rowStyle = {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 4,
    };

    const labelStyle = {
        fontSize: 12,
        color: "#9ca3af",
    };

    const valueStyle = {
        fontSize: 12,
        fontWeight: 600,
        color: "#ffffff",
    };

    return (
        <div className="flex flex-col rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <div className="p-4 pb-0">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                    Lead → MQL | Lead → SQL
                </h3>
            </div>

            <ResponsiveContainer width="100%" height={chartHeight}>
                <BarChart
                    barGap={4}
                    barCategoryGap={12}
                    data={dataWithPercent}
                    layout="vertical"
                    margin={{ top: 30, right: 90, left: 0, bottom: 0 }}
                >
                    <CartesianGrid
                        stroke={gridColor}
                        strokeDasharray="3 3"
                        horizontal
                        vertical={false}
                    />

                    <XAxis
                        type="number"
                        stroke={textColor}
                        tick={false}
                        axisLine={false}
                    />

                    <YAxis
                        type="category"
                        dataKey="name"
                        width={170}
                        interval={0}
                        tick={{ fill: textColor, fontSize: 12 }}
                    />

                    <Tooltip
                        cursor={{
                            fill: colors?.isDark
                                ? "rgba(255,255,255,0.12)"
                                : "rgba(59,130,246,0.10)"
                        }}
                        content={({ active, payload }) => {
                            if (!active || !payload || !payload.length) return null;

                            const data = payload[0].payload;

                            const isDark = document.documentElement.classList.contains("dark");

                            return (
                                <div
                                    style={{
                                        background: isDark ? "#111827" : "#ffffff",
                                        border: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
                                        borderRadius: 10,
                                        padding: "10px 12px",
                                        boxShadow: isDark
                                            ? "0 6px 18px rgba(0,0,0,0.4)"
                                            : "0 6px 18px rgba(0,0,0,0.1)",
                                        minWidth: 150,
                                    }}
                                >
                                    {/* TITLE */}
                                    <div
                                        style={{
                                            fontSize: 13,
                                            fontWeight: 600,
                                            color: isDark ? "#ffffff" : "#111827",
                                            marginBottom: 6,
                                        }}
                                    >
                                        {data.name}
                                    </div>

                                    {/* DIVIDER */}
                                    <div
                                        style={{
                                            height: 1,
                                            background: isDark ? "#374151" : "#e5e7eb",
                                            marginBottom: 8,
                                        }}
                                    />

                                    {/* ROWS */}
                                    <div style={rowStyle}>
                                        <span style={{ ...labelStyle, color: isDark ? "#9ca3af" : "#6b7280" }}>
                                            MQL
                                        </span>
                                        <span style={{ ...valueStyle, color: isDark ? "#3b82f6" : "#2563eb" }}>
                                            {data.mqlPercent.toFixed(1)}%
                                        </span>
                                    </div>

                                    <div style={rowStyle}>
                                        <span style={{ ...labelStyle, color: isDark ? "#9ca3af" : "#6b7280" }}>
                                            SQL
                                        </span>
                                        <span style={{ ...valueStyle, color: isDark ? "#22c55e" : "#16a34a" }}>
                                            {data.sqlPercent.toFixed(1)}%
                                        </span>
                                    </div>
                                </div>
                            );
                        }}
                    />

                    <Bar
                        dataKey="mqlPercent"
                        barSize={10}
                        radius={[0, 6, 6, 0]}
                        fill={colors?.isDark ? "#2563eb" : "#3b82f6"}
                        activeBar={{
                            fill: colors?.isDark ? "#1d4ed8" : "#60a5fa",
                        }}
                        label={({ x, y, width, value }) => (
                            <text
                                x={x + width + 8}
                                y={y + 10}
                                fill={colors?.text || "#9ca3af"}
                                fontSize={12}
                                fontWeight={500}
                            >
                                {value.toFixed(1)}%
                            </text>
                        )}
                    />

                    <Bar
                        dataKey="sqlPercent"
                        barSize={10}
                        radius={[0, 6, 6, 0]}
                        fill={colors?.isDark ? "#10b981" : "#22c55e"}
                        activeBar={{
                            fill: colors?.isDark ? "#059669" : "#4ade80",
                        }}
                        label={({ x, y, width, value }) => (
                            <text
                                x={x + width + 8}
                                y={y + 10}
                                fill={colors?.text || "#9ca3af"}
                                fontSize={12}
                                fontWeight={500}
                            >
                                {value.toFixed(1)}%
                            </text>
                        )}
                    />

                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default MqlBySourceChart;