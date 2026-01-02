// useAxiosSecure.jsx
import axios from "axios";
import useAuth from "./UseAuth";
import { useNavigate } from "react-router-dom";

const useAxiosSecure = () => {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();

  const axiosSecure = axios.create({
    baseURL: "https://zap-shift-server-sigma-two.vercel.app/",
  });

  // request interceptor: attach token
  axiosSecure.interceptors.request.use(
    async (config) => {
      if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // response interceptor: handle 401 / 403
  axiosSecure.interceptors.response.use(
    (res) => res,
    async (error) => {
      const status = error.response?.status;
      if (status === 403) {
        navigate("/forbidden");
      } else if (status === 401) {
        await logOut();
        navigate("/login");
      }
      return Promise.reject(error);
    }
  );

  return axiosSecure;
};

export default useAxiosSecure;
