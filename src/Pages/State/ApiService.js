import authenticatedAxiosInstance from "../../lib/AxiosInstance";

const getStateListService = (params = {}) => {
  return authenticatedAxiosInstance({
    method: "get",
    url: `/api/v1/lead-management/state`,
    params: params,
  });
};

const patchStateListService = (e, id) => {
  return authenticatedAxiosInstance({
    method: "patch",
    url: `api/v1/lead-management/state/${id}`,
    data: { is_active: e },
  });
};

const getStateDetailListService = (id) => {
  return authenticatedAxiosInstance({
    method: "get",
    url: `/api/v1/lead-management/state/${id}`,
  });
};

const editStateListService = (id, payload) => {
  return authenticatedAxiosInstance({
    method: "put",
    url: `/api/v1/lead-management/state/${id}`,
    data: payload,
  });
};

const addStateListService = (payload) => {
  return authenticatedAxiosInstance({
    method: "post",
    url: "/api/v1/lead-management/state",
    data: payload,
  });
};

const getStateListdashboadService = () => {
  return authenticatedAxiosInstance({
    method: "get",
    url: `/api/v1/lead-management/state`,
  });
};

const getStateDropdownService = ()=>{
  return authenticatedAxiosInstance({
    method: 'get',
    url: '/api/v1/lead-management/state-dropdown',
  });
};



export {
  getStateListService,
  patchStateListService,
  getStateDetailListService,
  editStateListService,
  addStateListService,
  getStateListdashboadService,
  getStateDropdownService,
};
