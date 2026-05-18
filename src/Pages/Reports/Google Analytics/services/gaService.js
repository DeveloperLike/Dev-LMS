import axios from "@/lib/AxiosInstance";
import { baseurl } from "@/lib/Constants";

const BASE_URL = baseurl;

export const getOverview = (params) =>
  axios.get(`${BASE_URL}/google/analytics/overview`, { params });

export const getPages = (params) =>
  axios.get(`${BASE_URL}/google/analytics/pages`, { params });

export const getCountries = (params) =>
  axios.get(`${BASE_URL}/google/analytics/countries`, { params });

export const getDevices = (params) =>
  axios.get(`${BASE_URL}/google/analytics/devices`, { params });

export const getSources = (params) =>
  axios.get(`${BASE_URL}/google/analytics/sources`, { params });

export const getEvents = (params) =>
  axios.get(`${BASE_URL}/google/analytics/events`, { params });

export const getDemographics = (params) =>
  axios.get(`${BASE_URL}/google/analytics/demographics`, { params });
