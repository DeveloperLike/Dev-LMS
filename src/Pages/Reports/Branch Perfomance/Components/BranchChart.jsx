import React from "react";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
} from "recharts";

import {
    TrendingUp,
    Users,
    PhoneCall,
    CalendarClock,
} from "lucide-react";
import { useCountUp } from "../../hook";

const leadTrendData = [
    { name: "Mon", leads: 120, followups: 40 },
    { name: "Tue", leads: 180, followups: 70 },
    { name: "Wed", leads: 140, followups: 60 },
    { name: "Thu", leads: 220, followups: 120 },
    { name: "Fri", leads: 260, followups: 150 },
    { name: "Sat", leads: 210, followups: 110 },
    { name: "Sun", leads: 170, followups: 90 },
];

const branchData = [
    { branch: "Delhi", leads: 420 },
    { branch: "Mumbai", leads: 380 },
    { branch: "Chandigarh", leads: 320 },
    { branch: "Bangalore", leads: 290 },
    { branch: "Pune", leads: 260 },
];

const STATUS_COLORS = {
    "Fresh Lead": "#3b82f6",
    "Did Not Pick": "#06b6d4",
    Interested: "#8b5cf6",
    Counselled: "#22c55e",
    "Future Lead": "#f59e0b",
    "Follow Up": "#ec4899",
    Junk: "#ef4444",
    "VC Schedule": "#14b8a6",
    "Visit Schedule": "#6366f1",
    SQL: "#f97316",
    MQL: "#84cc16",
    Others: "#64748b",
    "No Data": "#334155",
};

const usedColors = new Map();

const generateDistinctColor = (index) => {
    const hue = (index * 137.508) % 360;

    return `hsl(
        ${hue},
        72%,
        ${45 + (index % 3) * 8}%
    )`;
};

const getStatusColor = (statusName, index) => {

    // PREDEFINED COLORS
    if (STATUS_COLORS[statusName]) {
        return STATUS_COLORS[statusName];
    }

    // SAME STATUS => SAME COLOR
    if (usedColors.has(statusName)) {
        return usedColors.get(statusName);
    }

    // GENERATE UNIQUE COLOR
    let color = generateDistinctColor(
        usedColors.size + index
    );

    // AVOID DUPLICATE COLORS
    while (
        [
            ...Object.values(STATUS_COLORS),
            ...usedColors.values(),
        ].includes(color)
    ) {
        color = generateDistinctColor(
            usedColors.size + index + Math.random() * 100
        );
    }

    usedColors.set(statusName, color);

    return color;
};

export default function BranchPerformanceChartsPage({
    dashboardStats,
    isLoading,
}) {

    const safeStats = dashboardStats || {};

    const EXCLUDED_KEYS = [
        "total_lead",
        "total_mql",
        "total_sql",
        "Junk",
    ];

    const rawStatusData = Object.entries(
        safeStats || {}
    )
        .filter(([key, value]) => {
            return (
                !EXCLUDED_KEYS.includes(key) &&
                typeof value === "number" &&
                !isNaN(value) &&
                value > 0
            );
        })
        .map(([key, value]) => ({
            name: key
                .replaceAll("_", " ")
                .trim(),

            value: Number(value),
        }))
        .sort((a, b) => b.value - a.value);



    // TOP 10 + OTHERS
    const topStatuses = rawStatusData.slice(0, 10);

    const remainingStatuses =
        rawStatusData.slice(10);

    const othersTotal =
        remainingStatuses.reduce(
            (sum, item) => sum + item.value,
            0
        );

    const statusData =
        othersTotal > 0
            ? [
                ...topStatuses,
                {
                    name: "Others",
                    value: othersTotal,
                },
            ]
            : topStatuses;

    const totalStatusValue =
        statusData.reduce(
            (sum, item) => sum + item.value,
            0
        );

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

    const stats = [
        {
            title: "Total Lead",
            value: isLoading
                ? "..."
                : totalLeadCount,
            icon: <Users size={20} />,
        },

        {
            title: "Fresh Lead",
            value: isLoading
                ? "..."
                : freshLeadCount,
            icon: <PhoneCall size={20} />,
        },

        {
            title: "MQL",
            value: isLoading
                ? "..."
                : mqlCount,
            icon: <CalendarClock size={20} />,
        },

        {
            title: "SQL",
            value: isLoading
                ? "..."
                : sqlCount,
            icon: <TrendingUp size={20} />,
        },
    ];

    const CustomTooltip = ({
        active,
        payload,
        label,
    }) => {
        if (
            !active ||
            !payload ||
            !payload.length
        ) {
            return null;
        }

        return (
            <div
                className="
                    rounded-xl
                    border
                    border-gray-200
                    dark:border-white/10
                    bg-white
                    dark:bg-[#111827]
                    shadow-2xl
                    px-3
                    py-2
                    min-w-[120px]
                "
            >
                {label && (
                    <p
                        className="
                            text-xs
                            font-semibold
                            mb-2
                            text-gray-500
                            dark:text-gray-400
                        "
                    >
                        {label}
                    </p>
                )}

                <div className="space-y-1">
                    {payload.map((entry, index) => (
                        <div
                            key={index}
                            className="
                                flex
                                items-center
                                justify-between
                                gap-4
                                text-sm
                            "
                        >
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-2.5 h-2.5 rounded-full"
                                    style={{
                                        background:
                                            entry.color,
                                    }}
                                />

                                <span
                                    className="
                                        text-gray-600
                                        dark:text-gray-300
                                    "
                                >
                                    {entry.name}
                                </span>
                            </div>

                            <span
                                className="
                                    font-semibold
                                    text-black
                                    dark:text-white
                                "
                            >
                                {Number(
                                    entry.value || 0
                                ).toLocaleString()}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div
            className="
        rounded-3xl
        border border-white/10
        bg-white dark:bg-[#071018]
        p-5
        transition-all duration-300
        overflow-hidden
        h-fit
    "
        >
            {/* HEADER */}
            <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
                <div>
                    <h1 className="text-xl font-bold text-black dark:text-white">
                        Branch Analytics
                    </h1>
                </div>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-2 gap-3 mb-6">
                {stats.map((item, index) => (
                    <div
                        key={index}
                        className="
                            min-w-0
                            rounded-2xl
                            border border-gray-200 dark:border-white/10
                            bg-gray-50 dark:bg-[#111827]
                            p-4
                            overflow-hidden
                            transition-all duration-300
                        "
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                                    {item.title}
                                </p>

                                <h2
                                    className={`
                          text-xl md:text-2xl
                          font-bold
                          mt-2
                          truncate
                          transition-all duration-300
                          ${isLoading
                                            ? "text-gray-400 dark:text-gray-500 animate-pulse"
                                            : "text-black dark:text-white"
                                        }
                      `}
                                >
                                    {
                                        item.value === "..." ||
                                            item.value === null ||
                                            item.value === undefined
                                            ? "..."
                                            : Number(
                                                item.value
                                            ).toLocaleString()
                                    }
                                </h2>

                                {item.growth && (
                                    <div className="mt-4 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-semibold">
                                        <TrendingUp size={14} />
                                        {item.growth}
                                    </div>
                                )}
                            </div>

                            <div
                                className="
                  w-10 h-10 rounded-2xl
                  flex items-center justify-center
                  bg-black text-white
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

            <div className="grid grid-cols-1 gap-4">

                {/* LINE CHART */}
                <div
                    className="
                bg-white dark:bg-[#111827]
                border border-gray-200 dark:border-white/10
                rounded-3xl
                p-6
              "
                >
                    <h2 className="text-xl font-bold text-black dark:text-white mb-6">
                        Follow Up Performance
                    </h2>

                    <div className="h-[320px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={leadTrendData}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />

                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "#94a3b8" }}
                                />

                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "#94a3b8" }}
                                />

                                <Tooltip content={<CustomTooltip />} />

                                <Line
                                    type="monotone"
                                    dataKey="followups"
                                    stroke="#ec4899"
                                    strokeWidth={4}
                                    dot={{ r: 5 }}
                                    activeDot={{ r: 8 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 mt-4">
                {/* AREA CHART */}
                <div
                    className="
            xl:col-span-2
            bg-white dark:bg-[#111827]
            border border-gray-200 dark:border-white/10
            rounded-3xl
            p-6
          "
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-black dark:text-white">
                                Lead Trend Analytics
                            </h2>
                        </div>
                    </div>

                    <div className="h-[240px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={leadTrendData}>
                                <defs>
                                    <linearGradient id="leadColor" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.5} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>

                                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />

                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "#94a3b8" }}
                                />

                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "#94a3b8" }}
                                />

                                <Tooltip content={<CustomTooltip />} />

                                <Area
                                    type="monotone"
                                    dataKey="leads"
                                    stroke="#8b5cf6"
                                    strokeWidth={4}
                                    fill="url(#leadColor)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* PIE CHART */}
                <div
                    className="
            bg-white dark:bg-[#111827]
            border border-gray-200 dark:border-white/10
            rounded-3xl
            p-6
          "
                >
                    <h2 className="text-xl font-bold text-black dark:text-white mb-6">
                        Lead Status
                    </h2>

                    <div className="h-[220px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={110}
                                    paddingAngle={4}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={getStatusColor(entry.name, index)}
                                        />
                                    ))}
                                </Pie>

                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-4">
                        {totalStatusValue > 0 &&
                            statusData.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300"
                                >
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{
                                            background:
                                                getStatusColor(item.name, index),
                                        }}
                                    />

                                    {item.name}
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>

        </div>
    );
}
