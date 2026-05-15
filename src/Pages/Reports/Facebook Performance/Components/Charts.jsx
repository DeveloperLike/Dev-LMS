import { Card, Empty, Spin } from "antd";
import {
    ComposedChart,
    Line,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Legend,
    CartesianGrid,
    LineChart,
    BarChart,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import { useMemo } from "react";
import dayjs from "dayjs";

const Charts = ({ campaigns = [], loading, filters = {} }) => {

    const isDark = document.documentElement.classList.contains("dark");

    const chartColors = {
        text: isDark ? "#ffffff" : "#000000",
        grid: isDark ? "#000000" : "#ffffff",
        tooltipBg: isDark ? "#000000" : "#ffffff",

        impressions: "#3b82f6",
        clicks: "#10b981",
        leads: "#f59e0b",
        spend: "#ffce00",
        ctr: "#ef4444",
        cpc: "#a855f7",
    };

    const chartData = useMemo(() => {
        if (!Array.isArray(campaigns)) return [];

        const map = {};

        const hasDateFilter =
            filters?.startDate && filters?.endDate;

        let start = null;
        let end = null;

        if (hasDateFilter) {
            start = dayjs(filters.startDate);
            end = dayjs(filters.endDate);
        }

        campaigns.forEach((c) => {
            if (!c.date) return;

            const currentDate = dayjs(c.date);

            if (hasDateFilter) {
                if (currentDate.isBefore(start) || currentDate.isAfter(end)) return;
            }

            const key = currentDate.format("YYYY-MM-DD");

            if (!map[key]) {
                map[key] = {
                    fullDate: key,
                    label: currentDate.format("DD MMM YYYY"),
                    spend: 0,
                    impressions: 0,
                    clicks: 0,
                    leads: 0,
                };
            }

            map[key].spend += Number(c.spend || 0);
            map[key].impressions += Number(c.impressions || 0);
            map[key].clicks += Number(c.clicks || 0);
            map[key].leads += Number(c.leads || 0);
        });

        if (!hasDateFilter) {
            return Object.values(map)
                .sort((a, b) => a.fullDate.localeCompare(b.fullDate))
                .map((d) => ({
                    ...d,
                    ctr: d.impressions
                        ? Number(((d.clicks / d.impressions) * 100).toFixed(2))
                        : 0,
                    cpc: d.clicks
                        ? Number((d.spend / d.clicks).toFixed(2))
                        : 0,
                }));
        }

        const result = [];

        let current = start;

        while (current.isBefore(end) || current.isSame(end)) {
            const key = current.format("YYYY-MM-DD");

            const existing = map[key];

            result.push(
                existing || {
                    fullDate: key,
                    label: current.format("DD MMM YYYY"),
                    spend: 0,
                    impressions: 0,
                    clicks: 0,
                    leads: 0,
                }
            );

            current = current.add(1, "day");
        }

        return result.map((d) => ({
            ...d,
            ctr: d.impressions
                ? Number(((d.clicks / d.impressions) * 100).toFixed(2))
                : 0,
            cpc: d.clicks
                ? Number((d.spend / d.clicks).toFixed(2))
                : 0,
        }));

    }, [campaigns, filters]);

    const groupedData = useMemo(() => {
        if (!Array.isArray(campaigns)) return [];

        const grouped = campaigns.reduce((acc, item) => {
            const key = item.accountName || "Unknown";

            if (!acc[key]) {
                acc[key] = {
                    name: key,
                    spend: 0,
                    impressions: 0,
                };
            }

            acc[key].spend += Number(item.spend || 0);
            acc[key].impressions += Number(item.impressions || 0);

            return acc;
        }, {});

        return Object.values(grouped);
    }, [campaigns]);

    const campaignSpendData = useMemo(() => {
        if (!Array.isArray(campaigns)) return [];

        const grouped = campaigns.reduce((acc, item) => {
            const key = item.name || "Unknown Campaign";

            if (!acc[key]) {
                acc[key] = {
                    name: key,
                    spend: 0,
                };
            }

            acc[key].spend += Number(item.spend || 0);

            return acc;
        }, {});

        return Object.values(grouped).sort((a, b) =>
            a.name.localeCompare(b.name)
        );
    }, [campaigns]);

    // SORTED DATA
    const spendData = useMemo(() => {
        return [...groupedData].sort((a, b) => b.spend - a.spend);
    }, [groupedData]);

    const impressionData = useMemo(() => {
        return [...groupedData].sort((a, b) => b.impressions - a.impressions);
    }, [groupedData]);

    const hasData = groupedData.length > 0;

    const getTitle = () => {
        const start = filters?.startDate;
        const end = filters?.endDate;

        if (!start || !end) {
            return "Performance (Last 30 Days)";
        }

        if (start === end) {
            return `Performance (${dayjs(start).format("DD MMM")})`;
        }

        return `Performance (${dayjs(start).format("DD MMM")} → ${dayjs(end).format("DD MMM")})`;
    };

    const pieData = useMemo(() => {
        const top = spendData.slice(0, 6);
        const rest = spendData.slice(6);

        const othersSpend = rest.reduce((sum, i) => sum + i.spend, 0);

        return [
            ...top,
            ...(othersSpend > 0 ? [{ name: "Others", spend: othersSpend }] : []),
        ];
    }, [spendData]);

    const formatNumber = (num = 0) => {
        if (num >= 10000000) {
            return `${(num / 10000000).toFixed(0)}Cr`;
        }

        if (num >= 100000) {
            return `${(num / 100000).toFixed(0)}L`;
        }

        if (num >= 1000) {
            return `${(num / 1000).toFixed(0)}K`;
        }

        return num;
    };

    return (
        <>
            <Card title={getTitle()} className="mt-4 mb-4 dark:bg-[#1f2937] bg-white border border-gray-200 dark:border-gray-700">

                <Spin spinning={loading}>
                    {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={400}>
                            <ComposedChart
                                data={chartData}
                                margin={{ top: 20, right: 10, left: 10, bottom: 10 }}
                            >
                                <CartesianGrid vertical={false} horizontal={false} />

                                {/* X AXIS */}
                                <XAxis
                                    dataKey="label"
                                    tick={{ fill: chartColors.text, fontSize: 12 }}
                                    interval={4}
                                />

                                {/* Y AXIS - BIG VALUES (Impressions) */}
                                <YAxis
                                    yAxisId="left"
                                    tick={{ fill: chartColors.text }}
                                    tickFormatter={formatNumber}
                                />

                                {/* Y AXIS - MEDIUM VALUES (Spend) */}
                                <YAxis
                                    yAxisId="right"
                                    orientation="right"
                                    tick={{ fill: chartColors.text }}
                                    tickFormatter={formatNumber}
                                />

                                {/* Y AXIS - SMALL VALUES (Clicks & Leads) */}
                                <YAxis
                                    yAxisId="small"
                                    orientation="right"
                                    tick={{ fill: chartColors.text }}
                                    hide={true}
                                />

                                {/* TOOLTIP */}
                                <Tooltip
                                    cursor={{
                                        fill: isDark
                                            ? "rgba(255,255,255,0.04)"
                                            : "rgba(0,0,0,0.04)",
                                    }}
                                    contentStyle={{
                                        backgroundColor: isDark ? "#020617" : "#ffffff",
                                        border: `1px solid ${isDark ? "#1e293b" : "#e5e7eb"}`,
                                        borderRadius: "14px",
                                        padding: "12px 14px",
                                        boxShadow: isDark
                                            ? "0 8px 24px rgba(0,0,0,0.45)"
                                            : "0 8px 24px rgba(0,0,0,0.08)",
                                    }}
                                    labelStyle={{
                                        color: isDark ? "#ffffff" : "#111827",
                                        fontWeight: 700,
                                        marginBottom: "8px",
                                        display: "block",
                                        fontSize: "13px",
                                    }}
                                    itemStyle={{
                                        color: isDark ? "#e5e7eb" : "#111827",
                                        fontSize: "13px",
                                        padding: "2px 0",
                                    }}
                                    formatter={(value, name) => {
                                        if (name === "Spend") {
                                            return [
                                                `₹${Number(value).toLocaleString()}`,
                                                "Spend",
                                            ];
                                        }

                                        if (name === "CTR (%)") {
                                            return [
                                                `${Number(value).toFixed(2)}%`,
                                                "CTR",
                                            ];
                                        }

                                        return [
                                            Number(value).toLocaleString(),
                                            name,
                                        ];
                                    }}
                                />

                                <Legend />

                                {/* BIG DATA */}
                                <Bar
                                    yAxisId="left"
                                    dataKey="impressions"
                                    fill="#3b82f6"
                                    name="Impressions"
                                    radius={[8, 8, 0, 0]}
                                />

                                {/* MEDIUM DATA */}
                                <Line
                                    yAxisId="right"
                                    type="monotone"
                                    dataKey="spend"
                                    stroke="#ffce00"
                                    name="Spend"
                                    strokeWidth={2}
                                />

                                {/* SMALL DATA */}
                                <Bar
                                    yAxisId="small"
                                    dataKey="clicks"
                                    fill="#10b981"
                                    name="Clicks"
                                    radius={[8, 8, 0, 0]}
                                />

                                <Bar
                                    yAxisId="small"
                                    dataKey="leads"
                                    fill="#f59e0b"
                                    name="Meta Leads"
                                    radius={[8, 8, 0, 0]}
                                />
                            </ComposedChart>
                        </ResponsiveContainer>
                    ) : (
                        <Empty description="No data available" />
                    )}
                </Spin>
            </Card>

            {/*  CHARTS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Account Spend */}
                <Card
                    title="Account Spend"
                    className="dark:bg-[#1f2937] bg-white dark:text-white text-black border border-gray-200 dark:border-gray-700"
                >
                    <Spin spinning={loading}>
                        {hasData ? (
                            <div className="flex flex-col lg:flex-row items-center lg:items-center justify-between gap-6 min-h-[400px] px-2">

                                {/* PIE CHART */}
                                <div className="w-full lg:w-[42%] flex justify-center">
                                    <ResponsiveContainer width="100%" height={260}>
                                        <PieChart>
                                            <Pie
                                                data={pieData}
                                                dataKey="spend"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={70}
                                                outerRadius={105}
                                                paddingAngle={2}
                                                stroke="none"
                                            >
                                                {pieData.map((entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={[
                                                            "#3b82f6",
                                                            "#84cc16",
                                                            "#a855f7",
                                                            "#f59e0b",
                                                            "#06b6d4",
                                                            "#ef4444",
                                                            "#14b8a6",
                                                        ][index % 7]}
                                                    />
                                                ))}
                                            </Pie>

                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: isDark ? "#111827" : "#ffffff",
                                                    border: `1px solid ${isDark ? "#374151" : "#d1d5db"}`,
                                                    borderRadius: "10px",
                                                    color: isDark ? "#ffffff" : "#000000",
                                                    boxShadow: isDark
                                                        ? "0 4px 12px rgba(0,0,0,0.4)"
                                                        : "0 4px 12px rgba(0,0,0,0.1)",
                                                }}
                                                itemStyle={{
                                                    color: isDark ? "#ffffff" : "#000000",
                                                }}
                                                labelStyle={{
                                                    color: isDark ? "#ffffff" : "#000000",
                                                    fontWeight: 600,
                                                }}
                                                formatter={(value) =>
                                                    `₹${Number(value).toLocaleString()}`
                                                }
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* CUSTOM LEGEND */}
                                <div className="w-full lg:flex-1 space-y-3 text-sm lg:pr-4">

                                    {/* HEADER */}
                                    <div className="flex justify-between text-xs text-gray-400 mb-2">
                                        <strong>Account</strong>
                                        <strong>Spend</strong>
                                    </div>

                                    <div className="border-b border-gray-700"></div>

                                    {/* DATA */}
                                    {pieData.map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex justify-between items-center gap-3"
                                        >
                                            {/* LEFT */}
                                            <div className="flex items-center gap-2 min-w-0">
                                                <span
                                                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                                    style={{
                                                        background: [
                                                            "#3b82f6",
                                                            "#84cc16",
                                                            "#a855f7",
                                                            "#f59e0b",
                                                            "#06b6d4",
                                                            "#ef4444",
                                                            "#14b8a6",
                                                        ][index % 7],
                                                    }}
                                                />

                                                <span className="truncate max-w-[140px] sm:max-w-none text-black dark:text-white">
                                                    {item.name}
                                                </span>
                                            </div>

                                            {/* RIGHT */}
                                            <span className="font-medium whitespace-nowrap text-black dark:text-white">
                                                ₹{Number(item.spend).toLocaleString()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <Empty />
                        )}
                    </Spin>
                </Card>

                {/* Campaign Spend */}
                <Card title="Campaign Spend" className="dark:bg-[#1f2937] bg-white dark:text-white text-black border border-gray-200 dark:border-gray-700">
                    <Spin spinning={loading}>
                        {hasData ? (
                            <ResponsiveContainer width="100%" height={400}>
                                <BarChart
                                    data={campaignSpendData}
                                    margin={{ top: 20, right: 20, left: 0, bottom: 10 }}
                                >
                                    <XAxis
                                        dataKey="name"
                                        hide={false}
                                        tick={false}
                                        tickLine={false}
                                        axisLine={{
                                            stroke: isDark ? "#475569" : "#94a3b8",
                                            strokeWidth: 1,
                                        }}
                                    />

                                    <YAxis
                                        tick={{ fontSize: 10, fill: chartColors.text }}
                                        tickFormatter={formatNumber}
                                    />

                                    <Tooltip
                                        cursor={{
                                            fill: isDark
                                                ? "rgba(255,255,255,0.05)"
                                                : "rgba(0,0,0,0.04)",
                                        }}
                                        content={({ active, payload, label }) => {
                                            if (!active || !payload?.length) return null;

                                            const data = payload[0];

                                            return (
                                                <div
                                                    className={`min-w-[180px] rounded-xl border px-4 py-3 shadow-2xl ${isDark
                                                        ? "bg-[#020617] border-[#334155]"
                                                        : "bg-white border-gray-200"
                                                        }`}
                                                >
                                                    {/* TITLE */}
                                                    <div
                                                        className={`text-sm font-semibold mb-3 leading-5 break-words ${isDark
                                                            ? "text-white"
                                                            : "text-gray-900"
                                                            }`}
                                                    >
                                                        {label}
                                                    </div>

                                                    {/* VALUE */}
                                                    <div className="flex items-center justify-between gap-4">
                                                        <div className="flex items-center gap-2">
                                                            <span className="w-2.5 h-2.5 rounded-full bg-[#ffce00]" />

                                                            <span
                                                                className={`text-sm ${isDark
                                                                    ? "text-gray-300"
                                                                    : "text-gray-600"
                                                                    }`}
                                                            >
                                                                Spend
                                                            </span>
                                                        </div>

                                                        <span
                                                            className={`text-sm font-bold ${isDark
                                                                ? "text-white"
                                                                : "text-gray-900"
                                                                }`}
                                                        >
                                                            ₹{Number(data.value).toLocaleString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        }}
                                    />

                                    <Bar
                                        dataKey="spend"
                                        fill="#ffce00"
                                        name="Spend"
                                        radius={[8, 8, 0, 0]}
                                    />

                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <Empty />
                        )}
                    </Spin>
                </Card>

            </div>
        </>
    );
};

export default Charts;