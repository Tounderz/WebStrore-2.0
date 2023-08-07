import { authApi, dataApi } from "./interceptorsApi";

export const sortUsers = async (propertyTitle, typeSort, currentPage) => {
    const {data} = await authApi.get(`/sort/list`, { params: { propertyTitle: propertyTitle, typeSort: typeSort, currentPage: currentPage }});
    return data;
}

export const sortRoles = async (propertyTitle, typeSort, currentPage) => {
    const {data} = await authApi.get(`/sort/sortRoles`, { params: { propertyTitle: propertyTitle, typeSort: typeSort, currentPage: currentPage }});
    return data;
}

export const sortGenders = async (propertyTitle, typeSort, currentPage) => {
    const {data} = await authApi.get(`/sort/sortGenders`, { params: { propertyTitle: propertyTitle, typeSort: typeSort, currentPage: currentPage }});
    return data;
}

export const sortProducts = async (propertyTitle, typeSort, currentPage) => {
    const {data} = await dataApi.get(`/sort/sortProducts`, { params: { propertyTitle: propertyTitle, typeSort: typeSort, currentPage: currentPage }});
    return data;
}

export const sortCategories = async (propertyTitle, typeSort, currentPage) => {
    const {data} = await dataApi.get(`/sort/sortCategories`, { params: { propertyTitle: propertyTitle, typeSort: typeSort, currentPage: currentPage }});
    return data;
}

export const sortBrands = async (propertyTitle, typeSort, currentPage) => {
    const {data} = await dataApi.get(`/sort/sortBrands`, { params: { propertyTitle: propertyTitle, typeSort: typeSort, currentPage: currentPage }});
    return data;
}

export const sortTypes = async (propertyTitle, typeSort, currentPage) => {
    const {data} = await dataApi.get(`/sort/sortTypes`, { params: { propertyTitle: propertyTitle, typeSort: typeSort, currentPage: currentPage }});
    return data;
}

export const sortPaymentMethods = async (propertyTitle, typeSort, currentPage) => {
    const {data} = await dataApi.get(`/sort/sortPaymentMethods`, { params: { propertyTitle: propertyTitle, typeSort: typeSort, currentPage: currentPage }});
    return data;
}