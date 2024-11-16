import { VIPRouter } from '../../routers/vip_router';
import { Link } from 'react-router-dom';

function VIPPage() {
    return (
        <div>
          <VIPRouter/>
          <div className="row g-0">
                    <div className="col-2"></div>
                    <div className="col-6">
                    <VIPPageForm/>
                    </div>
                    <div className="col-4"></div>
         </div>
        </div>
    );
}

export default VIPPage;

function VIPPageForm() {
    return (
        <div>
           <Link to="/vip/addvip">会员注册</Link><br/>
           <Link to="/vip/deletevip">会员注销</Link><br/>
           <Link to="/vip/searchvip">会员信息查询</Link><br/>
           <Link to="/vip/changepoints">会员积分修改</Link>
        </div>
    );
}
