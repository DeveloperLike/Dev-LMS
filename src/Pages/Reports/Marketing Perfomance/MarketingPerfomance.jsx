import React, { useEffect, useState, useCallback } from "react";
import { Tooltip, message } from "antd";
import { FaFilter } from "react-icons/fa";
import { FaFilterCircleXmark } from "react-icons/fa6";
import SourceLeadPerformance from "./Components/SourceLeadPerformance";
import dayjs from "dayjs";
import { getCounsellorDropdown } from "../../AssignmentRule/ApiService";
import { getLeadSourceDropdownService } from "../../Lead/ApiService";
import axios from "axios";
import MarketingLeadReport from "./Components/MarketingLeadReport";
import TrackingUrlPerformance from "./Components/TrackingUrlPerformance";
import FacebookCampaignPerformance from "./Components/SourceCampaignPerformance";
import CommonFilters from "../CommonFilters";
import KpiSection from "./Components/KpiSection";
import MqlBySourceChart from "./Components/MqlBySourceChart";
import SqlBySourceChart from "./Components/SqlBySourceChart";
import useTheme from "../Google Analytics/services/useTheme";
import MqlToSqlTrend from "./Components/MqlToSqlTrend";
import { YgApi } from "../../../lib/Constants";

function MarketingPerformance() {
    const { colors } = useTheme();
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [counsellor, setCounsellor] = useState([]);
    const [leadSource, setLeadSource] = useState([]);
    const [sourceGroup, setSourceGroup] = useState([]);
    const [branch, setBranch] = useState([]);
    const [role, setRole] = useState([]);
    const [branchDropdown, setBranchDropdown] = useState([]);
    const [roleDropdown, setRoleDropdown] = useState([]);
    const [counsellorDropdown, setCounsellorDropdown] = useState([]);
    const [sourceGroupDropdown, setSourceGroupDropdown] = useState([]);
    const [leadSourceDropdown, setLeadSourceDropdown] = useState([]);
    const defaultRange = [dayjs().subtract(29, "day"), dayjs()];
    const [dateRange, setDateRange] = useState(defaultRange);
    const [appliedDateRange, setAppliedDateRange] = useState(defaultRange);
    const [appliedFilters, setAppliedFilters] = useState({
        counsellor: [],
        leadSource: [],
        sourceGroup: [],
        branch: [],
        role: []
    });

    const handleFilterChange = () => {
        setAppliedFilters({
            counsellor: [...counsellor],
            leadSource: [...leadSource],
            sourceGroup: [...sourceGroup],
            branch: [...branch],
            role: [...role]
        });

        setAppliedDateRange([...dateRange]);
    };

    useEffect(() => {
        setAppliedFilters({
            counsellor: [],
            leadSource: [],
            sourceGroup: [],
            branch: [],
            role: []
        });

        setAppliedDateRange(defaultRange);
    }, []);

    useEffect(() => {
        const fetchLeadSources = async () => {
            try {
                const res = await getLeadSourceDropdownService();
                const data = res?.data?.data || [];

                setLeadSourceDropdown(data);

                const groups = [
                    ...new Set(data.map((i) => i.source_group).filter(Boolean)),
                ].map((g) => ({ value: g, label: g }));

                setSourceGroupDropdown(groups);
            } catch (error) {
                console.error(error);
            }
        };

        fetchLeadSources();
    }, []);

    useEffect(() => {
        const fetchCounsellors = async () => {
            try {
                const res = await getCounsellorDropdown();
                const data = res?.data?.data || [];

                setCounsellorDropdown(data);

                const roles = [
                    ...new Map(
                        data.map(item => [
                            item.role_id,
                            {
                                value: item.role_id,
                                label: item.role_name
                            }
                        ])
                    ).values()
                ];

                setRoleDropdown(roles);
            } catch (error) {
                console.error(error);
            }
        };

        fetchCounsellors();
    }, []);

    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const res = await axios.post(
                    `${YgApi}/mondayMeetings/get-crm-records`,
                    {
                        query: `
                            SELECT id, name
                            FROM branch_management_branch
                            ORDER BY name
                        `
                    }
                );

                const data = res?.data?.data || res?.data || [];
                setBranchDropdown(data);
            } catch (err) {
                console.error("Branch dropdown error", err);
            }
        };

        fetchBranches();
    }, []);

    return (
        <div className="p-6 space-y-4">

            {/* HEADER */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-black dark:text-yellow-400">
                    Marketing Performance
                </h1>

                <Tooltip title="Filters">
                    <button
                        className="text-lg text-black dark:text-white"
                        onClick={() => setIsFilterOpen((prev) => !prev)}
                    >
                        {isFilterOpen ? <FaFilterCircleXmark /> : <FaFilter />}
                    </button>
                </Tooltip>
            </div>

            {/* FILTERS */}
            {isFilterOpen && (
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
                    onResetComplete={(range) => {
                        setAppliedDateRange(range);
                        setAppliedFilters({
                            counsellor: [],
                            leadSource: [],
                            sourceGroup: [],
                            branch: [],
                            role: []
                        });
                    }}
                />
            )}

            {/* KPI */}
            <KpiSection
                startDate={appliedDateRange?.[0]?.format("YYYY-MM-DD")}
                endDate={appliedDateRange?.[1]?.format("YYYY-MM-DD")}
                counsellor={appliedFilters.counsellor}
                leadSource={appliedFilters.leadSource}
                sourceGroup={appliedFilters.sourceGroup}
                branch={appliedFilters.branch}
                role={appliedFilters.role}
            />

            {/* CHARTS */}
            <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-6">
                <MqlBySourceChart
                    startDate={appliedDateRange?.[0]?.format("YYYY-MM-DD")}
                    endDate={appliedDateRange?.[1]?.format("YYYY-MM-DD")}
                    counsellor={appliedFilters.counsellor}
                    leadSource={appliedFilters.leadSource}
                    sourceGroup={appliedFilters.sourceGroup}
                    branch={appliedFilters.branch}
                    role={appliedFilters.role}
                    colors={colors}
                />

                <SqlBySourceChart
                    startDate={appliedDateRange?.[0]?.format("YYYY-MM-DD")}
                    endDate={appliedDateRange?.[1]?.format("YYYY-MM-DD")}
                    counsellor={appliedFilters.counsellor}
                    leadSource={appliedFilters.leadSource}
                    sourceGroup={appliedFilters.sourceGroup}
                    branch={appliedFilters.branch}
                    role={appliedFilters.role}
                    colors={colors}
                />
            </div>

            {/* TREND CHART */}
            <div className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">

                <MqlToSqlTrend
                    startDate={appliedDateRange?.[0]?.format("YYYY-MM-DD")}
                    endDate={appliedDateRange?.[1]?.format("YYYY-MM-DD")}
                    counsellor={appliedFilters.counsellor}
                    leadSource={appliedFilters.leadSource}
                    sourceGroup={appliedFilters.sourceGroup}
                    branch={appliedFilters.branch}
                    role={appliedFilters.role}
                />
            </div>

            {/* SOURCE TABLE*/}
            <div className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <div className="p-4 pb-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                        Source Lead Performance
                    </h3>
                </div>
                <SourceLeadPerformance
                    startDate={appliedDateRange?.[0]?.format("YYYY-MM-DD")}
                    endDate={appliedDateRange?.[1]?.format("YYYY-MM-DD")}
                    counsellor={appliedFilters.counsellor}
                    leadSource={appliedFilters.leadSource}
                    sourceGroup={appliedFilters.sourceGroup}
                    branch={appliedFilters.branch}
                    role={appliedFilters.role}
                />
            </div>

            {/* MARKETING REPORT */}
            <div className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <div className="p-4 pb-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                        Marketing Lead Report
                    </h3>
                </div>

                <MarketingLeadReport
                    startDate={appliedDateRange?.[0]?.format("YYYY-MM-DD")}
                    endDate={appliedDateRange?.[1]?.format("YYYY-MM-DD")}
                    counsellor={appliedFilters.counsellor}
                    leadSource={appliedFilters.leadSource}
                    sourceGroup={appliedFilters.sourceGroup}
                    branch={appliedFilters.branch}
                    role={appliedFilters.role}
                />
            </div>

            {/* FACEBOOK */}
            <div className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <div className="p-4 pb-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                        Facebook Performance
                    </h3>
                </div>

                <FacebookCampaignPerformance
                    startDate={appliedDateRange?.[0]?.format("YYYY-MM-DD")}
                    endDate={appliedDateRange?.[1]?.format("YYYY-MM-DD")}
                    counsellor={appliedFilters.counsellor}
                    leadSource={appliedFilters.leadSource}
                    sourceGroup={appliedFilters.sourceGroup}
                    branch={appliedFilters.branch}
                    role={appliedFilters.role}
                />
            </div>

            {/* TRACKING URL */}
            <div className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">

                <TrackingUrlPerformance
                    startDate={appliedDateRange?.[0]?.format("YYYY-MM-DD")}
                    endDate={appliedDateRange?.[1]?.format("YYYY-MM-DD")}
                    counsellor={appliedFilters.counsellor}
                    leadSource={appliedFilters.leadSource}
                    sourceGroup={appliedFilters.sourceGroup}
                    branch={appliedFilters.branch}
                    role={appliedFilters.role}
                />
            </div>

        </div>
    );
}

export default MarketingPerformance;