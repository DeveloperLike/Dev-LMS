import authenticatedAxiosInstance from "../../lib/AxiosInstance";

const reminderPostService = (payload, params = {}, reminderparam) => {
  return authenticatedAxiosInstance({
    method: 'post',
    url: `/api/v1/lead-management/my-reminder/${reminderparam}`,
    data: payload,
    params: params
  });
};


const patchReminderService = (e, id) => {
  return authenticatedAxiosInstance({
    method: "patch",
    url: `/api/v1/lead-management/reminder-update/${id}`,
    data: { status: e },
  });
};

const PostAddAllMyRemiderService = (payload) => {
  return authenticatedAxiosInstance({
    method: "post",
    url: `api/v1/lead-management/add-reminder`,
    data: payload,
  });
};

export { patchReminderService, PostAddAllMyRemiderService, reminderPostService };
