import React, { useMemo } from "react";
import { Tabs } from "antd";

import GscPagesTable from "./GscPagesTable";
import GscCountryTable from "./GscCountryTable";
import GscKeywordTable from "./GscKeywordTable";

const GscTabs = ({
    pages,
    countries,
    keywords,
    loading,
    activeTab,
    setActiveTab,
    crmData,
    pageFilter,
    setPageFilter
}) => {

    const items = useMemo(() => [
        {
            key: "pages",
            label: <strong>Pages</strong>,
            children: (
                <GscPagesTable
                    data={pages}
                    crmData={crmData}
                    loading={loading}
                    pageFilter={pageFilter}
                    setPageFilter={setPageFilter}
                />
            ),
        },
        {
            key: "keywords",
            label: <strong>Keywords</strong>,
            children: <GscKeywordTable data={keywords} loading={loading} />,
        },
        {
            key: "countries",
            label: <strong>Countries</strong>,
            children: <GscCountryTable data={countries} loading={loading} />,
        },
    ], [pages, keywords, countries, loading, crmData]);

    return (
        <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={items}
        />
    );
};

export default GscTabs;