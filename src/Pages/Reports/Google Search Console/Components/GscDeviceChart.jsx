import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const COLORS = ["#3b82f6", "#22c55e", "#f59e0b"];

/* ================= FORMAT ================= */
const formatNumber = (num = 0) => {
    if (num >= 10000000) return (num / 10000000).toFixed(2) + "Cr";
    if (num >= 100000) return (num / 100000).toFixed(2) + "L";
    if (num >= 1000) return (num / 1000).toFixed(2) + "K";
    return num;
};

const GscDeviceChart = ({ data = [] }) => {
    const totalClicks = data.reduce((sum, d) => sum + (d.clicks || 0), 0);

    const maxClicks = Math.max(...data.map(d => d.clicks || 0), 1);
    const maxImpr = Math.max(...data.map(d => d.impressions || 0), 1);

    return (
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 h-full flex flex-col">

            {/* TITLE */}
            <h3 className="mb-4 font-semibold text-sm text-gray-900 dark:text-white">
                Device Breakdown
            </h3>

            {/* STRAIGHT HALF PIE */}
            <div className="flex flex-col items-center">

                <div className="relative w-full h-[100px] sm:h-[120px] mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                dataKey="clicks"
                                startAngle={180}
                                endAngle={0}
                                cx="50%"
                                cy="100%"
                                innerRadius={70}
                                outerRadius={110}
                                paddingAngle={2}
                                isAnimationActive
                                animationDuration={800}
                                stroke="none"
                            >
                                {data.map((_, i) => (
                                    <Cell
                                        key={i}
                                        fill={COLORS[i % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>

                    {/* CENTER TEXT */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center mt-20">
                        <span className="text-xl font-semibold">
                            {formatNumber(totalClicks)}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            Total Clicks
                        </span>
                    </div>
                </div>

                {/* HEADER */}
                <div className="w-full">
                    <div className="flex flex-col sm:flex-row sm:justify-between text-xs text-gray-500 dark:text-gray-400 mb-2 gap-1">
                        <span>Device</span>

                        <div className="flex gap-4 mr-4">
                            <span className="w-[60px] text-left">Clicks</span>
                            <span className="w-[60px] text-left">Impr.</span>
                            <span className="w-[60px] text-left">CTR%</span>
                        </div>
                    </div>

                    <div className="border-b border-gray-200 dark:border-gray-700 mb-3"></div>

                    {/* LIST */}
                    <div className="space-y-4">
                        {data.map((row, i) => {
                            const clickWidth = (row.clicks / maxClicks) * 100;
                            const imprWidth = (row.impressions / maxImpr) * 100;

                            const percent = totalClicks
                                ? ((row.clicks / totalClicks) * 100).toFixed(1)
                                : 0;

                            return (
                                <div key={i} className="min-h-[10px]">

                                    {/* ROW */}
                                    <div className="flex items-center justify-between text-sm min-w-0">

                                        {/* LEFT */}
                                        <div className="flex items-center gap-2 min-w-0 flex-1">
                                            <span
                                                className="w-2.5 h-2.5 rounded-full shrink-0"
                                                style={{
                                                    backgroundColor: COLORS[i % COLORS.length],
                                                }}
                                            />
                                            <span className="uppercase text-xs tracking-wide truncate">
                                                {row.device}
                                            </span>
                                        </div>

                                        {/* RIGHT */}
                                        <div className="flex gap-3 text-xs text-gray-600 dark:text-gray-300 mr-6">
                                            <span className="w-[60px] text-left">
                                                {formatNumber(row.clicks)}
                                            </span>

                                            <span className="w-[70px] text-left">
                                                {formatNumber(row.impressions)}
                                            </span>

                                            <span className="w-[50px] text-left">
                                                {percent}%
                                            </span>
                                        </div>
                                    </div>

                                    {/* BARS */}
                                    <div className="flex justify-end gap-3 mt-1 mr-6">

                                        {/* Clicks Bar */}
                                        <div className="w-[60px] h-1 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                                            <div
                                                className="h-full bg-blue-500 transition-all duration-700"
                                                style={{ width: `${Math.max(clickWidth, 4)}%` }}
                                            />
                                        </div>

                                        {/* Impressions Bar */}
                                        <div className="w-[70px] h-1 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                                            <div
                                                className="h-full bg-purple-500 transition-all duration-700"
                                                style={{ width: `${Math.max(imprWidth, 4)}%` }}
                                            />
                                        </div>

                                        <div className="w-[50px]" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GscDeviceChart;