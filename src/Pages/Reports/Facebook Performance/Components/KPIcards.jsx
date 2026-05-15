import { Card, Skeleton } from "antd";
import {
    LineChart,
    Line,
    ResponsiveContainer,
    Tooltip
} from "recharts";
import {
    FaRupeeSign,
    FaEye,
    FaMousePointer,
    FaUserFriends,
    FaPercentage,
    FaChartLine
} from "react-icons/fa";
import dayjs from "dayjs";

const KPIcards = ({
    kpi = {},
    loading,
    sparklineData = [],
    currentRange,
    previousRange
}) => {

    const isLoading =
        loading || !kpi || Object.keys(kpi).length === 0;

    const formatPercent = (val) =>
        `${Number(val || 0).toFixed(2)}%`;

    const formatCPCL = (spend, crmLeads) => {
        if (!crmLeads || crmLeads === 0) return "—";
        return `₹${(spend / crmLeads).toFixed(2)}`;
    };

    const formatRange = (start, end) => {
        if (!start || !end) return "";

        return `${dayjs(start).format("DD MMM")} → ${dayjs(end).format("DD MMM")}`;
    };

    const formatNumberShort = (num) => {
        if (num === null || num === undefined) return "0";

        if (num >= 10000000) {
            return (num / 10000000).toFixed(2).replace(/\.00$/, "") + "Cr";
        }

        if (num >= 100000) {
            return (num / 100000).toFixed(2).replace(/\.00$/, "") + "L";
        }

        if (num >= 1000) {
            return (num / 1000).toFixed(2).replace(/\.00$/, "") + "K";
        }

        return num.toString();
    };

    const formatCurrencyShort = (num) => {
        if (num >= 10000000) return `₹${(num / 10000000).toFixed(2).replace(/\.00$/, "")}Cr`;
        if (num >= 100000) return `₹${(num / 100000).toFixed(2).replace(/\.00$/, "")}L`;
        if (num >= 1000) return `₹${(num / 1000).toFixed(2).replace(/\.00$/, "")}K`;
        return `₹${num}`;
    };

    const formatNumber = (val) => formatNumberShort(Number(val || 0));

    const formatCurrency = (val) =>
        formatCurrencyShort(Number(val || 0));

    // ================= SPARK DATA =================
    const getSparkData = (key) =>
        (sparklineData || []).map((d) => ({
            v: Number(parseFloat(d[key] || 0).toFixed(2)),
            date: d.date
        }));

    // ================= CARDS =================
    const cards = [
        {
            title: "Spend",
            value: formatCurrency(kpi.spend),
            icon: <FaRupeeSign />,
            color: "#facc15",
            dataKey: "spend"
        },
        {
            title: "Impressions",
            value: formatNumber(kpi.impressions),
            icon: <FaEye />,
            color: "#3b82f6",
            dataKey: "impressions"
        },
        {
            title: "Clicks",
            value: formatNumber(kpi.clicks),
            icon: <FaMousePointer />,
            color: "#22c55e",
            dataKey: "clicks"
        },
        {
            title: "CTR",
            value: formatPercent(kpi.ctr),
            icon: <FaPercentage />,
            color: "#a855f7",
            dataKey: "ctr"
        },
        {
            title: "CPC",
            value: formatCurrency(kpi.cpc),
            icon: <FaChartLine />,
            color: "#f97316",
            dataKey: "cpc"
        },
        {
            title: "Meta Leads",
            value: formatNumber(kpi.leads),
            icon: <FaUserFriends />,
            color: "#eab308",
            dataKey: "leads"
        },
        {
            title: "CRM Leads",
            value: formatNumber(kpi.crm_leads),
            icon: <FaUserFriends />,
            color: "#10b981",
            dataKey: "crm_leads"
        },
        {
            title: "CPCL",
            value: formatCurrency(kpi.cpcl),
            icon: <FaChartLine />,
            color: "#ef4444",
            dataKey: "cpcl"
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">

            {cards.map((card, i) => {
                const spark = getSparkData(card.dataKey);
                const changeValue = kpi?.change?.[card.dataKey] || 0;

                const isCRM = card.dataKey === "crm_leads";

                const trend = {
                    value: isCRM
                        ? Math.abs(changeValue).toFixed(0)
                        : Math.abs(changeValue) > 999
                            ? "999+"
                            : Math.abs(changeValue).toFixed(0),

                    isUp: changeValue >= 0,
                    color: changeValue >= 0 ? "#22c55e" : "#ef4444",
                    arrow: changeValue >= 0 ? "↑" : "↓"
                };

                return (
                    <Card
                        key={i}
                        className="mt-4 rounded-2xl border border-gray-200 dark:border-gray-700
                        bg-white dark:bg-gradient-to-br 
                        dark:from-[#1f2937] dark:to-[#020617]
                        shadow-sm dark:shadow-none
                        hover:shadow-lg dark:hover:shadow-xl
                        hover:scale-[1.02] transition-all duration-300"
                    >
                        {isLoading ? (
                            <Skeleton active paragraph={false} />
                        ) : (
                            <>
                                {/* HEADER */}
                                <div className="flex items-center justify-between">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                                        {card.title}
                                    </p>

                                    <div
                                        className="p-2 rounded-lg"
                                        style={{
                                            backgroundColor: `${card.color}20`,
                                            color: card.color,
                                            opacity: 0.9
                                        }}
                                    >
                                        {card.icon}
                                    </div>
                                </div>

                                {/* VALUE + TREND */}
                                <div className="flex items-start justify-between mt-3">

                                    {/* LEFT SIDE */}
                                    <div>
                                        {/* VALUE */}
                                        <p className="text-xl font-bold text-black dark:text-white">
                                            {card.value}
                                        </p>

                                        {/* DATE (COMPACT) */}
                                        <p className="text-[11px] text-gray-400 mt-1 whitespace-nowrap">
                                            {dayjs(currentRange?.start).format("DD MMM")}–{dayjs(currentRange?.end).format("DD MMM")}
                                            <span className="mx-1 text-gray-500">vs</span>
                                            {dayjs(previousRange?.start).format("DD MMM")}–{dayjs(previousRange?.end).format("DD MMM")}
                                        </p>
                                    </div>

                                    {/* RIGHT SIDE (PERCENT BADGE) */}
                                    <div
                                        className="text-[11px] font-semibold px-2 py-[2px] rounded-md h-fit"
                                        style={{
                                            backgroundColor: `${trend.color}15`,
                                            color: trend.color
                                        }}
                                    >
                                        {trend.arrow} {trend.value}%
                                    </div>

                                </div>

                                {/* SPARKLINE */}
                                <div className="h-10 mt-2 min-h-[40px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        {spark.length > 0 && (
                                            <LineChart data={spark}>
                                                <Tooltip
                                                    formatter={(value) => {
                                                        let label = card.title;

                                                        if (card.dataKey === "spend" || card.dataKey === "cpc" || card.dataKey === "cpcl") {
                                                            return [`₹${Number(value).toLocaleString("en-IN")}`, label];
                                                        }

                                                        if (card.dataKey === "ctr") {
                                                            return [`${Number(value).toFixed(2)}%`, label];
                                                        }

                                                        return [Number(value).toLocaleString("en-IN"), label];
                                                    }}

                                                    labelFormatter={(label, payload) => {
                                                        const d = payload?.[0]?.payload?.date;
                                                        return d ? dayjs(d).format("DD MMM YYYY") : "";
                                                    }}

                                                    contentStyle={{
                                                        backgroundColor: "transparent",
                                                        border: "none",
                                                        boxShadow: "none",
                                                        padding: 0,
                                                        color: "inherit",
                                                    }}
                                                    cursor={{ stroke: card.color, strokeWidth: 1 }}
                                                />

                                                <Line
                                                    type="monotone"
                                                    dataKey="v"
                                                    stroke={card.color}
                                                    strokeWidth={2}
                                                    dot={false}
                                                    activeDot={false}
                                                    strokeOpacity={0.9}
                                                />
                                            </LineChart>
                                        )}
                                    </ResponsiveContainer>
                                </div>
                            </>
                        )}
                    </Card>
                );
            })}

        </div>
    );
};

export default KPIcards;