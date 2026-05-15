import React, { useEffect, useState } from "react";
import { FunnelChart } from "react-funnel-pipeline";
import "react-funnel-pipeline/dist/index.css";
import { getFunnelAnalyticsService } from "./ApiService";
import LoadSkeleton from "../../Components/CustomComponents/Skeleton";

const FunnelAnalytics = () => {
  const [funnelData, setFunnelData] = useState(null);
  const [legendData, setLegendData] = useState([]);

  const funnelAnalyticsApi = () => {
    getFunnelAnalyticsService().then((response) => {
      if (response?.data?.data && Array.isArray(response.data.data)) {
        const processedData = response.data.data
          .map((item) => ({
            name: item.lead_status,
            value: item.lead_count,
          }))
          .sort((a, b) => b.value - a.value);

        setFunnelData(processedData);
        setLegendData(processedData.map((item, index) => ({
          name: item.name,
          value: item.value,
          color: `hsl(${index * 60}, 80%, 50%)`,
        })));
      } else {
        console.error("API response data is invalid:", response);
        setFunnelData([]);
        setLegendData([]);
      }
    });
  };

  useEffect(() => {
    funnelAnalyticsApi();
  }, []);

  return (
    <div style={{ display: "flex" }}>
      <div style={{ width: "400px", height: "500px" }}>
        {funnelData ? (
          funnelData.length > 0 ? (
            <FunnelChart
              data={funnelData}
              onSliceClick={(data, index, colors) => {
                console.log("Slice Clicked:", data, index, colors?.[index]);
              }}
            />
          ) : (
            <div>No Funnel Data Available</div>
          )
        ) : (
          <div><LoadSkeleton /></div>
        )}
      </div>
      {funnelData && funnelData.length > 0 && (
        <div style={{ marginLeft: "100px" }}>
          <h3><strong className="uppercase">Lead Status</strong></h3><br />
          {legendData.map((item) => (
            <div key={item.name} style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
              <div
                style={{
                  width: "15px",
                  height: "15px",
                  backgroundColor: item.color,
                  marginRight: "10px",
                }}
              />
              <div>{item.name}: {item.value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FunnelAnalytics;