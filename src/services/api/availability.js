import axios from 'axios';
import BASE_API_URL from './BaseUrl';

export default {
    addUnavailableDates : (data, token) => 
        axios.post(`${BASE_API_URL}/availability`, data, { headers: {"Authorization" : `Bearer ${token}`} }),
    getUnavailableDates: (token) =>
        axios.get(`${BASE_API_URL}/availability`, { headers: {"Authorization" : `Bearer ${token}`} }),  
    getUnavailableDatesOfNurse: (nurse_id, token) =>
        axios.get(`${BASE_API_URL}/availability/${nurse_id}`, { headers: {"Authorization" : `Bearer ${token}`} }),   
    deleteUnavailableDate: (date, token) =>
        axios.delete(`${BASE_API_URL}/availability/${date}`, { headers: {"Authorization" : `Bearer ${token}`} }),   
}