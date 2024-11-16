import { Link } from 'react-router-dom';
import { CaiGouRouter } from '../../routers/storage_router';

function StoragePage() {
    return (
        <div>
        <CaiGouRouter/>
          <div className="row g-0">
                    <div className="col-2"></div>
                    <div className="col-2"></div>
                    <div className="col-6">
                    <StoragePageForm/>
                    </div>
         </div>
        </div>
    );
}

export default StoragePage;

function StoragePageForm() {
    return (
        <div>
           <Link to="/storage/cgsb">采购申请</Link><br/>
           <Link to="/storage/cgsh">采购审核</Link><br/>
           <Link to="/storage/cgrk">采购入库</Link><br/>
           <Link to="/storage/cgys">采购验收</Link>
        </div>
    );
}
