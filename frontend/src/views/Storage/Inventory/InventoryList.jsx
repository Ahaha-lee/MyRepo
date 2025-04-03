import React, { useState ,useEffect} from 'react';
import MainLayout from '../../../utils/MainLayOut/MainLayout';
import { Pagination } from '../../../utils/Common/SlicePage';
import {InventoryApi} from '../../../api/storage/inventory';
import { InventoryDetailInfoModal } from './InventoryDetailInfo';
import { useNavigate } from 'react-router-dom';
import { CommonTable } from '../../../utils/Common/CommonTable';


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
export const InventoryList = ({ Results, feachdetail }) => {
  const [inventoryDetails, setInventoryDetails] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const navigate = useNavigate();

  const lowStockItems = Results.filter(item => item.Stocknow_quantity < item.Stock_minquantity);

  const columns = [
      {
          title: "商品 ID",
          key: "Inventory_id"
      },
      {
          title: "商品图片",
          key: "ImagePath"
      },
      {
          title: "商品名称",
          key: "Inv_productname"
      },
      {
          title: "商品条码",
          key: "Inv_barcode"
      },
      {
          title: "商品状态",
          key: "Inv_status"
      },
      {
          title: "库存现有数量",
          key: "Stocknow_quantity"
      },
      {
          title: "商品数量单位",
          key: "Inv_unit"
      }
  ];

  const tableActions = (record) => (
      <>
          <button onClick={() => handleFetchDetails("inventtoryinfo", record.Inventory_id)}>查看详情</button>
          <button onClick={() => handleUpdateProduct(record.Inventory_id)}>修改</button>
      </>
  );

  const handleFetchDetails = async (action, product_id) => {
      const details = await feachdetail(product_id);
      setInventoryDetails(details);
      handleNavigate(action);
  };

  const handleUpdateProduct = async (productId) => {
      const updateProduct = await feachdetail(productId);
      navigate('/storage/inventory_update', { state: { product: updateProduct } });
  };

  const handleNavigate = async (action) => {
      if (!isOpen) {
          setIsOpen(true);
      }
      setModalType(action);
  };

  const closeModal = () => {
      setModalType(null);
      setIsOpen(false);
  };

  return (
      <div>
          <div className="container">
              {lowStockItems.length > 0 && (
                  <div className="alert alert-warning">
                      以下商品库存低于最低库存量：
                      <ul>
                          {lowStockItems.map(item => (
                              <li key={item.Inventory_id}>
                                  {item.Inv_productname} (现有库存: {item.Stocknow_quantity}, 最低库存: {item.Stock_minquantity})
                              </li>
                          ))}
                      </ul>
                  </div>
              )}
              <CommonTable
                  columns={columns}
                  data={Results}
                  checkable={true}
                  // onCheckChange={setPcheckstatus}
                  actions={tableActions}
                  idField={"Inventory_id"}
              />

              {modalType === "inventtoryinfo" && (
                  <InventoryDetailInfoModal
                      Result={inventoryDetails}
                      isOpen={isOpen}
                      onRequestClose={closeModal}
                  />
              )}
          </div>
      </div>
  );
};