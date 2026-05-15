import authenticatedAxiosInstance from '../../../lib/AxiosInstance';

const getLeadCategoryService = (params = {}) => {
    return authenticatedAxiosInstance({
        method: 'get',
        url: '/api/v1/lead-management/lead-category',
        params: params,
    });
};

const addLeadCategoryService = (payload) => {
    return authenticatedAxiosInstance({
        method: 'post',
        url: '/api/v1/lead-management/lead-category',
        data: payload,
    });
};

const getLeadCategoryDetailService = (id) => {
    return authenticatedAxiosInstance({
        method: 'get',
        url: `/api/v1/lead-management/lead-category/${id}`,
    });
};

const editLeadCategoryService = (payload, id) => {
    return authenticatedAxiosInstance({
        method: 'put',
        url: `/api/v1/lead-management/lead-category/${id}`,
        data: payload,
    });
};

const patchLeadCategoryService = (e, id) => {
    return authenticatedAxiosInstance({
        method: 'patch',
        url: `/api/v1/lead-management/lead-category/${id}`,
        data: { status: e },
    });
};

export {
    getLeadCategoryService,
    addLeadCategoryService,
    getLeadCategoryDetailService,
    editLeadCategoryService,
    patchLeadCategoryService,
};
