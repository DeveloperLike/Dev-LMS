import authenticatedAxiosInstance from "../../lib/AxiosInstance";


const getExportService = (params = {}) => {
    return authenticatedAxiosInstance({
      method: 'get',
      url: `/api/v1/lead-management/export-leads`,
      params: params,
    });
  };

const getImportService = (params = {}) => {
    return authenticatedAxiosInstance({
      method: 'get',
      url: `/api/v1/lead-management/import-leads`,
      params: params,
    });
  };

  const postImportService = (payload) => {
    return authenticatedAxiosInstance({
      method: 'post',
      url: '/api/v1/lead-management/import-lead',
      data: payload,
    });
  };
  

  const getSampleFileService = () => {
    return authenticatedAxiosInstance({
      method: 'get',
      url: `/api/v1/lead-management/sample-export-lead`,
    });
  };

  const postExportService = (payload) => {
    return authenticatedAxiosInstance({
      method: 'post',
      url: '/api/v1/lead-management/export-selected-lead',
      data: payload,
    });
  };

  const getExportCounsellorDropdownService = () => {
    return authenticatedAxiosInstance({
      method: 'get',
      url: `/api/v1/lead-management/export-counsellor-dropdown`,
    });
  };


export {
    getExportService,
    postExportService,
    getImportService,
    postImportService,
    getSampleFileService,
    getExportCounsellorDropdownService
};