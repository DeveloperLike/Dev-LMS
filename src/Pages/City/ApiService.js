import authenticatedAxiosInstance from '../../lib/AxiosInstance';

const getCityListService = (params = {}) => {
  return authenticatedAxiosInstance({
    method: 'get',
    url: '/api/v1/utils/city',
    params: params,
  });
};

const getCityDropdownService = ()=>{
  return authenticatedAxiosInstance({
    method: 'get',
    url: '/api/v1/utils/city-dropdown',
  });
};


const addCityListService = (payload) => {
  return authenticatedAxiosInstance({
    method: 'post',
    url: '/api/v1/utils/city',
    data: payload,
  });
};

const getCityDetailService = (id) => {
  return authenticatedAxiosInstance({
    method: 'get',
    url: `/api/v1/utils/city/${id}`,
  });
};

const editCityListService = (payload, id) => {
  return authenticatedAxiosInstance({
    method: 'put',
    url: `/api/v1/utils/city/${id}`,
    data: payload,
  });
};

const patchCityService = (e, id) => {
  return authenticatedAxiosInstance({
    method: 'patch',
    url: `/api/v1/utils/city/${id}`,
    data: { is_active: e },
  });
};
const getCityListdashboardService = () => {
  return authenticatedAxiosInstance({
    method: 'get',
    url: '/api/v1/utils/city',
  });
};

export {
  getCityListService,
  addCityListService,
  getCityDetailService,
  editCityListService,
  patchCityService,
  getCityDropdownService,
  getCityListdashboardService
};
