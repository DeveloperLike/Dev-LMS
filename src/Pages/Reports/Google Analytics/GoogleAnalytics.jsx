import { useEffect, useState } from "react";
import KpiCard from "./Components/KpiCard";
import UsersChart from "./Components/UsersChart";
import TrafficSourceChart from "./Components/TrafficSourceChart";
import NewVsReturning from "./Components/NewVsReturning";
import TopPagesTable from "./Components/TopPagesTable";
import CountryMap from "./Components/CountryMap";
import DeviceChart from "./Components/DeviceChart";
import { DatePicker } from "antd";
import {
    getOverview,
    getPages,
    getCountries,
    getDevices,
    getSources,
    getDemographics,
} from "./services/gaService";
import { GaChartSectionSkeleton, GaKPISkeleton, GaTableSkeleton, GaThreeCardSkeleton } from "../Facebook Performance/Components/SkeletonLoader";
import AgeChart from "./Components/AgeChart";
import GenderChart from "./Components/GenderChart";
const { RangePicker } = DatePicker;

const GoogleAnalytics = ({ selectedDates, setSelectedDates }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [overviewData, setOverviewData] = useState({});
    const [usersData, setUsersData] = useState([]);
    const [sourcesData, setSourcesData] = useState([]);
    const [devicesData, setDevicesData] = useState([]);
    const [pagesData, setPagesData] = useState([]);
    const [countriesData, setCountriesData] = useState([]);
    const [newVsReturningData, setNewVsReturningData] = useState([]);
    const [ageData, setAgeData] = useState([]);
    const [genderData, setGenderData] = useState([]);
    const safeArray = (data) => (Array.isArray(data) ? data : []);
    const [pagesSummary, setPagesSummary] = useState({});
    const [countryChartData, setCountryChartData] = useState([]);

    const loadAnalyticsData = async () => {
        try {
            if (!selectedDates || selectedDates.length !== 2) {
                setIsLoading(false);
                return;
            }

            setIsLoading(true);

            const requestParams = {
                startDate: selectedDates[0].format("YYYY-MM-DD"),
                endDate: selectedDates[1].format("YYYY-MM-DD"),
            };
            const [
                overviewResponse,
                pagesResponse,
                countriesResponse,
                devicesResponse,
                sourcesResponse,
                demographicsResponse,
            ] = await Promise.all([
                getOverview(requestParams),
                getPages(requestParams),
                getCountries(requestParams),
                getDevices(requestParams),
                getSources(requestParams),
                getDemographics(requestParams),
            ]);

            const demoData = demographicsResponse.data?.data || {};

            const ageArray = safeArray(demoData.age);
            const genderArray = safeArray(demoData.gender);

            const ageMap = {};
            ageArray.forEach((item) => {
                if (!ageMap[item.age]) ageMap[item.age] = 0;
                ageMap[item.age] += item.activeUsers;
            });

            setAgeData(
                Object.keys(ageMap).map((key) => ({
                    name: key,
                    value: ageMap[key],
                }))
            );

            const genderMap = {};
            genderArray.forEach((item) => {
                if (!genderMap[item.gender]) genderMap[item.gender] = 0;
                genderMap[item.gender] += item.activeUsers;
            });

            setGenderData(
                Object.keys(genderMap).map((key) => ({
                    name: key,
                    value: genderMap[key],
                }))
            );

            const overviewArray = safeArray(overviewResponse.data?.data?.data);
            const summary = overviewResponse.data?.data?.summary || {};

            setOverviewData({
                activeUsers: summary.activeUsers || 0,
                newUsers: summary.newUsers || 0,
                totalUsers: summary.totalUsers || 0,
                returningUsers: summary.returningUsers || 0,
                sessions: summary.sessions || 0,
                bounceRate: summary.bounceRate || 0,
                avgSessionDuration: summary.avgSessionDuration || 0,
            });

            const usersChartData = overviewArray.map((item) => ({
                date: item.date,
                activeUsers: Number(item.activeUsers) || 0,
                newUsers: Number(item.newUsers) || 0,
            }));

            setUsersData(usersChartData);

            const sourcesArray = safeArray(sourcesResponse.data?.data?.data);
            const sourcesMap = {};
            sourcesArray.forEach((item) => {
                if (!sourcesMap[item.source]) sourcesMap[item.source] = 0;
                sourcesMap[item.source] += item.activeUsers;
            });

            setSourcesData(
                Object.keys(sourcesMap).map((key) => ({
                    name: key,
                    value: sourcesMap[key],
                }))
            );

            const devicesArray = safeArray(devicesResponse.data?.data?.data);
            const devicesMap = {};
            devicesArray.forEach((item) => {
                if (!devicesMap[item.device]) devicesMap[item.device] = 0;
                devicesMap[item.device] += item.activeUsers;
            });

            setDevicesData(
                Object.keys(devicesMap).map((key) => ({
                    name: key,
                    value: devicesMap[key],
                }))
            );

            const pagesArray = safeArray(pagesResponse.data?.data?.data);
            setPagesData(
                pagesArray.map((page) => ({
                    page: page.page,
                    views: page.views || 0,
                    activeUsers: page.activeUsers || 0,
                    newUsers: page.newUsers || 0,
                    totalUsers: page.totalUsers || 0,
                    sessions: page.sessions || 0,
                    avgSessionDuration: page.avgSessionDuration || "0s",
                }))
            );
            const pagesSummaryData = pagesResponse.data?.data?.summary || {};
            setPagesSummary(pagesSummaryData);

            const countriesArray = safeArray(countriesResponse.data?.data?.data);
            const flatCities = [];

            countriesArray.forEach((country) => {
                if (Array.isArray(country.cities) && country.cities.length > 0) {
                    country.cities.forEach((c) => {
                        flatCities.push({
                            country: country.country,
                            city: c.city || "Unknown",
                            activeUsers: c.activeUsers || 0,
                            newUsers: c.newUsers || 0,
                            totalUsers: c.totalUsers || 0,
                        });
                    });
                } else {
                    flatCities.push({
                        country: country.country,
                        city: "N/A",
                        activeUsers: country.activeUsers || 0,
                    });
                }
            });
            setCountriesData(flatCities);

            const countryMapData = [];
            countriesArray.forEach((country) => {
                countryMapData.push({
                    country: country.country,
                    users: country.activeUsers || 0,
                });
            });
            setCountryChartData(countryMapData);

            setNewVsReturningData([
                { name: "New Users", value: summary.newUsers || 0 },
                { name: "Returning Users", value: summary.returningUsers || 0 },
            ]);
        } catch (error) {
            console.error("Google Analytics Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!selectedDates || selectedDates.length !== 2) return;
        loadAnalyticsData();
    }, [selectedDates]);

    return (
        <div>

            {isLoading ? (
                <>
                    <GaKPISkeleton />
                    <GaChartSectionSkeleton />
                    <GaThreeCardSkeleton />
                    <GaTableSkeleton />
                </>
            ) : (
                <>
                    {/* KPI */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 gap-4">
                        <KpiCard title="New Users" value={overviewData.newUsers} />
                        <KpiCard title="Active Users" value={overviewData.activeUsers} />
                        <KpiCard title="Total Users" value={overviewData.totalUsers} />
                        <KpiCard title="Sessions" value={overviewData.sessions} />
                        <KpiCard title="Bounce Rate" value={overviewData.bounceRate} />
                        <KpiCard title="Avg Duration" value={overviewData.avgSessionDuration} />
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
                        <div className="rounded-xl">
                            <UsersChart data={usersData} />
                        </div>
                        <div className="rounded-xl">
                            <CountryMap data={countryChartData} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
                        <div className="rounded-xl">
                            <TrafficSourceChart data={sourcesData} />
                        </div>
                        <div className="rounded-xl">
                            <DeviceChart data={devicesData} />
                        </div>
                        <div className="rounded-xl">
                            <NewVsReturning data={newVsReturningData} />
                        </div>
                    </div>

                    <div className="flex flex-col xl:flex-row gap-4 mt-6 items-stretch">

                        {/* TABLE */}
                        <div className="xl:w-[67%] w-full">
                            <TopPagesTable
                                data={pagesData}
                                cityData={countriesData}
                                summary={pagesSummary}
                            />
                        </div>

                        {/* CHARTS */}
                        <div className="xl:w-[33%] w-full flex flex-col gap-4 h-full">
                            <div className="flex-1">
                                <AgeChart data={ageData} />
                            </div>
                            <div className="flex-1">
                                <GenderChart data={genderData} />
                            </div>
                        </div>

                    </div>
                </>
            )}

        </div>
    );
};

export default GoogleAnalytics;