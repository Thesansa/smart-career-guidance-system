import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // ✅ Correct import for jwt-decode v4+
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        if (token) {
            const userData = decodeToken(token);
            setUser(userData);
        }
        setLoading(false);
    }, [token]);

    const decodeToken = (token) => {
        try {
            // ✅ Use jwtDecode instead of manual decoding
            const payload = jwtDecode(token);
            console.log('🔐 Decoded token payload:', payload);

            return {
                username: payload.sub || payload.username,
                role: payload.role || payload.authorities?.[0]?.authority,
                id: payload.id || payload.userId
            };
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    };

    const login = async (email, password) => {
        try {
            const response = await authAPI.login(email, password);
            const { token } = response.data;

            localStorage.setItem('token', token);
            setToken(token);

            const userData = decodeToken(token);
            setUser(userData);

            console.log('✅ Login successful, user:', userData);

            return { success: true };
        } catch (error) {
            console.error('❌ Login error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const register = async (userData) => {
        try {
            const response = await authAPI.register(userData);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const value = {
        user,
        login,
        register,
        logout,
        loading,
        isAuthenticated: !!token,
        isAdmin: user?.role === 'ADMIN',
        isStudent: user?.role === 'STUDENT',
        isCounselor: user?.role === 'COUNSELOR'
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};