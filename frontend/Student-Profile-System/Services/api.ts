import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080/api/student-profiles/all';

const api = axios.create({
    baseURL: API_BASE,
    headers: { 'Content-Type': 'application/json' },
});

export type Role = { id: number; name?: string; roleName?: string };
export type UserPayload = {
    roleId: number;
    username: string;
    email: string;
    password: string;
};

export const getRoles = () => api.get<Role[]>('/roles/all');
export const createUser = (payload: UserPayload) => api.post('/users/add', payload);

export default api;
