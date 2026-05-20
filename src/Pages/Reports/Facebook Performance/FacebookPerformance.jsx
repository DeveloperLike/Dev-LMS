import { useState, useEffect, useMemo } from "react";
import { Spin, Tooltip } from "antd";
import KPIcards from "./Components/KPIcards";
import Filters from "./Components/Filters";
import CampaignTable from "./Components/CampaignTable";
import Charts from "./Components/Charts";

import { fetchDashboardData } from "./Components/facebookService";
import { FaFilter, FaFilterCircleXmark } from "react-icons/fa6";
import { applyFilters } from "./Components/Filters";
import { ChartSkeleton, KPISkeleton, TableSkeleton } from "./Components/SkeletonLoader";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);
dayjs.extend(utc);
dayjs.extend(timezone);

import axios from "axios";
// import { baseurl } from "../../../lib/Constants";
const baseurl = "https://yesgermany.org:8443"; //do not changee real data
const groupData = (data = [], type = "campaign") => {
    const map = {};

    data.forEach((c) => {
        let nameKey = "";

        if (type === "campaign") nameKey = c.name;
        if (type === "adset") nameKey = c.adset_name;
        if (type === "ad") nameKey = c.ad_name;

        const key = `${c.accountId}_${nameKey}`;

        if (!map[key]) {
            map[key] = {
                id: key,
                name: nameKey,
                spend: 0,
                impressions: 0,
                clicks: 0,
                leads: 0,
            };
        }

        map[key].spend += c.spend || 0;
        map[key].impressions += c.impressions || 0;
        map[key].clicks += c.clicks || 0;
        map[key].leads += c.leads || 0;
    });

    return Object.values(map).map((c) => ({
        ...c,
        ctr: c.impressions
            ? Number(((c.clicks / c.impressions) * 100).toFixed(2))
            : 0,
        cpc: c.clicks
            ? Number((c.spend / c.clicks).toFixed(2))
            : 0,
    }));
};

const FacebookPerformance = () => {

    const [activeTab, setActiveTab] = useState("campaign");
    const defaultFilters = {
        startDate: dayjs().subtract(29, "day").format("YYYY-MM-DD"),
        endDate: dayjs().format("YYYY-MM-DD"),
    };

    const [filters, setFilters] = useState(defaultFilters);
    const [tempFilters, setTempFilters] = useState(defaultFilters);
    const [campaigns, setCampaigns] = useState([]);
    const [kpi, setKpi] = useState({});
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [error, setError] = useState(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [crmDateData, setCrmDateData] = useState([]);
    const [crmData, setCrmData] = useState([]);
    const [previousCRMLeads, setPreviousCRMLeads] = useState(0);

    const handleFilterChange = (newFilter) => {
        setTempFilters((prev) => {
            const updated = { ...prev, ...newFilter };

            Object.keys(updated).forEach((key) => {
                if (
                    updated[key] === undefined ||
                    updated[key] === "" ||
                    (Array.isArray(updated[key]) && updated[key].length === 0)
                ) {
                    delete updated[key];
                }
            });

            return { ...updated };
        });
    };

    const getPreviousRange = (startDate, endDate) => {
        const start = dayjs(startDate);
        const end = dayjs(endDate);

        const diff = end.diff(start, "day") + 1;

        const prevEnd = start.subtract(1, "day");
        const prevStart = prevEnd.subtract(diff - 1, "day");

        return { prevStart, prevEnd };
    };

    const getChange = (current, previous, key = "") => {
        if (previous === 0) {
            return current > 0 ? 100 : 0;
        }

        const change = ((current - previous) / previous) * 100;
        if (!isFinite(change)) return 0;

        if (key === "crm_leads") {
            return change;
        }

        return Math.max(Math.min(change, 999), -999);
    };

    useEffect(() => {
        const controller = new AbortController();

        const load = async () => {
            try {
                if (campaigns.length === 0) setLoading(true);
                else setFetching(true);

                const { campaigns: data, kpi } = await fetchDashboardData(
                    filters,
                    controller.signal
                );

                setCampaigns(data);
                setKpi(kpi);
            } catch (err) {
                if (err.name !== "CanceledError") {
                    console.error(err);
                    setError(err);
                }
            } finally {
                setLoading(false);
                setFetching(false);
            }
        };

        load();
    }, [filters]);

    useEffect(() => {
        const fetchCRM = async () => {
            try {
                let conditions = [];

                const startUTC = dayjs(filters.startDate)
                    .tz("Asia/Kolkata")
                    .startOf("day")
                    .utc()
                    .format("YYYY-MM-DD HH:mm:ss");

                const endUTC = dayjs(filters.endDate)
                    .tz("Asia/Kolkata")
                    .endOf("day")
                    .utc()
                    .format("YYYY-MM-DD HH:mm:ss");

                conditions.push(`
                lml.created_at BETWEEN 
                '${startUTC}'
                AND '${endUTC}'
            `);

                if (filters.counsellor?.length) {
                    const values = filters.counsellor.map(u => `'${u}'`).join(",");
                    conditions.push(`lml.assign_to_id IN (${values})`);
                }

                if (filters.branch?.length) {
                    const values = filters.branch.map(b => `'${b}'`).join(",");
                    conditions.push(`
                    lml.assign_to_id IN (
                        SELECT user_id 
                        FROM user_management_user_branch
                        WHERE branch_id IN (${values})
                    )
                `);
                }

                if (filters.sourceGroup?.length) {
                    const values = filters.sourceGroup.map(g => `'${g}'`).join(",");
                    conditions.push(`
                    lml.lead_source_id IN (
                        SELECT id 
                        FROM lead_management_leadsource
                        WHERE source_group IN (${values})
                        AND LOWER(name) = 'facebook'
                    )
                `);
                }

                const whereClause = conditions.length
                    ? `AND ${conditions.join(" AND ")}`
                    : "";

                let groupField = "bl.campaign";

                if (activeTab === "adset") {
                    groupField = "bl.adset_name";
                } else if (activeTab === "ad") {
                    groupField = "bl.ad_name";
                }

                const res = await axios.post(
                    baseurl + "/mondayMeetings/get-crm-records",
                    {
                        query: `
                       SELECT
                           COALESCE(
                               NULLIF(LOWER(TRIM(${groupField})), ''),
                               'others'
                           ) AS name,
                       
                           COUNT(DISTINCT bl.id) AS total_lead
                       
                       FROM (
                       
                           SELECT DISTINCT ON (lml.id)
                               lml.id,
                               lml.campaign,
                               lml.adset_name,
                               lml.ad_name,
                               lml.assign_to_id
                       
                           FROM lead_management_lead lml
                       
                           WHERE 1=1
                           ${whereClause}
                       
                           AND lml.assign_to_id IS NOT NULL
                       
                           AND lml.lead_source_id IN (
                               SELECT id
                               FROM lead_management_leadsource
                               WHERE LOWER(name) = 'facebook'
                           )
                       
                           ORDER BY lml.id
                       
                       ) bl
                       
                       GROUP BY COALESCE(
                           NULLIF(LOWER(TRIM(${groupField})), ''),
                           'others'
                       )
                       
                       ORDER BY total_lead DESC;
                    `,
                    }
                );

                const result =
                    Array.isArray(res?.data)
                        ? res.data
                        : res?.data?.data || [];

                setCrmData(result);

            } catch (err) {
                console.error("CRM Fetch Error:", err);
            }
        };

        fetchCRM();
    }, [filters, activeTab]);

    useEffect(() => {
        const fetchCRMByDate = async () => {
            try {
                let conditions = [];

                const startUTC = dayjs(filters.startDate)
                    .tz("Asia/Kolkata")
                    .startOf("day")
                    .utc()
                    .format("YYYY-MM-DD HH:mm:ss");

                const endUTC = dayjs(filters.endDate)
                    .tz("Asia/Kolkata")
                    .endOf("day")
                    .utc()
                    .format("YYYY-MM-DD HH:mm:ss");

                conditions.push(`
                  lml.created_at BETWEEN '${startUTC}' AND '${endUTC}'
              `);

                if (filters.counsellor?.length) {
                    const values = filters.counsellor.map(u => `'${u}'`).join(",");
                    conditions.push(`lml.assign_to_id IN (${values})`);
                }
                if (filters.branch?.length) {
                    const values = filters.branch.map(b => `'${b}'`).join(",");
                    conditions.push(`
                      lml.assign_to_id IN (
                          SELECT user_id 
                          FROM user_management_user_branch
                          WHERE branch_id IN (${values})
                      )
                  `);
                }

                if (filters.sourceGroup?.length) {
                    const values = filters.sourceGroup.map(g => `'${g}'`).join(",");
                    conditions.push(`
                      lml.lead_source_id IN (
                          SELECT id 
                          FROM lead_management_leadsource
                          WHERE source_group IN (${values})
                          AND LOWER(name) = 'facebook'
                      )
                  `);
                }

                const whereClause = conditions.length
                    ? `WHERE ${conditions.join(" AND ")}`
                    : "";

                const res = await axios.post(
                    baseurl + "/mondayMeetings/get-crm-records",
                    {
                        query: `
                          SELECT
                              DATE(lml.created_at) AS date,
                              COUNT(DISTINCT lml.id) AS total_lead
                          FROM lead_management_lead lml
                          ${whereClause} 
                          AND lml.assign_to_id IS NOT NULL
                          
                          AND lml.lead_source_id IN (
                              SELECT id
                              FROM lead_management_leadsource
                              WHERE LOWER(name) = 'facebook'
                          )
                          GROUP BY DATE(lml.created_at)
                          ORDER BY date;
                      `,
                    }
                );

                const result =
                    Array.isArray(res?.data)
                        ? res.data
                        : res?.data?.data || [];

                setCrmDateData(result);

            } catch (err) {
                console.error("CRM Date Fetch Error:", err);
            }
        };

        fetchCRMByDate();
    }, [filters]);

    useEffect(() => {
        const fetchPreviousCRM = async () => {
            try {
                const { prevStart, prevEnd } = getPreviousRange(
                    filters.startDate,
                    filters.endDate
                );

                const prevStartUTC = dayjs(prevStart)
                    .tz("Asia/Kolkata")
                    .startOf("day")
                    .utc()
                    .format("YYYY-MM-DD HH:mm:ss");

                const prevEndUTC = dayjs(prevEnd)
                    .tz("Asia/Kolkata")
                    .endOf("day")
                    .utc()
                    .format("YYYY-MM-DD HH:mm:ss");

                const res = await axios.post(
                    baseurl + "/mondayMeetings/get-crm-records",
                    {
                        query: `
                            SELECT 
                                COUNT(DISTINCT lml.id) AS total_lead
                            
                            FROM lead_management_lead lml
                            
                            WHERE lml.created_at BETWEEN '${prevStartUTC}' AND '${prevEndUTC}'
                            
                            AND lml.assign_to_id IS NOT NULL
                            
                            AND lml.lead_source_id IN (
                                SELECT id
                                FROM lead_management_leadsource
                                WHERE LOWER(name) = 'facebook'
                            )
                        `,
                    }
                );

                const value =
                    Array.isArray(res?.data)
                        ? res.data[0]?.total_lead
                        : res?.data?.data?.[0]?.total_lead;

                setPreviousCRMLeads(value || 0);

            } catch (err) {
                console.error("Previous CRM Fetch Error:", err);
            }
        };

        fetchPreviousCRM();
    }, [filters]);

    const filteredCampaigns = useMemo(() => {
        return applyFilters(campaigns, filters);
    }, [campaigns, filters]);

    const { prevStart, prevEnd } = getPreviousRange(
        filters.startDate,
        filters.endDate
    );

    const previousCampaigns = useMemo(() => {
        return campaigns.filter((c) =>
            dayjs(c.date).isBetween(prevStart, prevEnd, null, "[]")
        );
    }, [campaigns, prevStart, prevEnd]);

    const groupedFilteredCampaigns = useMemo(() => {
        return groupData(filteredCampaigns, activeTab)
            .sort((a, b) => (b.spend || 0) - (a.spend || 0));
    }, [filteredCampaigns, activeTab]);

    const normalize = (str) =>
        (str || "")
            .toLowerCase()
            .trim()
            .replace(/\s+/g, " ");

    const crmMap = useMemo(() => {
        const map = {};

        crmData.forEach((item) => {

            const key = normalize(item.name);

            map[key] =
                (map[key] || 0) +
                Number(item.total_lead || 0);

        });

        return map;

    }, [crmData]);

    const crmDateMap = useMemo(() => {
        const map = {};

        crmDateData.forEach((d) => {
            const key = dayjs(d.date).tz("Asia/Kolkata").format("YYYY-MM-DD");
            map[key] = d.total_lead || 0;
        });

        return map;
    }, [crmDateData]);

    const groupedFilteredCampaignsWithCRM = useMemo(() => {

        return groupedFilteredCampaigns.map((c) => {

            const key = normalize(c.name);

            const crmLeads = Number(crmMap[key] || 0);

            return {
                ...c,

                crm_leads: crmLeads,

                cpcl: crmLeads
                    ? Number(
                        (Number(c.spend || 0) / crmLeads).toFixed(2)
                    )
                    : 0,
            };

        });

    }, [groupedFilteredCampaigns, crmMap]);

    const previousKPI = useMemo(() => {
        const totals = previousCampaigns.reduce(
            (acc, c) => {
                acc.spend += Number(c.spend || 0);
                acc.impressions += Number(c.impressions || 0);
                acc.clicks += Number(c.clicks || 0);
                acc.leads += Number(c.leads || 0);
                return acc;
            },
            { spend: 0, impressions: 0, clicks: 0, leads: 0 }
        );

        return {
            ...totals,
            ctr: totals.impressions
                ? (totals.clicks / totals.impressions) * 100
                : 0,
            cpc: totals.clicks ? totals.spend / totals.clicks : 0,
        };
    }, [previousCampaigns]);

    const finalKPI = useMemo(() => {

        const totals = groupedFilteredCampaignsWithCRM.reduce(
            (acc, c) => {
                acc.spend += Number(c.spend || 0);
                acc.impressions += Number(c.impressions || 0);
                acc.clicks += Number(c.clicks || 0);
                acc.leads += Number(c.leads || 0);
                return acc;
            },
            {
                spend: 0,
                impressions: 0,
                clicks: 0,
                leads: 0,
            }
        );

        const totalCRMLeads = crmData.reduce(
            (sum, item) => sum + Number(item.total_lead || 0),
            0
        );

        // console.group("📊 FACEBOOK KPI DEBUG");

        // console.group("🟢 CURRENT TOTALS");
        // console.table({
        //     Spend: totals.spend,
        //     Leads: totals.leads,

        //     CRM_Leads_From_SQL: totalCRMLeads,

        //     CPCL: totalCRMLeads
        //         ? Number((totals.spend / totalCRMLeads).toFixed(2))
        //         : 0,
        // });
        // console.groupEnd();

        // console.group("🔵 PREVIOUS TOTALS");
        // console.table({
        //     Previous_Spend: previousKPI.spend,
        //     Previous_Leads: previousKPI.leads,
        //     Previous_CRM_Leads: previousCRMLeads,

        //     Previous_CPCL: previousCRMLeads
        //         ? Number((previousKPI.spend / previousCRMLeads).toFixed(2))
        //         : 0,
        // });
        // console.groupEnd();

        // console.group("🟠 CHANGE VALUES");
        // console.table({
        //     CRM_Leads_Change: getChange(
        //         totalCRMLeads,
        //         previousCRMLeads,
        //         "crm_leads"
        //     ),

        //     CPCL_Change: getChange(
        //         totalCRMLeads
        //             ? totals.spend / totalCRMLeads
        //             : 0,

        //         previousCRMLeads
        //             ? previousKPI.spend / previousCRMLeads
        //             : 0
        //     ),
        // });
        // console.groupEnd();

        // console.groupEnd();

        return {
            ...totals,

            crm_leads: totalCRMLeads,

            ctr: totals.impressions
                ? Number(((totals.clicks / totals.impressions) * 100).toFixed(2))
                : 0,

            cpc: totals.clicks
                ? Number((totals.spend / totals.clicks).toFixed(2))
                : 0,

            cpcl: totalCRMLeads
                ? Number((totals.spend / totalCRMLeads).toFixed(2))
                : 0,

            change: {
                spend: getChange(totals.spend, previousKPI.spend),

                impressions: getChange(
                    totals.impressions,
                    previousKPI.impressions
                ),

                clicks: getChange(
                    totals.clicks,
                    previousKPI.clicks
                ),

                leads: getChange(
                    totals.leads,
                    previousKPI.leads
                ),

                ctr: getChange(
                    totals.impressions
                        ? (totals.clicks / totals.impressions) * 100
                        : 0,

                    previousKPI.ctr
                ),

                cpc: getChange(
                    totals.clicks
                        ? totals.spend / totals.clicks
                        : 0,

                    previousKPI.cpc
                ),

                crm_leads: getChange(
                    totalCRMLeads,
                    previousCRMLeads,
                    "crm_leads"
                ),

                cpcl: getChange(
                    totalCRMLeads
                        ? totals.spend / totalCRMLeads
                        : 0,

                    previousCRMLeads
                        ? previousKPI.spend / previousCRMLeads
                        : 0
                )
            }
        };

    }, [
        groupedFilteredCampaignsWithCRM,
        crmData,
        previousKPI,
        previousCRMLeads
    ]);

    if (error) {
        return (
            <div className="p-6">
                <h2 className="text-red-400 text-lg font-semibold">
                    Error loading dashboard
                </h2>
                <p className="text-gray-400">
                    Please check backend or API connection.
                </p>
            </div>
        );
    }

    const sparklineData = useMemo(() => {
        const map = {};

        // ================= FACEBOOK DATA =================
        filteredCampaigns.forEach((c) => {
            if (!c.date) return;

            const key = dayjs(c.date)
                .tz("Asia/Kolkata")
                .format("YYYY-MM-DD");

            if (!map[key]) {
                map[key] = {
                    date: key,
                    spend: 0,
                    impressions: 0,
                    clicks: 0,
                    leads: 0
                };
            }

            map[key].spend += Number(c.spend || 0);
            map[key].impressions += Number(c.impressions || 0);
            map[key].clicks += Number(c.clicks || 0);
            map[key].leads += Number(c.leads || 0);
        });

        // ================= FINAL MERGE =================
        const data = Object.values(map)
            .sort((a, b) => a.date.localeCompare(b.date))
            .map((d) => {
                const crm = crmDateMap[d.date] || 0;

                return {
                    ...d,
                    crm_leads: crm,

                    ctr: d.impressions
                        ? (d.clicks / d.impressions) * 100
                        : 0,

                    cpc: d.clicks
                        ? d.spend / d.clicks
                        : 0,

                    cpcl: d.leads
                        ? d.spend / d.leads
                        : 0
                };
            });

        // ================= SINGLE DAY FIX =================
        if (data.length === 1) {
            return [data[0], data[0]];
        }

        return data;

    }, [filteredCampaigns, crmDateMap]);

    return (
        <div className="mx-6">
            <div className="flex items-center justify-between mb-3 pt-1">
                <div className="flex items-center gap-3">
                    <h1 className="mt-4 dark:text-yellow-500 text-black font-semibold text-xl">
                        Facebook Dashboard
                    </h1>

                    {fetching && (
                        <div className="mt-4 flex items-center gap-2 text-sm text-gray-400">
                            <span>Updating...</span>
                            <Spin size="small" />
                        </div>
                    )}
                </div>

                <Tooltip title="Filters">
                    <button
                        className="text-lg text-black dark:text-white hover:text-yellow-400 transition"
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                    >
                        {isFilterOpen ? <FaFilterCircleXmark /> : <FaFilter />}
                    </button>
                </Tooltip>
            </div>

            {isFilterOpen && (
                <Filters
                    onFilterChange={handleFilterChange}
                    onSearch={() => setFilters(tempFilters)}
                    onReset={() => {
                        setTempFilters(defaultFilters);
                        setFilters(defaultFilters);
                    }}
                    campaigns={campaigns}
                    filters={tempFilters}
                />
            )}

            {loading ? (
                <>
                    <div className="dark:bg-[#24303f] bg-white p-4 rounded-xl shadow mt-4">
                        <KPISkeleton />
                    </div>

                    <div className="mt-6">
                        <ChartSkeleton />
                    </div>

                    <div className="mt-6">
                        <TableSkeleton />
                    </div>
                </>
            ) : (
                <>
                    <KPIcards
                        kpi={finalKPI}
                        loading={loading}
                        sparklineData={sparklineData}
                        currentRange={{
                            start: filters.startDate,
                            end: filters.endDate
                        }}
                        previousRange={{
                            start: prevStart.format("YYYY-MM-DD"),
                            end: prevEnd.format("YYYY-MM-DD")
                        }}
                    />

                    {campaigns.length > 0 && (
                        <Charts campaigns={filteredCampaigns} loading={loading} filters={filters} />
                    )}

                    <div className="mt-6">
                        {/* <h2 className="text-lg font-semibold text-black dark:text-yellow-500">
                            Campaign Table
                        </h2> */}
                        <CampaignTable
                            campaigns={groupedFilteredCampaignsWithCRM}
                            loading={loading}
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default FacebookPerformance;