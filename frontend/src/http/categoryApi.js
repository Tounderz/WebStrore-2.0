import { CONFIG_MULTIPART } from '../utils/constFunctions';
import { dataApi } from './interceptorsApi';

export const formDataCategory = (categoryId, name, shortDescription, info, img, brandsId, countView) => {
    const formData = new FormData();
        formData.append('Id', categoryId);
        formData.append('Name', name);
        formData.append('ShortDescription', shortDescription);
        formData.append('Info', info)
        formData.append("Img", img);
        formData.append('BrandsId', brandsId);
        formData.append("CountView", countView);

    return formData;
}

export const fetchCategories = async (brandId) => {
    const {data} = await dataApi.get(`/categories/list?brandId=${brandId}`);
    return data;
}

export const fetchTableCategories = async (currentPage) => {
    const {data} = await dataApi.get(`/categories/table?currentPage=${currentPage}`);
    return data;
}

export const fetchProductsCategory = async (categoryId, role, currentPage) => {
    const {data} = await dataApi.get(`/categories/productsCategory`, { params: { categoryId: categoryId, role: role, currentPage: currentPage }});
    return data;
}

export const fetchProductsCategoryByBrand = async (categoryId, brandsId, currentPage) => {
    const brandsIdArray = brandsId.join(',');
    const {data} = await dataApi.get(`/categories/categoryByBrand`, { params: { categoryId: categoryId, brandsId: brandsIdArray, currentPage: currentPage }});
    return data;
}

export const createCategory = async ( formData ) => {
    const {data} = await dataApi.post('/categories/create', formData, CONFIG_MULTIPART );
    return data;
}

export const updateCategory = async ( formData ) => {
    const {data} = await dataApi.post('/categories/edit', formData, CONFIG_MULTIPART );
    return data;
}

export const removeCategory = async (id) => {
    const {data} = await dataApi.delete(`/categories/delete?id=${id}`);
    return data;
}