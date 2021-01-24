import axios from 'axios';
import BASE_API_URL from './BaseUrl';

export default {
    login: (attributes) =>
        axios.post(`${BASE_API_URL}/login`, attributes), 
    register: (attributes) =>
        axios.post(`${BASE_API_URL}/register`, attributes),
    logout: (token) =>
        axios.get(`${BASE_API_URL}/logout`, { headers: {"Authorization" : `Bearer ${token}`} }), 
    emails: () =>
        axios.get(`${BASE_API_URL}/emails`)
}