import { CONFIG_MULTIPART } from '../utils/constFunctions';
import { dataApi } from './interceptorsApi';

export const formDataProduct = (productId, name, categoryId, typeId, brandId, shortDescription, isFavourite, available, price, img, countView) => {
    const formData = new FormData();
        formData.append('Id', productId);
        formData.append('Name', name);
        formData.append('CategoryId', categoryId);
        formData.append('TypeId', typeId);
        formData.append('BrandId', brandId);
        formData.append('ShortDescription', shortDescription);
        formData.append('IsFavourite', isFavourite);
        formData.append('Available', available);
        formData.append('Price', `${price}`);
        formData.append('Img', img);
        formData.append('CountView', countView);

    return formData;
}

export const fetchProduct = async (id) => {
    const {data} = await dataApi.get(`/products/product?id=${id}`);
    return data;
}

export const fetchProducts = async (page) => {
    const {data} = await dataApi.get(`/products/list?currentPage=${page}`);
    return data;
}

export const fetchProductsByBrand = async (brandId) => {
    const {data} = await dataApi.get(`/products/productsBrand?brandId=${brandId}`);
    return data;
}

export const fetchProductsByCategory = async (categoryId) => {
    const {data} = await dataApi.get(`/products/productsCategory?categoryId=${categoryId}`);
    return data;
}

export const fetchProductsByType = async (typeId) => {
    const {data} = await dataApi.get(`/products/productsType?typeId=${typeId}`);
    return data;
}

export const createProduct = async (formData) => {
    const {data} = await dataApi.post('/products/create', formData, CONFIG_MULTIPART);
    return data;
}

export const updateProduct = async (formData) => {
    const {data} = await dataApi.post('/products/edit', formData, CONFIG_MULTIPART);
    return data;
}

export const brandChangeProducts = async (brandId, productsId) => {
    const {data} = await dataApi.post('/products/brandChangeProducts', {brandId: brandId, productsId: productsId});
    return data;
}

export const categoryChangeProducts = async (categoryId, productsId) => {
    const {data} = await dataApi.post('/products/categoryChangeProducts', {categoryId: categoryId, productsId: productsId});
    return data;
}

export const typeChangeProducts = async (typeId, productsId) => {
    const {data} = await dataApi.post('/products/typeChangeProducts', {typeId: typeId, productsId: productsId});
    return data;
}

export const removeProduct = async (id) => {
    const {data} = await dataApi.delete(`/products/delete?id=${id}`);
    return data;
}

export const removeProducts = async (productsId) => {
    const {data} = await dataApi.delete(`/products/deleteProducts?productsId=${productsId}`);
    return data;
}