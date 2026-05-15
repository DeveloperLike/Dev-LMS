import authenticatedAxiosInstance from "../../lib/AxiosInstance";

const followupPostService = (payload, params = {}) => {
  return authenticatedAxiosInstance({
    method: 'post',
    url: '/api/v1/lead-management/my-follow-up',
    data: payload,
    params: params
  });
};

const patchFollowupService = (e, id) => {
  return authenticatedAxiosInstance({
    method: 'patch',
    url: `/api/v1/lead-management/follow-up-update/${id}`,
    data: { status: e },
  });
};

export { followupPostService, patchFollowupService }