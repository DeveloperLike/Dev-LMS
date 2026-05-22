import axios from "axios";
import { baseurl } from "./Constants";

let signalRef = null;
const authenticatedAxiosInstance = axios.create({
  baseURL: baseurl,
  // timeout: 5000,
});

// Request interceptor
authenticatedAxiosInstance.interceptors.request.use(
  (config) => {
    // signalRef?.abort();
    signalRef = new AbortController();

    // You can add the token or other headers here
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Token ${token}`;
      // config.signal= signalRef.signal;
    }

    const googleToken = localStorage.getItem("google_access_token");
    const googlePropertyId = localStorage.getItem("google_property_id");
    const googleGscSite = localStorage.getItem("google_gsc_site");

    if (googleToken) {
      config.headers["x-google-access-token"] = googleToken;
    }

    // Determine which property ID to send based on the URL
    if (config.url.includes("/google/analytics/")) {
      if (googlePropertyId) {
        config.headers["x-google-property-id"] = googlePropertyId;
      }
    } else if (config.url.includes("/google/search-console/")) {
      if (googleGscSite) {
        config.headers["x-google-property-id"] = googleGscSite;
      }
    } else if (googlePropertyId) {
      // Default fallback
      config.headers["x-google-property-id"] = googlePropertyId;
    }

    // config.headers['ngrok-skip-brouwser-warning'] = 123;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor
authenticatedAxiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // if (error.response && error.response.status === 401 || error.response.status === 403) {
    //   localStorage.removeItem('token');
    //   window.location.href = '/';
    // }
    if (error.response && error.response.status === 401) {
      const url = error.config?.url || "";
      const message = error.response.data?.message || "";
      // Do not logout if it's a third-party or integration error (Google/Facebook/etc.)
      if (
        url.includes('/google') ||
        url.includes('/integration') ||
        url.includes('/facebook') ||
        message.toLowerCase().includes("google") ||
        message.toLowerCase().includes("facebook")
      ) {
        console.warn("Google/Facebook integration credentials expired or invalid, keeping CRM session:", message);
        return Promise.reject(error);
      }
      localStorage.removeItem("token");
      window.location.href = "/";
    }
    return Promise.reject(error);
  },
);

export default authenticatedAxiosInstance;

export const unauthenticatedAxiosInstance = axios.create({
  baseURL: baseurl,
});

// Request interceptor
unauthenticatedAxiosInstance.interceptors.request.use(
  (config) => {
    // signalRef?.abort();
    // signalRef = new AbortController();
    // config.signal = signalRef.signal;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor
unauthenticatedAxiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      const url = error.config?.url || "";
      const message = error.response.data?.message || "";
      // Do not logout if it's an integration endpoint error
      if (
        url.includes('/google') ||
        url.includes('/integration') ||
        url.includes('/facebook') ||
        message.toLowerCase().includes("google") ||
        message.toLowerCase().includes("facebook")
      ) {
        return Promise.reject(error);
      }
      localStorage.removeItem("token");
      window.location.href = "/";
    }

    return Promise.reject(error);
  },
);
