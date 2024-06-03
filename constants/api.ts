const API_ENDPOINT_BASE = "https://jsonplaceholder.typicode.com";
export const API_ENDPOINTS = {
  BASE: API_ENDPOINT_BASE,
  POSTS: `${API_ENDPOINT_BASE}/posts`,
  ALBUMS: `${API_ENDPOINT_BASE}/albums`,
} as const;
