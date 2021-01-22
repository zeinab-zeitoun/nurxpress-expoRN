import axios from 'axios';
import BASE_API_URL from './BaseUrl';

export default {
    getUser: (token) =>
        axios.get(`${BASE_API_URL}/regularUser`, { headers: {"Authorization" : `Bearer ${token}`} }), 
    addUser: (data, token) =>
        axios.post(`${BASE_API_URL}/regularUser`, data, { headers: {"Authorization" : `Bearer ${token}`} }),
    editName: (fullName, token) =>
        axios.put(`${BASE_API_URL}/regularUser`, fullName, { headers: {"Authorization" : `Bearer ${token}`} }), 
    changeLocation: (location, token) =>
        axios.put(`${BASE_API_URL}/changeLocation`, location, { headers: {"Authorization" : `Bearer ${token}`} }),
    rate: (nurse_id, rating, token) =>
        axios.post(`${BASE_API_URL}/rating/${nurse_id}`, rating, { headers: {"Authorization" : `Bearer ${token}`} }),  
    rated: (nurse_id, token) =>
        axios.get(`${BASE_API_URL}/rated/${nurse_id}`, { headers: {"Authorization" : `Bearer ${token}`} }),  
    rating: (nurse_id, token) =>
        axios.get(`${BASE_API_URL}/rating/${nurse_id}`, { headers: {"Authorization" : `Bearer ${token}`} })  
}