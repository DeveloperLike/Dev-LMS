import authenticatedAxiosInstance from "../../lib/AxiosInstance";

const getCourseService = (params = {}) => {
    return authenticatedAxiosInstance({
        method: "get",
        url: `/api/v1/university-and-course-management/course`,
        params: params,

    });
};
const getSampleCourseExportService = () => {
    return authenticatedAxiosInstance({
        method: "get",
        url: `/api/v1/university-and-course-management/sample-course-export`,
    });
};
const addCourseService = (payload) => {
    return authenticatedAxiosInstance({
        method: 'post',
        url: `/api/v1/university-and-course-management/course`,
        data: payload,
    });
};
const getCourseDetailService = (id) => {
    return authenticatedAxiosInstance({
        method: "get",
        url: `/api/v1/university-and-course-management/course/${id}`,
    });
};
const editCourseService = (payload, id) => {
    return authenticatedAxiosInstance({
        method: 'put',
        url: `/api/v1/university-and-course-management/course/${id}`,
        data: payload,
    });
};
const getUniversityDropdownService = () => {
    return authenticatedAxiosInstance({
        method: "get",
        url: `/api/v1/university-and-course-management/university-dropdown`,
    });
};
const patchCourseService = (e, id) => {
    return authenticatedAxiosInstance({
        method: "patch",
        url: `api/v1/university-and-course-management/course/${id}`,
        data: { status: e },
    });
};

export {
    getCourseService,
    addCourseService,
    getCourseDetailService,
    editCourseService,
    getUniversityDropdownService,
    patchCourseService,
    getSampleCourseExportService
};
