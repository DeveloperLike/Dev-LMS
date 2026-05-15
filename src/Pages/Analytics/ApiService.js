import authenticatedAxiosInstance from "../../lib/AxiosInstance";

const getAnalysisByCityService = (payload) => {
  return authenticatedAxiosInstance({
    method: "post",
    url: `/api/v1/lead-management/city-analytics`,
    data: payload,
  });
};

const getAnalysisByCampaignervice = (payload) => {
  return authenticatedAxiosInstance({
    method: "post",
    url: `/api/v1/lead-management/campaign-analytics`,
    data: payload,
  });
};

const getAnalysisBycounsellorsService = () => {
  return authenticatedAxiosInstance({
    method: "get",
    url: `/api/v1/lead-management/lead-counsellors`,
  });
};

const getAnalysisByStateService = (payload) => {
  return authenticatedAxiosInstance({
    method: "post",
    url: `/api/v1/lead-management/state-analytics`,
    data: payload,
  });
};

const getAnalysisBySourceLeadService = (payload) => {
  return authenticatedAxiosInstance({
    method: "post",
    url: `/api/v1/lead-management/lead-source-analytics`,
    data: payload,
  });
};

const getFunnelAnalyticsService = (params = {}) => {
  return authenticatedAxiosInstance({
    method: 'get',
    url: '/api/v1/lead-management/lead-status-funnel',
    params: params,
  });
};


const getSalesPackagesAnalyticsService = (payload) => {
  return authenticatedAxiosInstance({
    method: 'post',
    url: '/api/v1/lead-management/packages-by-staff',
    data: payload,
  });
};
const getSalesPackagesAmountAnalyticsService = (payload) => {
  return authenticatedAxiosInstance({
    method: 'post',
    url: '/api/v1/lead-management/packages-amountby-staff',
    data: payload,
  });
};

export {
  getAnalysisByCityService,
  getAnalysisByStateService,
  getAnalysisBySourceLeadService,
  getFunnelAnalyticsService,
  getSalesPackagesAnalyticsService,
  getSalesPackagesAmountAnalyticsService,
  getAnalysisBycounsellorsService,
  getAnalysisByCampaignervice
};
