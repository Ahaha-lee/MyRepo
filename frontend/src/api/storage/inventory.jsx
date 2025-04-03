import { postRequest,getRequest,deleteRequest,putRequest,deleteBatchRequest} from "../../utils/Common/request";
import { BaseApi } from "..";
import { update } from "lodash";


export const InventoryApi ={
    getinfo:async (data) => {
        try {
            var response;
            response = await getRequest(BaseApi.baseURL + BaseApi.inventorylist,data);
            return response; 
        } catch (error) {
            console.error('请求错误:', error);
            throw error;
        }
    },
    updateinfo:async (data) => {
        try {
            var response;
            response = await putRequest(BaseApi.baseURL + BaseApi.inventoryupdate,data);
            return response; 
        } catch (error) {
            console.error('请求错误:', error);
            throw error;
        }
    },
    updatequantities:async (data) => {
        try {
            var response;
            response = await postRequest(BaseApi.baseURL + BaseApi.invquantitie,data);
            return response; 
        } catch (error) {
            console.error('请求错误:', error);
            throw error;
        }
    }
}