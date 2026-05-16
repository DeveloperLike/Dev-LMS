import authenticatedAxiosInstance from "../../lib/AxiosInstance";

const getLeadListService = (params = {}) => {
  return authenticatedAxiosInstance({
    method: "get",
    url: `/api/v1/lead-management/leads`,
    params: params,
    count_only: true,
  });
};

const getViewLeadDetailService = (id) => {
  return authenticatedAxiosInstance({
    method: "get",
    url: `/api/v1/lead-management/lead-details/${id}`,
  });
};

const getLeadDetailsService = (id) => {
  return authenticatedAxiosInstance({
    method: "get",
    url: `/api/v1/lead-management/lead-details/${id}`,
  });
};

const deleteLeadService = (id) => {
  return authenticatedAxiosInstance({
    method: "delete",
    url: `/api/v1/lead-management/delete-lead/${id}`,
  });
};

const getLeadSourceService = () => {
  return authenticatedAxiosInstance({
    method: "get",
    url: `/api/v1/lead-management/lead-source`,
  });
};
const getLeadSourceDropdownService = () => {
  return authenticatedAxiosInstance({
    method: "get",
    url: `/api/v1/lead-management/lead-source-dropdown`,
  });
};

const editLeadListService = (leadsource, id, payload) => {
  return authenticatedAxiosInstance({
    method: "put",
    url: `api/v1/lead-management/update-lead/${leadsource}/${id}`,
    data: payload,
  });
};

const getLeadFormFeildService = () => {
  return authenticatedAxiosInstance({
    method: "get",
    url: "/api/v1/lead-management/lead-form-field",
  });
};

const getLeadformsService = () => {
  return authenticatedAxiosInstance({
    method: "get",
    url: "/api/v1/lead-management/lead-forms",
  });
};

const addleadlistService = (payload, leadsource) => {
  return authenticatedAxiosInstance({
    method: "post",
    url: `api/v1/lead-management/add-lead/${leadsource}`,
    data: payload,
  });
};

const addleadPackageService = (payload, id) => {
  return authenticatedAxiosInstance({
    method: "post",
    url: `api/v1/accounting/register-lead/${id}`,
    data: payload,
  });
};

const addFollowupService = (payload) => {
  return authenticatedAxiosInstance({
    method: "post",
    url: `/api/v1/lead-management/follow-up`,
    data: payload,
  });
};

const getLeadListDashboardService = () => {
  return authenticatedAxiosInstance({
    method: "get",
    url: `/api/v1/lead-management/leads`,
  });
};

const getLeadPackageListService = () => {
  return authenticatedAxiosInstance({
    method: "get",
    url: `/api/v1/accounting/package-list`,
  });
};

const PostleadPackageTransactionService = (payload) => {
  return authenticatedAxiosInstance({
    method: "post",
    url: `/api/v1/accounting/transaction`,
    data: payload,
  });
};

const PostTransactionDiscountService = (payload) => {
  return authenticatedAxiosInstance({
    method: "post",
    url: `/api/v1/accounting/add-discount`,
    data: payload,
  });
};

const PostSmsActivityService = (payload) => {
  return authenticatedAxiosInstance({
    method: "post",
    url: `api/v1/lead-management/sms-activity`,
    data: payload,
  });
};

const PostwhatsappActivityService = (payload) => {
  return authenticatedAxiosInstance({
    method: "post",
    url: `api/v1/lead-management/whatsapp-activity`,
    data: payload,
  });
};

const PostAddRemiderService = (payload) => {
  return authenticatedAxiosInstance({
    method: "post",
    url: `api/v1/lead-management/reminder`,
    data: payload,
  });
};

// lead sub tabs api start from here

const getLeadMyReminderDetailsService = (id) => {
  return authenticatedAxiosInstance({
    method: "get",
    url: `api/v1/lead-management/my-reminder/${id}`,
  });
};

const getLeadMyFollowupDetailsService = (id) => {
  return authenticatedAxiosInstance({
    method: "get",
    url: `api/v1/lead-management/my-follow-up/${id}`,
  });
};

const getLeadActivityReportDetailsService = (id) => {
  return authenticatedAxiosInstance({
    method: "get",
    url: `api/v1/lead-management/lead-activity/${id}`,
  });
};

const refurbishMultipleLeadService = (payload) => {
  return authenticatedAxiosInstance({
    method: "post",
    url: `/api/v1/lead-management/refurbish-lead`,
    data: payload,
  });
};

const getViewLeadCardDetailsService = (id) => {
  return authenticatedAxiosInstance({
    method: "get",
    url: `/api/v1/lead-management/lead-card-details/${id}`,
  });
};

// lead sub tabs api close from here

// lead profile api
// profile service start from here
const getLeadStudentPersonalDetailsService = (userName, params = {}) => {
  return authenticatedAxiosInstance({
    method: "get",
    url: `/api/v1/student/lead-student-profile/${userName}`,
    params: params,
  });
};

const editLeadProfileDetailService = (payload, id) => {
  return authenticatedAxiosInstance({
    method: "put",
    url: `api/v1/student/lead-student-profile/${id}`,
    data: payload,
  });
};

// const UpdateStudentPersonalDetailsStatusService = (userName, payload) => {
//   return authenticatedAxiosInstance({
//     method: "put",
//     url: `/api/v1/student/student-profile/${userName}`,
//     data: payload,
//   });
// };

const getLeadMatriculationDetailService = (id) => {
  return authenticatedAxiosInstance({
    method: "get",
    url: `/api/v1/student/lead-matriculation-details/${id}`,
  });
};

const editLeadMatriculationDetailService = (payload, id) => {
  return authenticatedAxiosInstance({
    method: "put",
    url: `/api/v1/student/lead-matriculation-details/${id}`,
    data: payload,
  });
};

// const UpdateLeadStudentMatriculationDetailsStatusService = (userName, payload) => {
//   return authenticatedAxiosInstance({
//     method: "put",
//     url: `/api/v1/student/lead-matriculation-details/${userName}`,
//     data: payload,
//   });
// };

const getLeadStudentIntermediateDetailsService = (id) => {
  return authenticatedAxiosInstance({
    method: "get",
    url: `/api/v1/student/lead-intermediate-details/${id}`,
  });
};

const editLeadIntermediateDetailService = (payload, id) => {
  return authenticatedAxiosInstance({
    method: "put",
    url: `/api/v1/student/lead-intermediate-details/${id}`,
    data: payload,
  });
};

const getLeadStudentDiplomaDetailsService = (id) => {
  return authenticatedAxiosInstance({
    method: "get",
    url: `/api/v1/student/lead-diploma-details/${id}`,
  });
};
const editLeadDiplomaDetailService = (payload, id) => {
  return authenticatedAxiosInstance({
    method: "put",
    url: `/api/v1/student/lead-diploma-details/${id}`,
    data: payload,
  });
};

const getLeadStudentGraducationDetailsService = (id) => {
  return authenticatedAxiosInstance({
    method: "get",
    url: `/api/v1/student/lead-graduation-details/${id}`,
  });
};
const editLeadGraduationDetailService = (payload, id) => {
  return authenticatedAxiosInstance({
    method: "put",
    url: `/api/v1/student/lead-graduation-details/${id}`,
    data: payload,
  });
};

const getLeadStudentPostGraducationDetailsService = (id) => {
  return authenticatedAxiosInstance({
    method: "get",
    url: `/api/v1/student/lead-post-graduation-details/${id}`,
  });
};
const editLeadPostGraduationDetailService = (payload, id) => {
  return authenticatedAxiosInstance({
    method: "put",
    url: `/api/v1/student/lead-post-graduation-details/${id}`,
    data: payload,
  });
};

const addLeadEmploymentService = (payload, username) => {
  return authenticatedAxiosInstance({
    method: "post",
    url: `api/v1/student/lead-employment-details/${username}`,
    data: payload,
  });
};

const getLeadEmploymentDetailService = (id) => {
  return authenticatedAxiosInstance({
    method: "get",
    url: `/api/v1/student/lead-employment-details/${id}`,
  });
};
const editLeadEmploymentDetailService = (payload, username, id) => {
  return authenticatedAxiosInstance({
    method: "put",
    url: `api/v1/student/lead-employment-details/${username}/${id}`,
    data: payload,
  });
};

const getLeadRealPhoneService = async (id) => {
  const response = await authenticatedAxiosInstance({
    method: "get",
    url: `/api/v1/lead-management/lead-details/${id}`,
  });

  const phoneField = response?.data?.data?.lead_fields?.find(
    (field) => field.code === "phone",
  );

  return phoneField?.value || null;
};

const updateActivityLog = async (leadId, activityType, description, notes) => {
  try {
    const response = await authenticatedAxiosInstance.post(
      `/api/v1/leads/${leadId}/activity`,
      {
        activity_type: activityType,
        description: description,
        notes: notes,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating activity log:", error);
    throw error;
  }
};


// -------------------- Drip Marketing Rule ----------------------------------

const deleteDripMarketingRuleService = (id) => {
  return axios.delete(`/lead-management/drip-marketing-rule/${id}`);
};



const findLeadByEmailAndPhone = (payload) => {
  return authenticatedAxiosInstance({
    method: "post",
    url: `api/v1/lead-management/find-lead-data`,
    data: payload,
  });
};


export {
  deleteDripMarketingRuleService,
  updateActivityLog,
  getLeadListService,
  getViewLeadDetailService,
  getLeadDetailsService,
  getLeadSourceService,
  editLeadListService,
  getLeadFormFeildService,
  addleadlistService,
  addleadPackageService,
  addFollowupService,
  getLeadListDashboardService,
  getLeadPackageListService,
  PostleadPackageTransactionService,
  PostSmsActivityService,
  PostwhatsappActivityService,
  getLeadformsService,
  PostAddRemiderService,
  getLeadMyReminderDetailsService,
  getLeadMyFollowupDetailsService,
  getLeadActivityReportDetailsService,
  PostTransactionDiscountService,
  refurbishMultipleLeadService,
  deleteLeadService,
  getLeadSourceDropdownService,
  getViewLeadCardDetailsService,
  getLeadStudentPersonalDetailsService,
  editLeadProfileDetailService,
  editLeadMatriculationDetailService,
  getLeadMatriculationDetailService,
  getLeadStudentIntermediateDetailsService,
  editLeadIntermediateDetailService,
  getLeadStudentDiplomaDetailsService,
  editLeadDiplomaDetailService,
  getLeadStudentGraducationDetailsService,
  editLeadGraduationDetailService,
  getLeadStudentPostGraducationDetailsService,
  editLeadPostGraduationDetailService,
  addLeadEmploymentService,
  getLeadEmploymentDetailService,
  editLeadEmploymentDetailService,
  getLeadRealPhoneService,
  findLeadByEmailAndPhone
};
