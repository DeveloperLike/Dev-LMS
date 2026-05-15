export const BASE_URL = import.meta.env.VITE_MODE!=="production"? 'http://localhost:8443':'https://yesgermany.org:8443'

export const GET_TOKEN = "g@ba-ifth:6535"
export const GLOBAL_API = `${BASE_URL}/mondayMeetings/generate-reports`
export const GENERATE_REPORT = `${BASE_URL}/api/v1/email/get-live-reports`
export const FETCH_KPI_REPORTS = `${BASE_URL}/kpi/get-departments`