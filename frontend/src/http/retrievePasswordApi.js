import { authApi } from "./interceptorsApi";

export const retrievePassword = async (email) => {
    const {data} = await authApi.get(`/retrievePassword/retrievePassword?email=${email}`);
    return data;
}

export const createNewPassword = async (token, newPassword) => {
    const {data} = await authApi.post(`/retrievePassword/createNewPassword`, {Token: token, NewPassword: newPassword} );
    return data;
}