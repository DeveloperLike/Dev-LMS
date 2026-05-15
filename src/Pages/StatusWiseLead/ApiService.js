import authenticatedAxiosInstance from "../../lib/AxiosInstance";

const getAnalysisByLeadStatusService = (payload) => {
    return authenticatedAxiosInstance({
      method: "post",
      url: `/api/v1/lead-management/lead-status-analytics`,
      data: payload,
    });
  };


  // const getLeadStatusDropdownService = () => {
  //   return authenticatedAxiosInstance({
  //     method: 'get',
  //     url: `/api/v1/lead-management/lead-status-dropdown`,
  //   });
  // };
 
  const getLeadStatusDropdownService = (payload) => {
    return authenticatedAxiosInstance({
      method: 'post',
      url: `/api/v1/lead-management/status-wise-lead`,
      data:payload
    });
  };

  export {
    getAnalysisByLeadStatusService,
    getLeadStatusDropdownService 
  }