import { authApi, dataApi } from './interceptorsApi';

export const fetchSearch = async (parameter, currentPage) => {
    const {data} = await dataApi.get(`/search/result`, { params: { parameter: parameter, currentPage: currentPage }} );
    return data;
}

export const fetchSearchUsers = async (parameter, currentPage, criteria) => {
    const {data} = await authApi.get('/search/list', { params: { parameter: parameter, currentPage: currentPage, criteria: criteria }});
    return data;
}

export const fetchSearchRoles = async (parameter, currentPage, criteria) => {
    const {data} = await authApi.get('/search/searchRole', { params: { parameter: parameter, currentPage: currentPage, criteria: criteria }});
    return data;
}

export const fetchSearchGenders = async (parameter, currentPage, criteria) => {
    const {data} = await authApi.get('/search/searchGender', { params: { parameter: parameter, currentPage: currentPage, criteria: criteria }});
    return data;
}

export const fetchSearchProductAdmin = async (parameter, currentPage, criteria) => {
    const {data} = await dataApi.get('/search/searchProduct', { params: { parameter: parameter, currentPage: currentPage, criteria: criteria }});
    return data;
}

export const fetchSearchCategory = async (parameter, currentPage, criteria) => {
    const {data} = await dataApi.get('/search/searchCategory', { params: { parameter: parameter, currentPage: currentPage, criteria: criteria }});
    return data;
}

export const fetchSearchBrand = async (parameter, currentPage, criteria) => {
    const {data} = await dataApi.get('/search/searchBrand', { params: { parameter: parameter, currentPage: currentPage, criteria: criteria }});
    return data;
}

export const fetchSearchType = async (parameter, currentPage, criteria) => {
    const {data} = await dataApi.get('/search/searchType', { params: { parameter: parameter, currentPage: currentPage, criteria: criteria }});
    return data;
}