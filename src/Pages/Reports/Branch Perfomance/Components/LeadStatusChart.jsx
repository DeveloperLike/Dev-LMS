import React from "react";

import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
} from "recharts";

import ChartTooltip from "./ChartTooltip";

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
};

const usedColors = new Map();

const generateDistinctColor = (index) => {
    const hue = (index * 137.508) % 360;

    return `hsl(${hue},72%,55%)`;
};

const getStatusColor = (statusName, index) => {

    if (STATUS_COLORS[statusName]) {
        return STATUS_COLORS[statusName];
    }

    if (usedColors.has(statusName)) {
        return usedColors.get(statusName);
    }

    const color = generateDistinctColor(index);

    usedColors.set(statusName, color);

    return color;
};

export default function LeadStatusChart({
    dashboardStats,
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
                value > 0
            );
        })
        .map(([key, value]) => ({
            name: key.replaceAll("_", " "),
            value: Number(value),
        }))
        .sort((a, b) => b.value - a.value);

    // TOP 5
    const topStatuses = rawStatusData.slice(0, 5);

    // REMAINING
    const remainingStatuses =
        rawStatusData.slice(5);

    // OTHERS TOTAL
    const othersTotal =
        remainingStatuses.reduce(
            (sum, item) => sum + item.value,
            0
        );

    // FINAL DATA
    const statusData = (
        othersTotal > 0
            ? [
                ...topStatuses,
                {
                    name: "Others",
                    value: othersTotal,
                },
            ]
            : topStatuses
    ).sort((a, b) => b.value - a.value);

    return (
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">

                {/* DONUT */}
                <div className="h-[260px]">

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
                                        key={index}
                                        fill={getStatusColor(
                                            entry.name,
                                            index
                                        )}
                                    />
                                ))}
                            </Pie>

                            <Tooltip content={<ChartTooltip />} />

                        </PieChart>

                    </ResponsiveContainer>

                </div>

                {/* LABELS */}
                <div className="space-y-3">

                    {statusData.map((item, index) => (
                        <div
                            key={index}
                            className="
                          flex items-center justify-between
                          gap-3
                          rounded-xl
                          border border-gray-200 dark:border-white/10
                          bg-gray-50 dark:bg-[#0f172a]
                          px-4
                          py-3
                      "
                        >
                            <div className="flex items-center gap-3">

                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{
                                        background:
                                            getStatusColor(
                                                item.name,
                                                index
                                            ),
                                    }}
                                />

                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {item.name}
                                </span>

                            </div>

                            <span className="text-sm font-bold text-black dark:text-white">
                                {item.value}
                            </span>
                        </div>
                    ))}

                </div>

            </div>
        </div>
    );
}