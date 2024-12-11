import { useContext, useEffect, useState } from "react";
import { CategoryApi, ProductApi } from "../../../api/storage/product";
import MainLayout from '../../../utils/MainLayOut/MainLayout.jsx'
import { InfoModal, InfoModalCateGory } from "./ProductDetailInfo";
import { useNavigate } from "react-router-dom";
import { Pagination } from "../../../utils/SlicePage.jsx";
import React from 'react';
const MyContext = React.createContext();
export function ProductListPage() {
  return (
    <MainLayout rightContent={<ProductListForm />} />
  );
}

export function ProductListForm() {
  const [products, setProducts] = useState([]);
  const [productid, setProductid] = useState(0);
  const [pagecount,setPagecount] = useState(1)
  const navigate = useNavigate();
  const [totalNum, setTotalNum] = useState();  
  const[pcheckstatus,setPcheckstatus]=useState({});
 
  const getlist = () => {
    ProductApi.getinfo({
      params: { search_id: 0 ,page:pagecount}
    })
      .then(res => {
        console.log("productlist返回的数据", res);
        setProducts(res.data);
        setTotalNum(res.total_num);
      })
      .catch(error => {
        console.error('错误的信息:', error);
      });
  };
  const totalPages = Math.ceil(totalNum / 10);

  const searchproduact = async () => {
    await getinfo(productid,"search");
  };
  const getinfo = async (product_id,action) => {
    try {
      const res = await ProductApi.getinfo({
        params: { search_id: product_id,page:pagecount}
      });
      console.log('productdetail返回的数据', res);
      if (action==="search"){
      setProducts(res.data);
      setTotalNum(res.total_num);
      }
      const details = res.data[0]; // 获取第一个数据项的详细信息
      return details;
    } catch (err) {
      console.log("错误信息", err);
    }
  };

  const getCategory = async (category_id) => {
    try {
      const res = await CategoryApi.getinfo({
        params: { search_id: category_id }
      });
      console.log('categorydetail返回的数据', res);
      const details = res.category[0];
      return details;
    } catch (error) {
      console.log("错误信息", error);
    }
  };

  const deleteProduct = async () => {
    const newObj = [];
    for (const key in pcheckstatus) {
        if (pcheckstatus[key] === true) {
            newObj.push(key);
        }
    }
    const intArray = newObj.map(Number); // 转换为整数数组
    try {
        const res = await ProductApi.batchdeleteinfo({
            data:  intArray  
        });
        console.log("product删除成功", res);
        getlist();

    } catch (error) {
        console.error('错误信息:', error);
    }
};


  useEffect(() => {
    getlist();
  }, [pagecount]);

  return ( 
    <>
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
    <div className="mb-3">
      <button className="btn " type="button" onClick={()=>navigate("/storage/product_add")}>商品新增</button>
      <button className="btn " type="button" onClick={()=>deleteProduct()}>删除商品</button>
    </div>
    <div>
      <MyContext.Provider v value={{ pcheckstatus, setPcheckstatus, }}>
          <ProductList Results={products} fetchDetails={getinfo} fetchCategory={getCategory} page={pagecount} />
      </MyContext.Provider>
    </div>
    <Pagination totalPages={totalPages} onPageChange={setPagecount} />
    </>
  );
}

export function ProductList({ Results, fetchDetails, fetchCategory,page}) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [productDetails, setProductDetails] = useState(null);
  const [categoryDetails, setCategoryDetails] = useState(null);
  const [selectAllChecked, setSelectAllChecked]=useState(false);
  const [checkboxStates, setCheckboxStates] = useState({ });
  const {pcheckstatus,setPcheckstatus}=useContext(MyContext);
  const navigate = useNavigate();

  useEffect(() => {
    inicheck();
  }, [Results]);
  // 初始化页面商品勾选状态 为flase
  const inicheck=()=>{
    console.log("res",Results)
    const initialStates = Results.reduce((acc, product) => {
      acc[product.ProductID] = false;
      return acc;
      }, {}); 
        setCheckboxStates(initialStates);
  }
   // 处理全选框点击事件的函数
   const handleSelectAllClick = () => {
    setSelectAllChecked(!selectAllChecked);
    const newCheckboxStates = {};
    Results.forEach((product) => {
      newCheckboxStates[product.ProductID] = !selectAllChecked;
    });
    setCheckboxStates(newCheckboxStates);
    setPcheckstatus(newCheckboxStates);
   }

  //  页面小框单独点击事件函数
   const handleCheckboxChange = (product_id) => {
    setCheckboxStates(prevStates => ({
      ...prevStates,
      [product_id]: !prevStates[product_id]
    }));
    setPcheckstatus(pre=>({
      ...pre,
      [product_id]:!pre[product_id]
    }))
  };

  const handleFetchDetails = async (action, product_id) => {
    const details = await fetchDetails(product_id);
    setProductDetails(details);
    handleNavigate(action);
  };

  const handleUpdateProduct = async (productId) => {
    const updateProduct = await fetchDetails(productId);
    navigate('/storage/product_update', { state: { product: updateProduct } });
};

  const handleFetchCategory = async (action, category_id) => {
    const details = await fetchCategory(category_id);
    setCategoryDetails(details);
    handleNavigate(action);
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
            <th scope="col">商品描述</th>
            <th scope="col">商品种类</th>
            <th scope="col">操作</th>
          </tr>
        </thead>
        <tbody>
          {Results.map((result, index) => (
            <tr key={result.ProductID}>
              <td>
                {/* 页面单选 */}
                <input
                    className="form-check-input"
                    type="checkbox"
                    checked={checkboxStates[result.ProductID]}
                    onChange={() => handleCheckboxChange(result.ProductID)}
                />
              </td>
              <td>{index + 1}</td>
              <td>{result.ProductID}</td>
              <td>{result.ProductName}</td>
              <td>{result.ProBarcode}</td>
              <td>{result.DetailedlyDesc}</td>
              <td>
                <a href="#" onClick={() => handleFetchCategory("categoryinfo", result.Category)}>
                  {result.Category}
                </a>
              </td>
              <td>
                <button onClick={() => handleFetchDetails("productinfo", result.ProductID)}>查看详情 </button>
                <button onClick={() => handleUpdateProduct(result.ProductID)}>修改 </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      
      {modalType === "productinfo" && (
        <InfoModal
          isOpen={isOpen}
          onRequestClose={closeModal}
          productDetails={productDetails}
        />
      )}
      {modalType === "categoryinfo" && (
        <InfoModalCateGory
          isOpen={isOpen}
          onRequestClose={closeModal}
          categoryDetails={categoryDetails}
        />
      )}
  
  </div>
  );
}

