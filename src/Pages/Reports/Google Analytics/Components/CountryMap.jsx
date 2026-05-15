import {
    ComposableMap,
    Geographies,
    Geography,
} from "react-simple-maps";
import { useEffect, useState, useMemo, useRef } from "react";
import ReactCountryFlag from "react-country-flag";
import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";

countries.registerLocale(en);

const geoUrl =
    "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const formatNumber = (num = 0) => {
    if (num >= 100000) return (num / 1000).toFixed(1) + "K";
    return num;
};

const normalizeCountry = (name = "") => {
    const map = {
        "United States": "United States of America",
        "Russia": "Russian Federation",
        "Vietnam": "Viet Nam",
        "South Korea": "Korea, Republic of",
    };

    return (map[name] || name).toLowerCase();
};

const normalizeForFlag = (name = "") => {
    const map = {
        "United States of America": "United States",
        "Russian Federation": "Russia",
        "Viet Nam": "Vietnam",
        "Korea, Republic of": "South Korea",
    };

    return map[name] || name;
};

const getCountryCode = (name = "") => {
    return countries.getAlpha2Code(name, "en");
};

const CountryMap = ({ data = [] }) => {
    const [isDark, setIsDark] = useState(false);

    const [tooltip, setTooltip] = useState(null);
    const [showTooltip, setShowTooltip] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const tooltipTimer = useRef(null);

    useEffect(() => {
        const checkDark = () =>
            document.documentElement.classList.contains("dark");

        setIsDark(checkDark());

        const observer = new MutationObserver(() => {
            setIsDark(checkDark());
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });

        return () => observer.disconnect();
    }, []);

    const sortedData = useMemo(() => {
        return [...data].sort((a, b) => b.users - a.users);
    }, [data]);

    const maxUsers = sortedData[0]?.users || 1;
    const topCountries = sortedData.slice(0, 10);
    const highestCountry = normalizeCountry(sortedData[0]?.country);

    const getCountryFill = (geoName) => {
        const match = data.find(
            (c) =>
                normalizeCountry(c.country) === normalizeCountry(geoName)
        );

        const users = match?.users || 0;

        if (geoName.toLowerCase() === highestCountry) {
            return "#facc15";
        }

        if (!users) {
            return isDark ? "#334155" : "#f1f5f9";
        }

        const ratio = users / maxUsers;

        if (ratio > 0.75) return "#1d4ed8";
        if (ratio > 0.5) return "#2563eb";
        if (ratio > 0.25) return "#3b82f6";
        return "#93c5fd";
    };

    return (
        <div className="h-full rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 relative">

            {/* HEADER */}
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Active Users by Country
            </h3>

            <div className="relative w-full h-full">

                {/* MAP */}
                <div className="absolute inset-0">
                    <ComposableMap
                        projectionConfig={{ scale: 180 }}
                        className="w-full h-full"
                    >
                        <Geographies geography={geoUrl}>
                            {({ geographies }) =>
                                geographies.map((geo) => {
                                    const geoName = geo.properties.name;

                                    return (
                                        <Geography
                                            key={geo.rsmKey}
                                            geography={geo}

                                            onMouseEnter={(e) => {
                                                const geoName = geo.properties.name;

                                                const match = data.find(
                                                    (c) =>
                                                        normalizeCountry(c.country) === normalizeCountry(geoName)
                                                );

                                                const users = match?.users || 0;
                                                const percentage = ((users / maxUsers) * 100).toFixed(1);

                                                tooltipTimer.current = setTimeout(() => {
                                                    setTooltip({
                                                        name: geoName,
                                                        users,
                                                        percentage,
                                                    });
                                                    setShowTooltip(true);
                                                }, 150);

                                                setPosition({
                                                    x: e.clientX,
                                                    y: e.clientY,
                                                });
                                            }}

                                            onMouseLeave={() => {
                                                clearTimeout(tooltipTimer.current);
                                                setTooltip(null);
                                                setShowTooltip(false);
                                            }}

                                            onClick={() => {
                                                console.log("Clicked:", geoName);
                                            }}

                                            style={{
                                                default: {
                                                    fill: getCountryFill(geoName),
                                                    outline: "none",
                                                },
                                                hover: {
                                                    fill: "#3b82f6",
                                                    outline: "none",
                                                    cursor: "pointer",
                                                },
                                                pressed: {
                                                    fill: "#2563eb",
                                                    outline: "none",
                                                },
                                            }}
                                        />
                                    );
                                })
                            }
                        </Geographies>
                    </ComposableMap>
                </div>

                <div className="relative z-10 space-y-1 pointer-events-none">

                    {topCountries.map((item, index) => {
                        let percentage = (item.users / maxUsers) * 100;
                        const isTop = index === 0;

                        if (isTop) {
                            percentage = 15;
                        }

                        return (
                            <div key={item.country} className="space-y-1">

                                <div className="flex justify-between text-sm pointer-events-auto">
                                    <span>
                                        <div className="flex items-center gap-2 dark:text-white text-black">
                                            <ReactCountryFlag
                                                countryCode={getCountryCode(normalizeForFlag(item.country))}
                                                svg
                                                style={{ width: "1em", height: "1em" }}
                                            />
                                            {item.country}
                                        </div>
                                    </span>

                                    <span className="dark:text-white text-black">
                                        {formatNumber(item.users)}
                                    </span>
                                </div>

                                <div className="w-full h-1 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${isTop
                                            ? "bg-yellow-500"
                                            : "bg-blue-500"
                                            }`}
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {tooltip && (
                <div
                    className={`fixed z-50 pointer-events-none transition-all duration-200 ${showTooltip ? "opacity-100 scale-100" : "opacity-0 scale-95"
                        }`}
                    style={{
                        top: position.y + 16,
                        left: position.x + 16,
                    }}
                >
                    {/* Tooltip Box */}
                    <div className="relative dark:bg-black bg-white dark:text-white text-black text-xs px-3 py-2 rounded-lg shadow-xl">

                        {/* CONTENT */}
                        <div className="flex items-center gap-2 font-medium">
                            <ReactCountryFlag
                                countryCode={getCountryCode(normalizeForFlag(tooltip.name))}
                                svg
                                style={{ width: "1.2em", height: "1.2em" }}
                            />
                            {tooltip.name}
                        </div>

                        <div className="mt-1 text-black dark:text-white flex justify-between gap-3">
                            <span>{formatNumber(tooltip.users)}</span>
                            <span className="text-blue-400">
                                {tooltip.percentage}%
                            </span>
                        </div>

                        {/* ARROW */}
                        <div className="absolute -top-1 left-3 w-2 h-2 bg-gray-900 rotate-45" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default CountryMap;