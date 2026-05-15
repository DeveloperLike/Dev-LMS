import authenticatedAxiosInstance from "../../lib/AxiosInstance"

const getLeadStatusService = (params = {}) => {
    return authenticatedAxiosInstance({
        method: 'get',
        url: `/api/v1/lead-management/lead-status`,
        params: params
    });
};
const getLeadStatusDropdownService = () => {
    return authenticatedAxiosInstance({
        method: 'get',
        url: `/api/v1/lead-management/lead-status-dropdown`,
    });
};
const getLeadSubStatusDropdownService = () => {
    return authenticatedAxiosInstance({
        method: 'get',
        url: `/api/v1/lead-management/lead-sub-status-dropdown`,
    });
};
const patchLeadStatusService = (e, id) => {
    return authenticatedAxiosInstance({
        method: 'patch',
        url: `api/v1/lead-management/lead-status/${id}`,
        data: { is_active: e },
    });
};
const getLeadStatusDetailService = (id, params = {}) => {
    return authenticatedAxiosInstance({
        method: 'get',
        url: `/api/v1/lead-management/lead-status/${id}`,
        params: params
    });
};
const getLeadStatusSubStatusService = (id, params = {}) => {
    return authenticatedAxiosInstance({
        method: 'get',
        url: `/api/v1/lead-management/lead-sub-status-list/${id}`,
        params: params
    });
};
const editLeadStatusService = (id, payload) => {
    return authenticatedAxiosInstance({
        method: 'put',
        url: `/api/v1/lead-management/lead-status/${id}`,
        data: payload,
    });
};
const addLeadStatusService = (payload) => {
    return authenticatedAxiosInstance({
        method: 'post',
        url: '/api/v1/lead-management/lead-status',
        data: payload
    })
}
const getMappedLeadSubStatusService = (id) => {
    return authenticatedAxiosInstance({
        method: 'get',
        url: `/api/v1/lead-management/lead-status-sub-status-mapping/${id}`,
    });
};
const putMappedLeadSubStatusService = (id, payload) => {
    return authenticatedAxiosInstance({
        method: 'put',
        url: `/api/v1/lead-management/lead-status-sub-status-mapping/${id}`,
        data: payload,
    });
};
const postMappedLeadSubStatusService = (payload) => {
    return authenticatedAxiosInstance({
        method: 'post',
        url: '/api/v1/lead-management/lead-status-sub-status-mapping',
        data: payload
    })
}
const getMappedLeadSubStatusDetailService = (id) => {
    return authenticatedAxiosInstance({
        method: 'get',
        url: `/api/v1/lead-management/lead-status-sub-status-mapping/${id}`,
    });
};
const patchMappedLeadSubStatusService = (e, id) => {
    return authenticatedAxiosInstance({
        method: 'patch',
        url: `api/v1/lead-management/lead-status-sub-status-mapping/${id}`,
        data: { is_active: e },
    });
};
const deleteMappedLeadSubStatusDetailService = (id) => {
    return authenticatedAxiosInstance({
        method: 'delete',
        url: `/api/v1/lead-management/lead-status-sub-status-mapping/${id}`,
    });
};
export {
    getLeadStatusService,
    patchLeadStatusService,
    addLeadStatusService,
    editLeadStatusService,
    getLeadStatusDetailService,
    getLeadStatusDropdownService,
    putMappedLeadSubStatusService,
    postMappedLeadSubStatusService,
    getMappedLeadSubStatusDetailService,
    getLeadSubStatusDropdownService,
    patchMappedLeadSubStatusService,
    getMappedLeadSubStatusService,
    deleteMappedLeadSubStatusDetailService,
    getLeadStatusSubStatusService
};