import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: import.meta.env.DEV ? `${import.meta.env.VITE_BACKEND_URL}` : '/api/v1',
    withCredentials: true
})


axiosInstance.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                await axiosInstance.post("/users/refreshAccessToken");
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);