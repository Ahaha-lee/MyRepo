import { useState,useEffect,useContext} from "react";
import MainLayout from "../../../utils/MainLayOut/MainLayout"
import { CategoryAddModal } from "./CategoryAdd";
import { Pagination } from "../../../utils/Common/SlicePage";
import { CategoryApi } from "../../../api/storage/product";
import { InfoModalCateGory } from "./ProductDetailInfo";
import React from "react";
import { CommonTable } from "../../../utils/Common/CommonTable";
const MyContext=React.createContext();
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
  const[pcheckstatus,setPcheckstatus]=useState({});
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


// const deleteCategory = async () => {
//     const newObj = [];
//     for (const key in pcheckstatus) {
//         if (pcheckstatus[key] === true) {
//             newObj.push(key);
//         }
//     }
//     const intArray = newObj.map(Number); // 转换为整数数组
//     try {
//         const res = await CategoryApi.deletebatch({
//             data:  intArray  
//         });
//         console.log("category删除成功", res);
//         getlist();
//     } catch (error) {
//         console.error('错误信息:', error);
//     }
// };

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
    <MyContext.Provider v value={{ pcheckstatus, setPcheckstatus}}>
      <CategoryList Results={categories} fetchDetails={getinfo} />
    </MyContext.Provider>
 
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
  const {pcheckstatus,setPcheckstatus}=useContext(MyContext);
  
  const columns=[
    {
      title:'类型ID',
      key:'CategoryID'
    },
    {
      title:'类型名称',
      key:'CategoryName'
    },
    {
      title:'类型描述',
      key:'CategoryDesc',
    }
  ]
  const tableActions=(record)=>(
    <>
    <button onClick={()=>handleFetchDetails("categoryinfo",record.CategoryID)}>查看详情</button>
    </>
  )

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
      <CommonTable
        columns={columns}
        data={Results}
        checkable={true}
        onCheckChange={setPcheckstatus}
        actions={tableActions}
        idField={"CategoryID"}
        />
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

