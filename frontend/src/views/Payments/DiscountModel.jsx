import Modal from 'react-modal';
import { DiscountDetails, DiscountTypeDetails } from "./dashtable";
import { useEffect, useState, useContext } from 'react';
import { MyContext, ProductListForm, ProductProvider } from '../Storage/Product/ProductList';

export const SelfCheck = ({ isOpen, onRequestClose,handle }) => {
    console.log("DiscountRuleCheckapplicableModal", isOpen);
    return (
        <ProductProvider>
            <DiscountRuleCheckapplicableModal isOpen={isOpen} onRequestClose={onRequestClose} handle={handle}/>
        </ProductProvider>
    );
};

export const DiscountRuleModal = ({ isOpen, onRequestClose, diacountDetails }) => {
    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
            {DiscountDetails.length > 0 ? <DiscountDetails discountData={diacountDetails} /> : <div>暂无数据</div>}
        </Modal>
    );
}

export const DiscountTypeModal = ({ isOpen, onRequestClose, typedetails }) => {
    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
            <DiscountTypeDetails discountTypeData={typedetails} />
        </Modal>
    );
}

export function DiscountRuleCheckapplicableModal({ isOpen, onRequestClose, handle }) {
    const { products, pcheckstatus, setPcheckstatus } = useContext(MyContext);
    const [viewAdded, setViewAdded] = useState(false);
    const [tempSelectedProducts, setTempSelectedProducts] = useState([]);

    const handleSelectProduct = () => {
        // 筛选出 pcheckstatus 为 true 的产品
        const selectedProducts = products.filter(product => pcheckstatus[product.ProductID] === true);
        
        // 将新筛选出的产品与现有的 tempSelectedProducts 合并
        setTempSelectedProducts(prevSelected => {
            const existingProductIds = new Set(prevSelected.map(product => product.ProductID));
            const newProducts = selectedProducts.filter(product => !existingProductIds.has(product.ProductID));
            return [...prevSelected, ...newProducts];
        });
    };

    const handleConfirmSelection = () => {
        handleSelectProduct();
    };

    const handleRemoveProduct = (productId) => {
        setTempSelectedProducts(prevSelected => prevSelected.filter(product => product.ProductID !== productId));
    };

    const handleConfirmAdd = () => {
        // 提取已选择产品的 ID，并转换为字符串类型
        const selectedProductIds = tempSelectedProducts.map(product => String(product.ProductID)).join(','); // 使用 join(',') 将 ID 连接为逗号分隔的字符串
        // 调用传入的 handle 函数并传递选中的产品 ID
        handle(selectedProductIds);
        // 关闭模态框
        onRequestClose();
    };
    

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
            <div className="modal-header">
                <h5 className="modal-title">选择优惠商品</h5>
                <button type="button" className="btn-close" onClick={onRequestClose}></button>
            </div>
            <div className="modal-body">
                {!viewAdded ? (
                    <>
                        <ProductListForm />
                        <button className="btn" type="button" onClick={handleConfirmSelection}>添加商品</button>
                        <button className="btn" type="button" onClick={() => setViewAdded(true)}>查看已添加商品</button>
                    </>
                ) : (
                    <>
                        <h5>已添加商品</h5>
                        <ul>
                            {tempSelectedProducts.map(product => (
                                <li key={product.ProductID}>
                                    {product.ProductName} - {product.ProBarcode}
                                    <button className="btn btn-danger btn-sm ms-2" onClick={() => handleRemoveProduct(product.ProductID)}>删除</button>
                                </li>
                            ))}
                        </ul>
                        <button className="btn btn-secondary" onClick={() => setViewAdded(false)}>返回</button>
                        <button className="btn btn-primary" onClick={handleConfirmAdd}>确认添加</button>
                    </>
                )}
            </div>
        </Modal>
    );
}