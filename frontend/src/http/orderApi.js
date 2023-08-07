import { dataApi } from './interceptorsApi';

export const fetchOrders = async (userId, currentPage) => {
    const {data} = await dataApi.get(`/orders/list`, { params: { userId: userId, currentPage: currentPage }});
    return data;
}

export const placeOrder = async (userId, productId, userName, userPhone,
        userEmail, city, street, house, flat, orderComment, paymentMethod) => {
    const {data} = await dataApi.post('/orders/placeOrder', {
        UserId: userId, ProductId: productId, 
        UserName: userName, UserPhone: userPhone, UserEmail: userEmail, 
        City: city, Street: street, House: house, Flat: flat, 
        OrderComment: orderComment, PaymentMethod: paymentMethod });
    return data;
}

export const placeOrders = async (userId, userName, userPhone,
    userEmail, city, street, house, flat, orderComment, paymentMethod) => {
    const {data} = await dataApi.post('/orders/placeOrders', {
        UserId: userId, ProductId: 0, 
        UserName: userName, UserPhone: userPhone, UserEmail: userEmail, 
        City: city, Street: street, House: house, Flat: flat, 
        OrderComment: orderComment, PaymentMethod: paymentMethod });
    return data;
}