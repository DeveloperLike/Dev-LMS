import authenticatedAxiosInstance from "../../lib/AxiosInstance";

const getVisaApplicationService = () => {
    return authenticatedAxiosInstance({
        method: "get",
        url: `/api/v1/visa/visa-management`,
    });
};
const addVisaApplicationService = (payload, id) => {
    return authenticatedAxiosInstance({
        method: 'post',
        url: `/api/v1/visa/visa-management/${id}`,
        data: payload,
    });
};
const getVisaApplicationDetailService = (id) => {
    return authenticatedAxiosInstance({
        method: "get",
        url: `/api/v1/visa/visa-management/${id}`,
    });
};
const editVisaApplicationService = (payload, id) => {
    return authenticatedAxiosInstance({
        method: 'put',
        url: `/api/v1/visa/visa-management/${id}`,
        data: payload,
    });
};

export {
    getVisaApplicationService,
    addVisaApplicationService,
    editVisaApplicationService,
    getVisaApplicationDetailService,
};
