import React, { useEffect, useState } from "react";
import { DatePicker, Tooltip } from "antd";
import { FaFilter, FaFilterCircleXmark } from "react-icons/fa6";
import dayjs from "dayjs";
import { getCounsellorDropdown } from "../../AssignmentRule/ApiService";
import { getLeadSourceDropdownService } from "../../Lead/ApiService";
import { getLeadListService } from "../../Lead/ApiService";
import { PAGESIZE , YgApi } from "../../../lib/Constants";
import UserStatusOnFollowUpLeads from "./Components/UserStatusOnFollowUpLeads";
import DistributedSourceLeads from "./Components/DistributedSourceLeads";
import LeadsCounts from "./Components/LeadsCounts";
import CommonFilters from "../CommonFilters";
import { useSmoothCountUp } from "../../Dashboard/useSmoothCountUp";
import {
    getGlobalSqlCountService,
    getGlobalMqlCountService,
    getGlobalVcCountService,
    getGlobalVisitCountService,
} from "../ApiService";
import axios from "axios";


const dateFormat = "DD-MM-YYYY";

function LeadFunnel() {

    const [dateRange, setDateRange] = useState([dayjs(), dayjs(),]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [counsellorDropdown, setCounsellorDropdown] = useState([]);
    const [counsellor, setCounsellor] = useState([]);
    const [leadSourceDropdown, setLeadSourceDropdown] = useState([]);
    const [leadSource, setLeadSource] = useState([]);
    const [leadFunnelData, setLeadFunnelData] = useState(null);
    const [tableLoading, setTableLoading] = useState(false);
    const [pageSize, setPageSize] = useState(PAGESIZE);
    const [page, setPage] = useState(1);

    const [globalSqlCount, setGlobalSqlCount] = useState(0);
    const [sqlLoading, setSqlLoading] = useState(false);

    const [globalMqlCount, setGlobalMqlCount] = useState(0);
    const [mqlLoading, setMqlLoading] = useState(false);

    const [globalVcCount, setGlobalVcCount] = useState(0);
    const [globalVisitCount, setGlobalVisitCount] = useState(0);

    const [sourceGroupDropdown, setSourceGroupDropdown] = useState([]);
    const [sourceGroup, setSourceGroup] = useState([]);

    const [branchDropdown, setBranchDropdown] = useState([]);
    const [branch, setBranch] = useState([]);

    const [vcLoading, setVcLoading] = useState(false);
    const [visitLoading, setVisitLoading] = useState(false);

    const [role, setRole] = useState([]);
    const [roleDropdown, setRoleDropdown] = useState([]);

    const totalLeadsAnimated = useSmoothCountUp(leadFunnelData?.data_count ?? 0);
    const mqlAnimated = useSmoothCountUp(globalMqlCount);
    const sqlAnimated = useSmoothCountUp(globalSqlCount);
    const vcAnimated = useSmoothCountUp(globalVcCount);
    const visitAnimated = useSmoothCountUp(globalVisitCount);

    const [appliedFilters, setAppliedFilters] = useState({
        counsellor: [],
        leadSource: [],
        sourceGroup: [],
        branch: [],
        role: []
    });
    const [appliedDateRange, setAppliedDateRange] = useState([
        dayjs(),
        dayjs(),
    ]);

    const fetchGlobalVcCount = async (appliedFilters = {}) => {
        setVcLoading(true);
        try {
            const res = await getGlobalVcCountService(appliedFilters);
            setGlobalVcCount(res?.data?.count ?? res?.data?.data_count ?? 0);
        } catch (e) {
            console.error("VC count error", e);
            setGlobalVcCount(0);
        } finally {
            setVcLoading(false);
        }
    };

    const fetchGlobalVisitCount = async (appliedFilters = {}) => {
        setVisitLoading(true);
        try {
            const res = await getGlobalVisitCountService(appliedFilters);
            setGlobalVisitCount(res?.data?.count ?? res?.data?.data_count ?? 0);
        } catch (e) {
            console.error("Visit count error", e);
            setGlobalVisitCount(0);
        } finally {
            setVisitLoading(false);
        }
    };

    const fetchGlobalSqlCount = async (appliedFilters = {}) => {
        setSqlLoading(true);

        try {
            const res = await getGlobalSqlCountService(appliedFilters);

            const count =
                res?.data?.count ??
                res?.data?.data_count ??
                0;

            setGlobalSqlCount(count);

        } catch (err) {
            console.error("SQL count error", err);
            setGlobalSqlCount(0);
        } finally {
            setSqlLoading(false);
        }
    };

    const fetchGlobalMqlCount = async (appliedFilters = {}) => {
        setMqlLoading(true);

        try {
            const res = await getGlobalMqlCountService(appliedFilters);

            const count =
                res?.data?.count ??
                res?.data?.data_count ??
                0;

            setGlobalMqlCount(count);
        } catch (err) {
            console.error("Global MQL fetch failed:", err);
            setGlobalMqlCount(0);
        } finally {
            setMqlLoading(false);
        }
    };

    const totalLeadsRaw = leadFunnelData?.data_count ?? 0;

    const mqlPercentage =
        totalLeadsRaw && globalMqlCount
            ? Math.round((globalMqlCount / totalLeadsRaw) * 100)
            : 0;

    const sqlPercentage =
        globalMqlCount && globalSqlCount
            ? Math.round((globalSqlCount / globalMqlCount) * 100)
            : 0;

    const getPercentageStyle = (percent, type) => {
        const redLimit = type === "sql" ? 40 : 35;

        if (percent > 50) {
            return "text-green-500";
        }

        if (percent < redLimit) {
            return "text-red-500";
        }

        return "text-yellow-500";
    };

    const fetchLeadFunnelData = (params = {}) => {
        setTableLoading(true);

        const finalParams = {
            ...params,
            current_page_number:
                params.current_page_number ?? page,
            count_per_page: pageSize,
        };

        getLeadListService(finalParams)
            .then((res) => {
                setLeadFunnelData(res?.data || null);
            })
            .catch(console.error)
            .finally(() => setTableLoading(false));
    };

    useEffect(() => {
        getCounsellorDropdown().then((res) => {
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
        });
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
        const fetchBranches = async () => {
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
        };

        fetchBranches();
    }, []);

    const cards = [
        {
            title: "TOTAL LEADS CREATED",
            value: tableLoading ? "..." : totalLeadsAnimated,
        },
        {
            title: "MQL",
            value: mqlLoading ? "..." : mqlAnimated,
            percentage: mqlPercentage,
            type: "mql",
        },
        {
            title: "SQL",
            value: sqlLoading ? "..." : sqlAnimated,
            percentage: sqlPercentage,
            type: "sql",
        },
        {
            title: "VC DONE",
            value: vcLoading ? "..." : vcAnimated,
        },
        {
            title: "VISIT DONE",
            value: visitLoading ? "..." : visitAnimated,
        },
    ];

    const handleFilterChange = (apiFilters) => {

        setPage(1);

        setAppliedFilters({
            counsellor,
            leadSource,
            sourceGroup,
            branch,
            role
        });

        setAppliedDateRange(dateRange);

        fetchLeadFunnelData({
            ...apiFilters,
            current_page_number: 1
        });

        fetchGlobalSqlCount(apiFilters);
        fetchGlobalMqlCount(apiFilters);
        fetchGlobalVcCount(apiFilters);
        fetchGlobalVisitCount(apiFilters);
    };

    useEffect(() => {
        const defaultFilters = {};

        if (dateRange?.length === 2) {
            defaultFilters.start_date = dateRange[0].format(dateFormat);
            defaultFilters.end_date = dateRange[1].format(dateFormat);
        }

        fetchLeadFunnelData(defaultFilters);
        fetchGlobalSqlCount(defaultFilters);
        fetchGlobalMqlCount(defaultFilters);
        fetchGlobalVcCount(defaultFilters);
        fetchGlobalVisitCount(defaultFilters);

    }, []);

    return (
        <div className="mx-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-3 pt-1">
                <h1 className="dark:text-yellow-500 text-black font-semibold text-xl">
                    Lead Funnel
                </h1>

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

                        const defaultFilters = {
                            start_date: range[0].format(dateFormat),
                            end_date: range[1].format(dateFormat),
                        };

                        setAppliedDateRange(range);

                        setAppliedFilters({
                            counsellor: [],
                            leadSource: [],
                            sourceGroup: [],
                            branch: [],
                            role: []
                        });

                        setPage(1);

                        fetchLeadFunnelData(defaultFilters);
                        fetchGlobalSqlCount(defaultFilters);
                        fetchGlobalMqlCount(defaultFilters);
                        fetchGlobalVcCount(defaultFilters);
                        fetchGlobalVisitCount(defaultFilters);
                    }}
                />
            )}

            {/* Cards */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-[#24303f] rounded-lg shadow-default">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                    {cards.map((card, index) => (
                        <div
                            key={index}
                            className="hover:shadow bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-700 border-l-4 border-l-yellow-400 dark:hover:border-yellow-400 rounded-xl p-5 transition-all duration-200"
                        >
                            <p className="text-black dark:text-white text-lg uppercase font-semibold">
                                {card.title}
                            </p>

                            <div className="flex items-center justify-between mt-2">
                                <p className="text-black dark:text-white text-3xl font-extrabold">
                                    {card.value}
                                </p>

                                {card.percentage !== undefined && (
                                    <span
                                        className={`font-semibold ${getPercentageStyle(
                                            card.percentage,
                                            card.type
                                        )}`}
                                    >
                                        {card.percentage}%
                                    </span>
                                )}
                            </div>

                        </div>
                    ))}
                </div>
            </div>


            {/* Distributed source leads */}
            <div className="mt-6 ">
                <h2 className="text-lg mb-3 font-semibold text-black dark:text-yellow-500">
                    Distributed source leads
                </h2>

                <DistributedSourceLeads
                    startDate={
                        appliedDateRange?.length === 2
                            ? appliedDateRange[0].format("YYYY-MM-DD")
                            : null
                    }
                    endDate={
                        appliedDateRange?.length === 2
                            ? appliedDateRange[1].format("YYYY-MM-DD")
                            : null
                    }
                    counsellor={appliedFilters.counsellor}
                    leadSource={appliedFilters.leadSource}
                    sourceGroup={appliedFilters.sourceGroup}
                    branch={appliedFilters.branch}
                    role={appliedFilters.role}
                />
            </div>

            {/* Leads counts */}
            <div className="mt-6 ">
                <h2 className="text-lg font-semibold text-black dark:text-yellow-500">
                    Status Update Logs
                </h2>
                <h6 className="text-xs mb-3 text-black dark:text-white">
                    Current data may differ from this data.
                </h6>

                <LeadsCounts
                    startDate={appliedDateRange?.[0]?.format("YYYY-MM-DD")}
                    endDate={appliedDateRange?.[1]?.format("YYYY-MM-DD")}
                    counsellor={appliedFilters.counsellor}
                    leadSource={appliedFilters.leadSource}
                    sourceGroup={appliedFilters.sourceGroup}
                    branch={appliedFilters.branch}
                    role={appliedFilters.role}
                />
            </div>


            {/* User status on Follow-up Leads */}
            <div className="mt-6 ">

                <h2 className="text-lg font-semibold text-black dark:text-yellow-500">
                    User status on Follow-up Leads
                </h2>

                <h6 className="text-xs mb-3 text-black dark:text-white">
                    Filters are not applied to this table.
                </h6>

                <UserStatusOnFollowUpLeads
                    startDate={dateRange?.[0]?.format("DD-MM-YYYY")}
                    endDate={dateRange?.[1]?.format("DD-MM-YYYY")}
                    counsellor={counsellor}
                    leadSource={leadSource}
                    branch={appliedFilters.branch}
                    role={appliedFilters.role}
                />
            </div>
            {/* User status on Follow-up Leads */}

        </div>
    );
}

export default LeadFunnel;