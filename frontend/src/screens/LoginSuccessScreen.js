import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../App.css'; // Animations

const LoginSuccessScreen = () => {
    const { login } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');

        if (token) {
            login(token);
            setTimeout(() => {
                navigate('/');
            }, 1500); 
        } else {
            navigate('/login');
        }
    }, [login, location, navigate]);

    return (
        <div className="min-h-screen bg-[#FFFBF7] flex flex-col justify-center items-center text-center p-4">
            
            {/* Cute Animation Container */}
            <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100 animate-fade-in-up">
                
                {/* Success Icon */}
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl mb-6 mx-auto animate-bounce">
                    🎉
                </div>

                <h2 className="text-2xl font-extrabold text-[#3C3F36] mb-2">Login Successful!</h2>
                <p className="text-gray-500 mb-6">Redirecting you to the home page...</p>

                {/* Custom Loader */}
                <div className="flex justify-center gap-2">
                    <span className="w-3 h-3 bg-[#A0522D] rounded-full animate-bounce"></span>
                    <span className="w-3 h-3 bg-[#A0522D] rounded-full animate-bounce delay-100"></span>
                    <span className="w-3 h-3 bg-[#A0522D] rounded-full animate-bounce delay-200"></span>
                </div>
            </div>
        </div>
    );
}

export default LoginSuccessScreen;