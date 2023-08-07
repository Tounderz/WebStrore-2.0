import { authApi } from "./interceptorsApi";

export const signIn = async (login, password) => {
    const { data }  = await authApi.post(`/auth/login`, { Login: login, Password: password });
    return data;
}

export const check = async () => {
    const { data } = await authApi.get('/auth/refreshToken');
    return data;
}

export const logout = async () => {
    localStorage.removeItem('accessToken');
    const { data } = await authApi.post('/auth/logout');
    return data;
}