import React, { useState ,useEffect} from 'react';
import MainLayout from '../../../utils/MainLayOut/MainLayout';
import { Pagination } from '../../../utils/SlicePage';
import {InventoryApi} from '../../../api/storage/inventory';
import { InventoryDetailInfoModal } from './InventoryDetailInfo';
import { useNavigate } from 'react-router-dom';


export  const InventoryListPage = () => {
    return (
        <div>
            <MainLayout rightContent={<InventoryListForm />} />
        </div>
    );
}
export const InventoryListForm = () => {
    const [pagecount,setPagecount]=useState(1);
    const [inventories ,setInventories]=useState([]);
    const [totalNum,setTotalNum]=useState();
    const [productid,setProductid]=useState(0);

    useEffect(()=>{
        getlist();
    },[pagecount])
    const getlist=()=>{
        try{
            InventoryApi.getinfo({
                params:{search_id:0, page:pagecount}
            }).then((res)=>{
                console.log("库存列表返回的数据",res);  
                setInventories(res.data);
                setTotalNum(res.total_num);
            })
        }catch(error){
            console.error('错误的信息:', error);    
        }
    }
    const searchproduact = async () => {
        await getinfo(productid,"search");
      };
    const getinfo = async (product_id,action) => {
        try {
        const res=await InventoryApi.getinfo({
          params: { search_id: product_id, page:pagecount}
        });
          console.log("inventorydetail返回的数据", res);
          if (action==="search"){
          setInventories(res.data);
          setTotalNum(res.total_num);
          }
          const details = res.data[0]; // 获取第一个数据项的详细信息
          return details;
        } catch (err) {
          console.log("错误信息", err);
        }
      };

    const totalPages=Math.ceil(totalNum / 10);
      return(
        <div>
        <div className="mb-3">
            <label className="form-label">查询ID:</label>
            <input 
                type="text" 
                className="form-control"
                style={{ width: '30%' }}
                value={productid} 
                onChange={(e) => setProductid(e.target.value)} 
            /> 
            <button className="btn btn-primary" onClick={searchproduact}>查询</button>
        </div>
        {InventoryList.length>0&&<InventoryList Results={inventories} feachdetail={getinfo}/>}
        {<Pagination totalPages={totalPages} onPageChange={setPagecount}/>}
        </div>
      );
}   
export const InventoryList=({Results,feachdetail}) => {
    console.log("Results",Results)
    const [selectAllChecked, setSelectAllChecked]=useState(false);
    const [checkboxStates, setCheckboxStates] = useState({ });
    const [inventoryDetails, setInventoryDetails] = useState({});
    const [isOpen, setIsOpen] = useState(false);
    const [modalType, setModalType] = useState(null)
    const navigate=useNavigate();

    useEffect(() => {
        inicheck();
      }, [Results]);
      // 初始化页面商品勾选状态 为flase
      const inicheck=()=>{
        const initialStates = Results.reduce((acc, product) => {
          acc[product.Inventory_id] = false;
          return acc;
          }, {}); 
            setCheckboxStates(initialStates);
      }
       // 处理全选框点击事件的函数
       const handleSelectAllClick = () => {
        setSelectAllChecked(!selectAllChecked);
        const newCheckboxStates = {};
        Results.forEach((product) => {
          newCheckboxStates[product.Inventory_id] = !selectAllChecked;
        });
        setCheckboxStates(newCheckboxStates);
       }
    
      //  页面小框单独点击事件函数
       const handleCheckboxChange = (product_id) => {
        setCheckboxStates(prevStates => ({
          ...prevStates,
          [product_id]: !prevStates[product_id]
        }));
      };

      const handleFetchDetails = async (action, product_id) => {
        const details = await feachdetail(product_id);
        setInventoryDetails(details);
        handleNavigate(action);
      };

      const handleUpdateProduct = async (productId) => {
        const updateProduct = await feachdetail(productId);
        navigate('/storage/inventory_update', { state: { product: updateProduct } });
    };
      const handleNavigate = async(action) => {
        if (!isOpen) {
            setIsOpen(true);
        }
        setModalType(action);
    };
    const closeModal = () => {
        setModalType(null);
        setIsOpen(false);
      };

    return(
    <div>
      <div className="container">
      <table className="table">
        <thead>
          <tr>
            <th scope="col">
              {/* 页面全选 */}
              <input
                className="form-check-input"
                type="checkbox"
                checked={selectAllChecked}
                onChange={handleSelectAllClick}
              />
            </th>
            <th scope="col">#</th>
            <th scope="col">商品ID</th>
            <th scope="col">商品名称</th>
            <th scope="col">商品条码</th>
            <th scope='col'>商品状态</th>
            <th scope='col'>库存现有数量</th>
            <th scope="col">商品数量单位</th>
            <th scope="col">操作</th>
          </tr>
        </thead>
        <tbody>
          {Results.map((result, index) => (
            <tr key={result.Inventory_id}>
              <td>
                {/* 页面单选 */}
                <input
                    className="form-check-input"
                    type="checkbox"
                    checked={checkboxStates[result.ProductID]}
                    onChange={() => handleCheckboxChange(result.Inventory_id)}
                />
              </td>
              <td>{index + 1}</td>
              <td>{result.Inventory_id}</td>
              <td>{result.Inv_productname }</td>
              <td>{result.Inv_barcode}</td>
              <td>{result.Inv_status}</td>
              <td>{result.Stocknow_quantity}</td>
              <td>{result.Inv_unit}</td>
              <td>
                <button onClick={() => handleFetchDetails("inventtoryinfo", result.Inventory_id)}>查看详情 </button>
                <button onClick={() => handleUpdateProduct(result.Inventory_id)}>修改 </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalType==="inventtoryinfo" && (
        <InventoryDetailInfoModal 
            Result={inventoryDetails} 
            isOpen={isOpen} 
            onRequestClose={closeModal} />
       )}
      </div>
    </div>
    )
}