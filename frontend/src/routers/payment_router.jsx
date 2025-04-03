import { Route, Routes } from "react-router-dom";
import PaymentPage from "../views/Payments/PaymentPage";
import { DiscountInfoinsertOrUpdate, DiscountInfoPage, DiscountRuleAddPage, DiscountRuleUpdatePage  } from "../views/Payments/DiscoutOperation";
import { TypeListPage } from "../views/Payments/DiscountTypeOperation";


export function PaymentRouter(){

    return (
        <>
        {console.log("payment router")}
        <Routes>
            <Route path="/cash" element={<PaymentPage/>} />
            <Route path="/discount" element={<DiscountInfoPage/>} />
            <Route path="/discount/addrule" element={<DiscountRuleAddPage/>}/>
            <Route path="/discount/updaterule" element={<DiscountRuleUpdatePage/>}/>
            <Route path="/discount/type" element={<TypeListPage/>}/>
        </Routes>
        </>
    )
}

