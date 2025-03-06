import { postRequest,getRequest,deleteRequest,putRequest} from "../../utils/Common/request";
import { BaseApi } from "..";

//membership 
export const VipMemberApi={
        vip: async (data) => {
            try {
                var response;
                if (data.type === "add") {
                    response = await postRequest(BaseApi.baseURL + BaseApi.addVip, data.data);
                } else if (data.type === "delete") {
                    response = await deleteRequest(BaseApi.baseURL + BaseApi.deletevip, data.params);
                }
                return response; 
            } catch (error) {
                console.error('请求错误:', error);
                throw error;    
            }
        }
}

export const SearchVipApi = {
    searchvip: async (data) => {
        try {
            const response = await getRequest(BaseApi.baseURL+BaseApi.searchvip, data);
            return response; 
        } catch (error) {
            console.error('请求错误:', error);
            throw error;
        }
    }
}
export const VIPPointsApi={
    vippoints: async (data) => {
        try {
            const response = await putRequest(BaseApi.baseURL+BaseApi.updatevip, data);
            return response; 
        } catch (error) {
            console.error('请求错误:', error);
            throw error;
        }
    }
}


export const VIPListApi={
    list: async (data) => {
        try {
            const response = await getRequest(BaseApi.baseURL+BaseApi.viplist,data);
            return response; 
        } catch (error) {
            console.error('请求错误:', error);
            throw error;
        }
    }
}


export const VipGrade={
    insert: async (data) => {
        try {
            const response = await postRequest(BaseApi.baseURL+BaseApi.vipgraderule,data);
            return response; 
        } catch (error) {
            console.error('请求错误:', error);
            throw error;
        }
    },
    get: async () => {
        try {
            const response = await getRequest(BaseApi.baseURL+BaseApi.getgradeinfo,{});
            return response; 
        } catch (error) {
            console.error('请求错误:', error);
            throw error;
        }
    },

}