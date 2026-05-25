import authenticatedAxiosInstance from '../../lib/AxiosInstance';

const getDIDNumbersService = (params = {}) => {
  return authenticatedAxiosInstance({
    method: 'get',
    url: '/api/v1/did-numbers',
    params,
  });
};

const getDIDNumberDetailsService = (id) => {
  return authenticatedAxiosInstance({
    method: 'get',
    url: `/api/v1/did-numbers/${id}`,
  });
};

const createDIDNumberService = (payload) => {
  return authenticatedAxiosInstance({
    method: 'post',
    url: '/api/v1/did-numbers',
    data: payload,
  });
};

const updateDIDNumberService = (id, payload) => {
  return authenticatedAxiosInstance({
    method: 'put',
    url: `/api/v1/did-numbers/${id}`,
    data: payload,
  });
};

const deleteDIDNumberService = (id) => {
  return authenticatedAxiosInstance({
    method: 'delete',
    url: `/api/v1/did-numbers/${id}`,
  });
};

const toggleDIDNumberActiveService = (id) => {
  return authenticatedAxiosInstance({
    method: 'patch',
    url: `/api/v1/did-numbers/${id}/toggle-active`,
  });
};

export {
  getDIDNumbersService,
  getDIDNumberDetailsService,
  createDIDNumberService,
  updateDIDNumberService,
  deleteDIDNumberService,
  toggleDIDNumberActiveService,
};
