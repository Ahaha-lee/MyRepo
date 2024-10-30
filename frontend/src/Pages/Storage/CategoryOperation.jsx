import { useState,useEffect} from "react";
import { Handleselect } from "../Payments/ProductSelect";

export function CategoryOPerationList() {
  const [activeComponent, setActiveComponent] = useState(null);

  const renderComponent = () => {
      switch (activeComponent) {
          case 'insert':
              return <Categoryinfoinsert />;
          case 'select':
              return <Categoryinfoselect />;
          case 'delete':
              return <Categoryinfodelete/>;
          default:
              return null;
      }
  };

  return (
      <>
          <button onClick={() => setActiveComponent('insert')}>类型信息添加</button>
          <br />
          <button onClick={() => setActiveComponent('select')}>类型信息查询</button>
          <br />
          <button onClick={() => setActiveComponent('delete')}>类型信息删除</button>
          <br />
          <br />
          <div>
              {renderComponent()}
          </div>
      </>
  );
}

export function ShowCatrgoryInfo({categorydata}){
  return(
    <>
<strong>类型ID:  {categorydata.CategoryID}</strong>
<strong>具体类型:{categorydata.CategoryName}</strong>
<strong>类型描述:{categorydata.CategoryDesc}</strong>
    </>
  );
}

export function Categoryinfoselect(){
  const [selectdata,setSelectdata]=useState("");
  const [result, setResult] = useState(null); // 初始化为 null
  console.log("result",result)

  return (
    <>
        类型信息查询：
        <input
            type="text"
            value={selectdata}
            onChange={(event) => setSelectdata(event.target.value)}
        />
        <Handleselect barcode={selectdata} setResult={setResult} tablename={"producct_categories"}/><br/>
        {result&&<ShowCatrgoryInfo categorydata={result}/>}
    </>
  );
}



export function Categoryinfoinsert(){
    const [categoryid,setCategoryid]=useState("");

    useEffect(()=>{
        const GetCount=async()=>{
          try {
            const response= await fetch(`/api/gettablecount?tablename=product_categories`, {
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
           setCategoryid(`C${data+1}`)
      
          } catch (error) {
            alert('网络错误1，请稍后再试');
            console.error('Error:', error);
          }
        }
        GetCount();
    },[])

    const [formdata,setFormdata]=useState({
        CategoryName:"",
        CategoryDesc:"",
        });
    const handleChange=(event)=>{
            setFormdata(prev=>({
                ...prev,
                [event.target.name]:event.target.value
            }))
        }
    const handleSubmit=async(event)=>{
        event.preventDefault();
        const values=({
            CategoryID:categoryid,
            CategoryName:formdata.CategoryName,
            CategoryDesc:formdata.CategoryDesc,
        })

        try{
            const response= await fetch('/api/tableinfoinsert?tablename=product_categories',{
                method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
            })
            console.log(values)
    
          if (!response.ok) {
            throw new Error('插入数据失败');
          }
          alert('类型信息录入成功')

        }catch(error){
            alert('网络错误，请稍后再试');
            console.error('Error:', error);
        }
        
    }

    return(
        <>
        <form onSubmit={handleSubmit}>
            商品类型添加：<br/>
            具体类型:
            <input type='text' name="CategoryName" value={formdata.CategoryName}  placeholder={"请输入具体类型，例如水果，饮料"} onChange={handleChange}  /><br />
            类型描述：
            <input type='text' name="CategoryDesc" value={formdata.CategoryDesc}  onChange={handleChange}  /><br />
            <button type="submit">提交</button>
        </form>
        
        </>
    );
}

// 删除
export function Categoryinfodelete(){
  const[deleteid,setDeleteid]=useState("")
  const reqdata=({
    id:deleteid,
    keyword:"CategoryID",
    tablename:"product_categories"
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
    删除类型ID:<br/>
    <input 
        type="text" 
        value={deleteid} 
        onChange={(e) => setDeleteid(e.target.value)} 
    />
    <button onClick={handleDelete}>删除</button>
    </>
  );
}