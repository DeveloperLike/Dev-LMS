import authenticatedAxiosInstance from "../../lib/AxiosInstance"

const getLeadSubStatusService = (params = {}) => {
    return authenticatedAxiosInstance({
        method: 'get',
        url: `/api/v1/lead-management/lead-sub-status`,
        params: params
    });
};
const patchLeadSubStatusService = (e, id) => {
    return authenticatedAxiosInstance({
        method: 'patch',
        url: `api/v1/lead-management/lead-sub-status/${id}`,
        data: { is_active: e },
    });
};
const getLeadSubStatusDetailService = (id) => {
    return authenticatedAxiosInstance({
        method: 'get',
        url: `/api/v1/lead-management/lead-sub-status/${id}`,
    });
};
const editLeadSubStatusService = (id, payload) => {
    return authenticatedAxiosInstance({
        method: 'put',
        url: `/api/v1/lead-management/lead-sub-status/${id}`,
        data: payload,
    });
};
const patchSubStatusService = (payload, id) => {
    return authenticatedAxiosInstance({
        method: 'post',
        url: `/api/v1/lead-management/lead-status-update/${id}`,
        data: payload,
    });
};

const saveLeadStatusLog = (payload, id) => {
    return authenticatedAxiosInstance({
        method: 'post',
        url: `/api/v1/lead-management/save-lead-status-logs`,
        data: payload,
    });
};
const addLeadSubStatusService = (payload) => {
    return authenticatedAxiosInstance({
        method: 'post',
        url: '/api/v1/lead-management/lead-sub-status',
        data: payload
    })
}
const deleteLeadSubStatusService = (id) => {
    return authenticatedAxiosInstance({
        method: 'delete',
        url: `/api/v1/lead-management/lead-sub-status/${id}`,
    });
};

export {
    getLeadSubStatusService,
    patchLeadSubStatusService,
    addLeadSubStatusService,
    editLeadSubStatusService,
    getLeadSubStatusDetailService,
    patchSubStatusService,
    saveLeadStatusLog,
    deleteLeadSubStatusService
};