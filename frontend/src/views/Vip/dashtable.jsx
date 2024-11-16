export function VipDash({Results}){
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
