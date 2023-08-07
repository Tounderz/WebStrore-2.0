import { authApi } from "./interceptorsApi";

export const restoring = async (email) => {
    const {data}  = await authApi.get(`/restoringAccount/restoring?email=${email}`);
    return data;
}

export const restore = async (token) => {
    const {data}  = await authApi.get(`/restoringAccount/restored?token=${token}`);
    return data;
}