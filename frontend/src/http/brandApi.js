import { CONFIG_MULTIPART } from '../utils/constFunctions';
import { dataApi } from './interceptorsApi';

export const formDataBrand = (brandId, name, info, categoriesId, img, countView) => {
    const formData = new FormData();
        formData.append('Id', brandId);
        formData.append('Name', name);
        formData.append('Info', info)
        formData.append('CategoriesId', categoriesId);
        formData.append("Img", img);
        formData.append("CountView", countView)

    return formData;
}

export const fetchBrands = async (categoryId) => {
    const {data} = await dataApi.get(`/brands/list?categoryId=${categoryId}`);
    return data;
}

export const fetchTableBrands = async (currentPage) => {
    const {data} = await dataApi.get(`/brands/table?currentPage=${currentPage}`);
    return data;
}

export const fetchProductsBrand = async (brandId, role, currentPage) => {
    const {data} = await dataApi.get(`/brands/productsBrand`, { params: { brandId: brandId, role: role, currentPage: currentPage }});
    return data;
}

export const fetchProductsBrandByCategory = async (brandId, categoriesId, currentPage) => {
    const categoriesArray = categoriesId.join(',');
    const { data } = await dataApi.get(`/brands/brandByCategory`, { params: { brandId: brandId, categoriesId: categoriesArray, currentPage: currentPage }});
    return data;
}

export const createBrand = async (formData) => {
    const {data} = await dataApi.post('/brands/create', formData, CONFIG_MULTIPART);
    return data;
}

export const updateBrand = async (formData) => {
    const {data} = await dataApi.post('/brands/edit', formData, CONFIG_MULTIPART);
    return data;
}

export const removeBrand = async (id) => {
    const {data} = await dataApi.delete(`/brands/delete?id=${id}`);
    return data;
}