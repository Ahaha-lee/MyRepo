import Modal from 'react-modal';
import { ProductDetailInfo } from "../dashtable";
import { CategoryInfo } from "../dashtable";

export function InfoModal({isOpen, onRequestClose, productDetails}){

    return(
        <div className='row'>
            <div className='row-3'></div>
            <div className='row-3'>
            <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
                <div className='col-md-6'>
                  <h2 className='text-center'>商品详情</h2>
                </div>
                <ProductDetailInfo Result={productDetails} />
              </Modal>
            </div>
             
        </div>
    );

}



//category
export function InfoModalCateGory({isOpen, onRequestClose, categoryDetails}){
    return(
        <div>
              <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
              
                <CategoryInfo Results={categoryDetails} />
              </Modal>
        </div>
    );

}