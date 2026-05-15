import authenticatedAxiosInstance from "../../lib/AxiosInstance";

const getDripMarketingRuleService = (params = {}) => {
    return authenticatedAxiosInstance({
        method: 'get',
        url: '/api/v1/lead-management/drip-marketing-rule',
        params: params,
    });
};
const getDripMarketingRuleDetailsService = (id) => {
    return authenticatedAxiosInstance({
        method: 'get',
        url: `/api/v1/lead-management/drip-marketing-rule/${id}`,
    });
};
const getEventFieldsDropdown = () => {
    return authenticatedAxiosInstance({
      method: 'get',
      url: `/api/v1/lead-management/drip-event-fields-attributes`,
    });
  };
const postDripMarketingRuleService = (payload) => {
    return authenticatedAxiosInstance({
        method: 'post',
        url: '/api/v1/lead-management/drip-marketing-rule',
        data: payload,
    });
};
const putDripMarketingRuleService = (payload, id) => {
    return authenticatedAxiosInstance({
        method: 'put',
        url: `/api/v1/lead-management/drip-marketing-rule/${id}`,
        data: payload,
    });
};
const deleteDripMarketingRuleService = (id) => {
    return authenticatedAxiosInstance({
        method: 'delete',
        url: `/api/v1/lead-management/drip-marketing-rule/${id}`,
    });
};
const getWatiTemplatesService = () => {
    return authenticatedAxiosInstance({
        method: 'get',
        url: `/api/v1/wati/templates`,
    });
};

export {
    getDripMarketingRuleService,
    postDripMarketingRuleService,
    getDripMarketingRuleDetailsService,
    putDripMarketingRuleService,
    deleteDripMarketingRuleService,
    getEventFieldsDropdown,
    getWatiTemplatesService
};
