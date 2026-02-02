import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const token = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (token && storedUser) {
                const parsedUser = JSON.parse(storedUser);
                // Set initial state from storage to avoid flickering
                setUser(parsedUser);

                // Fetch fresh data
                try {
                    const res = await axios.get(`${API_URL}/api/users/${parsedUser.id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    if (res.data) {
                        setUser(res.data);
                        localStorage.setItem('user', JSON.stringify(res.data));
                    }
                } catch (err) {
                    console.error('Error fetching fresh user data:', err);
                    // If token is invalid (401/403), logout to clean state
                    if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        setUser(null);
                    }
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        };

        checkUser();
    }, []);

    const login = (token, userData) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
