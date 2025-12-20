import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import '../App.css'; 

const AdminLoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { user, login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user && user.isAdmin) {
            navigate('/admin/dashboard');
        }
    }, [user, navigate]);

    const submitHandler = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const { data } = await axios.post('https://yemani-petcare-backend.hf.space/api/users/admin/login', { email, password });
            login(data.token);
            
            toast.success('Welcome Back, Admin! 🛡️', {
                theme: "colored",
                style: { backgroundColor: '#3C3F36', color: '#fff' }, 
                autoClose: 2000
            });

            navigate('/admin/dashboard');
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Access Denied. Admin privileges required.';
            setError(errorMessage);
            
            toast.error(errorMessage + ' 🚫', {
                theme: "colored"
            });
        }
    };

    return (
        <div className="min-h-screen bg-[#FFFBF7] flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-10 border border-gray-100 animate-fade-in-up">
                
                {/* Header / Logo Area */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-[#3C3F36] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg text-4xl animate-bounce">
                        🛡️
                    </div>
                    <h2 className="text-3xl font-extrabold text-[#3C3F36]">Admin Portal</h2>
                    <p className="text-gray-500 mt-2 text-sm uppercase tracking-widest font-bold">Authorized Access Only</p>
                </div>

                {/* Error Message (On Screen) - Toast එකට අමතරව මේකත් තියෙන එක හොඳයි */}
                {error && (
                    <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-6 text-sm font-bold border border-red-100 flex items-center gap-2 animate-pulse">
                        ⚠️ {error}
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={submitHandler} className="space-y-5">
                    
                    {/* Email Field */}
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Admin Email</label>
                        <div className="relative">
                            <span className="absolute left-4 top-3.5 text-gray-400 text-lg">📧</span>
                            <input 
                                type="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                                className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#3C3F36] focus:ring-1 focus:ring-[#3C3F36] outline-none transition-all font-medium text-gray-700 placeholder-gray-400"
                                placeholder="admin@petcare.com"
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Password</label>
                        <div className="relative">
                            <span className="absolute left-4 top-3.5 text-gray-400 text-lg">🔒</span>
                            <input 
                                type="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                                className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#3C3F36] focus:ring-1 focus:ring-[#3C3F36] outline-none transition-all font-medium text-gray-700 placeholder-••••••••"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        className="w-full bg-[#3C3F36] text-white py-4 rounded-xl font-bold text-lg hover:bg-black hover:shadow-lg hover:-translate-y-1 transition-all duration-300 mt-4 flex justify-center items-center gap-2"
                    >
                        Secure Login 🚀
                    </button>
                </form>

                {/* Footer Link */}
                <div className="mt-8 text-center">
                    <Link to="/" className="text-sm font-medium text-gray-400 hover:text-[#3C3F36] transition-colors flex items-center justify-center gap-1 group">
                        <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Main Site
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminLoginScreen;