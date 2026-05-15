import authenticatedAxiosInstance from '../../lib/AxiosInstance';

const getPackagelistService = (params = {}) => {
  return authenticatedAxiosInstance({
    method: 'get',
    url: '/api/v1/accounting/package',
    params: params,
  });
};

const patchPackageListService = (e, id) => {
  return authenticatedAxiosInstance({
    method: 'patch',
    url: `/api/v1/accounting/package/${id}`,
    data: { is_active: e },
  });
};

const getPackageDetailslistservice = (id) => {
  return authenticatedAxiosInstance({
    method: 'get',
    url: `/api/v1/accounting/package/${id}`,
  });
};

const editPackageListService = (id, payload) => {
  return authenticatedAxiosInstance({
    method: 'put',
    url: `/api/v1/accounting/package/${id}`,
    data: payload,
  });
};

const addPackageListService = (payload) => {
  return authenticatedAxiosInstance({
    method: 'post',
    url: '/api/v1/accounting/package',
    data: payload,
  });
};

const getPackageSectionService = () => {
  return authenticatedAxiosInstance({
    method: 'get',
    url: '/api/v1/accounting/section',
  })
};

const getPackagelistDashboardService = () => {
  return authenticatedAxiosInstance({
    method: 'get',
    url: '/api/v1/accounting/package',
  });
};

const getPackageDropdownService = () => {
  return authenticatedAxiosInstance({
    method: 'get',
    url: '/api/v1/accounting/package-dropdown',
  });
};

export {
  getPackageDropdownService,
  getPackagelistService,
  patchPackageListService,
  getPackageDetailslistservice,
  editPackageListService,
  addPackageListService,
  getPackageSectionService,
  getPackagelistDashboardService
};
