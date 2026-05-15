import authenticatedAxiosInstance from "../../../lib/AxiosInstance";

const getUserListService = () => {
  return authenticatedAxiosInstance({
    method: 'get',
    url: '/api/v1/user-management/user'
  });
};

const editEmailTemplatedDetailService = (id) => {
  return authenticatedAxiosInstance({
    method: 'get',
    url: `/api/v1/template/template/email/${id}`,
  });
};

const testEmailTemplateService = (payload, id) => {
  return authenticatedAxiosInstance({
    method: 'post',
    url: `/api/v1/template/email-preview/${id}`,
    data: payload,
  })
}


const postemailTenplateService = (payload) => {
  return authenticatedAxiosInstance({
    method: 'post',
    url: `/api/v1/template/template/email`,
    data: payload,
  });
};

export { getUserListService, postemailTenplateService, editEmailTemplatedDetailService, testEmailTemplateService }