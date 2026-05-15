import React from "react";

export default function ChartTooltip({
    active,
    payload,
    label,
}) {

    if (
        !active ||
        !payload ||
        !payload.length
    ) {
        return null;
    }

    return (
        <div
            className="
                rounded-xl
                border
                border-gray-200
                dark:border-white/10
                bg-white
                dark:bg-[#111827]
                shadow-2xl
                px-3
                py-2
                min-w-[120px]
            "
        >
            {(payload?.[0]?.payload?.fullDate || label) && (
                <p
                    className="
                   text-xs
                   font-semibold
                   mb-2
                   text-gray-500
                   dark:text-gray-400
               "
                >
                    {payload?.[0]?.payload?.fullDate || label}
                </p>
            )}

            <div className="space-y-1">
                {payload.map((entry, index) => (
                    <div
                        key={index}
                        className="
                            flex
                            items-center
                            justify-between
                            gap-4
                            text-sm
                        "
                    >
                        <div className="flex items-center gap-2">

                            <div
                                className="w-2.5 h-2.5 rounded-full"
                                style={{
                                    background: entry.color,
                                }}
                            />

                            <span className="text-gray-600 dark:text-gray-300">
                                {entry.name}
                            </span>

                        </div>

                        <span className="font-semibold text-black dark:text-white">
                            {Number(entry.value || 0).toLocaleString()}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}