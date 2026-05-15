import { useRef, useState, useEffect } from "react";
import GscKpiCards from "./Components/GscKpiCards";
import GscChart from "./Components/GscChart";
import GscTabs from "./Components/GscTabs";
import GscDeviceChart from "./Components/GscDeviceChart";
import GscTopCountries from "./Components/GscTopCountries";
import dayjs from "dayjs";
import { getPageWiseLeadQuery } from "./Queries/query";
import axios from "axios";
import GoogleAnalytics from "../Google Analytics/GoogleAnalytics";

import {
    GscKPISkeleton,
    GscChartSectionSkeleton,
    GscTableSectionSkeleton,
} from "../Facebook Performance/Components/SkeletonLoader";

import {
    getOverview,
    getPages,
    getGeoDevice,
    getQueries,
} from "./services/gscService";
import DashboardHeader from "../DashboardHeader";

const GoogleSearchConsole = () => {
    const [gscDateRange, setGscDateRange] = useState([
        dayjs().subtract(30, "day"),
        dayjs(),
    ]);

    const [gaDateRange, setGaDateRange] = useState([
        dayjs().subtract(30, "day"),
        dayjs(),
    ]);
    const [overview, setOverview] = useState({});
    const [pages, setPages] = useState([]);
    const [countries, setCountries] = useState([]);
    const [devices, setDevices] = useState([]);
    const [keywords, setKeywords] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("pages");
    const [crmData, setCrmData] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [pageFilter, setPageFilter] = useState("");
    const [mainTab, setMainTab] = useState("gsc");

    const getSafeParams = (range) => {
        if (!range || range.length !== 2) return null;

        let [start, end] = range;

        if (!start?.isValid?.() || !end?.isValid?.()) return null;

        return {
            startDate: start.startOf("day").format("YYYY-MM-DD"),
            endDate: end.endOf("day").format("YYYY-MM-DD"),
        };
    };


    const processData = (o, p, geo, q) => {
        const overviewData = o.data || {};

        setOverview({
            clicks: overviewData.summary?.totalClicks || 0,
            impressions: overviewData.summary?.totalImpressions || 0,
            ctrPercent: overviewData.summary?.avgCTR || 0,
            position:
                overviewData.daily?.length
                    ? (
                        overviewData.daily.reduce(
                            (sum, d) => sum + (d.position || 0),
                            0
                        ) / overviewData.daily.length
                    ).toFixed(2)
                    : 0,
        });

        setChartData(overviewData.daily || []);
        setDevices(geo?.data?.devices || []);
        setCountries(geo?.data?.countries || []);

        const pagesData =
            p?.data?.data ||
            p?.data?.pages ||
            p?.data ||
            [];

        setPages(Array.isArray(pagesData) ? pagesData : []);

        const keywordData =
            q?.data?.data ||
            q?.data?.queries ||
            q?.data ||
            [];

        setKeywords(Array.isArray(keywordData) ? keywordData : []);
    };

    const fetchData = async () => {
        try {
            setLoading(true);

            const params = getSafeParams(gscDateRange);

            if (!params) {
                console.warn("Invalid date range");
                return;
            }

            const [o, p, geo, q] = await Promise.all([
                getOverview(params),
                getPages(params),
                getGeoDevice(params),
                getQueries(params),
            ]);

            processData(o, p, geo, q);

        } catch (err) {
            console.error("API failed:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (mainTab !== "gsc") return;
        const fetchCRM = async () => {
            try {
                const params = getSafeParams(gscDateRange);

                let whereClause = "";

                if (params) {
                    whereClause = `
                    WHERE created_at BETWEEN 
                    '${params.startDate} 00:00:00'
                    AND '${params.endDate} 23:59:59'
                `;
                }

                const query = getPageWiseLeadQuery({ whereClause });

                const res = await axios.post(
                    baseurl + "/mondayMeetings/get-crm-records",
                    { query }
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
    }, [gscDateRange, mainTab]);

    useEffect(() => {
        if (mainTab === "gsc") {
            fetchData();
        }
    }, [gscDateRange, mainTab]);

    return (
        <div className="p-2 sm:p-3 md:p-4 space-y-4">
            <DashboardHeader
                activeTab={mainTab}
                setActiveTab={setMainTab}
                dates={mainTab === "ga" ? gaDateRange : gscDateRange}
                setDates={mainTab === "ga" ? setGaDateRange : setGscDateRange}
                showDate={true}
            />
            {mainTab === "ga" ? (
                <GoogleAnalytics
                    selectedDates={gaDateRange}
                    setSelectedDates={setGaDateRange}
                />
            ) : (
                <>
                    {loading ? (
                        <>
                            <GscKPISkeleton />
                            <GscChartSectionSkeleton />
                            <GscTableSectionSkeleton />
                        </>
                    ) : (
                        <>
                            <GscKpiCards data={overview} />

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-4">
                                <div className="md:col-span-1 xl:col-span-8">

                                    <div className="rounded-xl h-[260px] sm:h-[320px] md:h-[340px] xl:h-[360px] flex flex-col bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                                        <div className="p-4">
                                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                                Performance Over Time
                                            </h3>
                                        </div>

                                        <div className="flex-1 min-h-0">
                                            <GscChart data={chartData} />
                                        </div>
                                    </div>
                                </div>

                                <div className="md:col-span-1 xl:col-span-4 flex">
                                    <div className="w-full min-h-[260px] h-full">
                                        <GscDeviceChart data={devices} />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-4">
                                <div className="md:col-span-2 xl:col-span-8">
                                    <GscTabs
                                        pages={pages}
                                        countries={countries}
                                        keywords={keywords}
                                        loading={loading}
                                        activeTab={activeTab}
                                        setActiveTab={setActiveTab}
                                        crmData={crmData}
                                        pageFilter={pageFilter}
                                        setPageFilter={setPageFilter}
                                    />
                                </div>

                                <div className="md:col-span-2 xl:col-span-4">
                                    <GscTopCountries
                                        data={countries}
                                        onViewAll={() => setActiveTab("countries")}
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </>
            )}

        </div>
    );
};

export default GoogleSearchConsole;