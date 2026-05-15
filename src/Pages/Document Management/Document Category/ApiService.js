import authenticatedAxiosInstance from "../../../lib/AxiosInstance";

const getDocumentCategoryService = (params = {}) => {
    return authenticatedAxiosInstance({
        method: "get",
        url: `/api/v1/document/document-category`,
        params: params,
    });
};
const addDocumentCategoryService = (payload) => {
    return authenticatedAxiosInstance({
        method: 'post',
        url: `/api/v1/document/document-category`,
        data: payload,
    });
};
const getDocumentCategoryDetailService = (id) => {
    return authenticatedAxiosInstance({
        method: "get",
        url: `/api/v1/document/document-category/${id}`,
    });
};
const editDocumentCategoryService = (payload, id) => {
    return authenticatedAxiosInstance({
        method: 'put',
        url: `/api/v1/document/document-category/${id}`,
        data: payload,
    });
};
const patchDocumentCategoryService = (e, id) => {
    return authenticatedAxiosInstance({
        method: 'patch',
        url: `api/v1/document/document-category/${id}`,
        data: { status: e },
    });
};

const getMappedDocumentService = (id, params = {}) => {
    return authenticatedAxiosInstance({
        method: 'get',
        url: `/api/v1/document/document-category-mapping/${id}`,
        params: params,
    });
};
const postMappedDocumentService = (id, payload) => {
    return authenticatedAxiosInstance({
        method: 'post',
        url: `/api/v1/document/document-category-mapping/${id}`,
        data: payload
    })
}
const putMappedDocumentService = (categoryId, documentId, payload) => {
    return authenticatedAxiosInstance({
        method: 'put',
        url: `/api/v1/document/document-category-mapping/${categoryId}/${documentId}`,
        data: payload,
    });
};

const getMappedDocumentDetailService = (categoryId, documentId) => {
    return authenticatedAxiosInstance({
        method: 'get',
        url: `/api/v1/document/document-category-mapping/${categoryId}/${documentId}`,
    });
};
const patchMappedDocumentService = (e, categoryId, documentId) => {
    return authenticatedAxiosInstance({
        method: 'patch',
        url: `api/v1/document/document-category-mapping/${categoryId}/${documentId}`,
        data: { status: e },
    });
};
const deleteMappedDocumentService = (categoryId, documentId) => {
    return authenticatedAxiosInstance({
        method: 'delete',
        url: `/api/v1/document/document-category-mapping/${categoryId}/${documentId}`,
    });
};

export {
    getDocumentCategoryService,
    addDocumentCategoryService,
    getDocumentCategoryDetailService,
    editDocumentCategoryService,
    getMappedDocumentService,
    putMappedDocumentService,
    postMappedDocumentService,
    getMappedDocumentDetailService,
    patchMappedDocumentService,
    deleteMappedDocumentService,
    patchDocumentCategoryService
};