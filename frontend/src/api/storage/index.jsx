import { postRequest,getRequest,deleteRequest,putRequest} from "../../utils/request";
import { BaseApi } from "..";


export const  ListApi ={
   
   cglist:async (data) => {
    try{
        var response;
        response = await getRequest(BaseApi.baseURL + BaseApi.procurementlst,data);
        return response;
    } catch (error) {
        console.error('请求错误:', error);
        throw error;
    }
    },
    cklist:async (data) => {
    try{
        var response;
        response = await getRequest(BaseApi.baseURL + BaseApi.outdeclarationlist,data);
        return response;
    } catch (error) {
        console.error('请求错误:', error);
        throw error;
    }
    }
  }



export const  ApplyApi={
    application:async (data) => {
        try {
            var response;
            if (data.type === "cg") {
                response = await postRequest(BaseApi.baseURL + BaseApi.cgsb, data.data);
            } else if (data.type === "ck") {
                response = await postRequest(BaseApi.baseURL + BaseApi.cksb, data.data);
            }
            return response; 
        } catch (error) {
            console.error('请求错误:', error);
            throw error;    
        }
    }
}


export const  CGOperationApi={
    update:async (data) => {
        try {
            var response;
            if (data.type === "sh") {
                response = await putRequest(BaseApi.baseURL + BaseApi.cgsh, data);
            } else if (data.type === "rk") {
                response = await putRequest(BaseApi.baseURL + BaseApi.cgrk, data)
            }else if (data.type === "ys") {
                response = await putRequest(BaseApi.baseURL + BaseApi.cgys, data)
            }
            return response; 
        } catch (error) {
            console.error('请求错误:', error);
            throw error;    
        }
        }
}

//是状态为未完成的采购申请表  后续还要是要联立records来获取状态
export const InboundRecordsApi={
    getinfo:async () => {
        try {
            var response;
            response = await getRequest(BaseApi.baseURL + BaseApi.inboundrecordslist,{params:{page:'1'}});
            return response; 
        } catch (error) {
            console.error('请求错误:', error);
            throw error;
        }
    }
}

export const CKOperationApi={
    update:async (data) => {
        try {
            var response;
            if (data.type === "sh") {
                response = await putRequest(BaseApi.baseURL + BaseApi.cksh, data);
            } else if (data.type === "ck") {
                response = await putRequest(BaseApi.baseURL + BaseApi.ckck, data)
            }
            return response; 
        } catch (error) {
            console.error('请求错误:', error);
            throw error;    
        }
        }
}   

//是状态为未完成的出库申请表  后续还要是要联立records来获取状态
export const OutRecordsApi={
    getinfo:async () => {
        try {
            var response;
            response = await getRequest(BaseApi.baseURL + BaseApi.outstoragelist,{params:{}});
            return response; 
        } catch (error) {
            console.error('请求错误:', error);
            throw error;
        }
    }
}


export const  InboundRecordsApiPro={
    getinfo:async (data) => {
        try {
            var response;
            response = await getRequest(BaseApi.baseURL + BaseApi.inboundrecords,data);
            return response; 
        } catch (error) {
            console.error('请求错误:', error);
            throw error;
        }
    }
}

export const  OutboundRecordsApiPro={
    getinfo:async (data) => {
        try {
            var response;
            response = await getRequest(BaseApi.baseURL + BaseApi.outboundrecords,data);
            return response; 
        } catch (error) {
            console.error('请求错误:', error);
            throw error;
        }
    }
}

export const StatusApi = {
    getstatus: async (data) => {
        try {
            const response = await getRequest(BaseApi.baseURL + BaseApi.status, data);
            return response; 
        } catch (error) {
            console.error('请求错误:', error);
            throw error;
        }
    }
}

export const DeclaretionApi={
    updatecg: async (data) => {
        try {
            const response = await putRequest(BaseApi.baseURL + BaseApi.procurementupdate, data);
            return response; 
        } catch (error) {
            console.error('请求错误:', error);
            throw error;
        }
    }
}