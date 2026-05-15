import React, { useEffect, useState } from "react";
import BranchUserPerformance from "./Components/BranchUserPerformance";
import { DatePicker, Tooltip } from "antd";
import { FaFilter, FaFilterCircleXmark } from "react-icons/fa6";
import dayjs from "dayjs";
import axios from "axios";
import { CustomSelectInput } from "../../../Components/CustomComponents/InputWithIcon";
import { PrimaryButton } from "../../../Components/CustomComponents/ButtonUi";
import { getLeadSourceDropdownService } from "../ApiService";
import { getCounsellorDropdown } from "../../AssignmentRule/ApiService";
import { YgApi } from "../../../lib/Constants";
const { RangePicker } = DatePicker;
const dateFormat = "DD-MM-YYYY";

function UserPerformance() {

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [counsellor, setCounsellor] = useState([]);
    const [counsellorDropdown, setCounsellorDropdown] = useState([]);
    const [dateRange, setDateRange] = useState([dayjs(), dayjs()]);
    const [leadSourceDropdown, setLeadSourceDropdown] = useState([]);
    const [leadSource, setLeadSource] = useState([]);
    const [sourceGroupDropdown, setSourceGroupDropdown] = useState([]);
    const [sourceGroup, setSourceGroup] = useState([]);
    const [branchDropdown, setBranchDropdown] = useState([]);
    const [branch, setBranch] = useState([]);

    const [appliedFilters, setAppliedFilters] = useState({
        counsellor: [],
        leadSource: [],
        sourceGroup: [],
        branch: []
    });
    const [appliedDateRange, setAppliedDateRange] = useState([
        dayjs(),
        dayjs(),
    ]);

    const rangePresets = [
        {
            label: "Today",
            value: [dayjs(), dayjs()],
        },
        {
            label: "Yesterday",
            value: [dayjs().subtract(1, "d"), dayjs().subtract(1, "d")],
        },
        {
            label: "Last 7 Days",
            value: [dayjs().subtract(7, "d"), dayjs()],
        },
        {
            label: "Last 14 Days",
            value: [dayjs().subtract(14, "d"), dayjs()],
        },
        {
            label: "Last 30 Days",
            value: [dayjs().subtract(30, "d"), dayjs()],
        },
        {
            label: "Last 60 Days",
            value: [dayjs().subtract(60, "d"), dayjs()],
        },
        {
            label: "Last 90 Days",
            value: [dayjs().subtract(90, "d"), dayjs()],
        },
    ];

    const handleAdvFilters = () => {

        const filtersToApply = {
            counsellor,
            leadSource,
            sourceGroup,
            branch
        };

        setAppliedFilters(filtersToApply);
        setAppliedDateRange(dateRange?.length === 2 ? dateRange : null);

    };

    const handleResetFilter = () => {

        const defaultRange = [dayjs(), dayjs()];

        setBranch([]);
        setCounsellor([]);
        setLeadSource([]);
        setSourceGroup([]);
        setDateRange(defaultRange);

        setAppliedFilters({
            counsellor: [],
            leadSource: [],
            sourceGroup: [],
            branch: []
        });

        setAppliedDateRange(defaultRange);

    };

    useEffect(() => {

        const fetchBranches = async () => {

            try {

                const query = `
                SELECT id, name
                FROM branch_management_branch
                ORDER BY name
                `;

                const res = await axios.post(
                    `${YgApi}/mondayMeetings/get-crm-records`,
                    { query }
                );

                const branches =
                    Array.isArray(res?.data)
                        ? res.data
                        : Array.isArray(res?.data?.data)
                            ? res.data.data
                            : [];

                setBranchDropdown(branches);

            } catch (err) {

                console.error("Branch dropdown error", err);

            }

        };

        fetchBranches();

    }, []);

    useEffect(() => {
        getLeadSourceDropdownService().then((res) => {

            const data = res?.data?.data || [];

            setLeadSourceDropdown(data);

            const uniqueGroups = [
                ...new Set(data.map((item) => item.source_group).filter(Boolean))
            ].map((group) => ({
                value: group,
                label: group,
            }));

            setSourceGroupDropdown(uniqueGroups);

        });
    }, []);

    useEffect(() => {
        getCounsellorDropdown().then((res) => {
            setCounsellorDropdown(res?.data?.data || []);
        });
    }, []);

    return (
        <div className="mt-2 mx-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-black dark:text-yellow-500">
                    Branch User Performance
                </h2>

                <Tooltip title="Filters">
                    <button
                        className="text-lg text-black dark:text-white"
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                    >
                        {isFilterOpen ? <FaFilterCircleXmark /> : <FaFilter />}
                    </button>
                </Tooltip>
            </div>

            {/* Filter Section */}
            {isFilterOpen && (
                <div className="mb-3 rounded-lg bg-white p-4 shadow-default dark:bg-boxdark">
                    <div className="flex flex-wrap lg:flex-nowrap gap-4 items-end">

                        <div className="flex flex-col w-full lg:w-[22%]">
                            <label className="text-black dark:text-white">Branch</label>
                            <CustomSelectInput
                                name="branch"
                                placeholder="Select Branch"
                                mode="multiple"
                                value={branch}
                                handler={(value) => setBranch(value)}
                                options={branchDropdown.map((item) => ({
                                    value: item.id,
                                    label: item.name
                                }))}
                            />
                        </div>

                        <div className="flex flex-col w-full lg:w-[22%]">
                            <label className="text-black dark:text-white">Counsellor</label>
                            <CustomSelectInput
                                size="large"
                                name="counsellor"
                                placeholder="Select Counsellor"
                                mode="multiple"
                                value={counsellor}
                                handler={(value) => setCounsellor(value)}
                                options={counsellorDropdown.map((item) => ({
                                    value: item.username,
                                    label: item.email,
                                }))}
                            />
                        </div>

                        <div className="flex flex-col w-full lg:w-[22%]">
                            <label className="text-black dark:text-white">Source Group</label>
                            <CustomSelectInput
                                name="source_group"
                                placeholder="Select Source Group"
                                mode="multiple"
                                value={sourceGroup}
                                handler={(value) => setSourceGroup(value)}
                                options={sourceGroupDropdown}
                            />
                        </div>

                        <div className="flex flex-col w-full lg:w-[22%]">
                            <label className="text-black dark:text-white">Lead Source</label>
                            <CustomSelectInput
                                name="lead_source"
                                placeholder="Please select Lead Source"
                                mode="multiple"
                                value={leadSource}
                                handler={(value) => setLeadSource(value)}
                                options={leadSourceDropdown.map((item) => ({
                                    value: item.id,
                                    label: item.name,
                                }))}
                            />
                        </div>

                        <div className="flex flex-col w-full lg:w-[26%]">
                            <label className="text-black dark:text-white">Date Range</label>
                            <RangePicker
                                size="large"
                                format={dateFormat}
                                presets={rangePresets}
                                value={dateRange}
                                onChange={(v) => {
                                    if (!v) {
                                        setDateRange([]);
                                    } else {
                                        setDateRange(v);
                                    }
                                }}
                            />
                        </div>

                        <div className="flex gap-2">
                            <PrimaryButton
                                size="large"
                                type="primary"
                                title="Search"
                                onClick={handleAdvFilters}
                                className="text-black"
                            />
                            <PrimaryButton
                                size="large"
                                title="Reset"
                                onClick={handleResetFilter}
                            />
                        </div>
                    </div>
                </div>
            )}
            <BranchUserPerformance
                startDate={appliedDateRange?.[0]?.format("YYYY-MM-DD")}
                endDate={appliedDateRange?.[1]?.format("YYYY-MM-DD")}
                counsellor={appliedFilters.counsellor}
                leadSource={appliedFilters.leadSource}
                sourceGroup={appliedFilters.sourceGroup}
                branch={appliedFilters.branch}
            />
        </div>
    );
}

export default UserPerformance;