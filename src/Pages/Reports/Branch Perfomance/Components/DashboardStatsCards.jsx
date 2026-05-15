import React from "react";
import {
    TrendingUp,
    Users,
    PhoneCall,
    CalendarClock,
} from "lucide-react";

import {
    useCountUp,
    useLeadConversion,
} from "../../hook";

export default function DashboardStatsCards({
    dashboardStats,
    isLoading,
}) {

    const safeStats = dashboardStats || {};

    const totalLeadCount = useCountUp(
        isLoading
            ? null
            : safeStats?.total_lead ?? null
    );

    const freshLeadCount = useCountUp(
        isLoading
            ? null
            : safeStats?.Fresh_Lead ?? null
    );

    const mqlCount = useCountUp(
        isLoading
            ? null
            : safeStats?.total_mql ?? null
    );

    const sqlCount = useCountUp(
        isLoading
            ? null
            : safeStats?.total_sql ?? null
    );

    const {
        getMqlData,
        getSqlData,
    } = useLeadConversion();

    const mqlData = getMqlData(
        safeStats?.total_mql || 0,
        safeStats?.total_lead || 0
    );

    const sqlData = getSqlData(
        safeStats?.total_sql || 0,
        safeStats?.total_mql || 0
    );

    const stats = [
        {
            title: "Total Lead",
            value: totalLeadCount,
            icon: <Users size={20} />,
        },
        {
            title: "Fresh Lead",
            value: (
                <>
                    <span>
                        {Number(freshLeadCount || 0).toLocaleString()}
                    </span>

                    <span className="text-red-500 text-xs m-2">
                        {Number(
                            safeStats?.stale_fresh_leads || 0
                        ).toLocaleString()}
                    </span>
                </>
            ),
            icon: <PhoneCall size={20} />,
        },
        {
            title: "MQL",
            value: mqlCount,
            percent: mqlData.percent,
            percentColor: mqlData.color,
            icon: <CalendarClock size={20} />,
        },
        {
            title: "SQL",
            value: sqlCount,
            percent: sqlData.percent,
            percentColor: sqlData.color,
            icon: <TrendingUp size={20} />,
        },
    ];

    return (
        <div className="grid grid-cols-2 gap-3">

            {stats.map((item, index) => (
                <div
                    key={index}
                    className="
                        rounded-2xl
                        border border-gray-200 dark:border-white/10
                        bg-white dark:bg-[#111827]
                        p-4
                    "
                >
                    <div className="flex items-start justify-between">

                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {item.title}
                            </p>

                            <h2
                                className={`
                              text-2xl
                              font-bold
                              mt-2
                              ${isLoading
                                        ? "animate-pulse text-gray-400"
                                        : "text-black dark:text-white"
                                    }
                          `}
                            >
                                <div className="flex items-end gap-2 mt-1 flex-wrap">

                                    <span>
                                        {isLoading
                                            ? "..."
                                            : React.isValidElement(item.value)
                                                ? item.value
                                                : typeof item.value === "string"
                                                    ? item.value
                                                    : Number(item.value || 0).toLocaleString()
                                        }
                                    </span>

                                    {item.percent !== undefined && !isLoading && (
                                        <span
                                            className={`
                                          text-xs
                                          font-semibold
                                          mb-1
                                          ${item.percentColor}
                                      `}
                                        >
                                            {item.percent}%
                                        </span>
                                    )}

                                </div>
                            </h2>
                        </div>

                        <div
                            className="
                                w-9 h-9
                                rounded-xl
                                flex items-center justify-center
                                bg-white text-black
                                dark:bg-yellow-400/15
                                dark:text-yellow-300
                            "
                        >
                            {item.icon}
                        </div>

                    </div>
                </div>
            ))}

        </div>
    );
}