import { Card } from "antd";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useSmoothCountUp } from "./useSmoothCountUp";

export const DashboardCard = ({ config, count, data, onClick }) => {
    const Icon = config.icon?.default || config.icon;
    const animatedCount = useSmoothCountUp(count, 1000);

    return (
        <Card
            onClick={onClick}
            className={`relative overflow-hidden p-0 shadow-lg ${config.color}`}
        >
            {!data && (
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent blur-sm opacity-80 animate-shimmer" />
                </div>
            )}

            <div
                className={`flex justify-between transition-all duration-500 ${data ? "blur-0 opacity-100" : "blur-[2px] opacity-60"
                    }`}
            >
                <div>
                    <p className="text-white text-xl capitalize">
                        {config.label}
                    </p>

                    <p className="text-white flex items-center">
                        Total {config.label}

                        <span className="ml-2 font-semibold">
                            {data ? animatedCount : "..."}
                        </span>

                        <MdKeyboardArrowRight size={25} />
                    </p>
                </div>

                <div>
                    {Icon && <Icon size={30} color="white" />}
                </div>
            </div>
        </Card>
    );
};