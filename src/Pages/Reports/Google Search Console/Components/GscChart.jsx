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

/* ================= NUMBER FORMAT ================= */
const formatNumber = (num = 0) => {
    if (num >= 10000000) return (num / 10000000).toFixed(2) + "Cr";
    if (num >= 100000) return (num / 100000).toFixed(2) + "L";
    if (num >= 1000) return (num / 1000).toFixed(0) + "K";
    return num;
};

const GscChart = ({ data = [] }) => {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const checkDark = () =>
            document.documentElement.classList.contains("dark");

        setIsDark(checkDark());

        const observer = new MutationObserver(() => {
            setIsDark(checkDark());
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });

        return () => observer.disconnect();
    }, []);

    const colors = {
        grid: isDark ? "#374151" : "#e5e7eb",
        text: isDark ? "#9ca3af" : "#6b7280",
        tooltipBg: isDark ? "#111827" : "#ffffff",
        tooltipText: isDark ? "#ffffff" : "#111827",
    };

    return (
        <div className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
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

                    {/* LEFT Y AXIS */}
                    <YAxis
                        yAxisId="left"
                        stroke="#3b82f6"
                        tick={{ fontSize: 11 }}
                        width={50}
                        tickFormatter={formatNumber}
                    />

                    {/* RIGHT Y AXIS */}
                    <YAxis
                        yAxisId="right"
                        orientation="right"
                        stroke="#a855f7"
                        tick={{ fontSize: 11 }}
                        width={60}
                        tickFormatter={formatNumber}
                    />

                    {/* TOOLTIP */}
                    <Tooltip
                        contentStyle={{
                            backgroundColor: colors.tooltipBg,
                            border: `1px solid ${colors.grid}`,
                            borderRadius: "8px",
                            color: colors.tooltipText,
                        }}
                        formatter={(value, name) => [
                            formatNumber(value),
                            name,
                        ]}
                        labelStyle={{ color: colors.text }}
                    />

                    {/* LINES */}
                    <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="clicks"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 5 }}
                        name="Clicks"
                    />

                    <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="impressions"
                        stroke="#a855f7"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 5 }}
                        name="Impressions"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default GscChart;