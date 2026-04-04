const LOCAL_API_BASE_URL = "http://localhost:5000";
const DEFAULT_PRODUCTION_API_BASE_URL = "https://zorvyn-task-lemon.vercel.app";

export const getApiBaseUrl = () => {
  const envBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

  if (import.meta.env.DEV) {
    return envBaseUrl || LOCAL_API_BASE_URL;
  }

  return envBaseUrl || DEFAULT_PRODUCTION_API_BASE_URL;
};

export const apiUrl = (path = "") => {
  const normalizedBaseUrl = getApiBaseUrl().replace(/\/$/, "");
  const normalizedPath = String(path).replace(/^\/+/, "");

  return normalizedPath ? `${normalizedBaseUrl}/${normalizedPath}` : normalizedBaseUrl;
};