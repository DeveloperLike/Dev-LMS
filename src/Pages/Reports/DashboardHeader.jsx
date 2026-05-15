import { DatePicker } from "antd";
import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

const DashboardHeader = ({
    activeTab,
    setActiveTab,
    dates,
    setDates,
    showDate = true,
}) => {
    const tabRefs = useRef({});
    const [sliderStyle, setSliderStyle] = useState({});

    useEffect(() => {
        const el = tabRefs.current[activeTab];
        if (el) {
            setSliderStyle({
                left: el.offsetLeft,
                width: el.offsetWidth,
            });
        }
    }, [activeTab]);

    const gscPresets = [
        { label: "Last 7 Days", value: [dayjs().subtract(7, "day"), dayjs()] },
        { label: "Last 14 Days", value: [dayjs().subtract(14, "day"), dayjs()] },
        { label: "Last 30 Days", value: [dayjs().subtract(30, "day"), dayjs()] },
        { label: "Last 60 Days", value: [dayjs().subtract(60, "day"), dayjs()] },
        { label: "Last 90 Days", value: [dayjs().subtract(90, "day"), dayjs()] },
        { label: "Last 16 Months", value: [dayjs().subtract(16, "month"), dayjs()] },
    ];

    const gaPresets = [
        { label: "Today", value: [dayjs(), dayjs()] },
        { label: "Yesterday", value: [dayjs().subtract(1, "day"), dayjs().subtract(1, "day")] },
        { label: "Last 7 Days", value: [dayjs().subtract(7, "day"), dayjs()] },
        { label: "Last 14 Days", value: [dayjs().subtract(14, "day"), dayjs()] },
        { label: "Last 30 Days", value: [dayjs().subtract(30, "day"), dayjs()] },
        { label: "Last 60 Days", value: [dayjs().subtract(60, "day"), dayjs()] },
        { label: "Last 90 Days", value: [dayjs().subtract(90, "day"), dayjs()] },
    ];

    const activePresets = activeTab === "ga" ? gaPresets : gscPresets;

    const handleDateChange = (d) => {
        if (d && d.length === 2 && d[0] && d[1]) {
            setDates(d);
        }
    };

    const tabs = [
        { key: "gsc", label: "Search Console" },
        { key: "ga", label: "Analytics" },
    ];

    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">

            <div className="relative inline-flex items-center bg-gray-100 dark:bg-gray-800 p-1 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">

                <div
                    className="absolute top-1 bottom-1 bg-yellow-400 rounded-md 
          transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
                    style={sliderStyle}
                />

                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        ref={(el) => (tabRefs.current[tab.key] = el)}
                        onClick={() => setActiveTab(tab.key)}
                        className={`relative z-10 px-4 py-1.5 text-sm font-medium transition-colors duration-300 ${activeTab === tab.key
                            ? "text-black"
                            : "text-gray-600 dark:text-gray-300"
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {showDate && (
                <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700">
                    <RangePicker
                        value={dates}
                        presets={activePresets}
                        onChange={handleDateChange}
                        format="DD MMM, YYYY"
                        allowClear={false}
                        placement="bottomRight"
                        className="bg-transparent dark:bg-transparent border-0 shadow-none w-[240px]"
                    />
                </div>
            )}
        </div>
    );
};

export default DashboardHeader;