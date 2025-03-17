import React from "react";
export function VipDash({Results}){
    console.log(Results)
    
    return (
        <div className="d-flex" style={{width:'100%'}}>
            <table class="table">
            <thead>
                <tr>
                <th scope="col">#</th>
                <th scope="col">ID</th>
                <th scope="col">名字</th>
                <th scope="col">手机号</th>
                <th scope="col">注册时间</th>
                <th scope="col">可用积分</th>
                <th scope="col">消耗积分</th>
                </tr>
            </thead>

            <tbody>
                    {Results.map((result, index) => (
                        <tr key={result.vipid}>
                            <th scope="row">{index + 1}</th>
                            <td>{result.vipid}</td>
                            <td>{result.name}</td>
                            <td>{result.phone}</td>
                            <td>{result.joindate}</td>
                            <td>{result.nowpoints}</td>
                            <td>{result.usedpoints}</td>
                            <td>{result.regihandler}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}


export function AVipDash({Results}){
    return (
        <div>
            <table class="table">
            <thead>
                <tr>
                <th scope="col">#</th>
                <th scope="col">ID</th>
                <th scope="col">名字</th>
                <th scope="col">手机号</th>
                <th scope="col">注册时间</th>
                <th scope="col">可用积分</th>
                <th scope="col">消耗积分</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                <th scope="row">1</th>
                <td>{Results.vipid}</td>
                <td>{Results.name}</td>
                <td>{Results.phone}</td>
                <td>{Results.joindate}</td>
                <td>{Results.nowpoints}</td>
                <td>{Results.usedpoints}</td>
                </tr>
            </tbody>
            </table>
        </div>
    );
}

