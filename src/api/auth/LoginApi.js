import axios from "axios";

export const LoginApi =async (data) => {
    const url = `${import.meta.env.VITE_API_URL}/user/login`;
    const res = await axios.post(url, data);
    return res.data;
}