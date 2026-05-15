import authenticatedAxiosInstance, {
  unauthenticatedAxiosInstance,
} from '../../lib/AxiosInstance';

const getBranchService = (params = {}) => {
  return authenticatedAxiosInstance({
    method: 'get',
    url: `/api/v1/branch-management/branch`,
    params: params,
  });
};

const patchBranchService = (e, id) => {
  return authenticatedAxiosInstance({
    method: 'patch',
    url: `/api/v1/branch-management/branch/${id}`,
    data: { is_active: e },
  });
};

const addBranchService = (payload) => {
  return authenticatedAxiosInstance({
    method: 'post',
    url: '/api/v1/branch-management/branch',
    data: payload,
  });
};

const getBranchDetailService = (id) => {
  return authenticatedAxiosInstance({
    method: 'get',
    url: `/api/v1/branch-management/branch/${id}`,
  });
};

const editBranchService = (id, payload) => {
  return authenticatedAxiosInstance({
    method: 'put',
    url: `/api/v1/branch-management/branch/${id}`,
    data: payload,
  });
};

export {
  getBranchService,
  patchBranchService,
  addBranchService,
  getBranchDetailService,
  editBranchService,
};
