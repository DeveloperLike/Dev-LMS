import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import useTheme from "../services/useTheme";


const GenderChart = ({ data = [] }) => {
    const { colors } = useTheme();

    const COLORS = [
        colors.primary || "#3b82f6",
        colors.secondary || "#22c55e",
    ];
    const chartData = data
        .filter((d) => d.name !== "unknown")
        .map((d) => ({
            name: d.name,
            value: d.value,
        }));

    return (
        <div className="h-[300px] md:h-[320px] xl:h-[300px] h-full rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Gender Distribution
            </h3>

            <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 10, right: 10, bottom: 40, left: 10 }}>
                    <Pie
                        data={chartData}
                        dataKey="value"
                        innerRadius={50}
                        outerRadius={100}
                        stroke="none"
                        label={({ name, percent }) => {
                            const formatted = name
                                .toLowerCase()
                                .replace(/_/g, " ")
                                .replace(/\b\w/g, (c) => c.toUpperCase());

                            return `${formatted} ${(percent * 100).toFixed(0)}%`;
                        }}
                    >
                        {chartData.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: colors.tooltipBg,
                            border: `1px solid ${colors.border}`,
                            color: colors.tooltipText,
                            borderRadius: "8px",
                            fontSize: "12px",
                        }}
                        formatter={(value, name) => [
                            value.toLocaleString(),
                            "Users",
                        ]}
                        labelFormatter={(label) => {
                            const formatted = label
                                .toLowerCase()
                                .replace(/_/g, " ")
                                .replace(/\b\w/g, (c) => c.toUpperCase());

                            return `Gender: ${formatted}`;
                        }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default GenderChart;