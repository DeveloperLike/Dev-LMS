import React, { useEffect, useState } from "react";

import {
    Tabs,
    Tooltip,
} from "antd";

import {
    FaFilter,
} from "react-icons/fa";

import {
    FaFilterCircleXmark,
} from "react-icons/fa6";

import dayjs from "dayjs";
import axios from "axios";

import BranchStatusPerformance from "./Components/BranchStatusPerfomance";
import BranchSourcePerformance from "./Components/BranchSourcePerformance";
import BranchUserStatusPerformance from "./Components/BranchUserStatusPerformance";

import DashboardStatsCards from "./Components/DashboardStatsCards";
import FollowupChart from "./Components/FollowupChart";
import LeadTrendChart from "./Components/LeadTrendChart";
import LeadStatusChart from "./Components/LeadStatusChart";

import CommonFilters from "../CommonFilters";

import {
    getCounsellorDropdown,
} from "../../AssignmentRule/ApiService";

import {
    getLeadSourceDropdownService,
} from "../../Lead/ApiService";
import { baseurl } from "../../../lib/Constants";
import SourceGroupJunk from "./Components/SourceGroupJunk";
function BranchPerfomance() {
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const [counsellor, setCounsellor] = useState([]);
    const [dateRange, setDateRange] = useState([
        dayjs().subtract(30, "day"),
        dayjs(),
    ]);
    const [leadSource, setLeadSource] = useState([]);
    const [sourceGroup, setSourceGroup] = useState([]);
    const [branch, setBranch] = useState([]);
    const [role, setRole] = useState([]);

    const [branchDropdown, setBranchDropdown] = useState([]);
    const [roleDropdown, setRoleDropdown] = useState([]);
    const [counsellorDropdown, setCounsellorDropdown] = useState([]);
    const [sourceGroupDropdown, setSourceGroupDropdown] = useState([]);
    const [leadSourceDropdown, setLeadSourceDropdown] = useState([]);
    const [isDashboardLoading, setIsDashboardLoading] = useState(true);
    const [dashboardStats, setDashboardStats] = useState({});

    const [appliedFilters, setAppliedFilters] = useState({
        counsellor: [],
        leadSource: [],
        sourceGroup: [],
        branch: [],
        role: [],
    });

    const [appliedDateRange, setAppliedDateRange] = useState([
        dayjs().subtract(30, "day"),
        dayjs(),
    ]);

    const handleFilterChange = (
        customFilters = {},
        isReset = false
    ) => {

        setDashboardStats({});
        setIsDashboardLoading(true);

        // ================= RESET =================
        if (isReset) {

            const defaultRange = [
                dayjs().subtract(30, "day"),
                dayjs(),
            ];

            const resetFilters = {
                counsellor: [],
                leadSource: [],
                sourceGroup: [],
                branch: [],
                role: [],
            };

            // reset local filters
            setCounsellor([]);
            setLeadSource([]);
            setSourceGroup([]);
            setBranch([]);
            setRole([]);

            // reset applied filters
            setAppliedFilters(resetFilters);

            // reset dates
            setDateRange(defaultRange);
            setAppliedDateRange(defaultRange);

            // close filter
            setIsFilterOpen(false);

            return;
        }

        // ================= APPLY =================
        const updatedFilters = {
            counsellor,
            leadSource,
            sourceGroup,
            branch,
            role,
        };

        setAppliedFilters(updatedFilters);

        setAppliedDateRange([
            dayjs(customFilters.start_date, "DD-MM-YYYY"),
            dayjs(customFilters.end_date, "DD-MM-YYYY"),
        ]);

        setIsFilterOpen(false);
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
                    baseurl + "/mondayMeetings/get-crm-records",
                    { query }
                );

                const branches = Array.isArray(res?.data)
                    ? res.data
                    : Array.isArray(res?.data?.data)
                        ? res.data.data
                        : [];

                setBranchDropdown(branches);
            } catch (err) {
                console.error(err);
            }
        };

        fetchBranches();
    }, []);

    useEffect(() => {
        getLeadSourceDropdownService().then((res) => {
            const data = res?.data?.data || [];

            setLeadSourceDropdown(data);

            const uniqueGroups = [
                ...new Set(data.map((item) => item.source_group).filter(Boolean)),
            ].map((group) => ({
                value: group,
                label: group,
            }));

            setSourceGroupDropdown(uniqueGroups);
        });
    }, []);

    useEffect(() => {
        getCounsellorDropdown().then((res) => {
            const data = res?.data?.data || [];

            setCounsellorDropdown(data);

            const roles = [
                ...new Map(
                    data.map((item) => [
                        item.role_id,
                        {
                            value: item.role_id,
                            label: item.role_name,
                        },
                    ])
                ).values(),
            ];

            setRoleDropdown(roles);
        });
    }, []);

    return (
        <div className="rounded-xl min-h-screen text-white md:px-6 ">

            {/* HEADER */}
            <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
                <div>
                    <h1 className="text-3xl font-bold dark:text-white text-black">
                        Branch Performance
                    </h1>

                    <p className="dark:text-white text-black mt-1 text-xs">
                        Track and analyze branch-wise lead performance
                    </p>
                </div>

                <div className="flex items-center gap-3 flex-wrap dark:text-white text-black">

                    <Tooltip
                        title={
                            isFilterOpen
                                ? "Close Filters"
                                : "Open Filters"
                        }
                    >

                        <button
                            onClick={() =>
                                setIsFilterOpen((prev) => !prev)
                            }
                        >

                            {isFilterOpen
                                ? <FaFilterCircleXmark />
                                : <FaFilter />
                            }

                        </button>

                    </Tooltip>

                </div>
            </div>

            {/* FILTERS */}
            {isFilterOpen && (
                <div className="mb-6 dark:text-white text-black">
                    <CommonFilters
                        branch={branch}
                        setBranch={setBranch}
                        branchDropdown={branchDropdown}
                        role={role}
                        setRole={setRole}
                        roleDropdown={roleDropdown}
                        counsellor={counsellor}
                        setCounsellor={setCounsellor}
                        counsellorDropdown={counsellorDropdown}
                        sourceGroup={sourceGroup}
                        setSourceGroup={setSourceGroup}
                        sourceGroupDropdown={sourceGroupDropdown}
                        leadSource={leadSource}
                        setLeadSource={setLeadSource}
                        leadSourceDropdown={leadSourceDropdown}
                        dateRange={dateRange}
                        setDateRange={setDateRange}
                        onFilterChange={handleFilterChange}
                        resetDateRange={[
                            dayjs().subtract(30, "day"),
                            dayjs(),
                        ]}
                    />
                </div>
            )}

            {/* MAIN CONTENT */}
            <div className="space-y-6 mb-6">

                {/* TOP SECTION */}
                <div
                    className="
                    grid
                    grid-cols-1
                    xl:grid-cols-[minmax(0,1fr)_420px]
                    2xl:grid-cols-[minmax(0,1fr)_610px]
                    gap-6
                    items-start
                    w-full
                "
                >

                    {/* LEFT SIDE TABLE */}
                    <div className="w-full min-w-0">

                        <div
                            className="
                            rounded-2xl
                            overflow-hidden
                            border
                            border-white/10
                            bg-white
                            dark:bg-black
                            p-5
                            h-full
                        "
                        >
                            <Tabs
                                defaultActiveKey="branch"
                                items={[
                                    {
                                        key: "branch",
                                        label: (<strong>Branch Status</strong>),
                                        children: (
                                            <div className="pt-4 overflow-x-auto">
                                                <BranchStatusPerformance
                                                    setDashboardLoading={setIsDashboardLoading}
                                                    onStatusTotalsChange={(data) => {
                                                        setDashboardStats((prev) => ({
                                                            ...prev,
                                                            ...data,
                                                        }));
                                                    }}
                                                    startDate={appliedDateRange?.[0]?.format(
                                                        "YYYY-MM-DD"
                                                    )}
                                                    endDate={appliedDateRange?.[1]?.format(
                                                        "YYYY-MM-DD"
                                                    )}
                                                    counsellor={appliedFilters.counsellor}
                                                    leadSource={appliedFilters.leadSource}
                                                    sourceGroup={appliedFilters.sourceGroup}
                                                    branch={appliedFilters.branch}
                                                    role={appliedFilters.role}
                                                />
                                            </div>
                                        ),
                                    },

                                    {
                                        key: "user",
                                        label: (<strong>Counsellor Status</strong>),
                                        children: (
                                            <div className="pt-4 overflow-x-auto">
                                                <BranchUserStatusPerformance
                                                    startDate={appliedDateRange?.[0]?.format(
                                                        "YYYY-MM-DD"
                                                    )}
                                                    endDate={appliedDateRange?.[1]?.format(
                                                        "YYYY-MM-DD"
                                                    )}
                                                    counsellor={appliedFilters.counsellor}
                                                    leadSource={appliedFilters.leadSource}
                                                    sourceGroup={appliedFilters.sourceGroup}
                                                    branch={appliedFilters.branch}
                                                    role={appliedFilters.role}
                                                />
                                            </div>
                                        ),
                                    },
                                ]}
                            />
                        </div>

                    </div>

                    {/* RIGHT SIDE */}
                    <div
                        className="
                         w-full
                         xl:w-[420px]
                         xl:max-w-[420px]
                         2xl:w-[610px]
                         2xl:max-w-[610px]
                         xl:ml-auto
                         space-y-6
                     "
                    >

                        {/* STATS */}
                        <DashboardStatsCards
                            dashboardStats={dashboardStats}
                            isLoading={isDashboardLoading}
                        />

                        {/* FOLLOWUP CHART */}
                        <FollowupChart
                            counsellor={appliedFilters.counsellor}
                            leadSource={appliedFilters.leadSource}
                            sourceGroup={appliedFilters.sourceGroup}
                            branch={appliedFilters.branch}
                            role={appliedFilters.role}
                        />

                    </div>

                </div>

                {/* TWO CHARTS */}
                <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_1fr] gap-6">

                    <LeadTrendChart
                        startDate={appliedDateRange?.[0]?.format(
                            "YYYY-MM-DD"
                        )}
                        endDate={appliedDateRange?.[1]?.format(
                            "YYYY-MM-DD"
                        )}
                        counsellor={appliedFilters.counsellor}
                        leadSource={appliedFilters.leadSource}
                        sourceGroup={appliedFilters.sourceGroup}
                        branch={appliedFilters.branch}
                        role={appliedFilters.role}
                    />

                    <LeadStatusChart
                        dashboardStats={dashboardStats}
                        isLoading={isDashboardLoading}
                    />

                </div>

                {/* BRANCH JUNK TABLE */}
                <div className="rounded-2xl overflow-hidden border border-white/10 bg-white dark:bg-black p-5">
                    <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
                        <h2 className="text-xl font-bold dark:text-white text-black">
                            Junk Analysis
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <SourceGroupJunk
                            startDate={appliedDateRange?.[0]?.format(
                                "YYYY-MM-DD"
                            )}
                            endDate={appliedDateRange?.[1]?.format(
                                "YYYY-MM-DD"
                            )}
                            counsellor={appliedFilters.counsellor}
                            leadSource={appliedFilters.leadSource}
                            sourceGroup={appliedFilters.sourceGroup}
                            branch={appliedFilters.branch}
                            role={appliedFilters.role}
                        />
                    </div>
                </div>

                {/* SOURCE PERFORMANCE TABLE */}
                <div className="rounded-2xl overflow-hidden border border-white/10 bg-white dark:bg-black p-5">
                    <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
                        <h2 className="text-xl font-bold dark:text-white text-black">
                            Branch Source Group Performance
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <BranchSourcePerformance
                            onTotalsChange={(data) => {
                                setDashboardStats((prev) => ({
                                    ...prev,
                                    ...data,
                                }));
                            }}
                            startDate={appliedDateRange?.[0]?.format(
                                "YYYY-MM-DD"
                            )}
                            endDate={appliedDateRange?.[1]?.format(
                                "YYYY-MM-DD"
                            )}
                            counsellor={appliedFilters.counsellor}
                            leadSource={appliedFilters.leadSource}
                            sourceGroup={appliedFilters.sourceGroup}
                            branch={appliedFilters.branch}
                            role={appliedFilters.role}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}

export default BranchPerfomance;