import React, { createContext, useState, useContext, useEffect } from 'react';
import { OrderApi } from '../../api/order';
import { CommonTable } from '../../utils/Common/CommonTable';
import Modal from 'react-modal';
import MainLayout from '../../utils/MainLayOut/MainLayout';
import { Pagination } from '../../utils/Common/SlicePage';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);
    const [orderDetails, setOrderDetails] = useState([]);
    const [pagecount, setPagecount] = useState(1);
    const[totalNum,setTotalNum]=useState(0);

    const fetchOrderIndex = async (id,page) => {
        try {
            const res = await OrderApi.orderindexget({
            params: {
                search_id:id,
                page:page
            }  
            });
            setTotalNum(res.count);
            setOrders(res.index);
            console.log("list返回的数据", res);
        } catch (error) {
            console.error('请求错误:', error);
        }
    };

    const fetchOrderContent = async (id) => {
        try {
            const res = await OrderApi.ordercontentget({
                params:{
                search_id:id,
            }
            });
            setOrderDetails(res.message);
        } catch (error) {
            console.error('请求错误:', error);
        }
    };

    return (
        <OrderContext.Provider value={{ orders, orderDetails, fetchOrderIndex, fetchOrderContent,pagecount,setPagecount,totalNum }}>
            {children}
        </OrderContext.Provider>
    );
};

export const useOrder = () => useContext(OrderContext);


export const OrderListPage = () => {
    return (
        <div>
            <OrderProvider>
                  <MainLayout rightContent={<OrderListForm />} />
            </OrderProvider>
        </div>
    );
};
export const OrderListForm = () => {
    const { orders, fetchOrderIndex, fetchOrderContent,pagecount,setPagecount,totalNum } = useOrder();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    const totalPages = Math.ceil(totalNum / 10);

    useEffect(() => {
        fetchOrderIndex(0,pagecount); // 示例数据
    }, [pagecount]);
      

    const columns = [
        { title: "订单ID", key: "SaleOrderid" },
        { title: "会员ID", key: "VipId" },
        { title: "收银员ID", key: "CashierId" },
        { title: "订单总价", key: "OrderTotalprice" },
        { title: "订单日期", key: "OrderDate" },
    ];

    const tableActions = (record) => (
        <>
            <button onClick={() => handleViewDetails(record.SaleOrderid)}>查看详情</button>
        </>
    );

    const handleViewDetails = async (orderId) => {
        await fetchOrderContent(orderId);
        setSelectedOrderId(orderId);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedOrderId(null);
    };

    return (
        <div>
            <h2>订单列表</h2>
            <CommonTable
                columns={columns}
                data={orders}
                actions={tableActions}
                idField="SaleOrderid"
            />
            <div>
                 <Pagination totalPages={totalPages} onPageChange={setPagecount} />
            </div>
            <Modal isOpen={isModalOpen} onRequestClose={closeModal}>
                <OrderDetails orderId={selectedOrderId} />
                <button onClick={closeModal}>关闭</button>
            </Modal>
        </div>
    );
};

export const OrderDetails = ({ orderId }) => {
    const { orderDetails, fetchOrderContent } = useOrder();

    
    useEffect(() => {
        fetchOrderContent(orderId);
    }, [ orderId]);
    console.log("detail",orderDetails);
    return (
        <div>
            <h2>订单详情</h2>
            {orderDetails.length > 0 ? (
                <table className="table">
                    <thead>
                        <tr>
                            <th>商品条码</th>
                            <th>商品零售价</th>
                            <th>折扣规则ID</th>
                            <th>商品数量</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orderDetails.map((item, index) => (
                            <tr key={index}>
                                <td>{item.ProductBarcode}</td>
                                <td>{item.ProductRetailprice}</td>
                                <td>{item.ProductDiscountruleid}</td>
                                <td>{item.ProductQuantities}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>没有找到订单详情</p>
            )}
        </div>
    );
};