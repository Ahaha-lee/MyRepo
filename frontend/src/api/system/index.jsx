import { postRequest,getRequest,deleteRequest,putRequest} from "../../utils/Common/request";
import { BaseApi } from "..";


export const PermissionApi = {
    getinfo: async (data) => {
        try{
            const res = await getRequest(BaseApi.baseURL + BaseApi.permissioninfosearch, data);
            return res;
        }catch(error){
            console.error('请求错误:', error);
            throw error;
        }
    },
}


export const roleApi = {
    getinfo: async (data) => {
        try{
            const res = await getRequest(BaseApi.baseURL + BaseApi.roleinfosearch, data);
            return res;
        }catch(error){
            console.error('请求错误:', error);
            throw error;
        }
    },
}

export const PermissionAndRoleApi={
    getinfo: async (data) => {
        try{
            const res = await getRequest(BaseApi.baseURL + BaseApi. permissionandroleinfo, data);
            return res;
        }catch(error){
            console.error('请求错误:', error);
            throw error;
        }
    },
}