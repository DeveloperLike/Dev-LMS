import React, { useRef } from "react";
import { DatePicker, message } from "antd";
import dayjs from "dayjs";
import { CustomSelectInput } from "../../Components/CustomComponents/InputWithIcon";
import { PrimaryButton } from "../../Components/CustomComponents/ButtonUi";

const { RangePicker } = DatePicker;
const dateFormat = "DD-MM-YYYY";
const MAX_RANGE = 365;

function CommonFilters({
    filters = {},
    onChange,

    branch,
    setBranch,
    role,
    setRole,
    counsellor,
    setCounsellor,
    sourceGroup,
    setSourceGroup,
    leadSource,
    setLeadSource,

    branchDropdown = [],
    roleDropdown = [],
    counsellorDropdown = [],
    sourceGroupDropdown = [],
    leadSourceDropdown = [],

    dateRange,
    setDateRange,

    onFilterChange,
    onResetComplete,
    resetDateRange,
}) {

    const errorShownRef = useRef(false);
    const isObjectMode = !!onChange;

    const getValue = (key, fallback) => {
        if (isObjectMode) return filters[key] || [];
        return fallback;
    };

    const setValue = (key, value, setter) => {
        if (isObjectMode) {
            onChange(key, value);
        } else {
            setter && setter(value);
        }
    };

    const rangePresets = [
        { label: "Today", value: [dayjs(), dayjs()] },
        { label: "Yesterday", value: [dayjs().subtract(1, "day"), dayjs().subtract(1, "day")] },
        { label: "Last 7 Days", value: [dayjs().subtract(7, "day"), dayjs()] },
        { label: "Last 14 Days", value: [dayjs().subtract(14, "day"), dayjs()] },
        { label: "Last 30 Days", value: [dayjs().subtract(30, "day"), dayjs()] },
        { label: "Last 60 Days", value: [dayjs().subtract(60, "day"), dayjs()] },
        { label: "Last 90 Days", value: [dayjs().subtract(90, "day"), dayjs()] },
        { label: "Last 1 Year", value: [dayjs().subtract(1, "year"), dayjs()] },
    ];

    const disabledDate = (current) => {
        if (!dateRange || dateRange.length !== 2) return false;

        const [start] = dateRange;
        if (!start) return false;

        return current && dateRange?.[0]
            ? current.diff(dateRange[0], "day") > MAX_RANGE
            : false;
    };

    const isDateValid = () => {
        if (!dateRange || dateRange.length !== 2) return false;

        const [start, end] = dateRange;

        if (!start || !end) return false;

        const diff = end.diff(start, "day");

        return diff <= MAX_RANGE;
    };

    const handleDateChange = (v) => {
        if (!v) return;

        const diff = v[1].diff(v[0], "day");

        if (diff > MAX_RANGE) {

            if (!errorShownRef.current) {
                errorShownRef.current = true;

                message.error("Date range cannot exceed 1 year");

                setTimeout(() => {
                    errorShownRef.current = false;
                }, 1500);
            }

            return;
        }

        setDateRange(v);
    };

    const handleCalendarChange = (dates) => {
        if (!dates || dates.length !== 2) return;

        const [start, end] = dates;

        if (start && end) {
            const diff = end.diff(start, "day");

            if (diff > MAX_RANGE) {
                return;
            }
        }
    };

    const handleApplyFilters = () => {

        let leadSourceIds = getValue("leadSource", leadSource) || [];

        if (
            (getValue("sourceGroup", sourceGroup) || []).length &&
            getValue("leadSource", leadSource).length === 0
        ) {
            leadSourceIds = leadSourceDropdown
                .filter((item) =>
                    getValue("sourceGroup", sourceGroup).includes(item.source_group)
                )
                .map((item) => item.id);
        }

        const roleUsers = getValue("role", role)?.length
            ? counsellorDropdown
                .filter(c => getValue("role", role).includes(c.role_id))
                .map(c => c.username)
            : [];

        const finalUsers =
            getValue("counsellor", counsellor)?.length > 0
                ? getValue("counsellor", counsellor)
                : roleUsers;

        const apiFilters = {
            ...(dateRange?.length === 2 && {
                start_date: dateRange[0].format(dateFormat),
                end_date: dateRange[1].format(dateFormat),
            }),
            assign_to: finalUsers.length ? finalUsers.join(",") : undefined,
            lead_source: leadSourceIds.length ? leadSourceIds.join(",") : undefined,
            branch: (getValue("branch", branch) || []).length
                ? getValue("branch", branch).join(",")
                : undefined,
        };

        onFilterChange && onFilterChange(apiFilters);
    };

    const handleResetFilters = () => {

        const defaultRange =
            resetDateRange ||
            [dayjs().subtract(30, "day"), dayjs()];

        setValue("branch", [], setBranch);
        setValue("role", [], setRole);
        setValue("counsellor", [], setCounsellor);
        setValue("leadSource", [], setLeadSource);
        setValue("sourceGroup", [], setSourceGroup);

        setDateRange(defaultRange);

        const defaultFilters = {
            start_date: defaultRange[0].format(dateFormat),
            end_date: defaultRange[1].format(dateFormat),
        };

        onFilterChange && onFilterChange(defaultFilters, true);

        onResetComplete && onResetComplete(defaultRange);
    };

    return (

        <div className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 mb-4">
            <div className="flex flex-wrap lg:flex-nowrap gap-4 items-end pb-3">

                {/* Branch */}
                <div className="flex flex-col w-full lg:w-[22%]">
                    <label>Branch</label>
                    <CustomSelectInput
                        mode="multiple"
                        placeholder="Select Branch"
                        value={getValue("branch", branch)}
                        handler={(v) => setValue("branch", v, setBranch)}
                        options={branchDropdown.map(i => ({
                            value: i.id,
                            label: i.name
                        }))}
                    />
                </div>

                {/* Role */}
                <div className="flex flex-col w-full lg:w-[22%]">
                    <label>Role</label>
                    <CustomSelectInput
                        mode="multiple"
                        placeholder="Select Role"
                        value={getValue("role", role)}
                        handler={(v) => setValue("role", v, setRole)}
                        options={roleDropdown}
                        showSearch
                    />
                </div>

                {/* Counsellor */}
                <div className="flex flex-col w-full lg:w-[22%]">
                    <label>Counsellor</label>
                    <CustomSelectInput
                        mode="multiple"
                        placeholder="Select Counsellor"
                        value={getValue("counsellor", counsellor)}
                        handler={(v) => setValue("counsellor", v, setCounsellor)}
                        options={counsellorDropdown.map(i => ({
                            value: i.username,
                            label: i.email
                        }))}
                    />
                </div>

                {/* Source Group */}
                <div className="flex flex-col w-full lg:w-[22%]">
                    <label>Source Group</label>
                    <CustomSelectInput
                        mode="multiple"
                        placeholder="Select Source Group"
                        value={getValue("sourceGroup", sourceGroup)}
                        handler={(v) => setValue("sourceGroup", v, setSourceGroup)}
                        options={sourceGroupDropdown}
                    />
                </div>

                {/* Lead Source */}
                <div className="flex flex-col w-full lg:w-[22%]">
                    <label>Lead Source</label>
                    <CustomSelectInput
                        mode="multiple"
                        placeholder="Select Lead Source"
                        value={getValue("leadSource", leadSource)}
                        handler={(v) => setValue("leadSource", v, setLeadSource)}
                        options={leadSourceDropdown.map(i => ({
                            value: i.id,
                            label: i.name
                        }))}
                    />
                </div>

                {/* Date */}
                <div className="flex flex-col w-full lg:w-[30%]">
                    <label>Date Range</label>
                    <RangePicker
                        size="large"
                        format={dateFormat}
                        value={dateRange}
                        presets={rangePresets}
                        allowClear={false}
                        disabledDate={disabledDate}
                        onChange={handleDateChange}
                        onCalendarChange={handleCalendarChange}
                    />
                </div>

                {/* Buttons */}
                <div className="flex gap-2">
                    <PrimaryButton
                        size="large"
                        type="primary"
                        title="Search"
                        onClick={handleApplyFilters}
                        className="text-black"
                        disabled={!isDateValid()}
                    />
                    <PrimaryButton
                        size="large"
                        title="Reset"
                        onClick={handleResetFilters}
                    />
                </div>

            </div>
        </div>

    );
}

export default CommonFilters;