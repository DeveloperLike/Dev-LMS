import authenticatedAxiosInstance from "../../lib/AxiosInstance";

const getCallReportService = (params = {}) => {
  return authenticatedAxiosInstance({
    method: "get",
    url: `/api/v1/common/calling-report`,
    params: params,
  });
};

const getCallLogService = (params = {}) => {
  return authenticatedAxiosInstance({
    method: "get",
    url: `/api/v1/common/call-logs`,
    params: params,
  });
};

const getUserDropdown = () => {
  return authenticatedAxiosInstance({
    method: "get",
    url: `/api/v1/user-management/lead-module-user-dropdown`,
  });
};

const getGlobalMqlCountService = (params) => {
  return authenticatedAxiosInstance.get("/api/v1/lead-management/leads", {
    params: {
      ...params,
      interest_count: true,
    },
  });
};

const getGlobalSqlCountService = (params) => {
  return authenticatedAxiosInstance.get("/api/v1/lead-management/leads", {
    params: {
      ...params,
      sql: true,
    },
  });
};

const getGlobalVcCountService = (params) => {
  return authenticatedAxiosInstance.get("/api/v1/lead-management/leads", {
    params: {
      ...params,
      vc_count: true,
    },
  });
};

const getGlobalVisitCountService = (params) => {
  return authenticatedAxiosInstance.get("/api/v1/lead-management/leads", {
    params: {
      ...params,
      visit_count: true,
    },
  });
};

const getLeadSourceDropdownService = () => {
  return authenticatedAxiosInstance.get(
    "/api/v1/lead-management/lead-source-dropdown",
  );
};
const getLeadCounsellorDropdownService = () => {
  return authenticatedAxiosInstance.get(
    "/api/v1/lead-management/counsellor-dropdown",
  );
};

export {
  getLeadCounsellorDropdownService,
  getCallReportService,
  getCallLogService,
  getUserDropdown,
  getGlobalMqlCountService,
  getGlobalVcCountService,
  getGlobalVisitCountService,
  getLeadSourceDropdownService,
  getGlobalSqlCountService,
};
