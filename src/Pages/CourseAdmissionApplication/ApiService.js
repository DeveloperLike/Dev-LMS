import authenticatedAxiosInstance from "../../lib/AxiosInstance";

const getCourseAdmissionApplicationService = () => {
    return authenticatedAxiosInstance({
        method: "get",
        url: `/api/v1/university-and-course-management/course-admission-application`,
    });
};
const addCourseAdmissionApplicationService = (payload) => {
    return authenticatedAxiosInstance({
        method: 'post',
        url: `/api/v1/university-and-course-management/course-admission-application`,
        data: payload,
    });
};
const getCourseAdmissionApplicationDetailService = (id) => {
    return authenticatedAxiosInstance({
        method: "get",
        url: `/api/v1/university-and-course-management/course-admission-application/${id}`,
    });
};
const editCourseAdmissionApplicationService = (payload, id) => {
    return authenticatedAxiosInstance({
        method: 'put',
        url: `/api/v1/university-and-course-management/course-admission-application/${id}`,
        data: payload,
    });
};

export {
    getCourseAdmissionApplicationService,
    addCourseAdmissionApplicationService,
    getCourseAdmissionApplicationDetailService,
    editCourseAdmissionApplicationService
};
