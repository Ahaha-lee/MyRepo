import { application } from "express";


export const  ApplyApi=()=>{
    application:async (data) => {
        try {
            var response;
            if (data.type === "cg") {
                response = await postRequest(BaseApi.baseURL + BaseApi.addVip, data.data);
            } else if (data.type === "out") {
                response = await deleteRequest(BaseApi.baseURL + BaseApi.deletevip, data.params);
            }
            return response; 
        } catch (error) {
            console.error('请求错误:', error);
            throw error;    
        }
    }
}