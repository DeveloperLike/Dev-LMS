import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
} from "recharts";

const COLORS = ["#3b82f6", "#22c55e", "#f59e0b"];

const formatNumber = (num = 0) => {
    if (num >= 10000000) return Math.round(num / 10000000) + "Cr";
    if (num >= 100000) return Math.round(num / 100000) + "L";
    if (num >= 1000) return Math.round(num / 1000) + "K";
    return num;
};

const DeviceChart = ({ data = [] }) => {
    const total = data.reduce((sum, d) => sum + (d.value || 0), 0);

    const max = Math.max(...data.map(d => d.value || 0), 1);

    return (
        <div className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 h-full p-4">

            {/* TITLE */}
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Device Breakdown
            </h3>

            {/* HALF PIE */}
            <div className="relative h-[120px] mb-6">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="value"
                            startAngle={180}
                            endAngle={0}
                            cx="50%"
                            cy="100%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={2}
                            stroke="none"
                        >
                            {data.map((_, i) => (
                                <Cell key={i} fill={COLORS[i % COLORS.length]} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>

                {/* CENTER TEXT */}
                <div className="absolute inset-0 flex flex-col items-center justify-center mt-20">
                    <span className="text-lg font-semibold text-black dark:text-white">
                        {formatNumber(total)}
                    </span>
                    <span className="text-xs text-black dark:text-white">
                        Total Active Users
                    </span>
                </div>
            </div>

            {/* HEADER */}
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                <span>Device</span>
                <span className="mr-6">Active Users</span>
            </div>

            <div className="border-b border-gray-200 dark:border-gray-700 mb-3"></div>

            {/* LIST */}
            <div className="space-y-3">
                {data.map((item, i) => {
                    const width = (item.value / max) * 100;

                    return (
                        <div key={i}>
                            <div className="flex justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <span
                                        className="w-2 h-2 rounded-full"
                                        style={{
                                            background: COLORS[i % COLORS.length],
                                        }}
                                    />
                                    <span className="uppercase text-xs text-black dark:text-white">
                                        {item.name}
                                    </span>
                                </div>

                                <span className="mr-6 text-xs text-black dark:text-white">
                                    {formatNumber(item.value)}
                                </span>
                            </div>

                            {/* BAR */}
                            <div className="mt-1 mr-6 h-1 bg-gray-200 dark:bg-gray-700 rounded">
                                <div
                                    className="h-full bg-blue-500"
                                    style={{ width: `${Math.max(width, 5)}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DeviceChart;