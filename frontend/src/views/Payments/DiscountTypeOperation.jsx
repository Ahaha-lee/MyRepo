import { useState, useEffect } from "react";
import { DiscountTypeApi } from "../../api/payment/discount";
import MainLayout from "../../utils/MainLayOut/MainLayout";
import { Pagination } from "../../utils/Common/SlicePage";

export function TypeListPage() {
    return (
        <div>
            <MainLayout rightContent={<TypeListForm />} />
        </div>
    );
}

export function TypeListForm() {
    const [discounttype, setDiscountType] = useState([]);
    const [pagecount, setPagecount] = useState(0);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [totalNum, setTotalNum] = useState(0);

    useEffect(() => {
        getDiscountType(0);
    }, [pagecount]);

    const getDiscountType = async (search_id) => {
        try {
            const res = await DiscountTypeApi.get({
                params: {
                    search: search_id,
                    page: page,
                },
            });
            console.log("list返回的数据", res);
            setDiscountType(res.discountTypes);
            setTotalNum(res.total_num);
        } catch (error) {
            console.error('请求错误:', error);
        }
    };

    const totalPages = Math.ceil(totalNum / 10);

    return (
        <div>
            <hr />
            <TypeList Results={discounttype} />
            <Pagination totalPages={totalPages} onPageChange={setPagecount} />
            <p>注意：系统限制满足与两种商品类型的使用，后续会持续更新。</p>
        </div>
    );
}

export function TypeList({ Results }) {
    return (
        <div>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>名称</th>
                        <th>描述</th>
                    </tr>
                </thead>
                <tbody>
                    {Results.map((item) => (
                        <tr key={item.Type_id}>
                            <td>{item.Type_id}</td>
                            <td>{item.Type_name}</td>
                            <td>{item.Type_desc}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}