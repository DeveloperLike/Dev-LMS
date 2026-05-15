import authenticatedAxiosInstance from '../../lib/AxiosInstance';

const getLeadFormListService = (params = {}) => {
  return authenticatedAxiosInstance({
    method: 'get',
    url: `/api/v1/lead-management/lead-form-field`,
    params: params,
  });
};

const patchLeadFormListService = (e, id) => {
  return authenticatedAxiosInstance({
    method: 'patch',
    data: { is_active: e },
    url: `/api/v1/lead-management/lead-form-field/${id}`,
  });
};

const deleteLeadFormFeildService = (code) => {
  return authenticatedAxiosInstance({
    method: 'delete',
    url: `/api/v1/lead-management/lead-form-field/${code}`,
  });
};

const getLeadFormFeildDetailService = (code) => {
  return authenticatedAxiosInstance({
    method: 'get',
    url: `/api/v1/lead-management/lead-form-field/${code}`,
  });
};

const editLeadFormFeildService = (payload,code) => {
  return authenticatedAxiosInstance({
    method: 'put',
    url: `/api/v1/lead-management/lead-form-field/${code}`,
    data: payload,
  });
};


const addLeadFormFeildService = (payload) => {
    return authenticatedAxiosInstance({
        method: 'post',
        url: '/api/v1/lead-management/lead-form-field',
        data: payload
    })
}
export {
  getLeadFormListService,
  patchLeadFormListService,
  deleteLeadFormFeildService,
  getLeadFormFeildDetailService,
  editLeadFormFeildService,
  addLeadFormFeildService
};
