import axios from "axios";


export const getStatusText = (item) => {
    if (item.checkresult==""){
     return "待审核"
    }else if (item.outresult==""||item.checkresult=="通过"){
     return"待出库"
    }else if(item.checkresult=="不通过"){
     return "审核不通过"
    } else if(item.outresult=="不通过"){
     return "出库不通过"
    }else if(item.isend=='true'){}
}
export const getPageStatus = (page) => {
    return new Promise((resolve, reject) => {
        axios.get(`http://localhost:8081/api/storage/ck/record/status_0/${page}`)
           .then(res => {
                console.log("返回的status", res);
                if (res.data.data.length === 0) {
                    resolve([]);
                    return;
                }
                const updatedPagestatus = res.data.data.map(item => {
                    const statusText = getStatusText(item);
                    return {
                        recordid: item.recordid,  
                        status: statusText
                    };
                });
                resolve(updatedPagestatus);
            })
           .catch((error) => {
                console.log("status错误信息", error);
                reject(error);
            });
    });
};


