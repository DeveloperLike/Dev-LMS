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


import {
    getLeadCounsellorDropdownService,
} from "../../ApiService";

dayjs.extend(utc);
dayjs.extend(timezone);

import {
    ResponsiveContainer,
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
} from "recharts";

import ChartTooltip from "./ChartTooltip";
import { baseurl } from "../../../../lib/Constants";

export default function FollowupChart({
    startDate,
    endDate,
    counsellor,
    leadSource,
    sourceGroup,
    branch,
    role,
}) {
    const [loginUser, setLoginUser] =
        useState(null);

    const [allowedUsernames, setAllowedUsernames] =
        useState([]);

    const leadModulePermission = useSelector(
        (state) => state.permissions.permissionsData
    );

    const isAdmin =
        leadModulePermission?.user_group === "admin";

    const [followupData, setFollowupData] =
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

        const fetchFollowupData = async () => {

            try {

                setLoading(true);

                let conditions = [];

                if (role?.length > 0) {

                    const values = role
                        .map((r) => `'${r}'`)
                        .join(",");

                    conditions.push(`
                     l.assign_to_id IN (
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
                     l.assign_to_id IN (${values})
                 `);

                } else if (!isAdmin && loginUser) {

                    conditions.push(`
                     l.assign_to_id = '${loginUser}'
                 `);
                }

                if (leadSource?.length > 0) {

                    const values = leadSource
                        .map((id) => `'${id}'`)
                        .join(",");

                    conditions.push(`
                     l.lead_source_id IN (${values})
                 `);
                }

                if (sourceGroup?.length > 0) {

                    const values = sourceGroup
                        .map((g) => `'${g}'`)
                        .join(",");

                    conditions.push(`
                     l.lead_source_id IN (
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
                     l.assign_to_id IN (
                         SELECT user_id
                         FROM user_management_user_branch
                         WHERE branch_id IN (${values})
                     )
                 `);
                }

                const whereClause =
                    conditions.length > 0
                        ? `AND ${conditions.join(" AND ")}`
                        : "";

                const query = `
                 SELECT
                     gs.day::date AS followup_date,
             
                     COUNT(f.id) AS total_followups
             
                FROM generate_series(
                    CURRENT_DATE,
                    CURRENT_DATE + INTERVAL '6 day',
                    INTERVAL '1 day'
                ) AS gs(day)
             
                 LEFT JOIN lead_management_followup f
                     ON DATE(f.date) = gs.day::date
                     AND f.status = false
             
                 LEFT JOIN lead_management_lead l
                     ON l.id = f.lead_id
             
                 WHERE 1=1
                     ${whereClause}
             
                 GROUP BY gs.day
             
                 ORDER BY gs.day ASC;
             `;

                const res = await axios.post(
                    baseurl + "/mondayMeetings/get-crm-records",
                    { query }
                );

                const rawData =
                    Array.isArray(res?.data)
                        ? res.data
                        : res?.data?.data || [];

                const formattedData =
                    rawData.map((item) => ({

                        // X AXIS
                        name: dayjs(
                            item.followup_date
                        ).format("DD MMM"),

                        // TOOLTIP
                        fullDate: dayjs(
                            item.followup_date
                        ).format("DD MMM YYYY"),

                        total_followups: Number(
                            item.total_followups || 0
                        ),

                    }));

                setFollowupData(formattedData);

            } catch (error) {

                console.error(
                    "Followup Chart Error:",
                    error
                );

                setFollowupData([]);

            } finally {

                setLoading(false);

            }
        };

        fetchFollowupData();

    }, [
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
                rounded-3xl p-6 pb-8
            "
        >

            <div className="flex items-center justify-between mb-6">

                <h2 className="text-xl font-bold text-black dark:text-white">
                    Upcoming Follow Ups
                </h2>

                {loading && (
                    <span className="text-sm text-gray-400">
                        Loading...
                    </span>
                )}

            </div>

            <div className="h-[320px]">

                <ResponsiveContainer width="100%" height="100%">

                    <LineChart
                        data={followupData}
                        margin={{
                            top: 10,
                            right: 20,
                            left: 20,
                            bottom: 0,
                        }}
                    >

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
                            interval={0}
                            tickMargin={10}
                            tick={{
                                fill: "#94a3b8",
                                fontSize: 11,
                            }}
                        />
                        <YAxis hide={true} />

                        <Tooltip
                            content={<ChartTooltip />}
                        />

                        <Line
                            type="monotone"
                            dataKey="total_followups"
                            name="Upcoming Followups"
                            stroke="#06b6d4"
                            strokeWidth={4}
                            dot={{
                                r: 5,
                                strokeWidth: 2,
                                fill: "#3b82f6",
                                stroke: "#ffffff",
                            }}
                            activeDot={{
                                r: 8,
                                fill: "#3b82f6",
                                stroke: "#ffffff",
                                strokeWidth: 2,
                            }}
                        />

                    </LineChart>

                </ResponsiveContainer>

            </div>

        </div>
    );
}