import axios from 'axios';
import BASE_API_URL from './BaseUrl';

export default {

    // posts
    addPost : (data, token) => 
        axios.post(`${BASE_API_URL}/posts`, data, { headers: {"Authorization" : `Bearer ${token}`} }),
    getPost: (id, token) =>
        axios.get(`${BASE_API_URL}/posts/${id}`, { headers: {"Authorization" : `Bearer ${token}`} }),
    getPosts : (token) =>
        axios.get(`${BASE_API_URL}/posts`, { headers: {"Authorization" : `Bearer ${token}`} }),
    editPosts : (id, data, token) =>
        axios.put(`${BASE_API_URL}/posts/${id}`, data, { headers: {"Authorization" : `Bearer ${token}`} }),
    deletePost : (id, token) =>
        axios.delete(`${BASE_API_URL}/posts/${id}`, { headers: {"Authorization" : `Bearer ${token}`} }),

    //comments
    markRead: (id, token) => 
        axios.put(`${BASE_API_URL}/readComment/${id}`,{}, { headers: {"Authorization" : `Bearer ${token}`} }),
    unreadComments: (token) =>
        axios.get(`${BASE_API_URL}/unreadComments`, { headers: {"Authorization" : `Bearer ${token}`} }),
    getPostComments : (post_id, token) =>
        axios.get(`${BASE_API_URL}/comments/${post_id}`, { headers: {"Authorization" : `Bearer ${token}`} }),
    getPostTwoComments : (post_id,token) =>
        axios.get(`${BASE_API_URL}/commentsTwo/${post_id}`, { headers: {"Authorization" : `Bearer ${token}`} }),
    getUserPostsComments : (token) =>
        axios.get(`${BASE_API_URL}/comments`, { headers: {"Authorization" : `Bearer ${token}`} }),    
    addComment : (post_id, data, token) => 
        axios.post(`${BASE_API_URL}/comments/${post_id}`, data, { headers: {"Authorization" : `Bearer ${token}`} }),
    editComment : (id, data, token) => 
        axios.put(`${BASE_API_URL}/comments/${id}`, data, { headers: {"Authorization" : `Bearer ${token}`} }),
    deleteComment : (id, token) =>
        axios.delete(`${BASE_API_URL}/comments/${id}`, { headers: {"Authorization" : `Bearer ${token}`} }),
           
}