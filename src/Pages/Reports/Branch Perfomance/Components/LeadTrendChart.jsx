import React, {
    useEffect,
    useState,
} from "react";

import axios from "axios";
import dayjs from "dayjs";

import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useSelector } from "react-redux";
import { getProfileService } from "../../../Profile/ApiService";
import { getLeadCounsellorDropdownService } from "../../ApiService";

dayjs.extend(utc);
dayjs.extend(timezone);

import {
    ResponsiveContainer,
    AreaChart,
    Area,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";

import ChartTooltip from "./ChartTooltip";
import { GET_CRM_RECORDS_API } from "../../../../lib/Constants";

export default function LeadTrendChart({
    startDate,
    endDate,
    counsellor,
    leadSource,
    sourceGroup,
    branch,
    role,
}) {
    const [loginUser, setLoginUser] = useState(null);
    const [allowedUsernames, setAllowedUsernames] = useState([]);
    const leadModulePermission = useSelector(
        (state) => state.permissions.permissionsData
    );

    const isAdmin =
        leadModulePermission?.user_group === "admin";
    const [leadTrendData, setLeadTrendData] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    useEffect(() => {

        const getUser = async () => {

            try {

                const res = await getProfileService();

                setLoginUser(
                    res?.data?.data?.username || null
                );

            } catch (err) {

                console.error(
                    "Profile Fetch Error:",
                    err
                );
            }
        };

        getUser();

    }, []);

    useEffect(() => {

        const fetchCounsellors = async () => {

            try {

                const res =
                    await getLeadCounsellorDropdownService();

                const usernames =
                    (res?.data?.data || []).map(
                        (item) => item.username
                    );

                setAllowedUsernames(usernames);

            } catch (err) {

                console.error(
                    "Counsellor fetch error",
                    err
                );
            }
        };

        fetchCounsellors();

    }, []);

    useEffect(() => {

        const fetchLeadTrendData = async () => {

            try {

                setLoading(true);

                let conditions = [];

                if (role?.length > 0) {

                    const values = role
                        .map((r) => `'${r}'`)
                        .join(",");

                    conditions.push(`
                      assign_to_id IN (
                          SELECT username
                          FROM user_management_user
                          WHERE role_id IN (${values})
                      )
                  `);
                }

                const users =
                    counsellor?.length
                        ? counsellor
                        : allowedUsernames;

                if (users.length > 0) {

                    const values = users
                        .map((u) => `'${u}'`)
                        .join(",");

                    conditions.push(`
                      assign_to_id IN (${values})
                  `);

                } else if (!isAdmin && loginUser) {

                    conditions.push(`
                      assign_to_id = '${loginUser}'
                  `);
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

                    conditions.push(`
                      created_at BETWEEN
                      '${startUTC}'
                      AND '${endUTC}'
                  `);
                }

                if (leadSource?.length > 0) {

                    const values = leadSource
                        .map((id) => `'${id}'`)
                        .join(",");

                    conditions.push(`
                      lead_source_id IN (${values})
                  `);
                }

                if (sourceGroup?.length > 0) {

                    const values = sourceGroup
                        .map((g) => `'${g}'`)
                        .join(",");

                    conditions.push(`
                      lead_source_id IN (
                          SELECT id
                          FROM lead_management_leadsource
                          WHERE source_group IN (${values})
                      )
                  `);
                }

                if (branch?.length > 0) {

                    const values = branch
                        .map((b) => `'${b}'`)
                        .join(",");

                    conditions.push(`
                      assign_to_id IN (
                          SELECT user_id
                          FROM user_management_user_branch
                          WHERE branch_id IN (${values})
                      )
                  `);
                }

                const whereClause =
                    conditions.length > 0
                        ? `WHERE ${conditions.join(" AND ")}`
                        : "";

                const query = `
                    SELECT
                        ${startDate === endDate
                        ? `'${dayjs(startDate).format("DD MMM YYYY")}' AS lead_date`
                        : `DATE(created_at) AS lead_date`
                    },
                
                        COUNT(*) AS total_lead
                
                    FROM lead_management_lead
                
                    ${whereClause}
                
                    ${startDate === endDate
                        ? ""
                        : `
                        GROUP BY DATE(created_at)
                        ORDER BY DATE(created_at)
                    `
                    }
                `;

                const res = await axios.post(GET_CRM_RECORDS_API, { query });

                const rawData =
                    Array.isArray(res?.data)
                        ? res.data
                        : res?.data?.data || [];

                const formattedData =
                    rawData.map((item) => ({

                        // X AXIS
                        name: dayjs(
                            item.lead_date
                        ).format("DD MMM"),

                        // TOOLTIP
                        fullDate: dayjs(
                            item.lead_date
                        ).format("DD MMM YYYY"),

                        leads: Number(
                            item.total_lead || 0
                        ),

                    }));

                setLeadTrendData(formattedData);

            } catch (error) {

                console.error(
                    "Lead Trend Chart Error:",
                    error
                );

                setLeadTrendData([]);

            } finally {

                setLoading(false);

            }
        };

        if (startDate && endDate) {
            fetchLeadTrendData();
        }

    }, [
        startDate,
        endDate,
        counsellor,
        leadSource,
        sourceGroup,
        branch,
        role,
        allowedUsernames,
        loginUser,
        isAdmin,
    ]);

    return (
        <div
            className="
            bg-white dark:bg-[#111827]
            border border-gray-200 dark:border-white/10
            rounded-3xl
            p-6
        "
        >

            <div className="flex items-center justify-between mb-6">

                <h2 className="text-xl font-bold text-black dark:text-white">
                    Lead Trend Analytics
                </h2>

                {loading && (
                    <span className="text-sm text-gray-400">
                        Loading...
                    </span>
                )}

            </div>

            <div className="h-[360px]">

                <ResponsiveContainer width="100%" height="100%">

                    <AreaChart
                        data={leadTrendData}
                        margin={{
                            top: 10,
                            right: 10,
                            left: 10,
                            bottom: 0,
                        }}
                    >

                        <defs>

                            <linearGradient
                                id="leadColor"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >

                                <stop
                                    offset="5%"
                                    stopColor="#8b5cf6"
                                    stopOpacity={0.5}
                                />

                                <stop
                                    offset="95%"
                                    stopColor="#8b5cf6"
                                    stopOpacity={0}
                                />

                            </linearGradient>

                        </defs>

                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={true}
                            horizontal={true}
                            opacity={0.08}
                        />

                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            interval="preserveStartEnd"
                            minTickGap={35}
                            tickMargin={10}
                            padding={{
                                left: 0,
                                right: 0,
                            }}
                            tick={{
                                fill: "#94a3b8",
                                fontSize: 11,
                            }}
                        />

                        <YAxis
                            hide={true}
                        />

                        <Tooltip
                            content={<ChartTooltip />}
                            labelFormatter={(label, payload) =>
                                payload?.[0]?.payload?.fullDate || label
                            }
                        />

                        <Area
                            type="monotone"
                            dataKey="leads"
                            name="Total Leads"
                            stroke="#8b5cf6"
                            strokeWidth={4}
                            fill="url(#leadColor)"
                        />

                    </AreaChart>

                </ResponsiveContainer>

            </div>

        </div>
    );
}