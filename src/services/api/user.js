import axios from 'axios';
import BASE_API_URL from './BaseUrl';

export default {
    getAuthUser: (token) =>
        axios.get(`${BASE_API_URL}/authUser`, { headers: {"Authorization" : `Bearer ${token}`} }), 
}