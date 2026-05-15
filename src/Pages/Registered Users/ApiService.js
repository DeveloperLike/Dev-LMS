import authenticatedAxiosInstance from "../../lib/AxiosInstance";

const getRegisteredUserService = (params = {}) => {
  return authenticatedAxiosInstance({
    method: "get",
    url: "/api/v1/lead-management/registered-user",
    params: params,
  });
};

const getRegisteredUserExportService = () => {
  return authenticatedAxiosInstance({
    method: "get",
    url: "/api/v1/lead-management/export-registered-users",
  });
};

const getExportedRegisteredUsersService = (params = {}) => {
  return authenticatedAxiosInstance({
    method: "get",
    url: "/api/v1/lead-management/exported-registered-users",
        params: params,
  });
};

const getRegisteredUserDetailService = (id) => {
  return authenticatedAxiosInstance({
    method: "get",
    url: `/api/v1/lead-management/registered-user/${id}`,
  });
};
const getRegisteredUserPackageService = (id) => {
  return authenticatedAxiosInstance({
    method: "get",
    url: `api/v1/lead-management/registered-user-packages/${id}`,
  });
};
const getRegisteredUserTransactionService = (id) => {
  return authenticatedAxiosInstance({
    method: "get",
    url: `api/v1/lead-management/registered-user-transaction/${id}`,
  });
};

const getRegisterUserDetailsService = (id) => {
  return authenticatedAxiosInstance({
    method: 'get',
    url: `api/v1/lead-management/register-user-reminder/${id}`,
  })
}

const PostAddRegisterRemiderService = (payload) => {
  return authenticatedAxiosInstance({
    method: 'post',
    url: `api/v1/lead-management/register-user-reminder`,
    data: payload
  })
}

const patchTransactionStatusService = (id, payload) => {
  return authenticatedAxiosInstance({
    method: 'patch',
    url: `/api/v1/accounting/verify-transaction/${id}`,
    data: payload,
  });
};

const getUserMappedDocumentService = (id, params = {}) => {
  return authenticatedAxiosInstance({
    method: "get",
    url: `/api/v1/document/document-category-user-mapping/${id}`,
    params: params,
  });
};
const postUserMappedDocumentService = (id, payload) => {
  return authenticatedAxiosInstance({
    method: 'post',
    url: `/api/v1/document/document-category-user-mapping/${id}`,
    data: payload
  })
}
const putUserMappedDocumentService = (categoryId, documentId, payload) => {
  return authenticatedAxiosInstance({
    method: 'put',
    url: `/api/v1/document/document-category-user-mapping/${categoryId}/${documentId}`,
    data: payload,
  });
};

const getUserMappedDocumentDetailService = (categoryId, documentId) => {
  return authenticatedAxiosInstance({
    method: 'get',
    url: `/api/v1/document/document-category-user-mapping/${categoryId}/${documentId}`,
  });
};
const deleteUserMappedDocumentService = (categoryId, documentId) => {
  return authenticatedAxiosInstance({
    method: 'delete',
    url: `/api/v1/document/document-category-user-mapping/${categoryId}/${documentId}`,
  });
};

const getVisaApplicationService = (id) => {
  return authenticatedAxiosInstance({
    method: "get",
    url: `/api/v1/visa/visa-management/${id}`,
  });
};
const addVisaApplicationService = (payload, id) => {
  return authenticatedAxiosInstance({
    method: 'post',
    url: `/api/v1/visa/visa-management/${id}`,
    data: payload,
  });
};
const getVisaApplicationDetailService = (userId, id) => {
  return authenticatedAxiosInstance({
    method: "get",
    url: `/api/v1/visa/visa-management/${userId}/${id}`,
  });
};
const editVisaApplicationService = (payload, userId, id) => {
  return authenticatedAxiosInstance({
    method: 'put',
    url: `/api/v1/visa/visa-management/${userId}/${id}`,
    data: payload,
  });
};

const getAccommodationApplicationService = (id) => {
  return authenticatedAxiosInstance({
    method: "get",
    url: `/api/v1/visa/apply-accommodation/${id}`,
  });
};
const addAccommodationApplicationService = (payload, id) => {
  return authenticatedAxiosInstance({
    method: 'post',
    url: `/api/v1/visa/apply-accommodation/${id}`,
    data: payload,
  });
};
const getAccommodationApplicationDetailService = (userId, id) => {
  return authenticatedAxiosInstance({
    method: "get",
    url: `/api/v1/visa/apply-accommodation/${userId}/${id}`,
  });
};
const editAccommodationApplicationService = (payload, userId, id) => {
  return authenticatedAxiosInstance({
    method: 'put',
    url: `/api/v1/visa/apply-accommodation/${userId}/${id}`,
    data: payload,
  });
};

const getApsApplicationService = (id) => {
  return authenticatedAxiosInstance({
    method: "get",
    url: `/api/v1/aps/aps-management/${id}`,
  });
};
// const addApsApplicationService = (payload, id) => {
//   return authenticatedAxiosInstance({
//     method: 'post',
//     url: `/api/v1/aps/aps-management/${id}`,
//     data: payload,
//   });
// };
// const getApsApplicationDetailService = (userId, id) => {
//   return authenticatedAxiosInstance({
//     method: "get",
//     url: `/api/v1/aps/aps-management/${userId}/${id}`,
//   });
// };
const editApsApplicationService = (payload, userId) => {
  return authenticatedAxiosInstance({
    method: 'put',
    url: `/api/v1/aps/aps-management/${userId}`,
    data: payload,
  });
};

const getDocumentsListService = (userName, categoryId, params = {}) => {
  return authenticatedAxiosInstance({
    method: "get",
    url: `/api/v1/document/submitted-document/${userName}/${categoryId}`,
    params: params
  });
};

const UpdateDocumentStatusService = (userName, categoryId, documentId, payload) => {
  return authenticatedAxiosInstance({
    method: "put",
    url: `/api/v1/document/submitted-document/${userName}/${categoryId}/${documentId}`,
    data: payload,
  });
};

// profile service start from here
const getStudentPersonalDetailsService = (userName, params = {}) => {
  return authenticatedAxiosInstance({
    method: "get",
    url: `/api/v1/student/student-profile/${userName}`,
    params: params
  });
};
const editProfileDetailService = (payload, id) => {
  return authenticatedAxiosInstance({
    method: 'put',
    url: `api/v1/student/my-profile/${id}`,
    data: payload,
  });
};
const editDocumentsService = (payload, id, documentId, submitionId) => {
  return authenticatedAxiosInstance({
    method: "put",
    url: `/api/v1/document/update-user-document/${id}/${documentId}/${submitionId}`,
    data: payload,
  });
};
const UpdateStudentPersonalDetailsStatusService = (userName, payload) => {
  return authenticatedAxiosInstance({
    method: "put",
    url: `/api/v1/student/student-profile/${userName}`,
    data: payload,
  });
};
const getStudentMatriculationDetailsService = (userName, params = {}) => {
  return authenticatedAxiosInstance({
    method: "get",
    url: `/api/v1/student/matriculation-details/${userName}`,
    params: params
  });
};
const editMatriculationDetailService = (payload, id) => {
  return authenticatedAxiosInstance({
    method: 'put',
    url: `/api/v1/student/my-matriculation-details/${id}`,
    data: payload,
  });
};

const UpdateStudentMatriculationDetailsStatusService = (userName, payload) => {
  return authenticatedAxiosInstance({
    method: "put",
    url: `/api/v1/student/matriculation-details/${userName}`,
    data: payload,
  });
};
const getStudentIntermediateDetailsService = (userName, params = {}) => {
  return authenticatedAxiosInstance({
    method: "get",
    url: `/api/v1/student/intermediate-exam-details/${userName}`,
    params: params
  });
};
const editIntermediateDetailService = (payload, id) => {
  return authenticatedAxiosInstance({
    method: 'put',
    url: `/api/v1/student/my-intermediate-exam-details/${id}`,
    data: payload,
  });
};


const UpdateStudentIntermediateDetailsStatusService = (userName, payload) => {
  return authenticatedAxiosInstance({
    method: "put",
    url: `/api/v1/student/ntermediate-exam-details/${userName}`,
    data: payload,
  });
};
const getStudentDiplomaDetailsService = (userName, params = {}) => {
  return authenticatedAxiosInstance({
    method: "get",
    url: `/api/v1/student/diploma-details/${userName}`,
    params: params
  });
};
const editDiplomaDetailService = (payload, id) => {
  return authenticatedAxiosInstance({
    method: 'put',
    url: `api/v1/student/my-diploma-details/${id}`,
    data: payload,
  });
};

const UpdateStudentDiplomaDetailsStatusService = (userName, payload) => {
  return authenticatedAxiosInstance({
    method: "put",
    url: `/api/v1/student/diploma-details/${userName}`,
    data: payload,
  });
};

const getStudentGraducationDetailsService = (userName, params = {}) => {
  return authenticatedAxiosInstance({
    method: "get",
    url: `/api/v1/student/graduation-details/${userName}`,
    params: params
  });
};
const editGraduationDetailService = (payload, id) => {
  return authenticatedAxiosInstance({
    method: 'put',
    url: `api/v1/student/my-graduation-details/${id}`,
    data: payload,
  });
};
const updateStudentGraducationDetailsStatusService = (userName, payload) => {
  return authenticatedAxiosInstance({
    method: "put",
    url: `/api/v1/student/graduation-details/${userName}`,
    data: payload,
  });
};

const getStudentPostGraducationDetailsService = (userName, params = {}) => {
  return authenticatedAxiosInstance({
    method: "get",
    url: `/api/v1/student/post-graduation-details/${userName}`,
    params: params
  });
};
const editPostGraduationDetailService = (payload, id) => {
  return authenticatedAxiosInstance({
    method: 'put',
    url: `api/v1/student/my-post-graduation-details/${id}`,
    data: payload,
  });
};

const updateStudentPostGraducationDetailsStatusService = (userName, payload) => {
  return authenticatedAxiosInstance({
    method: "put",
    url: `/api/v1/student/post-graduation-details/${userName}`,
    data: payload,
  });
};
const getStudentEmploymentDetailsService = (userName) => {
  return authenticatedAxiosInstance({
    method: "get",
    url: `/api/v1/student/employment/${userName}`,
  });
};
const UpdateStudentEmploymentStatusService = (userName, selectedData, payload) => {
  return authenticatedAxiosInstance({
    method: "put",
    url: `/api/v1/student/employment/${userName}/${selectedData}`,
    data: payload,
  });
};
const addEmploymentService = (payload, username) => {
  return authenticatedAxiosInstance({
    method: "post",
    url: `api/v1/student/my-employment-details/${username}`,
    data: payload,
  });
};
const editEmploymentDetailService = (payload, username, id) => {
  return authenticatedAxiosInstance({
    method: 'put',
    url: `api/v1/student/my-employment-details/${username}/${id}`,
    data: payload,
  });
};
const getEmploymentDetailService = (username, id) => {
  return authenticatedAxiosInstance({
    method: "get",
    url: `api/v1/student/my-employment-details/${username}/${id}`,
  });
};

const getStudentScoreDetailsService = (userName, params = {}) => {
  return authenticatedAxiosInstance({
    method: "get",
    url: `/api/v1/student/score-details/${userName}`,
    params: params
  });
};
const updateStudentScoreStatusService = (userName, payload) => {
  return authenticatedAxiosInstance({
    method: "put",
    url: `/api/v1/student/score-details/${userName}`,
    data: payload,
  });
};
const editScoreDetailService = (payload, id) => {
  return authenticatedAxiosInstance({
    method: 'put',
    url: `api/v1/student/my-score-details/${id}`,
    data: payload,
  });
};


const getStudentPreferenceDetailsService = (userName, params = {}) => {
  return authenticatedAxiosInstance({
    method: "get",
    url: `/api/v1/student/user-preferences/${userName}`,
    params: params
  });
};
const updateStudentPreferenceStatusService = (userName, payload) => {
  return authenticatedAxiosInstance({
    method: "put",
    url: `/api/v1/student/user-preferences/${userName}`,
    data: payload,
  });
};
const editPreferenceDetailService = (payload, id) => {
  return authenticatedAxiosInstance({
    method: 'put',
    url: `api/v1/student/my-preferences/${id}`,
    data: payload,
  });
};
// profile service close from here

// course service start from here
const getStudentCourseListService = (userName, params = {}) => {
  return authenticatedAxiosInstance({
    method: "get",
    url: `/api/v1/student/student-course/${userName}`,
    params: params
  });
};
const postPreferredCourseService = (payload) => {
  return authenticatedAxiosInstance({
    method: 'post',
    url: `/api/v1/student/preferred-course`,
    data: payload,
  });
};
const uploadMyDocumentsService = (payload, id, documentId) => {
  return authenticatedAxiosInstance({
    method: "post",
    url: `/api/v1/document/submitted-document/${id}/${documentId}`,
    data: payload,
  });
};

const postStudentCourseApplicationService = (payload, userName) => {
  return authenticatedAxiosInstance({
    method: "post",
    url: `/api/v1/student/course-application/${userName}`,
    data: payload,
  });
};

const editStudentCourseApplicationService = (payload, userName, applicationId) => {
  return authenticatedAxiosInstance({
    method: "put",
    url: `/api/v1/student/course-application/${userName}/${applicationId}`,
    data: payload,
  });
};

const getDetailsStudentCourseApplicationService = (userName, applicationId) => {
  return authenticatedAxiosInstance({
    method: "get",
    url: `/api/v1/student/course-application/${userName}/${applicationId}`,
  });
};
// course service close from here


const getApprovalStatusService = (userName) => {
  return authenticatedAxiosInstance({
    method: "get",
    url: `/api/v1/student/get-approval-status/${userName}`,
  });
};

const sendDocumentReminderService = (payload, id) => {
  return authenticatedAxiosInstance({
    method: "post",
    url: `/api/v1/document/send-document-notification/${id}`,
    data: payload,
  });
};

const getAppliedCourseService = (id) => {
  return authenticatedAxiosInstance({
    method: "get",
    url: `/api/v1/student/course-application/${id}`,
  });
};
const getAppliedCourseDetailService = (studentId, id) => {
  return authenticatedAxiosInstance({
    method: "get",
    url: `/api/v1/student/course-application/${studentId}/${id}`,
  });
};

export {
  getAppliedCourseService,
  getAppliedCourseDetailService,
  sendDocumentReminderService,
  getApprovalStatusService,
  getEmploymentDetailService,
  editEmploymentDetailService,
  addEmploymentService,
  editPreferenceDetailService,
  editScoreDetailService,
  getAccommodationApplicationService,
  addAccommodationApplicationService,
  getAccommodationApplicationDetailService,
  editAccommodationApplicationService,
  getStudentPreferenceDetailsService,
  updateStudentPreferenceStatusService,
  getStudentScoreDetailsService,
  updateStudentScoreStatusService,
  getDocumentsListService,
  UpdateDocumentStatusService,
  getRegisteredUserService,
  getRegisteredUserDetailService,
  getRegisteredUserPackageService,
  getRegisteredUserTransactionService,
  PostAddRegisterRemiderService,
  getRegisterUserDetailsService,
  patchTransactionStatusService,
  getUserMappedDocumentService,
  postUserMappedDocumentService,
  putUserMappedDocumentService,
  getUserMappedDocumentDetailService,
  deleteUserMappedDocumentService,
  getVisaApplicationService,
  addVisaApplicationService,
  editVisaApplicationService,
  getVisaApplicationDetailService,
  getApsApplicationService,
  // addApsApplicationService,
  // getApsApplicationDetailService,
  editApsApplicationService,
  getStudentPersonalDetailsService,
  UpdateStudentPersonalDetailsStatusService,
  getStudentMatriculationDetailsService,
  UpdateStudentMatriculationDetailsStatusService,
  getStudentIntermediateDetailsService,
  UpdateStudentIntermediateDetailsStatusService,
  getStudentDiplomaDetailsService,
  UpdateStudentDiplomaDetailsStatusService,
  getStudentGraducationDetailsService,
  updateStudentGraducationDetailsStatusService,
  getStudentPostGraducationDetailsService,
  updateStudentPostGraducationDetailsStatusService,
  getStudentEmploymentDetailsService,
  UpdateStudentEmploymentStatusService,
  getStudentCourseListService,
  postPreferredCourseService,
  editDiplomaDetailService,
  editGraduationDetailService,
  editMatriculationDetailService,
  editIntermediateDetailService,
  editPostGraduationDetailService,
  editProfileDetailService,
  editDocumentsService,
  uploadMyDocumentsService,
  postStudentCourseApplicationService,
  editStudentCourseApplicationService,
  getDetailsStudentCourseApplicationService,
  getRegisteredUserExportService,
  getExportedRegisteredUsersService
};
