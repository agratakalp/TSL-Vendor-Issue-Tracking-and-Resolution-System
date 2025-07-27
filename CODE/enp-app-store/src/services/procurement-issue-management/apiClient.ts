import axios from 'axios';

const apiClient = axios.create({
    baseURL: "http://localhost:3000/api",
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    }
});

apiClient.interceptors.request.use(
    (config) => {
        const token = 'fsadfkj';
        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => response,
    (error) =>{
        console.log('API Error', error.response || error.message);
        return Promise.reject(error);
    }
);


export default apiClient;