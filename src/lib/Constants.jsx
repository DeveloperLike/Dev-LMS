// const baseurl = 'http://192.168.1.2:5000';
// const baseurl = 'https://dev-lms.yesgermany.org:8443'; //do not changee real data 
// const baseurl = 'https://lms.yesgermany.org'; //do not changee real data
// const baseurl = 'https://crm-backend.yesgermany.org';
// const baseurl = "http://192.168.99.63:8001";
const baseurl = "http://127.0.0.1:8443";
// const baseurl = "http://13.235.51.155:5000";
// const baseurl = "https://ygcrmgl-be-prod.politetree-8266bad7.centralus.azurecontainerapps.io/";
// const YgApi = "https://yesgermany.org:8443";
const YgApi = baseurl;

// CRM QUERY API
const GET_CRM_RECORDS_API = YgApi + "/mondayMeetings/get-crm-records";

const PAGESIZE = 10;
export { baseurl, PAGESIZE, GET_CRM_RECORDS_API , YgApi};  

