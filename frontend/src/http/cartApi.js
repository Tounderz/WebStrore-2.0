import { dataApi } from './interceptorsApi';

export const fetchCart = async (id, currentPage) => {
    const {data} = await dataApi.get(`/carts/cart`, { params: { userId: id, currentPage: currentPage }});
    return data;
}

export const addToCart = async (productId, userId) => {
    const {data} = await dataApi.post('/carts/add', {ProductId: productId, UserId: userId});
    return data;
}

export const removeToCartItem = async (productId, userId) => {
    const {data} = await dataApi.delete('/carts/delete', {params: { productId: productId, userId: userId}});
    return data;
}

export const cleanToCart = async (userId) => {
    const {data} = await dataApi.delete(`/carts/clean?userId=${userId}`);
    return data;
}