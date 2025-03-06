import Modal from 'react-modal';
import { DiscountDetails, DiscountTypeDetails } from "./dashtable";
import { ProductApi } from '../../api/storage/product';
import { useEffect } from 'react';
import { useState,useContext } from 'react';
import { ProductList, ProductListForm } from '../Storage/Product/ProductList';
import { MyContext } from '../Storage/Product/ProductList';
export const DiscountRuleModal = ({ isOpen, onRequestClose, diacountDetails}) => {

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
            {DiscountDetails.length>0 ?<DiscountDetails discountData={diacountDetails} />:<div>暂无数据</div>}            
        </Modal>
    );
}


export const DiscountTypeModal = ({ isOpen, onRequestClose,typedetails}) => {
    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
            <DiscountTypeDetails discountTypeData={typedetails}/>
        </Modal>
    );
    
}

export function DiscountRuleCheckapplicableModal ({ isOpen, onRequestClose,keywords,onsubmit}) {
    const [products, setProducts]=useState([]);
    const [totalNum, setTotalNum] = useState(0);
    const [pagecount, setPagecount] = useState(1);
    // const {applicableItems}=useContext(MyContext);
    useEffect(()=>{
        Checkapplicableitems();
       },[])
   const Checkapplicableitems = () => {
           ProductApi.getinfo({
             params: { search_id: 0 ,page:pagecount}
           }) .then(res => {
               console.log("productlist返回的数据", res);
               setProducts(res.data);
               setTotalNum(res.total_num);
             }).catch(error => {
               console.error('错误的信息:', error);
             });
    };
    // const handleSubmit = () => {
    //     onsubmit(applicableItems);
    // };
    // console.log("applicableItems",applicableItems)
       return(
          <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
            <ProductListForm action="producapplicable"></ProductListForm>
            {/* <button onClick={handleSubmit}>确定</button> */}
          </Modal>
       )
   
}
        