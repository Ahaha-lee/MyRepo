import axios from 'axios';
import { getLocalStorage } from '../../components/localstorage';

const apiClient = axios.create({
  timeout: 20000, 
});

const gettoken=()=>{
  const session = getLocalStorage('session', true)
  const token=session.password;
  return token
}

// 封装 GET 请求  我这里传的是一个params对象
export const getRequest = async (url, { params }) => {
  try {
    console.log("params",params)
    if (params) {
    // 替换 URL 中的路径参数
    for (const key in params) {
      url = url.replace(`:${key}`, encodeURIComponent(params[key]));
      console.log(url);
    }}

    // 发送GET请求
    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    console.error('GET请求错误:', error.response ? error.response.data : error.message);
    throw error; 
  }
};




//封装Post请求
export const postRequest = async (url, data = {}) => {
  try {
      let finalUrl = url;
      let requestData;

      // 检查 data 中是否包含 params
      if (data.params) {
          // 替换 URL 中的路径参数
          for (const key in data.params) {
              if (data.params.hasOwnProperty(key)) {
                  finalUrl = finalUrl.replace(`:${key}`, encodeURIComponent(data.params[key]));
              }
          }
          // 如果有 params，使用 data.data 作为请求数据
          requestData = JSON.stringify(data.data);
      } else {
          // 如果没有 params，直接使用 data 作为请求数据
          requestData = JSON.stringify(data);
      }

      const token = gettoken();

      // 发送 POST 请求
      const response = await apiClient.post(finalUrl, requestData, {
          headers: {
              'Content-Type': 'application/json',
              "Authorization": token
          }
      });
      return response.data;
  } catch (error) {
      console.error('POST请求错误:', error.message);
      throw error;
  }
};  


// 封装 PUT 请求
export const putRequest = async (url, data) => {
  try {
    const params = data.params
    console.log("apipa",data)
    if (params) {
       // 替换 URL 中的路径参数
    for (const key in params) {
      url = url.replace(`:${key}`, encodeURIComponent(params[key]));
      console.log(url);
    }
    }

    // 将 data 转换为 JSON 字符串
    const jsonData = JSON.stringify(data.data);
    console.log("jsondata",jsonData)

    const response = await apiClient.put(url, jsonData);
    return response.data;
  } catch (error) {
    console.error('PUT请求错误:', error);
    throw error; 
  }
};

// 封装 DELETE 请求
export const deleteRequest = async (url,  params ) => {
  try { 
    console.log("params",params)
    
    if (params){
    // 替换 URL 中的路径参数
    for (const key in params) {
      url = url.replace(`:${key}`, encodeURIComponent(params[key]));
      console.log(url);
    }
  }

    // 发送GET请求
    const response = await apiClient.delete(url);
    return response.data;
  } catch (error) {
    console.error('DELETE请求错误:', error);
    throw error; 
  }
};


