import { Route, Routes } from "react-router-dom";
import { OrderListPage } from "../views/Order/OrderList";


export function OrderRouter(){

    return (
        <>
        <Routes>
            <Route path="/orderlist" element={<OrderListPage/>} />
            {/* <Route path="/discount" element={<DiscountInfoPage/>} />
            <Route path="/discount/addrule" element={<DiscountRuleAddPage/>}/>
            <Route path="/discount/updaterule" element={<DiscountRuleUpdatePage/>}/>
            <Route path="/discount/type" element={<TypeListPage/>}/> */}
        </Routes>
        </>
    )
}

