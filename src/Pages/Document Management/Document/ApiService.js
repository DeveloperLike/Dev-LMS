import authenticatedAxiosInstance from "../../../lib/AxiosInstance";

const getDocumentService = (params = {}) => {
    return authenticatedAxiosInstance({
        method: "get",
        url: `/api/v1/document/document`,
        params: params,
    });
};
const getDocumentDropdownService = () => {
    return authenticatedAxiosInstance({
        method: "get",
        url: `/api/v1/document/documents-dropdown`,
    });
};
const addDocumentService = (payload) => {
    return authenticatedAxiosInstance({
        method: 'post',
        url: `/api/v1/document/document`,
        data: payload,
    });
};
const getDocumentDetailService = (id) => {
    return authenticatedAxiosInstance({
        method: "get",
        url: `/api/v1/document/document/${id}`,
    });
};
const editDocumentService = (payload, id) => {
    return authenticatedAxiosInstance({
        method: 'put',
        url: `/api/v1/document/document/${id}`,
        data: payload,
    });
};
const patchDocumentService = (e, id) => {
    return authenticatedAxiosInstance({
        method: 'patch',
        url: `api/v1/document/document/${id}`,
        data: { status: e },
    });
};

export {
    getDocumentService,
    addDocumentService,
    getDocumentDetailService,
    editDocumentService,
    patchDocumentService,
    getDocumentDropdownService
};
