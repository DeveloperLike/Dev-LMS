import { Row, Col, DatePicker, Select, Button } from "antd";
import { useMemo } from "react";
import dayjs from "dayjs";
import { PrimaryButton } from "../../../../Components/CustomComponents/ButtonUi";

const { RangePicker } = DatePicker;

export const applyFilters = (campaigns = [], filters = {}) => {
    let filtered = [...campaigns];

    if (filters.account && filters.account.length > 0) {
        filtered = filtered.filter((c) =>
            filters.account.includes(c.accountName)
        );
    }

    if (filters.campaign && filters.campaign.length > 0) {
        filtered = filtered.filter((c) =>
            filters.campaign.includes(c.name)
        );
    }

    if (filters.adset && filters.adset.length > 0) {
        filtered = filtered.filter((c) =>
            filters.adset.includes(c.adset_name)
        );
    }

    if (filters.ad && filters.ad.length > 0) {
        filtered = filtered.filter((c) =>
            filters.ad.includes(c.ad_name)
        );
    }

    if (filters.startDate && filters.endDate) {
        filtered = filtered.filter((c) => {
            if (!c.date) return false;
            return (
                c.date >= filters.startDate &&
                c.date <= filters.endDate
            );
        });
    }

    return filtered;
};

const Filters = ({ onFilterChange, onSearch, onReset, campaigns = [], filters = {} }) => {

    const getRangePresets = () => [
        { label: "Today", value: [dayjs(), dayjs()] },
        { label: "Yesterday", value: [dayjs().subtract(1, "day"), dayjs().subtract(1, "day")] },
        { label: "Last 7 Days", value: [dayjs().subtract(7, "day"), dayjs()] },
        { label: "Last 14 Days", value: [dayjs().subtract(14, "day"), dayjs()] },
        { label: "Last 30 Days", value: [dayjs().subtract(30, "day"), dayjs()] },
        { label: "Last 60 Days", value: [dayjs().subtract(60, "day"), dayjs()] },
        { label: "Last 90 Days", value: [dayjs().subtract(90, "day"), dayjs()] },
    ];
    const presets = useMemo(() => getRangePresets(), []);

    const campaignOptions = useMemo(() => {
        if (!Array.isArray(campaigns)) return [];

        let filteredCampaigns = campaigns;

        if (filters.account && filters.account.length > 0) {
            filteredCampaigns = campaigns.filter((c) =>
                filters.account.includes(c.accountName)
            );
        }

        const unique = [
            ...new Set(filteredCampaigns.map((c) => c.name).filter(Boolean)),
        ];

        return unique.map((name) => ({
            value: name,
            label: name,
        }));
    }, [campaigns, filters]);

    const adsetOptions = useMemo(() => {
        if (!Array.isArray(campaigns)) return [];

        let filteredData = campaigns;

        if (filters.campaign?.length) {
            filteredData = filteredData.filter((c) =>
                filters.campaign.includes(c.name)
            );
        }

        const unique = [
            ...new Set(filteredData.map((c) => c.adset_name).filter(Boolean)),
        ];

        return unique.map((name) => ({
            value: name,
            label: name,
        }));
    }, [campaigns, filters]);

    const adOptions = useMemo(() => {
        if (!Array.isArray(campaigns)) return [];

        let filteredData = campaigns;

        if (filters.adset?.length) {
            filteredData = filteredData.filter((c) =>
                filters.adset.includes(c.adset_name)
            );
        }

        const unique = [
            ...new Set(filteredData.map((c) => c.ad_name).filter(Boolean)),
        ];

        return unique.map((name) => ({
            value: name,
            label: name,
        }));
    }, [campaigns, filters]);

    const accountOptions = useMemo(() => {
        if (!Array.isArray(campaigns)) return [];

        const unique = [
            ...new Set(campaigns.map((c) => c.accountName).filter(Boolean)),
        ];

        return unique.map((name) => ({
            value: name,
            label: name,
        }));
    }, [campaigns]);

    const handleReset = () => {
        onFilterChange({
            startDate: null,
            endDate: null,
            account: null,
            campaign: null,
            adset: null,
            ad: null,
        });
    };

    return (
        <div className="rounded-xl bg-white dark:bg-[#24303f] p-5 shadow w-full">

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">

                {/* Ad Account */}
                <div className="flex flex-col w-full">
                    <label>Ad Account</label>
                    <Select
                        size="large"
                        mode="multiple"
                        placeholder="Select Account"
                        className="w-full"
                        allowClear
                        showSearch
                        value={filters.account || []}
                        onChange={(value) => {
                            onFilterChange({
                                account: value?.length ? value : null,
                            });
                        }}
                        options={accountOptions}
                    />
                </div>

                {/* Campaign */}
                <div className="flex flex-col w-full">
                    <label>Campaign</label>
                    <Select
                        size="large"
                        mode="multiple"
                        placeholder="Select Campaign"
                        className="w-full"
                        allowClear
                        showSearch
                        value={filters.campaign || []}
                        onChange={(value) => {
                            onFilterChange({
                                campaign: value?.length ? value : null,
                            });
                        }}
                        options={campaignOptions}
                    />
                </div>

                {/* Ad Set Name */}
                <div className="flex flex-col w-full">
                    <label>Ad Set Name</label>
                    <Select
                        size="large"
                        mode="multiple"
                        placeholder="Select Ad Set"
                        allowClear
                        showSearch
                        value={filters.adset || []}
                        onChange={(value) => {
                            onFilterChange({
                                adset: value?.length ? value : null,
                            });
                        }}
                        options={adsetOptions}
                    />
                </div>

                {/* Ad Name */}
                <div className="flex flex-col w-full">
                    <label>Ad Name</label>
                    <Select
                        size="large"
                        mode="multiple"
                        placeholder="Select Ad"
                        allowClear
                        showSearch
                        value={filters.ad || []}
                        onChange={(value) => {
                            onFilterChange({
                                ad: value?.length ? value : null,
                            });
                        }}
                        options={adOptions}
                    />
                </div>

                {/* Date Range */}
                <div className="flex flex-col w-full">
                    <label>Date Range</label>
                    <RangePicker
                        size="large"
                        className="w-full"
                        format="YYYY-MM-DD"
                        presets={presets}
                        value={
                            filters.startDate && filters.endDate
                                ? [dayjs(filters.startDate), dayjs(filters.endDate)]
                                : null
                        }
                        onChange={(dates) => {
                            if (!dates) {
                                onFilterChange({
                                    startDate: null,
                                    endDate: null,
                                });
                                return;
                            }
                            onFilterChange({
                                startDate: dates[0].format("YYYY-MM-DD"),
                                endDate: dates[1].format("YYYY-MM-DD"),
                            });
                        }}
                    />
                </div>

                {/* Buttons */}
                <div className="flex gap-3 w-full lg:justify-start">
                    <PrimaryButton
                        size="large"
                        type="primary"
                        title="Search"
                        className="text-black"
                        onClick={onSearch}
                    />
                    <PrimaryButton
                        size="large"
                        title="Reset"
                        onClick={onReset}
                    />
                </div>

            </div>
        </div>
    );
};

export default Filters;