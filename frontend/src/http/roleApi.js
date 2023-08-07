import { authApi } from "./interceptorsApi";

export const fetchRole = async (id) => {
    const { data }  = await authApi.get(`/roles/role?id=${id}`);
    return data;
}

export const fetchRoles = async (currentPage) => {
    const { data }  = await authApi.get(`/roles/list?currentPage=${currentPage}`);
    return data;
}

export const createRole = async (name) => {
    const { data }  = await authApi.post(`/roles/create`, {RoleName: name} );
    return data;
}

export const updateRole = async (id, name) => {
    const { data }  = await authApi.post(`/roles/edit`, {Id: id, RoleName: name} );
    return data;
}

export const removeRole = async (id) => {
    const { data }  = await authApi.delete(`/roles/delete?id=${id}`);
    return data;
}

export const replaceRole = async (currentRoleName, newRoleName) => {
    const { data }  = await authApi.post(`/roles/replace`, {CurrentRoleName: currentRoleName, NewRoleName: newRoleName} );
    return data;
}