import $api, { dataApi } from './interceptorsApi';

export const fetchProductsPopular = async () => {
    const {data} = await dataApi.get('/home/productsPopular');
    return data;
}

export const fetchBrandsPopular = async () => {
    const {data} = await dataApi.get('/home/brandsPopular');
    return data;
}

export const fetchCategoriesPopular = async () => {
    const {data} = await dataApi.get('/home/categoriesPopular');
    return data;
}