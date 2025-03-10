import React, { useEffect, useState } from 'react';
import { SystemmProvider } from './Info';
import MainLayout from '../../utils/MainLayOut/MainLayout';
import { SysMycontext } from './Info';
import { useContext } from 'react';



export function PermissionassignmentPage() {
    return(
        <SystemmProvider>
             <MainLayout rightContent={<PermissionsAndRole/>} />
        </SystemmProvider>
    )
}

export function PermissionsAndRole() {
    const [newRoles, setNewRoles] = useState([]);
    const [permission, setPermission] = useState([]);
    useEffect(() => {
        permissioninfo();
    }, []);

    const context = useContext(SysMycontext);
    if (!context) {
        console.error("SysMycontext错误");
        return null; // 或者其他处理
    }
    const { getPermissionInfo, permissionandarole } = context;

    const permissioninfo = async () => {
        try {
            const info = await getPermissionInfo(0);
            setPermission(info.permission);
        } catch (error) {
            console.error("获取权限信息失败:", error);
        }
    };
    // 对权限进行分组
    const groupedPermissions = permission.reduce((acc, curr) => {
        const category = curr.PermissionCategory;
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(curr);
        return acc;
    }, {});



    console.log(permission);

    return (
        <div className="container mt-5">
            <h2 className="mb-4">权限分配</h2>
            <table className="table table-bordered">
            <thead>
                <tr>
                    <th>角色</th>
                    <th>权限</th>
                </tr>
            </thead>
            <tbody>
                {permissionandarole.map((item, index) => (
                    <tr key={index}>
                        <td>{item.Rolename}</td>
                        <td>
                            {item.Permissionname?.join(', ') || '权限为空'}
                        </td>
                    </tr>
                ))}
            </tbody>
            </table>
 
        <div className="mb-4">
            <div className="mb-4">
            <input
                type="text"
                className="form-control"
                placeholder="请输入新增角色名称"
                value={newRoles}
                onChange={(e) => setNewRoles(e.target.value)}
            />
            <button className="btn btn-primary" >添加角色</button>
            <div className="container mt-4">
                <h2>权限管理</h2>
                <table className="table table-bordered">
                    <thead className="thead-light">
                        <tr>
                            <th scope="col">该类全选</th>
                            <th scope="col">权限类别</th>
                            <th scope="col">权限ID</th>
                            <th scope="col">权限名称</th>
                            <th scope="col">权限描述</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(groupedPermissions).map(([category, perms]) => (
                            <React.Fragment key={category}>
                                {perms.map((perm, index) => (
                                    <tr key={perm.PermissionId}>
                                        {index === 0 && ( // 只在第一行显示类别
                                            <td rowSpan={perms.length}>
                                                <input type="checkbox" />
                                            </td>
                                        )}
                                        {index === 0 && ( // 只在第一行显示权限类别
                                            <td rowSpan={perms.length}>{category}</td>
                                        )}
                                        <td>{perm.PermissionId}</td>
                                        <td>
                                            <input type="checkbox" /> {/* 在权限名称前添加勾选框 */}
                                            {perm.PermissionName}
                                        </td>
                                        <td>{perm.PermissionDesc}</td>
                                    </tr>
                                ))}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    </div>
    );
}
