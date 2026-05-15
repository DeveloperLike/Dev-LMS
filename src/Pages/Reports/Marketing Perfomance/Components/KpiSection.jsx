import {
    UserOutlined,
    FunnelPlotOutlined,
    AimOutlined,
    LineChartOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useCountUp, useLeadConversion } from "../../hook";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import { useSelector } from "react-redux";
import { getProfileService } from "../../../Profile/ApiService";
import { getLeadCounsellorDropdownService } from "../../ApiService";

import { YgApi } from "../../../../lib/Constants";

dayjs.extend(utc);
dayjs.extend(timezone);

const iconMap = {
    "Total Leads": {
        icon: <UserOutlined />,
        color: "text-purple-500",
        bg: "bg-purple-500/10",
    },
    MQL: {
        icon: <FunnelPlotOutlined />,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
    },
    SQL: {
        icon: <AimOutlined />,
        color: "text-green-500",
        bg: "bg-green-500/10",
    },
    Conversion: {
        icon: <LineChartOutlined />,
        color: "text-orange-500",
        bg: "bg-orange-500/10",
    },
};

const KpiSection = ({
    startDate,
    endDate,
    counsellor = [],
    leadSource = [],
    sourceGroup = [],
    branch = [],
    role = [],
}) => {
    const [kpi, setKpi] = useState({
        total: 0,
        mql: 0,
        sql: 0,
        registered: 0,
        conversion: 0,
    });

    const [loading, setLoading] = useState(false);
    const [loginUser, setLoginUser] = useState(null);
    const [allowedUsernames, setAllowedUsernames] = useState([]);

    const leadModulePermission = useSelector(
        (state) => state.permissions.permissionsData
    );

    const isAdmin = leadModulePermission?.user_group === "admin";
    const { getMqlData, getSqlData } = useLeadConversion();

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

            conditions.push(`lml.created_at BETWEEN '${startUTC}' AND '${endUTC}'`);
        }

        const users = counsellor?.length ? counsellor : allowedUsernames;

        if (users.length > 0) {
            const values = users.map(u => `'${u}'`).join(",");
            conditions.push(`lml.assign_to_id IN (${values})`);
        } else if (!isAdmin && loginUser) {
            conditions.push(`lml.assign_to_id = '${loginUser}'`);
        }

        if (role?.length > 0) {
            const values = role.map(r => `'${r}'`).join(",");

            conditions.push(`
            lml.assign_to_id IN (
                SELECT username 
                FROM user_management_user
                WHERE role_id IN (${values})
            )
        `);
        }

        if (leadSource?.length > 0) {
            const values = leadSource.map(l => `'${l}'`).join(",");
            conditions.push(`lml.lead_source_id IN (${values})`);
        }

        if (sourceGroup?.length > 0) {
            const values = sourceGroup.map(s => `'${s}'`).join(",");
            conditions.push(`
            lml.lead_source_id IN (
                SELECT id FROM lead_management_leadsource
                WHERE source_group IN (${values})
            )
        `);
        }

        if (branch?.length > 0) {
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

        return conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    };

    useEffect(() => {
        if (!loginUser || allowedUsernames.length === 0) return;

        const fetchKpi = async () => {
            setLoading(true);
            try {
                const whereClause = buildWhereClause();

                const res = await fetch(
                    `${YgApi}/mondayMeetings/get-crm-records`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            query: `
                                SELECT 
                                    COUNT(DISTINCT lml.id) AS total_leads,

                                    COUNT(DISTINCT lml.id) FILTER (
                                        WHERE lml.interest_count > 0
                                    ) AS mql,

                                    COUNT(DISTINCT lml.id) FILTER (
                                        WHERE (lml.visit_count > 0 OR lml.vc_count > 0)
                                    ) AS sql,

                                    COUNT(DISTINCT lml.id) FILTER (
                                        WHERE app.lead_id IS NOT NULL
                                    ) AS registered,

                                    ROUND(
                                        (COUNT(DISTINCT lml.id) FILTER (WHERE app.lead_id IS NOT NULL) * 100.0)
                                        / NULLIF(COUNT(DISTINCT lml.id), 0),
                                        2
                                    ) AS conversion_pct

                                FROM lead_management_lead lml

                                LEFT JOIN accounting_packagepurchased app
                                    ON app.lead_id = lml.id

                                LEFT JOIN lead_management_leadsource lmls
                                    ON lml.lead_source_id = lmls.id

                                ${whereClause}
                            `,
                        }),
                    }
                );

                const result = await res.json();

                if (!result || !result.length) {
                    setKpi({ total: 0, mql: 0, sql: 0, registered: 0, conversion: 0 });
                    return;
                }

                const row = result[0];

                setKpi({
                    total: Number(row.total_leads) || 0,
                    mql: Number(row.mql) || 0,
                    sql: Number(row.sql) || 0,
                    registered: Number(row.registered) || 0,
                    conversion: Number(row.conversion_pct) || 0,
                });

            } catch (err) {
                console.error("KPI API Error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchKpi();
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

    const mqlData = getMqlData(kpi.mql, kpi.total);

    const sqlData = getSqlData(kpi.sql, kpi.mql);

    const data = [
        {
            title: "Total Leads",
            value: useCountUp(kpi.total),
        },
        {
            title: "MQL",
            value: useCountUp(kpi.mql),
            percentage: `${mqlData.percent}%`,
            percentageColor: mqlData.color,
        },
        {
            title: "SQL",
            value: useCountUp(kpi.sql),
            percentage: `${sqlData.percent}%`,
            percentageColor: sqlData.color,
        },
        {
            title: "Conversion",
            value: `${useCountUp(kpi.conversion)}%`,
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {data.map((item, i) => {
                const config = iconMap[item.title] || {};

                return (
                    <div key={i} className="rounded-xl p-4 bg-white dark:bg-gray-800 shadow hover:shadow-lg transition">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 flex items-center justify-center rounded-lg ${config.bg}`}>
                                <span className={`${config.color} text-lg`}>
                                    {config.icon}
                                </span>
                            </div>

                            <div className="flex-1">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {item.title}
                                </p>

                                <div className="flex items-center justify-between w-full gap-3">
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        {loading ? "..." : item.value}
                                    </h2>

                                    {item.percentage && (
                                        <span
                                            className={`text-sm font-medium px-2 py-[2px] rounded-md whitespace-nowrap bg-white/5 ${item.percentageColor}`}
                                        >
                                            {item.percentage}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default KpiSection;