import React from "react";
import { Select } from "antd";

const MqlSqlDropdown = ({
    value = "totallead",
    onChange,
    className = "",
}) => {

    const options = [
        {
            label: "Total Lead",
            value: "totallead",
        },
        {
            label: "MQL",
            value: "mql",
        },
        {
            label: "SQL",
            value: "sql",
        },
    ];

    return (
        <div className={`min-w-[180px] ${className}`}>

            <Select
                value={value}
                onChange={onChange}
                options={options}
                placeholder="Select Lead Type"
                className="w-full"
                size="middle"
            />

        </div>
    );
};

export default MqlSqlDropdown;