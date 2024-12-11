import Modal from 'react-modal';
import { InventoryInfo } from '../dashtable';


export const InventoryDetailInfoModal  = ({Result,isOpen,onRequestClose}) => {
    return(
        <div>
          <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
                <div className='col-md-6'>
                  <h2 className='text-center'>商品库存详情</h2>
                  <InventoryInfo Result={Result}/>
                </div>
          </Modal>
        </div>
    )
}