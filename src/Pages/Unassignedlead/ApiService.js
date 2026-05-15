import authenticatedAxiosInstance from "../../lib/AxiosInstance";

const getUnassignedLeadService = (params = {}) => {
  return authenticatedAxiosInstance({
    method: 'get',
    url: `/api/v1/lead-management/unassigned-leads`,
    params: params,
  });
};

const assignMultipleLeadService = (payload) => {
  return authenticatedAxiosInstance({
    method: 'post',
    url: `/api/v1/lead-management/assign-multiple-leads`,
    data: payload,
  });
};

export { getUnassignedLeadService, assignMultipleLeadService }
