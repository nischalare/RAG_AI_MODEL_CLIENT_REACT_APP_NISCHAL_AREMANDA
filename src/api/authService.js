import api from "./axiosInstance";

export const loginUser = async (data) => {
  const response = await api.post("/login", data);
  return response.data;
};

export const registerUser = async (data) => {
  const response = await api.post("/register", data);
  return response.data;
};
