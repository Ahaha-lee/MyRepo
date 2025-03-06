import React, { useState, useEffect } from 'react';
import MainLayout from '../../utils/MainLayOut/MainLayout';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { Pagination } from '../../utils/Common/SlicePage';
import { CommonTable } from '../../utils/Common/CommonTable';
import { DiscoutApi } from '../../api/payment/discount';
import { DiscountTypeApi } from '../../api/payment/discount';
import { DiscountRuleModal,DiscountTypeModal,DiscountRuleCheckapplicableModal } from './DiscountModel';
import { useLocation } from 'react-router-dom';
import { use } from 'react';

const MyContext = React.createContext();
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

   const deleteDiscountrule = async (search_id) => {

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
              <button className="btn" type="button">优惠规则删除</button>

          </div>
          <div>
              <MyContext.Provider value={{ pcheckstatus, setPcheckstatus }}>
                  <DiscountInfoList Results={discount} Typeinfo={discounttype} fetchDetails={getlist} fetchtype={gettype}/>
              </MyContext.Provider>
          </div>
          <Pagination totalPages={totalPages} onPageChange={setPagecount} />
      </>
  );
}

export function DiscountInfoList({Results,Typeinfo,fetchDetails,fetchtype}) {
     const [isOpen, setIsOpen] = useState(false);
      const [modalType, setModalType] = useState(null);
      const [discountDetails, setDiscounDetails] = useState(null);
      const [typeDetails, setTTypeDetails] = useState(null);
      const {pcheckstatus,setPcheckstatus}=useContext(MyContext);
      const [discounttype,setDiscountType] = useState([]);

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
          title: '商品种类',
          key: 'Category',
          render: (value, record) => (
            <a href="#" onClick={() => handleFetchType("discounttypeinfo",record.RuleTypeid
            )}>
                {Typeinfo.find(item => item.Type_id=== record.RuleTypeid)?.Type_name}
            </a>
          )
        }
      ];
    
      const tableActions = (record) => (
        <>
          <button onClick={() => handleNavigate("discountinfo",record.DiscountruleId)}>查看详情</button> 
          <button onClick={() => handleUpdateDiscountrule(record.DiscountruleId)}>修改</button>
        </>
      );
    
      const handleUpdateDiscountrule = async (search_id) => {
        const details = getdetails(search_id);
        navigate('/payment/discount/updaterule', { state: { discountrule: details[0] } });
    };
    
      const handleFetchType = async (action, type_id) => {
        Typeinfo.forEach(Typeinfo => {
            if (Typeinfo.Type_id === type_id) {
                setTTypeDetails(Typeinfo);
            }
        });
        handleNavigate(action);
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
        setModalType(action);
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
                // onCheckChange={setPcheckstatus}
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
            {modalType=="discounttypeinfo" && (
                <DiscountTypeModal
                  isOpen={isOpen}
                  onRequestClose={closeModal}
                  typedetails={typeDetails}
                />
            )}
          
         </div>
        </>
      
              
      );
    
}

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





export function DiscountInfoinsertOrUpdate({existingDiscountRule}) {

    const [applicableitems,setApplicableitems]=useState()
    const [discounttype,setDiscountType]=useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [modalType, setModalType]=useState(null);
    const [products,setProducts]=useState([]);
    const [selectionType,setSelectionType]=useState()
    const handleNavigate = async (action,search_id) => {
        if (!isOpen) {
          setIsOpen(true);
        }
        setModalType(action);
      };
    
      const closeModal = () => {
        setModalType(null);
        setIsOpen(false);
      };

    
    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().slice(0, 16); // 格式化 YYYY-MM-DDTHH:MM
    };

    const [formData, setFormData] = useState({
        RuleTypeid: existingDiscountRule?.RuleTypeid || "",
        Minprice: existingDiscountRule?.Minprice || "",
        DiscountRate: existingDiscountRule?.DiscountRate || "",
        DiscountAmount: existingDiscountRule?.DiscountAmount || "",
        Isvip: existingDiscountRule?.Isvip ,
        DiscountItems: applicableitems,
        StartDate: formatDateForInput(existingDiscountRule?.StartDate),
        EndDate: formatDateForInput(existingDiscountRule?.EndDate),
    });
    

    useEffect(() => {
        getDiscountType(0);
    }, []);
    const handleChange = (event) => {
        const { name, type, checked, value } = event.target;
     
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value
        }));
    };
    const handleChange2=(select)=>{
        if (select === 'custom') {
            setSelectionType(select);
            handleNavigate("applicableitems");
        }else if (select === 'all') {
            setSelectionType(select);
            setApplicableitems("全部商品")
        }
    }
    
    console.log("formdata",formData);
   
  

    
    const updateApplibaleItems = async({itemsarray}) => {
    //     const newitems = []; 
    //         // 将输入的字符串转换为数组
    //         const itemsArray = formdata.ApplicableItems.split(/[,，]/).map(item => item.trim());
    //         console.log(itemsArray)
    //     for (let i = 0; i <itemsArray.length; i++) {
    //         const data = {
    //             // DiscountRuleID:id,
    //             ProductBarcode:itemsArray[i],       
    //         };
    //         console.log(data);//解决异步问题
    //         newitems.push(data); 
    //     }
    //     setApplicableitems((prev) => [...(prev||[]), ...newitems]);
    //     const values2={
    //         "type": "applicableItems",
    //         "items":newitems
    //     }
    //     console.log(values2)
    //     const response1= await fetch(`/api/arrayinsert`,{
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify(values2),
    //     });
    //     console.log("values",JSON.stringify(values2))
    
    //     if (!response1.ok) {
    //       throw new Error('插入数据失败');
    //     }
    };
  
     const handleItemsSubmit=()=>{

    }

    
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {

             const isVipString = formData.Isvip; 
             const isVip = (isVipString === 'true'); 
            
                const values = {
                RuleTypeid: parseInt(formData.RuleTypeid),
                Minprice: parseFloat(formData.Minprice),
                DiscountRate: parseFloat(formData.DiscountRate),
                DiscountAmount: parseFloat(formData.DiscountAmount),
                Isvip: isVip,
                DiscountItems: applicableitems,
                StartDate: new Date(formData.StartDate).toISOString(), 
                EndDate: new Date(formData.EndDate).toISOString(), 
            };
            if (existingDiscountRule) {
        
                console.log("更新成功");
            } else {
                DiscoutApi.add(values).then(res=>{
                    console.log("添加成功",res);
                })
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const getDiscountType = async (search_id) => {
        try{
            DiscountTypeApi.get({
                search:search_id,
                page:1
            }).then((res)=>{
                console.log("typelist返回的数据",res);
                setDiscountType(res.discountTypes);
            })
        }catch(error){
            console.error('请求错误:', error);
        }
    }

    return (
        <div className="container mt-5">
        <form onSubmit={handleSubmit}>
            {existingDiscountRule ? (
                <h3 className="mb-4">优惠表优惠信息数据修改：</h3>
            ) : (
                <h3 className="mb-4">优惠表优惠信息填写：</h3>
            )}
    
            <div className="mb-3">
                <label className="form-label">优惠类型：</label>
                <select
                    className="form-control"
                    name="RuleTypeid"
                    value={formData.RuleTypeid}
                    onChange={handleChange}
                >
                    <option value="">请选择优惠类型</option>
                    {discounttype.map((type, index) => (
                        <option key={index} value={type.Type_id}>
                            {type.Type_name}
                        </option>
                    ))}
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
                value={formatDateForInput(formData.StartDate)}
                onChange={handleChange}
            />
        </div>

        <div className="mb-3">
            <label className="form-label">结束时间：</label>
            <input
                type='datetime-local'
                className="form-control"
                name="EndDate"
                value={formatDateForInput(formData.EndDate)}
                onChange={handleChange}
            />
        </div>
        <div className="mb-3">
            <label className="form-label">选择优惠商品：</label><br />
            <div className="btn-group" role="group" aria-label="Selection Type">
                <button
                    type="button"
                    className={`btn ${selectionType === 'custom' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => handleChange2('custom')}
                >
                    自定义选择商品
                </button>
                <button
                    type="button"
                    className={`btn ${selectionType === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={()=>handleChange2('all')}
                >
                    全部商品
                </button>
            </div>
        </div>
    
            <button type="submit" className="btn btn-primary">
                {existingDiscountRule ? '更新' : '提交'}
            </button>
        </form>
        {modalType=="applicableitems"&& (
            <DiscountRuleCheckapplicableModal
                isOpen={isOpen}
                onRequestClose={closeModal}
                // onSubmit={updateApplibaleItems}
            />
            )
        
        }
    </div>
        
    );
}




