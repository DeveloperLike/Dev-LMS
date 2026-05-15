import authenticatedAxiosInstance from "../../lib/AxiosInstance";

const getUniversityService = (params = {}) => {
    return authenticatedAxiosInstance({
        method: "get",
        url: `/api/v1/university-and-course-management/university`,
        params: params,
    });
};
const getUniversityImportsService = () => {
    return authenticatedAxiosInstance({
        method: "get",
        url: `/api/v1/university-and-course-management/university-data-imports`,
    });
};
const getUniversitySampleService = () => {
    return authenticatedAxiosInstance({
        method: "get",
        url: `/api/v1/university-and-course-management/sample-university-export`,
    });
};
const addUniversityService = (payload) => {
    return authenticatedAxiosInstance({
        method: 'post',
        url: `/api/v1/university-and-course-management/university`,
        data: payload,
    });
};
const getUniversityDetailService = (id) => {
    return authenticatedAxiosInstance({
        method: "get",
        url: `/api/v1/university-and-course-management/university/${id}`,
    });
};
const editUniversityService = (payload, id) => {
    return authenticatedAxiosInstance({
        method: 'put',
        url: `/api/v1/university-and-course-management/university/${id}`,
        data: payload,
    });
};
const patchUniversityStatusService = (e, id) => {
    return authenticatedAxiosInstance({
        method: "patch",
        url: `api/v1/university-and-course-management/university/${id}`,
        data: { status: e },
    });
};

export {
    getUniversityService,
    addUniversityService,
    getUniversityDetailService,
    editUniversityService,
    patchUniversityStatusService,
    getUniversityImportsService,
    getUniversitySampleService
};
