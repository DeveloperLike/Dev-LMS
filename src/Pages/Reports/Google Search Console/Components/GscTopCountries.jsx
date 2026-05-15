import React from "react";
import ReactCountryFlag from "react-country-flag";
import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";

countries.registerLocale(en);

const GscTopCountries = ({ data = [], onViewAll }) => {
    const top = data.slice(0, 10);

    const maxClicks = Math.max(...top.map((d) => d.clicks || 0), 1);
    const maxImpr = Math.max(...top.map((d) => d.impressions || 0), 1);

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 h-full flex flex-col">

            {/* HEADER */}
            <h3 className="mb-3 font-semibold text-gray-900 dark:text-white">
                Top Countries
            </h3>

            {/* SUB HEADER */}
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                <span>Country</span>

                <div className="flex gap-2 sm:gap-4 min-w-[120px] justify-end">
                    <span className="w-[90px] text-left">Clicks</span>
                    <span className="w-[75px] text-left">Impr.</span>
                    <span className="w-[45px] text-left">CTR%</span>
                </div>
            </div>

            <div className="border-b border-gray-200 dark:border-gray-700 mb-2"></div>

            {/* SCROLLABLE LIST */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-3">

                {top.map((row, i) => {
                    const clickWidth = (row.clicks / maxClicks) * 100;
                    const imprWidth = (row.impressions / maxImpr) * 100;

                    return (
                        <div key={i} className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <ReactCountryFlag
                                        countryCode={getCountryCode(row.country)}
                                        svg
                                        style={{ width: "1.2em", height: "1.2em" }}
                                    />
                                    <span className="truncate max-w-[100px] sm:max-w-[140px]">
                                        {row.country}
                                    </span>
                                </div>

                                <div className="flex gap-2 sm:gap-4 text-xs text-gray-600 dark:text-gray-300 min-w-[120px] justify-end">
                                    <span className="w-[60px] sm:w-[80px] text-left">
                                        {formatNumber(row.clicks)}
                                    </span>

                                    <span className="w-[60px] sm:w-[80px] text-left">
                                        {formatNumber(row.impressions)}
                                    </span>

                                    <span className="w-[40px] text-left">
                                        {Number(row.ctrPercent || 0).toFixed(2)}%
                                    </span>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 sm:gap-3 mt-1">

                                {/* Clicks */}
                                <div className="w-[80px] h-1 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500 transition-all duration-700"
                                        style={{ width: `${Math.max(clickWidth, 4)}%` }}
                                    />
                                </div>

                                {/* Impressions */}
                                <div className="w-[80px] h-1 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                                    <div
                                        className="h-full bg-purple-500 transition-all duration-700"
                                        style={{ width: `${Math.max(imprWidth, 4)}%` }}
                                    />
                                </div>

                                {/* CTR spacer */}
                                <div className="w-[50px]" />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* FOOTER */}
            <div
                className="mt-3 text-blue-600 dark:text-blue-400 text-sm cursor-pointer hover:underline"
                onClick={onViewAll}
            >
                View full report →
            </div>
        </div>
    );
};

export default GscTopCountries;

const normalizeCountry = (name = "") => {
    const fixes = {
        "Türkiye": "Turkey",
        "Syrian Arab Republic": "Syria",
        "Russian Federation": "Russia",
        "Viet Nam": "Vietnam",
        "United States of America": "United States",
    };

    return fixes[name] || name;
};

const getCountryCode = (name = "") => {
    const normalized = normalizeCountry(name);
    return countries.getAlpha2Code(normalized, "en") || "UN";
};

const formatNumber = (num = 0) => {
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
    if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
    return num;
};