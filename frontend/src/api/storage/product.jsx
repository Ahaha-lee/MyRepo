import { postRequest,getRequest,deleteRequest,putRequest,deleteBatchRequest} from "../../utils/Common/request";
import { BaseApi } from "..";


export const ProductApi = {
    getinfo: async (data) => {
        try {
            var response;
            response = await getRequest(BaseApi.baseURL + BaseApi.productsearch,data);
            return response; 
        } catch (error) {
            console.error('请求错误:', error);
            throw error;
        }
    },
    addinfo: async (data) => {
        try {
            var response;
            response = await postRequest(BaseApi.baseURL + BaseApi.addproduct,data);
            return response; 
        } catch (error) {
            console.error('请求错误:', error);
            throw error;
        }
    },
   
    deleteinfo: async (data) => {
        try {
            var response;
            response = await deleteRequest(BaseApi.baseURL + BaseApi.deleteproduct,data);
            return response; 
        } catch (error) {
            console.error('请求错误:', error);
            throw error;
        }
    },
    batchdeleteinfo: async (data) => {
        try {
            console.log("api",data);
            var response;
            response = await postRequest(BaseApi.baseURL + BaseApi.batchdeleteproduct,data);
            return response; 
        } catch (error) {
            console.error('请求错误:', error);
            throw error;
        }
    },
    updateinfo: async (data) => {
        try {
            var response;
            response = await putRequest(BaseApi.baseURL + BaseApi. updateprduct,data);
            return response; 
        } catch (error) {
            console.error('请求错误:', error);
            throw error;
        }
    },
    searchhotproduct:async(data)=>{
        try {
            var response;
            response = await getRequest(BaseApi.baseURL + BaseApi.hotproduct,data);
            return response; 
        } catch (error) {
            console.error('请求错误:', error);
            throw error;
        }
    }
    }



export const CategoryApi = {
    getinfo: async (data) => {
        try {
            var response;
            response = await getRequest(BaseApi.baseURL + BaseApi.categorysearch,data);
            return response; 
        } catch (error) {
            console.error('请求错误:', error);
            throw error;
        }
    },
    add: async (data) => {
        try {
            var response;
            response = await postRequest(BaseApi.baseURL + BaseApi.categoryadd,data);
            return response; 
        } catch (error) {
            console.error('请求错误:', error);
            throw error;
        }
    },
    deletebatch: async (data) => {
        try {
            var response;
            response = await postRequest(BaseApi.baseURL + BaseApi.categorydelete,data);
            return response; 
        } catch (error) {
            console.error('请求错误:', error);
            throw error;
        }
    },
}   


export const ProductCacheApi={
    addinfo: async (data) => {
        try {
            var response;
            response = await postRequest(BaseApi.baseURL + BaseApi.preload,data);
            return response; 
        } catch (error) {
            console.error('请求错误:', error);
            throw error;
        }
    },
    getallinfo:async()=>{
        try {
            var response;
            response = await getRequest(BaseApi.baseURL + BaseApi.getcacheallinfo,{params:{}});
            return response; 
        } catch (error) {
            console.error('请求错误:', error);
            throw error;
        }
    }
}