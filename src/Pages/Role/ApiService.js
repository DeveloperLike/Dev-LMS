import authenticatedAxiosInstance from '../../lib/AxiosInstance';

const getRoleListService = (params = {}) => {
  return authenticatedAxiosInstance({
    method: 'get',
    url: `/api/v1/role-management/role`,
    params: params,
  });
};

const patchRoleListService = (e, id) => {
  return authenticatedAxiosInstance({
    method: 'patch',
    data: { is_active: e },
    url: `/api/v1/role-management/role/${id}`,
  });
};

const editRoleListService = (id, payload) => {
  return authenticatedAxiosInstance({
    method: 'put',
    url: `/api/v1/role-management/role/${id}`,
    data: payload,
  });
};

const getRoleListDetailService = (id) => {
  return authenticatedAxiosInstance({
    method: 'get',
    url: `/api/v1/role-management/role/${id}`,
  });
};

const getRoleModuleService = () => {
  return authenticatedAxiosInstance({
    method: 'get',
    url: '/api/v1/role-management/modules',
  });
};

const addRoleListService = (payload) => {
  return authenticatedAxiosInstance({
    method: 'post',
    url: `/api/v1/role-management/role`,
    data: payload,
  });
};

export {
  getRoleListService,
  patchRoleListService,
  editRoleListService,
  getRoleListDetailService,
  getRoleModuleService,
  addRoleListService,
};
