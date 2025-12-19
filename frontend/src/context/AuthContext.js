import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('petCareToken');
        if (token) {
            try {
                const decodedUser = jwtDecode(token);
                // Check if token is expired
                if (decodedUser.exp * 1000 > Date.now()) {
                    setUser({ name: decodedUser.name, isAdmin: decodedUser.isAdmin });
                } else {
                    localStorage.removeItem('petCareToken');
                }
            } catch (error) {
                console.error("Invalid token found:", error);
                localStorage.removeItem('petCareToken');
            }
        }
    }, []);

    
    const login = useCallback((token) => {
        localStorage.setItem('petCareToken', token);
        try {
            const decodedUser = jwtDecode(token);
            setUser({ name: decodedUser.name, isAdmin: decodedUser.isAdmin });
        } catch (error) {
            console.error("Failed to decode token on login:", error);
        }
    }, []); // Empty dependency array means this function will never change

    const logout = useCallback(() => {
        localStorage.removeItem('petCareToken');
        setUser(null);
    }, []); // Empty dependency array means this function will never change

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};