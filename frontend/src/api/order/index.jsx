
import { postRequest,getRequest,deleteRequest,putRequest} from "../../utils/Common/request";
import { BaseApi } from "..";


export const OrderApi = {
    orderindexget: async (data) => {
        try{
            const res = await getRequest(BaseApi.baseURL + BaseApi.orderindexinfoget,data);
            return res;
        }catch(error){
            console.error('请求错误:', error);
            throw error;
        }
    },
    ordercontentget: async (data) => {
        try{
            const res = await getRequest(BaseApi.baseURL + BaseApi.ordercontentinfoget,data);
            return res;
        }catch(error){
            console.error('请求错误:', error);
            throw error;
        }
    },
    orderinsert: async (data) => {
        try{
            const res = await postRequest(BaseApi.baseURL + BaseApi.orderinfoinsert,data);
            return res;
        }catch(error){
            console.error('请求错误:', error);
            throw error;
        }
    },
}