import axios from "axios";

const AUTH_BASE_URL = 'https://localhost:44353';
const DATA_BASE_URL = 'https://localhost:44350';

let refreshTokenAttempts = 0;

const authApi = axios.create({
    baseURL: AUTH_BASE_URL
});

authApi.interceptors.request.use(config => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('accessToken')}`;
    config.headers.accept = 'application/json';
    return config;
});

authApi.interceptors.response.use(config => {
    return config;
}, async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && error.config && !error.config._isRetry) {
        originalRequest._isRetry = true;
        try {
            const response = await authApi.get('/auth/refreshToken');
            localStorage.setItem('accessToken', response.data.accessToken);
            return authApi.request(originalRequest);
        } catch (e) {
            console.log('No Authorization');
            handleRefreshTokenError();
        }
    }

    throw error;
});

const dataApi = axios.create({
    baseURL: DATA_BASE_URL
});

dataApi.interceptors.request.use(config => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('accessToken')}`;
    config.headers.accept = 'application/json';
    return config;
});

dataApi.interceptors.response.use(config => {
    return config;
}, async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && error.config && !error.config._isRetry) {
        originalRequest._isRetry = true;
        try {
            const response = await authApi.get('/auth/refreshToken');
            localStorage.setItem('accessToken', response.data.accessToken);
            return dataApi.request(originalRequest);
        } catch (e) {
            console.log('No Authorization');
            handleRefreshTokenError();
        }
    }

    throw error;
});

function handleRefreshTokenError() {
    refreshTokenAttempts++;

    if (refreshTokenAttempts >= 3) {
        // Выход из аккаунта и удаление токена из localStorage
        localStorage.removeItem('accessToken');
        // Перенаправление на главную страницу или любую другую
        window.location.href = '/'; // Перенаправление на главную страницу
    }
}

export { authApi, dataApi };
