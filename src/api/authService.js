import api from "./axiosInstance";

/**
 * Login user using OAuth2 form format
 * FastAPI expects:
 *  - username
 *  - password
 *  - application/x-www-form-urlencoded
 */
export const loginUser = async (email, password) => {
  const formData = new URLSearchParams();
  formData.append("username", email);   // OAuth2 expects username
  formData.append("password", password);

  const response = await api.post(
    "/auth/login",
    formData,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }
  );

  return response.data;
};


/**
 * Register user (JSON format)
 */
export const registerUser = async (data) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};
