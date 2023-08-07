import { dataApi } from './interceptorsApi';

export const fetchPaymentMethods = async () => {
    const {data} = await dataApi.get(`/paymentMethods/list`);
    return data;
}

export const createPaymentMethods = async (name) => {
    const {data} = await dataApi.post('/paymentMethods/create', {name: name});
    return data;
}

export const updatePaymentMethods = async (id, name) => {
    const {data} = await dataApi.post('/paymentMethods/update', {Id: id, Name: name});
    return data;
}

export const removePaymentMethods = async (id) => {
    const {data} = await dataApi.delete(`/paymentMethods/delete?id=${id}`);
    return data;
}