import { PermissionAndRoleApi, PermissionApi } from "../../api/system";
import React, { createContext, useContext, useEffect, useState } from "react";

const SysMycontext = createContext();

export { SysMycontext };

export function SystemmProvider({ children }) {
    const [permissionandarole, setPermissionandarole] = useState([]);

    // 获取权限信息
    const getPermissionInfo = async (id) => {
        try {
            const res = await PermissionApi.getinfo({ search_id: id });
            console.log("权限数据返回成功", res);
            return res; // 返回权限信息
        } catch (error) {
            console.log("权限数据返回失败", error);
        }
    };

    // 获取角色信息
    const getRoleInfo = async (id) => {
        try {
            const res = await PermissionApi.getinfo({ search_id: id });
            console.log("角色数据返回成功", res);
            return res; // 返回角色信息
        } catch (error) {
            console.log("角色数据返回失败", error);
        }
    };

    // 获取权限和角色信息
    const getPermissionAndRole = async () => {
        try {
            const res = await PermissionAndRoleApi.getinfo({});
            console.log("角色数据返回成功", res);
            setPermissionandarole(res.permissionandrole);
        } catch (error) {
            console.log("角色数据返回失败", error);
        }
    };

    // 在组件加载时获取权限和角色信息
    useEffect(() => {
        getPermissionAndRole();
    }, []);

    return (
        <SysMycontext.Provider value={{ getPermissionInfo, getRoleInfo, permissionandarole}}>
            {children}
        </SysMycontext.Provider>
    );
}


