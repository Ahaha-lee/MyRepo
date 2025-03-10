import { useContext, useEffect, useState } from "react";
import { CategoryApi, ProductApi, ProductCacheApi } from "../../../api/storage/product";
import MainLayout from '../../../utils/MainLayOut/MainLayout.jsx';
import { InfoModal, InfoModalCateGory } from "./ProductDetailInfo";
import { useNavigate } from "react-router-dom";
import { Pagination } from "../../../utils/Common/SlicePage.jsx";
import React from 'react';
import { GetCacheProduct } from "./ProductOperation.jsx";
import { CommonTable } from "../../../utils/Common/CommonTable.jsx";

export const MyContext = React.createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [productid, setProductid] = useState(0);
  const [pagecount, setPagecount] = useState(1);
  const [totalNum, setTotalNum] = useState();
  const [pcheckstatus, setPcheckstatus] = useState({});
  const [applicableItems, setApplicableItems] = useState([]);

  const getlist = () => {
    ProductApi.getinfo({
      params: { search_id: 0, page: pagecount }
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

  const getinfo = async (product_id, action) => {
    try {
      const res = await ProductApi.getinfo({
        params: { search_id: product_id, page: pagecount }
      });
      console.log('productdetail返回的数据', res);
      if (action === "search") {
        setProducts(res.data);
        setTotalNum(res.total_num);
      }
      const details = res.data[0];
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

  const checkboxProduct = async (action) => {
    const newObj = [];
    for (const key in pcheckstatus) {
      if (pcheckstatus[key] === true) {
        newObj.push(key);
      }
    }
    console.log("newObj", newObj);
    const intArray = newObj.map(Number);
    try {
      if (action === "delete") {
        const res = await ProductApi.batchdeleteinfo({
          data: intArray
        });
        intArray.length = 0;
        console.log("product删除成功", res);
        getlist();
      } else if (action == "preload") {
        const res = await ProductCacheApi.addinfo(
          {data:intArray});
        intArray.length = 0;
        console.log("product预加载成功", res);
      } else if (action === "showkApplicableItems") {
        setApplicableItems(intArray);
      }
    } catch (error) {
      console.error('错误信息:', error);
    }
  };

  useEffect(() => {
    getlist();
  }, [pagecount]);

  return (
    <MyContext.Provider value={{
      products, setProducts,
      productid, setProductid,
      pagecount, setPagecount,
      totalNum, setTotalNum,
      pcheckstatus, setPcheckstatus,
      applicableItems, setApplicableItems,
      getinfo, getCategory, checkboxProduct,
      getlist
    }}>
      {children}
    </MyContext.Provider>
  );
}

export function ProductListPage() {
  return (
    <MainLayout rightContent={<ProductProvider><ProductListForm action="productlist" /></ProductProvider>} />
  );
}

export function ProductListForm({ action }) {
  const {  productid, setProductid, pagecount, setPagecount, totalNum, checkboxProduct,getinfo,getlist} = useContext(MyContext);
  const navigate = useNavigate();
  const totalPages = Math.ceil(totalNum / 10);

  useEffect(() => {
    getlist();
  }, [pagecount]);
  const searchproduact = async () => {
    await getinfo(productid, "search");
  };

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
        {action === "productlist" ? (
            <div className="mb-3">
                <button className="btn " type="button" onClick={() => navigate("/storage/product_add")}>商品新增</button>
                <button className="btn " type="button" onClick={() => navigate("/storage/product_batchadd")}>批量新增</button>
                <button className="btn " type="button" onClick={() => checkboxProduct("delete")}>删除商品</button>
                <button className="btn " type="button" onClick={() => checkboxProduct("preload")}>缓存预加载</button>
                <button className="btn " type="button" onClick={() => navigate("/storage/product_hot")}>查看缓存商品</button>
            </div>
        ) : null}
        <div>
            <ProductList action={action === "productlist" ? "list" : action} />
        </div>
        <Pagination totalPages={totalPages} onPageChange={setPagecount} />
    </>
);
}

export function GetCacheProductPage() {
  return (
    <MainLayout rightContent={<GetCacheProduct />} />
  );
}

export function ProductList({ action }) {
  const { products, getinfo, getCategory, pcheckstatus, setPcheckstatus } = useContext(MyContext);
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [productDetails, setProductDetails] = useState(null);
  const [categoryDetails, setCategoryDetails] = useState(null);
  const navigate = useNavigate();


  const columns = [
    {
      title: '商品ID',
      key: 'ProductID'
    },
    {
      title: '商品名称',
      key: 'ProductName'
    },
    {
      title: '商品条码',
      key: 'ProBarcode'
    },
    {
      title: '商品描述',
      key: 'DetailedlyDesc'
    },
    {
      title: '商品种类',
      key: 'Category',
      render: (value, record) => (
        <a href="#" onClick={() => handleFetchCategory("categoryinfo", value)}>
          {value}
        </a>
      )
    }
  ];

  const tableActions = (record) => (
    <>
      <button onClick={() => handleFetchDetails("productinfo", record.ProductID)}>查看详情</button>
      {action === "list" ? <button onClick={() => handleUpdateProduct(record.ProductID)}>修改</button> : <></>}
    </>
  );

  const handleFetchDetails = async (action, product_id) => {
    const details = await getinfo(product_id);
    setProductDetails(details);
    handleNavigate(action);
  };

  const handleUpdateProduct = async (productId) => {
    const updateProduct = await getinfo(productId);
    navigate('/storage/product_update', { state: { product: updateProduct } });
  };

  const handleFetchCategory = async (action, category_id) => {
    const details = await getCategory(category_id);
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
        <CommonTable
          columns={columns}
          data={products}
          checkable={true}
          onCheckChange={setPcheckstatus}
          actions={tableActions}
          idField={"ProductID"}
        />
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
