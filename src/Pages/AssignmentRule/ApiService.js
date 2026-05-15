import authenticatedAxiosInstance from '../../lib/AxiosInstance';

// GET all rules
export const getAssignmentRuleService = (params = {}) => {
  return authenticatedAxiosInstance({
    method: 'get',
    url: '/api/v1/crm-tar/rules',
    params: params,
  });
};

// POST save rule (create or update based on uid)
export const saveAssignmentRuleService = (payload) => {
  return authenticatedAxiosInstance({
    method: 'post',
    url: '/api/v1/crm-tar/save-rule',
    data: payload,
  });
};

// PATCH change status
export const patchAssignmentRuleService = (status, uid) => {
  return authenticatedAxiosInstance({
    method: 'patch',
    url: '/api/v1/crm-tar/change-status',
    data: { uid, status },
  });
};

// DELETE rule
export const deleteLeadAssignmentRuleService = (uid) => {
  return authenticatedAxiosInstance({
    method: 'delete',
    url: `/api/v1/crm-tar/delete-rule/${uid}`,
  });
};

// GET dropdown data for Branches, Roles, Users
export const getCRMTarDropdownData = () => {
  return authenticatedAxiosInstance({
    method: 'get',
    url: '/api/v1/crm-tar/dropdown-data',
  });
};

// (Keeping standard dropdowns for source/city/state fallback if needed, but CRMTar often has its own hardcoded source)
// These can just use the standard endpoints. We will fetch these from city/state/lead services in the component.

export const getCounsellorDropdown = () => {
  return authenticatedAxiosInstance({
    method: 'get',
    url: `/api/v1/lead-management/counsellor-dropdown`,
  });
};

export const getTrackingUrlDropdown = () => {
  return authenticatedAxiosInstance({
    method: 'get',
    url: `/api/v1/lead-management/tracking-url`,
  });
};

export const getManagerlDropdown = () => {
  return authenticatedAxiosInstance({
    method: 'get',
    url: `/api/v1/user-management/manager-dropdown`,
  });
};

export const getLeadManagementAssignmentCounsellorDropdownService = () => {
  return authenticatedAxiosInstance({
    method: 'get',
    url: `/api/v1/lead-management/assignment-counsellor-dropdown`,
  });
};
