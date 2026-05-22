import authenticatedAxiosInstance from '../../../lib/AxiosInstance';

const getSMTPSettingsService = () => {
  return authenticatedAxiosInstance({
    method: 'get',
    url: '/api/v1/mail-settings',
  });
};

const getSMTPSettingDetailsService = (id) => {
  return authenticatedAxiosInstance({
    method: 'get',
    url: `/api/v1/mail-settings/${id}`,
  });
};

const createSMTPSettingService = (payload) => {
  return authenticatedAxiosInstance({
    method: 'post',
    url: '/api/v1/mail-settings',
    data: payload,
  });
};

const updateSMTPSettingService = (payload, id) => {
  return authenticatedAxiosInstance({
    method: 'put',
    url: `/api/v1/mail-settings/${id}`,
    data: payload,
  });
};

const deleteSMTPSettingService = (id) => {
  return authenticatedAxiosInstance({
    method: 'delete',
    url: `/api/v1/mail-settings/${id}`,
  });
};

const activateSMTPSettingService = (id) => {
  return authenticatedAxiosInstance({
    method: 'patch',
    url: `/api/v1/mail-settings/${id}/activate`,
  });
};

const toggleSMTPActiveService = (id) => {
  return authenticatedAxiosInstance({
    method: 'patch',
    url: `/api/v1/mail-settings/${id}/toggle-active`,
  });
};

const setSMTPPrimaryService = (id) => {
  return authenticatedAxiosInstance({
    method: 'patch',
    url: `/api/v1/mail-settings/${id}/set-primary`,
  });
};

const testSMTPConnectionService = (payload, id) => {
  return authenticatedAxiosInstance({
    method: 'post',
    url: `/api/v1/mail-settings/${id}/test`,
    data: payload,
  });
};

export {
  getSMTPSettingsService,
  getSMTPSettingDetailsService,
  createSMTPSettingService,
  updateSMTPSettingService,
  deleteSMTPSettingService,
  activateSMTPSettingService,
  toggleSMTPActiveService,
  setSMTPPrimaryService,
  testSMTPConnectionService,
};
