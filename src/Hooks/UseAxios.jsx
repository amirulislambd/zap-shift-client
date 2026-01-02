import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `https://zap-shift-server-sigma-two.vercel.app/`,
});
const UseAxios = () => {
  return axiosInstance;
};

export default UseAxios;
