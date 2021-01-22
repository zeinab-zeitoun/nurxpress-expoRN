import axios from 'axios';
import BASE_API_URL from './BaseUrl';

export default {
    addDetail : (data, token) => 
        axios.post(`${BASE_API_URL}/details`, data, { headers: {"Authorization" : `Bearer ${token}`} }),
    getDetails: (token) =>
        axios.get(`${BASE_API_URL}/details`, { headers: {"Authorization" : `Bearer ${token}`} }),   
    getDetailsOfNurse: (nurse_id, token) =>
        axios.get(`${BASE_API_URL}/details/${nurse_id}`, { headers: {"Authorization" : `Bearer ${token}`} }),   
    deleteDetail: (id, token) =>
        axios.delete(`${BASE_API_URL}/details/${id}`, { headers: {"Authorization" : `Bearer ${token}`} }),   
}