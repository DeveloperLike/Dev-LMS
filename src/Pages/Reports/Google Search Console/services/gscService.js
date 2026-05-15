import axios from "@/lib/AxiosInstance";

const BASE_URL = "https://yesgermany.org:8443";

export const getOverview = (params) =>
  axios.get(`${BASE_URL}/google/search-console/overview`, { params });

export const getPages = (params) =>
  axios.get(`${BASE_URL}/google/search-console/pages`, { params });

export const getQueries = (params) =>
  axios.get(`${BASE_URL}/google/search-console/keywords`, { params });

export const getGeoDevice = (params) =>
  axios.get(`${BASE_URL}/google/search-console/geo-device`, { params });
