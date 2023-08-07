import { authApi } from "./interceptorsApi";

export const confirmEmail = async (token) => {
    const {data} = await authApi.get(`/confirmEmails/confirmEmail?token=${token}`);
    return data;
}

export const updateTokenConfirm = async (email) => {
    const {data} = await authApi.get(`/confirmEmails/updateToken?email=${email}`);
    return data;
}