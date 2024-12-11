import { useState,useEffect } from "react";
import MainLayout from "../../../utils/MainLayOut/MainLayout"
import { CategoryAddModal } from "./CategoryAdd";
import { Pagination } from "../../../utils/SlicePage";
import { CategoryApi } from "../../../api/storage/product";
import { InfoModalCateGory } from "./ProductDetailInfo";
export function CategoryListPage(){
  return (
    <div>
      <MainLayout rightContent={<CategoryListForm />} />
    </div>
  )
}

export function CategoryListForm() {
  const [categories, setCategories]=useState([]);
  const [categoryid, setCotegoryid] = useState();
  const [pagecount,setPagecount] = useState(1)
  const [totalNum, setTotalNum] = useState();  
 const [isOpen, setIsOpen] = useState(false);
 const [modalType, setModalType] = useState(null);
  const getlist = () => {
   CategoryApi.getinfo({
      params: { search_id: '0' ,page:pagecount}
    })
      .then(res => {
        console.log("productlist返回的数据", res);
        setCategories(res.category);
        setTotalNum(res.total_num);
      })
      .catch(error => {
        console.error('错误的信息:', error);
      });
  };
  const totalPages = Math.ceil(totalNum / 10);


  const getinfo = async (category_id) => {
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
                value={categoryid} 
                onChange={(e) => setCotegoryid(e.target.value)} 
            /> 
            <button className="btn btn-primary">查询</button>
        </div>
    <div className="mb-3">
    <button className="btn " type="button" onClick={()=>handleNavigate("addcategory")} >种类新增</button>
    <button className="btn " type="button">删除种类</button>
    </div>
    <hr/>
    <CategoryList Results={categories} fetchDetails={getinfo} />
    <Pagination totalPages={totalPages} onPageChange={setPagecount} />

    {isOpen && modalType === "addcategory" && (<CategoryAddModal
      isOpen={isOpen}
      onRequestClose={closeModal}
    />
     )}
    </>
  );
}

export function CategoryList({Results,fetchDetails}){
  console.log("Results",Results)
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [categoryDetails, setCategoryDetails] = useState(null);
  const [selectAllChecked, setSelectAllChecked]=useState(false);
  const [checkboxStates, setCheckboxStates] = useState({ });
  useEffect(()=>{
    inicheck()
  },[])
  const inicheck=()=>{
    const initialStates = Results.reduce((acc, categories) => {
      acc[categories.ProductID] = false;
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
   }

  //  页面小框单独点击事件函数
   const handleCheckboxChange = (product_id) => {
    setCheckboxStates(prevStates => ({
      ...prevStates,
      [product_id]: !prevStates[product_id]
    }));
  };

  const handleFetchDetails = async (action, category_id) => {
    const details = await fetchDetails(category_id);
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
            <th scope="col">类型ID</th>
            <th scope="col">类型名称</th>
            <th scope="col">类型描述</th>
            <th scope="col">操作</th>
          </tr>
        </thead>
        <tbody>
          {Results.map((result, index) => (
            <tr key={result.ProductID}>
              <td>
                <input
                    className="form-check-input"
                    type="checkbox"
                    checked={checkboxStates[result.ProductID]}
                    onChange={() => handleCheckboxChange(result.ProductID)}
                />
              </td>
              <td>{index + 1}</td>
              <td>{result.CategoryID}</td>
              <td>{result.CategoryName}</td>
              <td>{result.CategoryDesc}</td>
              <td>
                <a href="#" onClick={() =>  handleFetchDetails("categoryinfo", result.CategoryID)}>查看详情
                </a>
              </td>
             
            </tr>
          ))}
        </tbody>
      </table>
      {modalType === "categoryinfo" && (
        <InfoModalCateGory
          isOpen={isOpen}
          onRequestClose={closeModal}
          categoryDetails={categoryDetails}
        />
      )}
    </div>
  </div>
  );
}

