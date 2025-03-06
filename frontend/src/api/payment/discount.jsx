import { postRequest,getRequest,deleteRequest,putRequest} from "../../utils/Common/request";
import { BaseApi } from "..";

export const DiscoutApi = {
    add: async (data) => {
        try{
            const res = await postRequest(BaseApi.baseURL + BaseApi.discountinsert, data);
            return res;
        }catch(error){
            console.error('请求错误:', error);
            throw error;
        }
    },
    delete: async (data) => {
        try{
            const res = await postRequest(BaseApi.discountdelete, data);
            return res;
        }catch(error){
            console.error('请求错误:', error);
            throw error;
        }
    },
    get: async (data) => {
        try{
            const res = await getRequest(BaseApi.baseURL + BaseApi.discountsearch, data);
            return res;
        }catch(error){
            console.error('请求错误:', error);
            throw error;
        }
    },
}



export const DiscountTypeApi = {
    add: async (data) => {
        try{
            const res = await postRequest(BaseApi.baseURL + BaseApi.discounttypeinsert, data);
            return res;
        }catch(error){
            console.error('请求错误:', error);
            throw error;
        }
    },
   get: async (data) => {
        try{
            const res = await getRequest(BaseApi.baseURL + BaseApi.discounttypesearch, data);
            return res;
        }catch(error){
            console.error('请求错误:', error);
            throw error;
        }
    },
}