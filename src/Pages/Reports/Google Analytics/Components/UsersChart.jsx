import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
import { useEffect, useState } from "react";
import useTheme from "../services/useTheme";

const formatNumber = (num = 0) => {
    if (num >= 10000000) return (num / 10000000).toFixed(2) + "Cr";
    if (num >= 100000) return (num / 100000).toFixed(2) + "L";
    if (num >= 1000) return (num / 1000).toFixed(0) + "K";
    return num;
};

const UsersChart = ({ data = [] }) => {
    const { colors } = useTheme();

    const sortedData = [...data].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
    );

    return (
        <div className="rounded-xl flex flex-col bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 h-full">

            <div className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                    Users Over Time
                </h3>
            </div>

            {/* CHART */}
            <div className="flex-1 min-h-[350px] px-4 pb-2">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={sortedData}
                        margin={{ top: 10, right: 0, left: 0, bottom: 5 }}
                    >
                        {/* GRID */}
                        <CartesianGrid
                            stroke={colors.grid}
                            strokeDasharray="3 3"
                        />

                        {/* X AXIS */}
                        <XAxis
                            dataKey="date"
                            stroke={colors.text}
                            tick={{ fontSize: 11 }}
                            minTickGap={30}
                        />

                        {/* LEFT AXIS → USERS */}
                        <YAxis
                            yAxisId="left"
                            stroke="#3b82f6"
                            tick={{ fontSize: 11 }}
                            width={50}
                            tickFormatter={formatNumber}
                        />

                        {/* RIGHT AXIS → NEW USERS */}
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            stroke="#22c55e"
                            tick={{ fontSize: 11 }}
                            width={60}
                            tickFormatter={formatNumber}
                        />

                        {/* TOOLTIP */}
                        <Tooltip
                            contentStyle={{
                                backgroundColor: colors.tooltipBg,
                                border: `1px solid ${colors.border}`,
                                borderRadius: "8px",
                                color: colors.tooltipText,
                            }}
                            labelStyle={{ color: colors.text }}
                            formatter={(value, name, props) => [
                                value.toLocaleString(),
                                name,
                            ]}
                            itemSorter={(item) => {
                                if (item.name === "New Users") return -1;
                                if (item.name === "Active Users") return 1;
                                return 0;
                            }}
                        />

                        {/* USERS LINE */}
                        <Line
                            yAxisId="left"
                            type="monotoneX"
                            dataKey="activeUsers"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 5 }}
                            name="Active Users"
                            connectNulls
                        />

                        <Line
                            yAxisId="right"
                            type="monotoneX"
                            dataKey="newUsers"
                            stroke="#22c55e"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 5 }}
                            name="New Users"
                            connectNulls
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default UsersChart;