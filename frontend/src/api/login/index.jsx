import { postRequest } from "../../utils/request";
import { BaseApi } from "..";



export const RegisterApi = {
    register: async (data) => {
        try {
            const response = await postRequest(BaseApi.baseURL+BaseApi.register, data);
            return response; 
        } catch (error) {
            console.error('注册请求错误:', error);
            throw error; 
        }
    },
};

export const LoginApi = {
    login: async (params) => {
        try {
            const response = await postRequest(BaseApi.baseURL+BaseApi.login, params);
            return response; 
        } catch (error) {
            console.error('登录请求错误:', error);
            throw error; 
        }
    },
};
