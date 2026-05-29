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
const getPaymentDashboardService = (params) => {
  return authenticatedAxiosInstance.get('/api/v1/student/payment-dashboard', { params });
};

const retryPaymentService = (data) => {
  return authenticatedAxiosInstance.post(
    "/api/v1/retry-payment",
    data
  );
};
const syncPendingPaymentsService = (transactionId = null) => {
  const url = transactionId
    ? `/api/v1/sync-pending-payments?transaction_id=${transactionId}`
    : `/api/v1/sync-pending-payments`;

  return authenticatedAxiosInstance.get(url);
};

const createBranchCommissionService = (
  data
) => {

  return authenticatedAxiosInstance({
    method: "post",
    url: `/api/v1/branch-commission/create`,
    data,
  });
};


const updateBranchCommissionService = (
  id,
  data
) => {

  return authenticatedAxiosInstance({
    method: "put",
    url: `/api/v1/branch-commission/update/${id}`,
    data,
  });
};

const patchBranchCommissionService = (
  id,
  data
) => {

  return authenticatedAxiosInstance({
    method: "patch",
    url: `/api/v1/branch-commission/patch/${id}`,
    data,
  });
};

const deleteBranchCommissionService = (
  id
) => {

  return authenticatedAxiosInstance({
    method: "delete",
    url: `/api/v1/branch-commission/delete/${id}`,
  });
};
const getAllBranchCommissionService = (
  params = {}
) => {

  return authenticatedAxiosInstance({
    method: "get",
    url: `/api/v1/branch-commission/list`,
    params,
  });
};

const getBranchCommissionByIdService = (
  id
) => {

  return authenticatedAxiosInstance({
    method: "get",
    url: `/api/v1/branch-commission/${id}`,
  });
};
const getTransactionSuggestionsService = (
  params = {}
) => {

  return authenticatedAxiosInstance({
    method: "get",
    url: `/api/v1/suggestions`,
    params,
  });

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
  getPaymentDashboardService,
  retryPaymentService,
  syncPendingPaymentsService,
  createBranchCommissionService,
  updateBranchCommissionService,
  patchBranchCommissionService,
  deleteBranchCommissionService,
  getAllBranchCommissionService,
  getBranchCommissionByIdService, 
  getTransactionSuggestionsService,
};
