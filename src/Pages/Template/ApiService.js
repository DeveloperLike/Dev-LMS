import authenticatedAxiosInstance from '../../lib/AxiosInstance';

const getWhatsappTemplateVariableListService = () => {
  return authenticatedAxiosInstance({
    method: 'get',
    url: `/api/v1/template/variable-dropdown`,
  });
};

const getWhatsappTemplateListService = (params = {}) => {
  return authenticatedAxiosInstance({
    method: 'get',
    url: `/api/v1/template/template/whatsapp`,
    params: params,
  });
};

const patchWhatsapptemplateListService = (e, id) => {
  return authenticatedAxiosInstance({
    method: 'patch',
    url: `/api/v1/template/template/whatsapp/${id}`,
    data: { status: e },
  });
};

const getSmsTemplateListservice = (params = {}) => {
  return authenticatedAxiosInstance({
    method: 'get',
    url: `/api/v1/template/template/sms`,
    params: params,
  });
};

const patchSmstemplateListService = (e, id) => {
  return authenticatedAxiosInstance({
    method: 'patch',
    url: `/api/v1/template/template/sms/${id}`,
    data: { status: e },
  });
};

const addwhatsapptemplate = (payload) => {
  return authenticatedAxiosInstance({
    method: 'post',
    url: `/api/v1/template/template/whatsapp`,
    data: payload,
  });
};

const testWhatsappTemplateService = (payload, id) => {
  return authenticatedAxiosInstance({
    method: 'post',
    url: `/api/v1/template/whatsapp-preview/${id}`,
    data: payload,
  })
}

const editwhatsapptemplate = (payload, id) => {
  return authenticatedAxiosInstance({
    method: 'put',
    url: `/api/v1/template/template/whatsapp/${id}`,
    data: payload,
  });
};

const getWhatsappTemplateDetailService = (id) => {
  return authenticatedAxiosInstance({
    method: 'get',
    url: `/api/v1/template/template/whatsapp/${id}`,
  });
};

const getRepportingManagerService = () => {
  return authenticatedAxiosInstance({
    method: 'get',
    url: 'api/v1/user-management/reporting-manager-dropdown'
  });
};

const addsmsTemplateListserService = (payload) => {
  return authenticatedAxiosInstance({
    method: 'post',
    url: `/api/v1/template/template/sms`,
    data: payload,
  })
}

const testSmsTemplateService = (payload, id) => {
  return authenticatedAxiosInstance({
    method: 'post',
    url: `/api/v1/template/sms-preview/${id}`,
    data: payload,
  })
}

const editsmsTemplateListserService = (payload, id) => {
  return authenticatedAxiosInstance({
    method: 'put',
    url: `/api/v1/template/template/sms/${id}`,
    data: payload,
  })
}

const getSmsTemplatedDetailService = (id) => {
  return authenticatedAxiosInstance({
    method: 'get',
    url: `/api/v1/template/template/sms/${id}`,
  });
};

const getEmailTemplateListService = (params = {}) => {
  return authenticatedAxiosInstance({
    method: 'get',
    url: `/api/v1/template/template/email`,
    params: params,
  });
};

const patchEmailtemplateListService = (e, id) => {
  return authenticatedAxiosInstance({
    method: 'patch',
    url: `/api/v1/template/template/email/${id}`,
    data: { status: e },
  });
};

const templateApplyTemplateService = (payload, id) => {
  return authenticatedAxiosInstance({
    method: 'post',
    url: `/api/v1/template/apply-template/${id}`,
    data: payload,
  })
}

export {
  getWhatsappTemplateVariableListService,
  getWhatsappTemplateListService,
  patchWhatsapptemplateListService,
  getSmsTemplateListservice,
  patchSmstemplateListService,
  addwhatsapptemplate,
  getRepportingManagerService,
  addsmsTemplateListserService,
  getEmailTemplateListService,
  patchEmailtemplateListService,
  editsmsTemplateListserService,
  getSmsTemplatedDetailService,
  editwhatsapptemplate,
  getWhatsappTemplateDetailService,
  testSmsTemplateService,
  testWhatsappTemplateService,
  templateApplyTemplateService
};
