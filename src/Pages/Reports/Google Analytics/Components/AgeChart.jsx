import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
import useTheme from "../services/useTheme";

const AgeChart = ({ data = [] }) => {
    const { colors } = useTheme();

    const chartData = data
        .filter((d) => d.name !== "unknown")
        .map((d) => ({
            name: d.name,
            value: d.value,
        }));

    return (
        <div className="h-[300px] md:h-[320px] xl:h-[300px] h-full rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4">
            {/* TITLE */}
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Age Distribution
            </h3>

            {/* CHART */}
            <div className="h-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        margin={{ top: 10, right: 0, left: 0, bottom: 30 }}
                    >
                        <CartesianGrid stroke={colors.grid} strokeDasharray="3 3" />
                        <XAxis
                            dataKey="name"
                            stroke={colors.text}
                            tick={{ fontSize: 12 }}
                        />
                        {/* <YAxis
                            stroke={colors.text}
                            tick={{ fontSize: 12 }}
                        /> */}
                        <Tooltip
                            contentStyle={{
                                backgroundColor: colors.tooltipBg,
                                border: `1px solid ${colors.border}`,
                                color: colors.tooltipText,
                                borderRadius: "8px",
                                fontSize: "12px",
                            }}
                            cursor={{ fill: "rgba(59, 130, 246, 0.15)" }}
                            formatter={(value) => [`${value}`, "Users"]}
                            labelFormatter={(label) => `Age: ${label}`}
                        />

                        <Bar
                            dataKey="value"
                            fill={colors.primary || "#3b82f6"}
                            radius={[6, 6, 0, 0]}
                            barSize={50}
                            activeBar={{
                                fill: colors.primary || "#3b82f6",
                                stroke: "#ffffff",
                                strokeWidth: 2,
                            }}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default AgeChart;