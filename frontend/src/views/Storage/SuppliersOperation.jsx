import { useState,useEffect } from "react";
import { Handleselect } from "../Payments/ProductSelect";


export function SupplierOperationList() {
    const [activeComponent, setActiveComponent] = useState(null);

    const renderComponent = () => {
        switch (activeComponent) {
            case 'insert':
                return <SupplierInfoinsert />;
            case 'select':
                return <SupplierInfoselect />;
            case 'delete':
                return <SupplierinfoDelete />;
            case 'update':
                return <SupplierInfoUpdate />;
            default:
                return null;
        }
    };

    return (
        <>
            <button onClick={() => setActiveComponent('insert')}>供应商信息添加</button>
            <br />
            <button onClick={() => setActiveComponent('select')}>供应商信息查询</button>
            <br />
            <button onClick={() => setActiveComponent('delete')}>供应商信息删除</button>
            <br />
            <button onClick={() => setActiveComponent('update')}>供应商信息更改</button>
            <br />
            <div>
                {renderComponent()}
            </div>
        </>
    );
}

export const ShowSupplierInfo=({supplierdata})=>{
  console.log(supplierdata)
  return(
    <>
    <strong>供应商ID：{supplierdata.supplierID}</strong><br/>          
    <strong>供应商名称：{supplierdata.supplierContactName}</strong><br/>  
    <strong>供应商地址：{supplierdata.supplierAddress}</strong><br/>  
    <strong>供应商负责人姓名：{supplierdata.supplierContactName}</strong><br/>  
    <strong>供应商负责人联系方式：{supplierdata.supplierContactPhone}</strong><br/>  
    <strong>供应商备用联系方式：{supplierdata.supplierContactStandby}</strong><br/>  
    <strong>供应商邮件：{supplierdata.supplierEmail}</strong><br/>  

    </>
  );
}
//信息查找
export function SupplierInfoselect(){
  const [selectdata,setSelectdata]=useState("");
  const [result, setResult] = useState(null); // 初始化为 null
  console.log("result",result)

  return (
    <>
        供应商信息查询：
        <input
            type="text"
            value={selectdata}
            onChange={(event) => setSelectdata(event.target.value)}
        />
        <Handleselect barcode={selectdata} setResult={setResult} tablename={"supplierdata"}/><br/>
        {result&&<ShowSupplierInfo supplierdata={result}/>}
    </>
);
  
}
// 信息插入
export function SupplierInfoinsert(){
    const [supplierid,setSupplierid]=useState("");

    useEffect(()=>{
        const GetCount=async()=>{
          try {
            const response= await fetch(`/api/gettablecount?tablename=supplierdata`, {
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
            const data =await response.json()
           setSupplierid(`S${data+1}`)
      
          } catch (error) {
            alert('网络错误1，请稍后再试');
            console.error('Error:', error);
          }
        }
        GetCount();
    },[])
    console.log(supplierid)
    const [formdata,setFormdata]=useState({
        SupplierName:"",
        SupplierAddress :"",
        SupplierContactName :"",
        SupplierContactPhone :"",
        SupplierContactStandby :"",
        SupplierEmail :"",
        })
    const handleChange = (event) => {
        setFormdata(prevData => ({
          ...prevData,
          [event.target.name]: event.target.value
        }));
      };
    const handleSubmit=async(event)=>{
        event.preventDefault();
        try{
        const values=({
            SupplierID:supplierid,
            SupplierName:formdata.SupplierName,    
            SupplierAddress:formdata.SupplierAddress,
            SupplierContactName:formdata.SupplierContactName,
            SupplierContactPhone:formdata.SupplierContactPhone,
            SupplierContactStandby:formdata.SupplierContactStandby,
            SupplierEmail:formdata.SupplierEmail,
        })
        const response= await fetch(`/api/tableinfoinsert?tablename=supplierdata`,{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
          });
          console.log(values)
    
          if (!response.ok) {
            throw new Error('插入数据失败');
          }
          alert('供应商信息录入成功')
      }catch (error) {
        alert('网络错误，请稍后再试');
        console.error('Error:', error);
      }
    }


    return(
        <>
        <form onSubmit={handleSubmit}>
            供应商信息填写：<br/>
            供应商名称：
            <input type='text' name="SupplierName" value={formdata.SupplierName} onChange={handleChange}  /><br />
            供应商地址：
            <input type='text' name="SupplierAddress" value={formdata.SupplierAddress} onChange={handleChange}  /><br />
            供应商负责人姓名：
            <input type='text' name="SupplierContactName" value={formdata.SupplierContactName} onChange={handleChange}  /><br />
            供应商负责人联系方式：
            <input type='text' name="SupplierContactPhone" value={formdata.SupplierContactPhone} onChange={handleChange}  /><br />
            供应商备用联系方式：
            <input type='text' name="SupplierContactStandby" value={formdata.SupplierContactStandby} onChange={handleChange}  /><br />
            供应商公司邮件：
            <input type='text' name="SupplierEmail" value={formdata.SupplierEmail} onChange={handleChange}  /><br />

            <button type="submit">提交</button>
        </form>
        </>
    );
}

// 删除
export function SupplierinfoDelete(){
  const[deleteid,setDeleteid]=useState("")
  const reqdata=({
    id:deleteid,
    keyword:"SupplierID",
    tablename:"Supplierdata"
  })

  async function handleDelete() {
    try{
      const response = await fetch(`/api/tableinfodelete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(reqdata),
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert(`删除数据失败: ${errorText}`);
        return;
      }
      alert('删除成功')
    }catch (error) {
      alert('网络错误，请稍后再试');
      console.error('Error:', error);
    }
    
  }
  return(
    <>
    删除供应商ID:<br/>
    <input 
        type="text" 
        value={deleteid} 
        onChange={(e) => setDeleteid(e.target.value)} 
    />
    <button onClick={handleDelete}>删除</button>
    </>
  );
}

// 更新
export const SupplierInfoUpdate = () => {
  const [id, setID] = useState("");
  const [data, setData] = useState([]);

  const handleChange = (rowIndex, columnKey, value) => {
      const newData = [...data];
      newData[rowIndex][columnKey] = value;
      setData(newData);
  };
  console.log(data)

  const handleResult = (result) => {
      const formattedData = {
        ...result
      };
      setData([formattedData]); 
  };
  console.log(data)
  const handleSubmit = async () => {
      const reqdata = {   
        SupplierID:data[0].supplierID,
        SupplierName :data[0].suppliertName,
        SupplierAddress  :data[0].supplierAddress,
        SupplierContactName  :data[0].supplierContactName,
        SupplierContactPhone  :data[0].supplierContactPhone,
        SupplierContactStandby :data[0].supplierContactStandby,
        SupplierEmail  :data[0].supplierEmail,
      };
      
      console.log(reqdata)
      try {
          const response = await fetch(`/api/updateproductinfo?tablename=${'supplierdata'}&&id=${id}&&keyword=${"SupplierID"}`, {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(
               reqdata
               ),
              
          });
          console.log(JSON.stringify(
             reqdata
           ))
           if (!response.ok) {
              throw new Error('更新数据失败');
          }
          alert("更新成功");
          } catch (err) {
              alert(err.message)
          }
  }
  const nonEditableColumns = ['SupplierID', 'SupplierName'];

  return (
      <>
      <div>
          更改供应商信息查询：
          <input
              type="text"
              value={id}
              onChange={(event) => setID(event.target.value)}
          />
          <Handleselect barcode={id} setResult={handleResult} tablename={"supplierdata"} />
          <br /><br/>
      </div>
      库存商品信息：
          <table border="1">
              <thead>
                  <tr>
                      <th>供应商ID</th>
                      <th>供应商名称</th>
                      <th>供应商地址</th>
                      <th>供应商直接联系人姓名</th>
                      <th>供应商直接联系人联系方式</th>
                      <th>供应商备用联系方式</th>
                      <th>供应商邮件</th>
                  </tr>
              </thead>
              <tbody>
              {data.map((row, rowIndex) => (
                      <tr key={row.inventoryID}>
                          {Object.keys(row).map((key) => (
                              <td key={key} 
                                  contentEditable={!nonEditableColumns.includes(key)} 
                                  suppressContentEditableWarning={true}
                                  onBlur={(e) => {
                                      if (!nonEditableColumns.includes(key)) {
                                          handleChange(rowIndex, key, e.target.innerText);
                                      }
                                  }}
                                  >
                                  {row[key]}
                              </td>
                          ))}
                      </tr>
                  ))}
              </tbody>
          </table>
          <button onClick={handleSubmit}>提交更改</button>
      </>
  );
};
