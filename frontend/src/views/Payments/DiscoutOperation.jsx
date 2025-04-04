import React, { useState, useEffect } from 'react';
import MainLayout from '../../utils/MainLayOut/MainLayout';
import { useNavigate } from 'react-router-dom';
import { Pagination } from '../../utils/Common/SlicePage';
import { CommonTable } from '../../utils/Common/CommonTable';
import { DiscoutApi } from '../../api/payment/discount';
import { DiscountTypeApi } from '../../api/payment/discount';
import { DiscountRuleModal, SelfCheck} from './DiscountModel';
import { useLocation } from 'react-router-dom';



export function DiscountInfoPage() {
    return(
    <div>
        <MainLayout rightContent={<DiscountOperationForm />} />
    </div>
    );
}



export function DiscountOperationForm() {
  const [discount, setDiscount] = useState([]);
  const [id, setId] = useState(0);
  const [pagecount, setPagecount] = useState(1);
  const navigate = useNavigate();
  const [totalNum, setTotalNum] = useState(0);  
  const [pcheckstatus, setPcheckstatus] = useState({});
  const [discounttype,setDiscountType] = useState([]);
  // 使用 useEffect 来获取数据
  useEffect(() => {
      getlist("searchlist",0); 
      gettype(0);
  }, [pagecount])


  const getlist = (action,search_id) => {
    if (search_id === undefined || search_id === null) return; // 防止无效的查询
    
    try {
        DiscoutApi.get({
            params: { search_id: search_id, page: pagecount }
        }).then((res) => {
            console.log("list返回的数据", res);
            if (action=="searchlist") { // 只有在数据变化时才更新状态
                setDiscount(res.discounts);
                setTotalNum(res.totalnum);
            }
        })
    } catch (error) {
        console.error('请求错误:', error);
    }
  };
  const totalPages = Math.ceil(totalNum / 10);

  const  gettype= async (search_id) => {
    try{
        const res= await DiscountTypeApi.get(
            {params:{
                search_id:search_id,
                page:1
            }})
            console.log("typelist返回的数据",res);
            const detailstype =res.discountTypes[0]
            setDiscountType(res.discountTypes);
            return detailstype;

    }catch(error){
        console.error('请求错误:',error);
    }
   }

   const deleteDiscountrule = async() => {
    try{
        const newObj = [];
        for (const key in pcheckstatus) {
            if (pcheckstatus[key] === true) {
            newObj.push(key);
            }
        }
        const intArray = newObj.map(Number);
        console.log("newObj", intArray);
        const res = await DiscoutApi.delete({
            data: intArray
        });
        console.log("删除返回的数据",res);
    }catch(error){
        console.error('请求错误:',error);
    }

  }
  return ( 
      <>
          <div className="mb-3">
              <label className="form-label">查询ID:</label>
              <input 
                  type="text" 
                  className="form-control"
                  style={{ width: '30%' }}
                  value={id} 
                  onChange={(e) => setId(e.target.value)} 
              /> 
              <button className="btn btn-primary" onClick={() => getlist(id)}>查询</button>
          </div>
          <div className="mb-3">
              <button className="btn" type="button" onClick={() => navigate('/payment/discount/addrule')}>优惠规则新增</button>
              <button className="btn" type="button" onClick={()=>deleteDiscountrule()}>优惠规则删除</button>

          </div>
          <div>
                  <DiscountInfoList Results={discount} Typeinfo={discounttype} fetchDetails={getlist} setPcheckstatus={setPcheckstatus}/>
          </div>
          <Pagination totalPages={totalPages} onPageChange={setPagecount} />
      </>
  );
}

export function DiscountInfoList({Results,Typeinfo,setPcheckstatus}) {
     const [isOpen, setIsOpen] = useState(false);
      const [modalType, setModalType] = useState(null);
      const [discountDetails, setDiscounDetails] = useState(null);

      const navigate = useNavigate();
      const columns = [
        {
          title: '优惠规则ID',
          key: 'DiscountruleId'
        },
        {
          title: '优惠最小金额',
          key: 'Minprice'
        },
        {
          title: '优惠折扣',
          key: 'DiscountRate'
        },
        {
          title: '开始日期',
          key: 'StartDate'
        },
        {
          title:'结束日期',
          key: 'EndDate'
        },
        {
          title: '是否会员专属',
          key: 'Isvip'
        },
        {
          title: '优惠商品',
          key: 'DiscountItems'
        },
      
        {
          title: '优惠种类',
          key: 'Category',
          render: (value, record) => {
            const typeName = Typeinfo.find(item => item.Type_id === record.RuleTypeid)?.Type_name;
            return (
                <div> {typeName}</div>
            );
        }
        }
      ];
  

    
      const tableActions = (record) => (
        <>
          <button onClick={() => handleNavigate("discountinfo",record.DiscountruleId)}>查看详情</button> 
          {/* <button onClick={() => handleUpdateDiscountrule(record.DiscountruleId)}>修改</button> */}
        </>
      );
    
      const handleUpdateDiscountrule = async (search_id) => {
        const details = getdetails(search_id);
        navigate('/payment/discount/updaterule', { state: { discountrule: details[0] } });
    };
    
    const getdetails = (search_id) => {
        const matchingResults = Results.filter(result => result.DiscountruleId == search_id);
        matchingResults.forEach(matchingResult => {
            setDiscounDetails(matchingResult);
        });
        return matchingResults;
    };
    
      const handleNavigate = async (action,search_id) => {
        if (!isOpen) {
          setIsOpen(true);
        }
        if (action=="discountinfo")
        {
            getdetails(search_id);
        }
        setModalType(action)
      };
    
      const closeModal = () => {
        setModalType(null);
        setIsOpen(false);
      };
      
      return (
        <>
           <div className="container">
               <CommonTable
                columns={columns}
                data={Results}
                checkable={true}
                onCheckChange={setPcheckstatus}
                actions={tableActions}
                idField={"DiscountruleId"}
              />
         </div>
         <div>
            {modalType == 'discountinfo' && (   
                <DiscountRuleModal
                  isOpen={isOpen}
                  onRequestClose={closeModal}
                  diacountDetails={discountDetails}
                />
            )}
          
          
         </div>
        </>
      
              
      );
    
}







//分界线
export function DiscountRuleAddPage() {
    return (
        <>
        <DiscountInfoinsertOrUpdate/>
        </>
    );
}


export function DiscountRuleUpdatePage() {
    const location = useLocation();
    const { discountrule } = location.state || {}; // 获取传递的信息
    if (!discountrule) {
        return <div>没有找到需要修改的信息</div>;
    }
    return (
        <>
        <DiscountInfoinsertOrUpdate existingDiscountRule={discountrule}/>
        </>
    );
}






export function DiscountInfoinsertOrUpdate({ existingDiscountRule }) {
    const [applicableitems, setApplicableitems] = useState();
    const [isOpen, setIsOpen] = useState(false);
    const [modalType, setModalType] = useState(null);
    const [selecttype, setSelecttype] = useState(null);
    const navigate = useNavigate();
    const handleNavigate = async (action) => {
        if (!isOpen) {
            setIsOpen(true);
        }
        setModalType(action);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    const handleItemsSubmit = (selectedIds) => {
        console.log('已选择的产品 ID:', selectedIds);
        setApplicableitems(selectedIds); // 存储选中的产品 ID
        closeModal();
    };

    const handleSubmit = async () => {
        // 确保日期格式正确
        const newFormData = {
            ...formData,
            StartDate: formatDateTime(formData.StartDate),
            EndDate: formatDateTime(formData.EndDate)
        };

        if (existingDiscountRule) {
            // 更新
            try {
                const res = await DiscoutApi.add(newFormData);
                console.log("更新返回的数据", res);
            } catch (error) {
                console.error('请求错误:', error);
            }
        } else {
            // 新增
            try {
                const res = await DiscoutApi.add(newFormData);
                console.log("新增返回的数据", res);
            } catch (error) {
                console.error('请求错误:', error);
            }
        }
    };

    const handleChange2 = (select) => {
        setSelecttype(select);
        if (select === 'custom') {
            handleNavigate("applicableitems");
        } else {
            setApplicableitems("全部商品");
        }
    };
        // 格式化日期时间为后端需要的格式
        const formatDateTime = (dateTime) => {
            if (!dateTime) return "";
            const date = new Date(dateTime);
            return date.toISOString();
        };
    
        // 格式化日期时间为 input 元素需要的格式
        const formatDateTimeForInput = (dateTime) => {
            if (!dateTime) return "";
            const date = new Date(dateTime);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            return `${year}-${month}-${day}T${hours}:${minutes}`;
        };

    useEffect(() => {
        formData.DiscountItems = applicableitems;
    }, [applicableitems]);

    const [formData, setFormData] = useState({
        RuleType: existingDiscountRule?.RuleType || "",
        Minprice: existingDiscountRule?.Minprice || 0,
        DiscountRate: existingDiscountRule?.DiscountRate || 0,
        DiscountAmount: existingDiscountRule?.DiscountAmount || 0,
        Isvip: existingDiscountRule?.Isvip,
        DiscountItems: existingDiscountRule?.DiscountItems || "",
        StartDate: formatDateTimeForInput(existingDiscountRule?.StartDate) || "",
        EndDate: formatDateTimeForInput(existingDiscountRule?.EndDate) || "",
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        // 如果是数字输入，转换为浮点数；如果是复选框，使用 checked
        const newValue = (type === 'number') ? parseFloat(value) : (type === 'radio' ? checked : value);

        setFormData(prevState => ({
            ...prevState,
            [name]: newValue
        }));
    };





    return (
    <div className="container mt-5">
    <form onSubmit={handleSubmit}>
        {existingDiscountRule ? (
            <h3 className="mb-4">优惠表优惠信息数据修改：</h3>
        ) : (
            <h3 className="mb-4">优惠表优惠信息新增：</h3>
        )}

        <div className="mb-3">
            <label className="form-label">优惠类型：</label>
            <select
                className="form-control"
                name="RuleType"
                value={formData.RuleType}
                onChange={handleChange}
            >
                <option value="">请选择优惠类型</option>
                <option value="discount">折扣</option>
                <option value="fullReduction">满减</option>
            </select>
        </div>

        <div className="mb-3">
            <label className="form-label">最低价格：</label>
            <input
                type='number'
                className="form-control"
                name="Minprice"
                placeholder='顾客购买商品享受优惠的最低金额'
                value={formData.Minprice}
                onChange={handleChange}
            />
        </div>

        <div className="mb-3">
            <label className="form-label">折扣率：</label>
            <input
                type='number'
                className="form-control"
                name="DiscountRate"
                placeholder='优惠折扣，例如 输入0.9即9折'
                value={formData.DiscountRate}
                onChange={handleChange}
            />
        </div>

        <div className="mb-3">
            <label className="form-label">满减金额：</label>
            <input
                type='number'
                className="form-control"
                name="DiscountAmount"
                placeholder="满减类型所属属性，例如顾客购物金额满500元就可以减去100"
                value={formData.DiscountAmount}
                onChange={handleChange}
            />
        </div>

        <div className="mb-3">
            <label className="form-label">是否为会员专享：</label>
            <div className="form-check">
                <input
                    type="radio"
                    className="form-check-input"
                    name="Isvip"
                    value={true}
                    checked={formData.Isvip === true}
                    onChange={handleChange}
                    id="vipYes"
                />
                <label className="form-check-label" htmlFor="vipYes">是</label>
            </div>
            <div className="form-check">
                <input
                    type="radio"
                    className="form-check-input"
                    name="Isvip"
                    value={false}
                    checked={formData.Isvip === false}
                    onChange={handleChange}
                    id="vipNo"
                />
                <label className="form-check-label" htmlFor="vipNo">否</label>
            </div>
        </div>

        <div className="mb-3">
                <label className="form-label">开始时间：</label>
                <input
                    type='datetime-local'
                    className="form-control"
                    name="StartDate"
                    value={formData.StartDate}
                    onChange={handleChange}
                />
        </div>
        <div className="mb-3">
                <label className="form-label">结束时间：</label>
                <input
                    type='datetime-local'
                    className="form-control"
                    name="EndDate"
                    value={formData.EndDate}
                    onChange={handleChange}
                />
       </div>
        <div className="mb-3">
            <label className="form-label">选择优惠商品：</label><br />
            <div className="btn-group" role="group" aria-label="Selection Type">
                <button
                    type="button"
                    className={`btn ${selecttype === 'custom' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => handleChange2('custom')}
                >
                    自定义选择商品
                </button>
                <button
                    type="button"
                    className={`btn ${selecttype === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => handleChange2('all')}
                >
                    全部商品
                </button>
            </div>
            <div>
            <label className="form-label">优惠商品：</label>
            {applicableitems}
            </div>
        </div>
        <button type="submit" className="btn btn-primary">
            {existingDiscountRule ? '更新' : '提交'}
        </button>
        <button className="btn" type="button" onClick={() => navigate('/payment/discount')}>返回</button>
     </form>
     
     {modalType === "applicableitems" && (
                <SelfCheck
                    isOpen={isOpen}
                    onRequestClose={closeModal}
                    handle={handleItemsSubmit}
                />
            )}
        </div>
    );
}




