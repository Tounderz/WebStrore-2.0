import { dataApi } from './interceptorsApi';

export const fetchTypes = async (categoryId, brandId) => {
    const { data } = await dataApi.get(`/types/list`, {params: { categoryId: categoryId, brandId: brandId }});
    return data;
}

export const fetchTableTypes = async (currentPage) => {
    const { data } = await dataApi.get(`/types/table?currentPage=${currentPage}`);
    return data;
}

export const fetchProductsType = async (typeId, brandsId, currentPage) => {
    const brandsIdArray = brandsId.length > 0 ? brandsId.join(',') : '';
    const {data} = await dataApi.get(`/types/productsBrandByType`, {params: { TypeId: typeId, BrandsId: brandsIdArray, CurrentPage: currentPage }} );
    return data;
}

export const createType = async (name, categoryId) => {
    const {data} = await dataApi.post('/types/create', { Name: name, CategoryId: categoryId } );
    return data;
}

export const updateType = async (typeId, name, categoryId) => {
    const {data} = await dataApi.post('/types/edit', { Id: typeId, Name: name, CategoryId: categoryId } );
    return data;
}

export const removeType = async (id) => {
    const {data} = await dataApi.delete(`/types/delete?id=${id}`);
    return data;
}