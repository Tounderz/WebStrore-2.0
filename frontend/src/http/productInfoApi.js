import { dataApi } from './interceptorsApi';

export const fetchInfoProduct = async (productId) => {
    const {data} = await dataApi.get(`/productInfos/info?productId=${productId}`);
    return data;
}

export const createInfoProduct = async (productId, title, description) => {
    const {data} = await dataApi.post(`/productInfos/create`, { ProductId: productId, Title: title, Description: description});
    return data;
}

export const updateInfoProduct = async (id, title, description) => {
    const {data} = await dataApi.post(`/productInfos/edit`, { Id: id, Title: title, Description: description});
    return data;
}

export const removeInfoProduct = async (id) => {
    const {data} = await dataApi.delete(`/productInfos/delete?id=${id}`);
    return data;
}