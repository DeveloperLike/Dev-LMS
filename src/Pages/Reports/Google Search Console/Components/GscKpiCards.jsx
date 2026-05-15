import { MousePointerClick, Eye, Percent, TrendingUp } from "lucide-react";

const formatNumber = (num = 0) => {
    if (num >= 10000000) return (num / 10000000).toFixed(2) + "Cr";
    if (num >= 100000) return (num / 100000).toFixed(2) + "L";
    if (num >= 1000) return (num / 1000).toFixed(2) + "K";
    return num;
};

const cards = [
    {
        title: "Total Clicks",
        key: "clicks",
        icon: MousePointerClick,
        color: "text-blue-500",
    },
    {
        title: "Total Impressions",
        key: "impressions",
        icon: Eye,
        color: "text-purple-500",
    },
    {
        title: "Average CTR",
        key: "ctrPercent",
        icon: Percent,
        color: "text-green-500",
    },
    {
        title: "Average Position",
        key: "position",
        icon: TrendingUp,
        color: "text-orange-500",
    },
];

const GscKpiCards = ({ data }) => {
    return (
        <div className="grid grid-cols-4 gap-4">
            {cards.map((card, i) => {
                const Icon = card.icon;

                const value = data?.[card.key] || 0;

                return (
                    <div
                        key={i}
                        className="
                        p-4 rounded-xl 
                        bg-white dark:bg-gray-800 
                        text-gray-900 dark:text-white
                    
                        shadow-[0_2px_10px_rgba(0,0,0,0.08)]
                        hover:shadow-[0_10px_30px_rgba(0,0,0,0.25)]
                        hover:-translate-y-1
                    
                        transition-all duration-300 ease-in-out
                        cursor-pointer
                    "
                    >
                        <div className="flex items-center gap-3">

                            <Icon size={22} className={card.color} />

                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {card.title}
                                </p>

                                <h2 className="text-xl font-bold">
                                    {card.key === "ctrPercent"
                                        ? `${Number(value).toFixed(2)}%`
                                        : formatNumber(value)}
                                </h2>
                            </div>

                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default GscKpiCards;