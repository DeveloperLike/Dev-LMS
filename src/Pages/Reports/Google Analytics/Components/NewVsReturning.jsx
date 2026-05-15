import { Card } from "antd";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import useTheme from "../services/useTheme";

const COLORS = ["#1677ff", "#52c41a"];

const NewVsReturning = ({ data }) => {
    const { colors } = useTheme();

    const chartData =
        data && data.length
            ? data
            : [
                { name: "New Users", value: 8245 },
                { name: "Returning Users", value: 4213 },
            ];

    return (
        <div className="rounded-xl flex flex-col bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 h-full">

            <div className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                    New vs Returning Users
                </h3>
            </div>

            <div className="flex justify-center">
                <ResponsiveContainer width={250} height={250}>
                    <PieChart>
                        <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={60}
                            outerRadius={90}
                            stroke="none"
                        >
                            {chartData.map((_, index) => (
                                <Cell
                                    key={index}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>

                        <Tooltip
                            contentStyle={{
                                backgroundColor: colors.tooltipBg,
                                border: `1px solid ${colors.border}`,
                                borderRadius: "8px",
                                color: colors.tooltipText,
                            }}
                            formatter={(value, name) => [
                                value.toLocaleString(),
                                name,
                            ]}
                            labelStyle={{ color: colors.text }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="m-4 space-y-1">
                {chartData.map((item, i) => (
                    <div
                        key={i}
                        className="flex justify-between text-black dark:text-white text-sm"
                    >
                        <span className="flex items-center gap-2">
                            <span
                                className="w-2 h-2 rounded-full"
                                style={{ background: COLORS[i] }}
                            />
                            {item.name}
                        </span>
                        <span>{item.value.toLocaleString()}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NewVsReturning;