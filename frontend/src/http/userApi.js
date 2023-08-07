import { CONFIG_MULTIPART } from "../utils/constFunctions";
import { authApi } from "./interceptorsApi";

export const formDataUser = (id, name, lastName, genderId, dateOfBirth, 
        email, phone, login, password, img, roleId) => {
    const formData = new FormData();
        formData.append('UserId', id);
        formData.append('Name', name);
        formData.append('LastName', lastName);
        formData.append('GenderId', genderId);
        formData.append('DateOfBirth', dateOfBirth);
        formData.append('Email', email);
        formData.append('Phone', phone);
        formData.append('Login', login);
        formData.append('Password', password);
        formData.append('Img', img);
        formData.append('RoleId', roleId);

    return formData;
}

export const fetchUser = async (login) => {
    const {data} = await authApi.get(`/users/user?login=${login}`);
    return data;
}

export const fetchUsers = async (page) => {
    const {data} = await authApi.get(`/users/list?currentPage=${page}`);
    return data;
}

export const removeUser = async (id) => {
    const {data} = await authApi.delete(`/users/deleteUser?id=${id}`);
    return data;
}

export const register = async (formData) => {
    const {data} = await authApi.post(`/users/register`, formData, CONFIG_MULTIPART);
    return data;
}

export const updateUser = async (formData) => {
    const {data} = await authApi.post('/users/edit', formData, CONFIG_MULTIPART);
    return data;
}

export const updateUserImg = async (formData) => {
    const {data} = await authApi.post(`/users/editImg`, formData, CONFIG_MULTIPART);
    return data;
}

export const updatePassword = async (oldPassword, newPassword, idUser) => {
    const formData = new FormData();
        formData.append('OldPassword', oldPassword);
        formData.append('NewPassword', newPassword);
        formData.append('UserId', idUser);
    const {data} = await authApi.post('/users/editPassword', formData, CONFIG_MULTIPART);
    return data;
}