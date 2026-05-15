import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import useTheme from "../../Google Analytics/services/useTheme";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useSelector } from "react-redux";
import { getProfileService } from "../../../Profile/ApiService";
import { getLeadCounsellorDropdownService } from "../../ApiService";

import { YgApi } from "../../../../lib/Constants";

const generateColor = (i, total) => {
    const hue = Math.floor((360 / total) * i);
    return `hsl(${hue}, 70%, 55%)`;
};

const SqlBySourceChart = ({
    startDate,
    endDate,
    counsellor = [],
    leadSource = [],
    sourceGroup = [],
    branch = [],
    role = [],
}) => {
    const { colors } = useTheme();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loginUser, setLoginUser] = useState(null);
    const [allowedUsernames, setAllowedUsernames] = useState([]);

    const leadModulePermission = useSelector(
        (state) => state.permissions.permissionsData
    );

    const isAdmin = leadModulePermission?.user_group === "admin";

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

    const formatDate = (d) => {
        if (!d) return "";
        if (d.includes("-") && d.split("-")[0].length === 4) return d;

        const [day, month, year] = d.split("-");
        return `${year}-${month}-${day}`;
    };

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
            const values = role.map(r => `'${r}'`).join(",");
            conditions.push(`
            lml.assign_to_id IN (
                SELECT username
                FROM user_management_user
                WHERE role_id IN (${values})
            )
        `);
        }

        if (leadSource?.length) {
            const values = leadSource.map(l => `'${l}'`).join(",");
            conditions.push(`lml.lead_source_id IN (${values})`);
        }

        if (sourceGroup?.length) {
            const values = sourceGroup.map(s => `'${s}'`).join(",");
            conditions.push(`
            lml.lead_source_id IN (
                SELECT id FROM lead_management_leadsource
                WHERE source_group IN (${values})
            )
        `);
        }

        if (branch?.length) {
            const values = branch.map(b => `'${b}'`).join(",");
            conditions.push(`
            lml.assign_to_id IN (
                SELECT user_id
                FROM user_management_user_branch
                WHERE branch_id IN (${values})
            )
        `);
        }

        conditions.push(`lml.assign_to_id IS NOT NULL`);

        return conditions.length
            ? `WHERE ${conditions.join(" AND ")}`
            : "";
    };

    useEffect(() => {
        if (!loginUser || allowedUsernames.length === 0) return;

        const fetchChart = async () => {
            setLoading(true);
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
                              
                                  COUNT(DISTINCT lml.id) FILTER (
                                  WHERE (lml.interest_count > 0 OR lml.visit_count > 0 OR lml.vc_count > 0)
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
                              
                              ORDER BY sql DESC;
                            `,
                        }),
                    }
                );

                const result = await res.json();

                if (!Array.isArray(result)) {
                    setData([]);
                    return;
                }

                const formatted = result.map((item) => ({
                    name: item.name,
                    mql: Number(item.mql) || 0,
                    sql: Number(item.sql) || 0,
                }));

                setData(formatted);
            } catch (err) {
                console.error("MQL → SQL Chart API Error:", err);
            } finally {
                setLoading(false);
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

    const filteredData = data.filter((item) => item.sql > 0);

    const dataWithPercent = filteredData
        .map((item) => {
            const percent = item.mql ? (item.sql * 100) / item.mql : 0;

            return {
                ...item,
                value: percent,
                percent,
            };
        })
        .filter((item) => item.percent > 0)
        .sort((a, b) => b.percent - a.percent)
        .map((item, index, arr) => ({
            ...item,
            color:
                index === 0
                    ? "#10b981"
                    : generateColor(index, arr.length),
        }));

    const itemCount = dataWithPercent.length;
    const chartHeight = itemCount <= 1 ? 200 : itemCount <= 3 ? 220 : 260;
    const innerRadius = itemCount <= 2 ? 50 : 70;
    const outerRadius = itemCount <= 2 ? 80 : 110;
    const isSmallData = false;

    // console.log(
    //     dataWithPercent.map((d) =>
    //         `source group = ${d.name}, lead = ${d.lead}, sql = ${d.sql}, percent = ${d.percent.toFixed(2)}%`
    //     )
    // );

    return (
        <div className="rounded-xl flex flex-col bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 h-full">

            <div className="p-4 pb-0">
                <h3 className="font-semibold text-black dark:text-white">
                    MQL → SQL %
                </h3>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-[260px]">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div
                    className={`flex ${isSmallData ? "justify-center items-center" : "items-center"
                        } h-full`}
                >

                    {/* CHART */}
                    <div
                        className={isSmallData ? "w-full" : "w-[55%]"}
                        style={{
                            height: chartHeight,
                            minHeight: 260,
                        }}
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart
                                margin={{ top: 30, right: 30, left: 10, bottom: 50 }}
                            >
                                <Pie
                                    data={dataWithPercent}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={innerRadius}
                                    outerRadius={outerRadius}
                                    paddingAngle={2}
                                    stroke="none"
                                    isAnimationActive={true}
                                    animationDuration={800}
                                    animationEasing="ease-out"
                                >
                                    {dataWithPercent.map((entry, index) => (
                                        <Cell
                                            key={index}
                                            fill={entry.color}
                                        />
                                    ))}
                                </Pie>

                                <Tooltip
                                    content={({ active, payload }) => {
                                        if (!active || !payload || !payload.length) return null;

                                        const data = payload[0].payload;

                                        return (
                                            <div
                                                style={{
                                                    background: colors.tooltipBg || "#111827",
                                                    border: `1px solid ${colors.border || "#374151"}`,
                                                    borderRadius: "10px",
                                                    padding: "10px 12px",
                                                    boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
                                                    minWidth: "140px",
                                                }}
                                            >
                                                {/* TITLE */}
                                                <div
                                                    style={{
                                                        fontSize: "13px",
                                                        fontWeight: 600,
                                                        color: colors.tooltipText || "#fff",
                                                        marginBottom: "6px",
                                                    }}
                                                >
                                                    {data.name}
                                                </div>

                                                {/* DIVIDER */}
                                                <div
                                                    style={{
                                                        height: "1px",
                                                        background: colors.border || "#374151",
                                                        margin: "6px 0",
                                                        opacity: 0.5,
                                                    }}
                                                />

                                                {/* VALUES */}
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        fontSize: "12px",
                                                        color: colors.tooltipText || "#fff",
                                                    }}
                                                >
                                                    <strong>MQL → SQL</strong>
                                                    <span style={{ fontWeight: 600 }}>
                                                        {data.percent.toFixed(1)}%
                                                    </span>
                                                </div>

                                                <div
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        fontSize: "12px",
                                                        color: colors.tooltipText || "#9ca3af",
                                                        marginTop: "2px",
                                                    }}
                                                >
                                                    <strong>MQL</strong>
                                                    <span>{data.mql}</span>
                                                </div>
                                            </div>
                                        );
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* LEGEND */}
                    {dataWithPercent.length > 0 && (
                        <div className="w-[45%] pr-4 pb-4">

                            <div className="flex items-center justify-between text-xs text-black dark:text-white px-1">
                                <strong>Source Group</strong>
                                <strong>MQL → SQL %</strong>
                            </div>

                            <div className="border-b border-gray-700 my-2"></div>

                            <div className="space-y-2">
                                {dataWithPercent.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between text-sm"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span
                                                className="w-2.5 h-2.5 rounded-full"
                                                style={{
                                                    backgroundColor: item.color,
                                                }}
                                            />
                                            <span className="text-gray-700 dark:text-gray-300">
                                                {item.name}
                                            </span>
                                        </div>

                                        <span className="text-gray-900 dark:text-white font-medium">
                                            {item.percent.toFixed(1)}%
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SqlBySourceChart;