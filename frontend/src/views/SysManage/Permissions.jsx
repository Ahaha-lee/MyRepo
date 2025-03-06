import React, { useState } from 'react';

const initialRoles = ['管理员', '编辑', '查看者'];
const permissions = {
    '收银员常规操作': ['允许收银', '开启钱箱', '购物车删减商品', '交接班显示明细'],
    '价格权限': ['单品改价', '整单改价', '显示进货价/利润', '禁止赠送商品', '禁止手动兑换积分'],
    '盘点与库存权限': ['盘点权限', '明盘(显示库存)', '查询连锁库存', '修改商品库存', '禁止报损', '提交报损', '商品与货流权限'],
    '用户管理': ['注册用户'],
    '财务管理': ['查看报表', '修改删除报表']
};

export default function Permissions() {
    const [roles, setRoles] = useState(initialRoles);
    const [rolePermissions, setRolePermissions] = useState({
        '管理员': ['读取', '写入', '删除'],
        '编辑': ['读取', '写入'],
        '查看者': ['读取']
    });
    const [newRole, setNewRole] = useState('');
    const [newRolePermissions, setNewRolePermissions] = useState([]);

    const handlePermissionChange = (role, permission) => {
        setRolePermissions(prevState => {
            const newPermissions = prevState[role].includes(permission)
                ? prevState[role].filter(p => p !== permission)
                : [...prevState[role], permission];
            return { ...prevState, [role]: newPermissions };
        });
    };

    const handleAddRole = () => {
        if (newRole && !roles.includes(newRole)) {
            setRoles([...roles, newRole]);
            setRolePermissions({ ...rolePermissions, [newRole]: newRolePermissions });
            setNewRole('');
            setNewRolePermissions([]);
        }
    };

    const handleToggleSelectAll = (role, category) => {
        const allSelected = permissions[category].every(permission => rolePermissions[role]?.includes(permission));
        setRolePermissions(prevState => {
            const newPermissions = allSelected
                ? prevState[role].filter(p => !permissions[category].includes(p))
                : [...new Set([...prevState[role], ...permissions[category]])];
            return { ...prevState, [role]: newPermissions };
        });
    };

    const handleDeleteRole = (role) => {
        setRoles(prevState => prevState.filter(r => r !== role));
        setRolePermissions(prevState => {
            const newState = { ...prevState };
            delete newState[role];
            return newState;
        });
    };

    const handleNewRolePermissionChange = (permission) => {
        setNewRolePermissions(prevState => {
            const newPermissions = prevState.includes(permission)
                ? prevState.filter(p => p !== permission)
                : [...prevState, permission];
            return newPermissions;
        });
    };

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
                    {roles.map(role => (
                        <tr key={role}>
                            <td>{role}</td>
                            <td>
                                {rolePermissions[role]?.join(', ') || '无权限'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="mb-4">
            <input
                    type="text"
                    className="form-control"
                    placeholder="请输入新增角色"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                />
                <div className="mt-4">
                <h5>选择权限</h5>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>权限分类</th>
                            <th>权限</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(permissions).map(category => (
                            <tr key={category}>
                                <td>{category}</td>
                                <td>
                                    {permissions[category].map(permission => (
                                        <div key={permission}>
                                            <input
                                                type="checkbox"
                                                checked={newRolePermissions.includes(permission)}
                                                onChange={() => handleNewRolePermissionChange(permission)}
                                            />
                                            {permission}
                                        </div>
                                    ))}
                                </td>
                                <td>
                                    <button className="btn btn-sm btn-secondary" onClick={() => handleToggleSelectAll(category)}>
                                        {permissions[category].every(permission => newRolePermissions.includes(permission)) ? '取消全选' : '全选'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button className="btn btn-primary mt-2" onClick={handleAddRole}>添加角色</button>
            </div>
            </div>
        </div>
    );
}
