import authenticatedAxiosInstance from "../../lib/AxiosInstance";

const getFacebookService = (params = {}) => {
  return authenticatedAxiosInstance({
    method: "get",
    url: "/api/v1/integration/get-linked-facebook-pages",
    params: params,
  });
};

const postFacebookPageListService = (payload) => {
  return authenticatedAxiosInstance({
    method: "post",
    url: "/api/v1/integration/get-all-facebook-pages",
    data: payload,
  });
};

const postLinkFacebookPageListService = (payload) => {
  return authenticatedAxiosInstance({
    method: "post",
    url: "/api/v1/integration/link-facebook-pages",
    data: payload,
  });
};

const postFacebookValidateTokenService = (payload) => {
  return authenticatedAxiosInstance({
    method: "post",
    url: "/api/v1/integration/validate-token",
    data: payload,
  });
};


// facebook ads account api start from here
  const getFacebookAdsService = (params = {}) => {
  return authenticatedAxiosInstance({
    method: "get",
    url: "/api/v1/integration/get-linked-facebook-ad-accounts",
    params: params,
  });
};

const postFacebookAdsAccountListService = (payload) => {
  return authenticatedAxiosInstance({
    method: "post",
    url: "/api/v1/integration/get-all-facebook-ad-accounts",
    data: payload,
  });
};

const postLinkFacebookAccountListService = (payload) => {
  return authenticatedAxiosInstance({
    method: "post",
    url: "/api/v1/integration/link-facebook-ad-accounts",
    data: payload,
  });
};

const postFacebookValidateTokenAdsService = (payload) => {
  return authenticatedAxiosInstance({
    method: "post",
    url: "/api/v1/integration/validate-ad-accounts-token",
    data: payload,
  });
};
// facebook ads account api close from here

const postSyncFacebookLeadsService = (payload) => {
  return authenticatedAxiosInstance({
    method: "post",
    url: "/api/v1/integration/sync-facebook-leads",
    data: payload,
  });
};

const getFacebookLeadsService = (params = {}) => {
  return authenticatedAxiosInstance({
    method: "get",
    url: "/api/v1/integration/get-facebook-leads",
    params: params,
  });
};

const getGoogleAuthUrlService = () => {
  return authenticatedAxiosInstance({
    method: "get",
    url: "/google/auth-url",
  });
};

const postGoogleCallbackService = (payload) => {
  return authenticatedAxiosInstance({
    method: "post",
    url: "/google/callback",
    data: payload,
  });
};

const getGooglePropertiesService = () => {
  return authenticatedAxiosInstance({
    method: "get",
    url: "/google/properties",
  });
};

const getGoogleGscSitesService = () => {
  return authenticatedAxiosInstance({
    method: "get",
    url: "/google/list-gsc-sites",
  });
};

const getGoogleSettingsService = () => {
  return authenticatedAxiosInstance({
    method: "get",
    url: "/google/settings",
  });
};

const postGoogleSettingsService = (payload) => {
  return authenticatedAxiosInstance({
    method: "post",
    url: "/google/settings",
    data: payload,
  });
};

const postToggleFacebookPageService = (payload) => {
  return authenticatedAxiosInstance({
    method: "post",
    url: "/api/v1/integration/toggle-facebook-page",
    data: payload,
  });
};

const postToggleFacebookAdAccountService = (payload) => {
  return authenticatedAxiosInstance({
    method: "post",
    url: "/api/v1/integration/toggle-facebook-ad-account",
    data: payload,
  });
};

const getFacebookPerformanceSettingsService = () => {
  return authenticatedAxiosInstance({
    method: "get",
    url: "/facebook/performance-settings"
  });
};

const postFacebookPerformanceSettingsService = (payload) => {
  return authenticatedAxiosInstance({
    method: "post",
    url: "/facebook/performance-settings",
    data: payload
  });
};

const postSyncFacebookPerformanceService = () => {
  return authenticatedAxiosInstance({
    method: "post",
    url: "/facebook/ad-accounts"
  });
};

const postGetFacebookPerformanceDataService = () => {
  return authenticatedAxiosInstance({
    method: "post",
    url: "/facebook/get-ad-data"
  });
};

export {
  getFacebookService,
  postFacebookPageListService,
  postLinkFacebookPageListService,
  postFacebookValidateTokenService,
  getFacebookAdsService,
  postFacebookAdsAccountListService,
  postLinkFacebookAccountListService,
  postFacebookValidateTokenAdsService,
  postSyncFacebookLeadsService,
  getFacebookLeadsService,
  getGoogleAuthUrlService,
  postGoogleCallbackService,
  getGooglePropertiesService,
  getGoogleGscSitesService,
  getGoogleSettingsService,
  postGoogleSettingsService,
  postToggleFacebookPageService,
  postToggleFacebookAdAccountService,
  getFacebookPerformanceSettingsService,
  postFacebookPerformanceSettingsService,
  postSyncFacebookPerformanceService,
  postGetFacebookPerformanceDataService
};


