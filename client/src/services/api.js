import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:5000",
  withCredentials: true,
});

export const getUser = () => api.get("/auth/user");
export const getRepos = () => api.get("/api/repos");
export const getRepoMetrics = (owner, repo) => {
  const url = `/api/repos/${owner}/${repo}/metrics`;
  console.log("Requesting URL:", `${api.defaults.baseURL}${url}`);
  return api.get(url);
};

export default api;
