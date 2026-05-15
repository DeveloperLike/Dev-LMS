import authenticatedAxiosInstance from "../../lib/AxiosInstance";

const getTicketListService = (params = {}) => {
  return authenticatedAxiosInstance({
    method: "get",
    url: "/api/v1/ticket-management/ticket/",
    params: params,
  });
};

const getTicketCategoriesService = () => {
  return authenticatedAxiosInstance({
    method: "get",
    url: "/api/v1/ticket-management/ticket-categories/",
  });
};

const getTicketDetailsService = (id) => {
  return authenticatedAxiosInstance({
    method: "get",
    url: `/api/v1/ticket-management/ticket/${id}`,
  });
};

const patchTicketService = (e, id) => {
  return authenticatedAxiosInstance({
    method: "patch",
    url: `/api/v1/ticket-management/ticket/${id}`,
    data: { status: e },
  });
};

const addTicketListService = (payload) => {
  return authenticatedAxiosInstance({
    method: 'post',
    url: '/api/v1/ticket-management/ticket/',
    data: payload,
  });
};


// comments api start from here
const getTicketCommentService = (id) => {
  return authenticatedAxiosInstance({
    method: "get",
    url: `/api/v1/ticket-management/ticket-comment/${id}`,
  });
};

const getTicketCommentDetailsService = (id) => {
  return authenticatedAxiosInstance({
    method: "get",
    url: `/api/v1/ticket-management/ticket-comment/${id}`,
  });
};

const addCommentListService = (payload, id) => {
  return authenticatedAxiosInstance({
    method: 'post',
    url: `/api/v1/ticket-management/ticket-comment/${id}`,
    data: payload,
  });
};

const EditCommentListService = (payload,id) => {
  return authenticatedAxiosInstance({
    method: 'put',
    url: `/api/v1/ticket-management/ticket-comment/${id}`,
    data: payload,
  });
};

const getAdminDropdown = () => {
  return authenticatedAxiosInstance({
    method: 'get',
    url: `/api/v1/user-management/admin-dropdown`,
  });
};

export {
  getTicketListService,
  getTicketDetailsService,
  patchTicketService,
  getTicketCategoriesService,
  addTicketListService,
  getTicketCommentService,
  addCommentListService,
  EditCommentListService,
  getTicketCommentDetailsService,
  getAdminDropdown
};
