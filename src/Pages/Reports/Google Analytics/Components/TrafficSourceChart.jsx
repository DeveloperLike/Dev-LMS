import { PieChart, Pie, Cell, Tooltip } from "recharts";
import useTheme from "../services/useTheme";

const COLORS = ["#1677ff", "#52c41a", "#722ed1", "#faad14"];

const TrafficSourceChart = ({ data = [] }) => {
    const { colors } = useTheme();
    const topData = [...data]
        .sort((a, b) => b.value - a.value)
        .slice(0, 10);

    return (
        <div className="rounded-xl flex flex-col bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 h-full">

            {/* HEADER */}
            <div className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                    Traffic Source
                </h3>
            </div>

            {/* CONTENT */}
            <div className="flex flex-1 items-center justify-between px-4 pb-4 gap-4">

                {/* PIE */}
                <PieChart width={220} height={220}>
                    <Pie
                        data={topData}
                        nameKey="name"
                        dataKey="value"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        stroke="none"
                    >
                        {topData.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: colors.tooltipBg,
                            border: `1px solid ${colors.border}`,
                            borderRadius: "8px",
                            color: colors.tooltipText,
                        }}
                        formatter={(value) => value.toLocaleString()}
                        labelStyle={{ color: colors.text }}
                    />
                </PieChart>

                {/* LIST */}
                <div className="flex-1 space-y-2 text-sm">

                    {/* HEADER */}
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                        <span>Source</span>
                        <span>Active Users</span>
                    </div>

                    <div className="border-b border-gray-200 dark:border-gray-700 mb-2"></div>

                    {/* DATA */}
                    {topData.map((item, index) => (
                        <div
                            key={index}
                            className="flex justify-between items-center"
                        >
                            <div className="flex items-center gap-2 truncate">
                                <span
                                    className="w-2 h-2 rounded-full"
                                    style={{
                                        background: COLORS[index % COLORS.length],
                                    }}
                                />
                                <span className="text-black dark:text-white truncate">
                                    {item.name}
                                </span>
                            </div>

                            <span className="text-black dark:text-white">
                                {item.value.toLocaleString()}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TrafficSourceChart;