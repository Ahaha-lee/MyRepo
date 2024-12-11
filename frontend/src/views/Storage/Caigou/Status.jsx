import axios from "axios";

const getStatusText = (item) => {
    if (item.checkresult === "") {
        return "待审核";
    } else if (item.putinresult === "") {
        return "待入库";
    } else if (item.examineresult === "") {
        return "待验收";
    } else if (item.checkresult === "不通过") {
        return "审核不通过";
    } else if (item.putinresult === "不通过") {
        return "入库不通过";
    } else if (item.examineresult === "不通过") {
        return "验收不通过";
    } else if (item.isend === 'true') {
        return "已完成";
    } else {
        return "进行中";
    }
};

export const getPageStatus = (page) => {
    return new Promise((resolve, reject) => {
        axios.get(`http://localhost:8081/api/storage/cg/record/status_0/${page}`)
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
