
export function AdminHomePage(){
      return (
        <div>
          <div className="row g-0">
          <div className="col-2"></div>
          <div className="col-10">
          <h1 className="text-center">Admin Home Page</h1>
          </div>
          </div>
        </div>
      );
}

// export default function HomeForm() {
//     const navigate = useNavigate();
//     const { getSession } = useSession();
//     const user = getSession();

//     useEffect(() => {
//         initialCGcheck();
//         initialCGPutin();
//         initialCgExamine()
//         initialOut();
//         initialOutcheck();

//         if (!user) {
//             navigate("/login");
//         }
//         console.log("账号使用者Data",user);
//     }, [user, navigate]);


//     return (
//         <div>
//             Welcome to 顶呱呱
            
//             <br/>
//             <Link to='/searchvipdata'>会员信息查询</Link>
//             <br/>
//             <Link to='/addvippoints'>会员积分更改</Link>
//             <br/>
//             <Link to='/addvipmembers'>会员注册（后端）</Link>
//             <br/>
//             <Link to='/deletvipmemers'>会员注销（后端）</Link>
//             <br/>
//             <Link to='/applyforcaigou'>采购申报（后端）</Link>
//             <br/>
//             <Link to='/caigoulist'>采购列表（1/3后端）</Link>
//             <br/>
//             <Link to= '/checkforcaigou'>采购验收</Link>
//             <br/>
//             <Link to='/outproducts'>出库申报</Link>
//             <br/>
//             <Link to='/outlist'>出库申报列表</Link>
//             <br/>
//             <Link to='/productoperation'>商品信息操作</Link>
//             <br/>
//             <Link to='/inventoryoperation'>库存信息操作</Link>
//             <br/>
//             <Link to='/searchvipdata'>vip信息查询（后端）</Link>
//             <br/>
//             <Link to='/addvippoints'>vip积分修改（后端）</Link>
//             <br/>
//             <Link to='/payment'>收银</Link>
//             <br/>
//             <Link to='/supplieroperation'>供应商信息操作</Link>
//             <br/>
//             <Link to='/categoryoperation'>类型信息操作</Link>
//             <br/>
//             <Link to='/discountoperation'>优惠信息操作</Link>

//         </div>
//     )
// }