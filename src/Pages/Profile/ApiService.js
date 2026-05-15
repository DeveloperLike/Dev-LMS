import authenticatedAxiosInstance from "../../lib/AxiosInstance";

const getProfileService = () => {
  return authenticatedAxiosInstance({
    method: "get",
    url: `api/v1/user-management/profile`,
  });
};

const getStudentPermissionService = (id) => {
  return authenticatedAxiosInstance({
    method: "get",
    url: `api/v1/student/student-permissions/${id}`,
  });
};

const UpdatePasswordService = (payload) => {
  return authenticatedAxiosInstance({
    method: "post",
    url: "/api/v1/user-management/update-password",
    data: payload,
  });
};
export {
  getStudentPermissionService,
  getProfileService,
  UpdatePasswordService
};
