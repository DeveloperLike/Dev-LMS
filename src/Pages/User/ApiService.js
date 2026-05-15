import authenticatedAxiosInstance, {
  unauthenticatedAxiosInstance,
} from '../../lib/AxiosInstance';

const getUserListService = (params = {}) => {
  return authenticatedAxiosInstance({
    method: 'get',
    url: `/api/v1/user-management/user`,
    params: params,
  });
};

const getUserDetailsService = (e, id) => {
  return authenticatedAxiosInstance({
    method: 'patch',
    data: { is_active: e },
    url: `/api/v1/user-management/user/${id}`,
  });
};

const getUserDropdownService = () => {
  return authenticatedAxiosInstance({
    method: 'get',
    url: `/api/v1/template/users-list`,
  });
};

const addUserService = (payload) => {
  return authenticatedAxiosInstance({
    method: 'post',
    url: `/api/v1/user-management/user`,
    data: payload,
  });
};

const getStrongPasswordervice = () => {
  return authenticatedAxiosInstance({
    method: 'get',
    url: `/api/v1/common/password-generate`,
  });
};

const getReportingManagersService = () => {
  return authenticatedAxiosInstance({
    method: 'get',
    url: 'api/v1/user-management/reporting-manager-dropdown',
  });
};

const getCountryCodeService = () => {
  return authenticatedAxiosInstance({
    method: 'get',
    url: 'api/v1/utils/country-code-dropdown',
  });
};

const getBranchService = () => {
  return authenticatedAxiosInstance({
    method: 'get',
    url: 'api/v1/branch-management/branch-dropdown',
  });
};

const getBranchListService = () => {
  return authenticatedAxiosInstance({
    method: 'get',
    url: 'api/v1/branch-management/branch',
  });
};

const getRolesService = () => {
  return authenticatedAxiosInstance({
    method: 'get',
    url: '/api/v1/role-management/role-dropdown',
  });
};

const editUserService = (payload, id) => {
  return authenticatedAxiosInstance({
    method: 'put',
    url: `/api/v1/user-management/user/${id}`,
    data: payload,
  });
};

const geteditUserService = (id) => {
  return authenticatedAxiosInstance({
    method: 'get',
    url: `/api/v1/user-management/user/${id}`,
  });
};

const getStaffListService = () => {
  return authenticatedAxiosInstance({
    method: "get",
    url: `/api/v1/user-management/user`,
  });
};


export {
  getUserListService,
  addUserService,
  getStrongPasswordervice,
  getReportingManagersService,
  getCountryCodeService,
  getBranchService,
  getRolesService,
  editUserService,
  geteditUserService,
  getUserDetailsService,
  getUserDropdownService,
  getBranchListService,
  getStaffListService
};
