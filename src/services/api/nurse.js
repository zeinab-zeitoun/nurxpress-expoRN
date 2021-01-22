import axios from 'axios';

import BASE_API_URL from './BaseUrl';

export default {

    // apis for nurse
    addNurse : (data, token) => 
        axios.post(`${BASE_API_URL}/nurse`, data, { headers: {"Authorization" : `Bearer ${token}`} }),
    getNurse : (token) =>
        axios.get(`${BASE_API_URL}/nurse`, { headers: {"Authorization" : `Bearer ${token}`} }),
    getNurses : (token) =>
        axios.get(`${BASE_API_URL}/nurses`, { headers: {"Authorization" : `Bearer ${token}`} }),
    editNurse : (data, token) =>
        axios.put(`${BASE_API_URL}/nurse`, data, { headers: {"Authorization" : `Bearer ${token}`} }),
    changeLocation : (data, token) =>
        axios.put(`${BASE_API_URL}/changeLocation`, data, { headers: {"Authorization" : `Bearer ${token}`} }),


    addNurseEducation: (data, token) =>
        axios.post(`${BASE_API_URL}/nurseEducation`, data, { headers: {"Authorization" : `Bearer ${token}`} }),
    getNurseEducation : (token) =>
        axios.get(`${BASE_API_URL}/nurseEducation`, { headers: {"Authorization" : `Bearer ${token}`} }),
    showNurseEducation : (id, token) =>
        axios.get(`${BASE_API_URL}/nurseEducation/${id}`, { headers: {"Authorization" : `Bearer ${token}`} }),
    editNurseEducation : (id, data, token) =>
        axios.put(`${BASE_API_URL}/nurseEducation/${id}`, data, { headers: {"Authorization" : `Bearer ${token}`} }),
    deleteNurseEducation : (id, token) => 
        axios.delete(`${BASE_API_URL}/nurseEducation/${id}`, { headers: {"Authorization" : `Bearer ${token}`} }),

    addNurseExperience: (data, token) =>
        axios.post(`${BASE_API_URL}/nurseExperience`, data, { headers: {"Authorization" : `Bearer ${token}`} }),
    getNurseExperience : (token) =>
        axios.get(`${BASE_API_URL}/nurseExperience`, { headers: {"Authorization" : `Bearer ${token}`} }),
    showNurseExperience : (id, token) =>
        axios.get(`${BASE_API_URL}/nurseExperience/${id}`, { headers: {"Authorization" : `Bearer ${token}`} }),
    editNurseExperience : (id, data, token) =>
        axios.put(`${BASE_API_URL}/nurseExperience/${id}`, data, { headers: {"Authorization" : `Bearer ${token}`} }),
    deleteNurseExperience : (id, token) => 
        axios.delete(`${BASE_API_URL}/nurseExperience/${id}`, { headers: {"Authorization" : `Bearer ${token}`} }),

    rating: (token) =>
        axios.get(`${BASE_API_URL}/rating`, { headers: {"Authorization" : `Bearer ${token}`} }),

    //apis for regular users
    getThisNurse : (id, token) =>
        axios.get(`${BASE_API_URL}/nurse/${id}`, { headers: {"Authorization" : `Bearer ${token}`} }),
    getNurseGivenUserId: (user_id, token) => 
        axios.get(`${BASE_API_URL}/thisNurse/${user_id}`, { headers: {"Authorization" : `Bearer ${token}`} }),
    getThisNurseEducation : (nurse_id, token) =>
        axios.get(`${BASE_API_URL}/education/${nurse_id}`, { headers: {"Authorization" : `Bearer ${token}`} }),
    getThisNurseExperience : (nurse_id, token) =>
        axios.get(`${BASE_API_URL}/experience/${nurse_id}`, { headers: {"Authorization" : `Bearer ${token}`} }),

    // limit nurses according to budget
    limitNurses8HoursBudget: (pricePer8Hour, token) => 
        axios.get(`${BASE_API_URL}/nurses8/${pricePer8Hour}`, { headers: {"Authorization" : `Bearer ${token}`} }),
    limitNurses12HoursBudget: (pricePer12Hour, token) => 
        axios.get(`${BASE_API_URL}/nurses12/${pricePer12Hour}`, { headers: {"Authorization" : `Bearer ${token}`} }),
    limitNurses24HoursBudget: (pricePer24Hour, token) => 
        axios.get(`${BASE_API_URL}/nurses24/${pricePer24Hour}`, { headers: {"Authorization" : `Bearer ${token}`} }),
    }