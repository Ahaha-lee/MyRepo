import React, { useState, useEffect } from 'react';

export function DiscountOperationList() {
    const [activeComponent, setActiveComponent] = useState(null);

    const renderComponent = () => {
        switch (activeComponent) {
            case 'insert':
                return <DiscountInfoinsert />;
            // case 'select':
            //     return <SupplierInfoselect />;
            // case 'delete':
            //     return <SupplierinfoDelete />;
            // case 'update':
            //     return <SupplierInfoUpdate />;
            default:
                return null;
        }
    };

    return (
        <>
            <button onClick={() => setActiveComponent('insert')}>优惠信息添加</button>
            <br />
            {/* <button onClick={() => setActiveComponent('select')}>供应商信息查询</button>
            <br />
            <button onClick={() => setActiveComponent('delete')}>供应商信息删除</button>
            <br />
            <button onClick={() => setActiveComponent('update')}>供应商信息更改</button> */}
            <br />
            <div>
                {renderComponent()}
            </div>
        </>
    );
}

export function DiscountInfoinsert() {
    const [id, setId] = useState("");
    const [applicableitems,setApplicableitems]=useState([])
    
    const [formdata, setFormdata] = useState({
        RuleType: "",
        MinPrice: "",
        DiscountRate: "",
        DiscountAmount: "",
        IsVIP: false,
        StartDate: "",
        EndDate: "",
        UpdatedDate: "",
        ApplicableItems:"",
        selectionType: 'custom',
    });

    useEffect(() => {
        const GetCount = async () => {
            try {
                const response = await fetch(`/api/gettablecount?tablename=discount_rules`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    alert(`查询数据失败: ${errorText}`);
                    return;
                }
                const data = await response.json();
                console.log(data)
                setId(`DR${data}`);
            } catch (error) {
                alert('网络错误，请稍后再试');
                console.error('Error:', error);
            }
        };
        GetCount();
    }, []);


    const handleChange = (event) => {
        const { name, type, checked, value } = event.target;
        setFormdata(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value
        }));
        
    };

   
    const updateApplibaleItems = async() => {
        const newitems = []; 
            // 将输入的字符串转换为数组
            const itemsArray = formdata.ApplicableItems.split(/[,，]/).map(item => item.trim());
            console.log(itemsArray)
        for (let i = 0; i <itemsArray.length; i++) {
            const data = {
                DiscountRuleID:id,
                ProductBarcode:itemsArray[i],       
            };
            console.log(data);//解决异步问题
            newitems.push(data); 
        }
        setApplicableitems((prev) => [...(prev||[]), ...newitems]);
        const values2={
            "type": "applicableItems",
            "items":newitems
        }
        console.log(values2)
        const response1= await fetch(`/api/arrayinsert`,{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values2),
        });
        console.log("values",JSON.stringify(values2))
    
        if (!response1.ok) {
          throw new Error('插入数据失败');
        }
    };
  

    
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const values = {
                DiscountRuleID: id,
                RuleType: formdata.RuleType,
                MinPrice: parseFloat(formdata.MinPrice),
                DiscountRate: parseFloat(formdata.DiscountRate),
                DiscountAmount: parseFloat(formdata.DiscountAmount),
                IsVIP: formdata.IsVIP,
                StartDate: new Date(formdata.StartDate).toISOString(), 
                EndDate: new Date(formdata.EndDate).toISOString(), 
                UpdatedDate: formdata.UpdatedDate,
            };
            const response = await fetch(`/api/tableinfoinsert?tablename=discount_rules`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });
            if (!response.ok) {
                throw new Error('插入数据失败');
            }
            alert('优惠信息录入成功');
            updateApplibaleItems()
            alert('优惠商品信息录入成功') 

        } catch (error) {
            alert('网络错误，请稍后再试');
            console.error('Error:', error);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <h3>优惠信息填写：</h3>
                <label>
                    优惠类型：
                    <input type='text' name="RuleType" value={formdata.RuleType} onChange={handleChange} />
                </label><br />
                <label>
                    最低价格：
                    <input type='number' name="MinPrice" value={formdata.MinPrice} onChange={handleChange} />
                </label><br />
                <label>
                    折扣率：
                    <input type='number' name="DiscountRate" value={formdata.DiscountRate} onChange={handleChange} />
                </label><br />
                <label>
                    满减金额：
                    <input type='number' name="DiscountAmount" value={formdata.DiscountAmount} onChange={handleChange} />
                </label><br />
                <label>
                    是否为会员专属：
                    <input type='checkbox' name="IsVIP" checked={formdata.IsVIP} onChange={handleChange} />
                </label><br />
                <label>
                    开始时间：
                    <input type='datetime-local' name="StartDate" value={formdata.StartDate} onChange={handleChange} />
                </label><br />
                <label>
                    结束时间：
                    <input type='datetime-local' name="EndDate" value={formdata.EndDate} onChange={handleChange} />
                </label><br />
            
                <label>
                    选择类型：
                    <label>
                        <input
                            type='radio'
                            name='selectionType'
                            value='custom'
                            checked={formdata.selectionType === 'custom'}
                            onChange={handleChange}
                        />
                        自定义
                    </label>
                    <label>
                        <input
                            type='radio'
                            name='selectionType'
                            value='all'
                            checked={formdata.selectionType === 'all'}
                            onChange={handleChange}
                        />
                        全部
                    </label><br/>
                    <label>
                    优惠商品列表：
                    <input
                        type='text'
                        name="ApplicableItems"
                        value={formdata.ApplicableItems}
                        onChange={handleChange}
                    />
                </label><br />
                </label>
                <button type="submit">提交</button>
            </form>
        </>
    );
}

