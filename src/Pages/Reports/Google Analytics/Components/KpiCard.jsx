import {
    UserOutlined,
    UserAddOutlined,
    TeamOutlined,
    FundOutlined,
    ArrowDownOutlined,
    ClockCircleOutlined,
} from "@ant-design/icons";

const formatNumber = (num = 0) => {
    if (num >= 10000000) return (num / 10000000).toFixed(2) + "Cr";
    if (num >= 100000) return (num / 100000).toFixed(2) + "L";
    if (num >= 1000) return (num / 1000).toFixed(2) + "K";

    return Number(num).toFixed(2);
};

const iconMap = {
    "Active Users": {
        icon: <UserOutlined />,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
    },
    "New Users": {
        icon: <UserAddOutlined />,
        color: "text-green-500",
        bg: "bg-green-500/10",
    },
    "Total Users": {
        icon: <TeamOutlined />,
        color: "text-purple-500",
        bg: "bg-purple-500/10",
    },
    "Sessions": {
        icon: <FundOutlined />,
        color: "text-orange-500",
        bg: "bg-orange-500/10",
    },
    "Bounce Rate": {
        icon: <ArrowDownOutlined />,
        color: "text-red-500",
        bg: "bg-red-500/10",
    },
    "Avg Duration": {
        icon: <ClockCircleOutlined />,
        color: "text-cyan-500",
        bg: "bg-cyan-500/10",
    },
};

const KpiCard = ({ title, value }) => {
    const config = iconMap[title] || {};
    const formatValue = () => {
        if (title === "Bounce Rate") {
            if (!value) return "0%";
            const formatted = value <= 1 ? value * 100 : value;
            return `${formatted.toFixed(1)}%`;
        }

        if (title === "Avg Duration") {
            return value || "0s";
        }
        return formatNumber(value || 0);
    };

    return (
        <div
            className="
        rounded-xl p-4 
        bg-white dark:bg-gray-800 
        
        shadow-[0_2px_10px_rgba(0,0,0,0.08)]
        
        hover:shadow-[0_10px_30px_rgba(0,0,0,0.25)]
        hover:-translate-y-1
        
        transition-all duration-300 ease-in-out
        cursor-pointer
      "
        >
            <div className="flex items-center gap-3">

                {/* ICON */}
                <div
                    className={`w-10 h-10 flex items-center justify-center rounded-lg ${config.bg}`}
                >
                    <span className={config.color}>{config.icon}</span>
                </div>

                {/* TEXT */}
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {title}
                    </p>

                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {formatValue()}
                    </h2>
                </div>

            </div>
        </div>
    );
};

export default KpiCard;