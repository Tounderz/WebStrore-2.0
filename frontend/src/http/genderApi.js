import { authApi } from "./interceptorsApi";

export const fetchGender = async (id) => {
    const { data }  = await authApi.get(`/genders/gender?id=${id}`);
    return data;
}

export const fetchGenders = async (currentPage) => {
    const { data }  = await authApi.get(`/genders/list?currentPage=${currentPage}`);
    return data;
}

export const createGender = async (name) => {
    const { data }  = await authApi.post(`/genders/create`, {GenderName: name} );
    return data;
}

export const updateGender = async (id, name) => {
    const { data }  = await authApi.post(`/genders/edit`, {Id: id, GenderName: name} );
    return data;
}

export const removeGender = async (id) => {
    const { data }  = await authApi.delete(`/genders/delete?id=${id}`);
    return data;
}

export const replaceGender = async (currentGenderName, newGenderName) => {
    const { data }  = await authApi.post(`/genders/replace`, {CurrentGenderName: currentGenderName, NewGenderName: newGenderName} );
    return data;
}