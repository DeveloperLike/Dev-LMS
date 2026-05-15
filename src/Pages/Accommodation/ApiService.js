import authenticatedAxiosInstance from "../../lib/AxiosInstance";

const getStudentAccommodationListService = (params = {}) => {
  return authenticatedAxiosInstance({
    method: "get",
    url: `/api/v1/visa/accommodation`,
    params: params,
  });
};
const patchAccommodationService = (e, id) => {
  return authenticatedAxiosInstance({
    method: "patch",
    url: `/api/v1/visa/accommodation/${id}`,
    data: { is_active: e },
  });
};

const addAccommodationService = (payload) => {
  return authenticatedAxiosInstance({
    method: "post",
    url: "/api/v1/visa/accommodation",
    data: payload,
  });
};

const detailsAccommodationService = (id) => {
  return authenticatedAxiosInstance({
    method: "get",
    url: `/api/v1/visa/accommodation/${id}`,
  });
};

const editAccommodationService = (id, payload) => {
  return authenticatedAxiosInstance({
    method: "put",
    url: `/api/v1/visa/accommodation/${id}`,
    data: payload,
  });
};

const getUniversityDropdownListService = () => {
  return authenticatedAxiosInstance({
    method: "get",
    url: `/api/v1/university-and-course-management/university-dropdown`,
  });
};

export {
  getStudentAccommodationListService,
  patchAccommodationService,
  addAccommodationService,
  editAccommodationService,
  detailsAccommodationService,
  getUniversityDropdownListService
};
