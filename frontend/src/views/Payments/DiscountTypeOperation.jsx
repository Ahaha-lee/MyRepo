import { useState } from "react";
import { DiscountTypeApi } from "../../api/payment/discount";
import { CommonTable } from "../../utils/Common/CommonTable";
import MainLayout from "../../utils/MainLayOut/MainLayout";
import { useEffect } from "react";
import { Pagination } from "../../utils/Common/SlicePage";




export function TypeListPage(){
    return(
        <div>
            <MainLayout rightContent={<TypeListForm />} />
        </div>
    )
}

export function TypeListForm(){
    const [discounttype,setDiscountType] = useState([]);
    const [pagecount,setPagecount]=useState(0);
    const [page,setPage]=useState(1);
    const [search,setSearch]=useState("");
    const [totalNum,setTotalNum]=useState(0);
    useEffect(()=>{
        getDiscountType(0);
    },[pagecount])
    const getDiscountType = async (search_id) => {
        try{
            DiscountTypeApi.get(
            {params:{
                search:search_id,
                page:page
            }}).then((res)=>{
                console.log("list返回的数据",res);
                setDiscountType(res.discountTypes);
                setTotalNum(res.total_num);
            })
        }catch(error){
            console.error('请求错误:', error);
        }
    }
    const totalPages = Math.ceil(totalNum / 10);
    return(
        <div>
             <div className="mb-3">
              <label className="form-label">查询ID:</label>
              <input 
                  type="text" 
                  className="form-control"
                  style={{ width: '30%' }}
                  value={search} 
                  onChange={(e) => setSearch(e.target.value)} 
              /> 
              <button className="btn btn-primary" onClick={() => getDiscountType(search)}>查询</button>
          </div>
        <div>
            <button className="btn">优惠类型新增</button>
        </div>
        <hr/>

        <>
        <TypeList Results={discounttype} fetchDetails={getDiscountType}/>
        </>
   <Pagination totalPages={totalPages} onPageChange={setPagecount} />
        </div>
    )
}

export function TypeList({Results,fetchDetails}){
    const columns=[
        {
            title: 'ID',
            key:"Type_id"
        },
        {
            title: '名称',
            key:"Type_name"
        },
        {
            title: '描述',
            key:"Type_desc"
        },
        {
            title: '操作',
            key:"operation",
            // render:(record)=>(
            //     <>
            //     <button onClick={()=>handleFetchDetails("typeinfo",record.Type_id)}>查看详情</button>
            //     </>
            // )
        }
    ]
    return(
        <div>
            <CommonTable
               columns={columns}
               data={Results}
               checkable={true}
            //    actions={tableActions}
               idField={"Type_id"}
            />
        </div>
    )
}