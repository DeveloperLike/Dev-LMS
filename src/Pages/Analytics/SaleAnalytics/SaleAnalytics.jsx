import React from "react";
import PackagesSoldByStaff from "./PackagesSoldByStaff";
import AmountSoldPackages from "./AmountSoldPackages";

const SaleAnalyticsChart = () => {

  return (
    <>
    <PackagesSoldByStaff/>
    <br />
    <AmountSoldPackages/>
    </>
  );
};

export default SaleAnalyticsChart;