import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../App.css'; // Animations

const LoginScreen = () => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        setError('');

        if (isRegistering) {
            if (password.length < 6) {
                setError('Password must be at least 6 characters long.');
                return;
            }
            try {
                await axios.post('https://yemani-petcare-backend.hf.space/api/users/register', { name, email, password });
                
                const loginData = await axios.post('https://yemani-petcare-backend.hf.space/api/users/login', { email, password });
                login(loginData.data.token);
                navigate('/');
            } catch (err) {
                setError(err.response?.data?.message || 'Registration failed.');
            }
        } else {
            try {
                const { data } = await axios.post('https://yemani-petcare-backend.hf.space/api/users/login', { email, password });
                login(data.token);
                navigate('/');
            } catch (err) {
                setError(err.response?.data?.message || 'Login failed.');
            }
        }
    };

    const googleLoginHandler = () => {
        window.location.href = 'https://yemani-petcare-backend.hf.space/auth/google';
    };

    return (
        <div className="min-h-screen bg-[#FFFBF7] flex items-center justify-center p-4">
            <div className="w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-100 animate-fade-in-up">
                
                {/* --- Left Side: Cute Image --- */}
                <div className="w-full md:w-1/2 bg-orange-50 relative hidden md:block">
                    <img 
                        src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                        alt="Cute Dogs" 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#A0522D]/80 to-transparent flex flex-col justify-end p-10 text-white">
                        <h2 className="text-3xl font-extrabold mb-2">Welcome Back! 🐾</h2>
                        <p className="text-white/90">Join our community of pet lovers and give your furry friend the best care.</p>
                    </div>
                </div>

                {/* --- Right Side: Login Form --- */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                    <div className="text-center md:text-left mb-8">
                        <h2 className="text-3xl font-extrabold text-[#3C3F36] mb-2">
                            {isRegistering ? 'Create Account' : 'Hello Again!'}
                        </h2>
                        <p className="text-gray-400">
                            {isRegistering ? 'Start your journey with us today' : 'Welcome back, you\'ve been missed!'}
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-6 text-sm font-bold flex items-center gap-2 border border-red-100">
                            ⚠️ {error}
                        </div>
                    )}

                    <form onSubmit={submitHandler} className="space-y-5">
                        {isRegistering && (
                            <div className="relative">
                                <span className="absolute left-4 top-3.5 text-gray-400 text-lg">👤</span>
                                <input 
                                    type="text" 
                                    placeholder="Your Name"
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)} 
                                    required
                                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#A0522D] focus:ring-1 focus:ring-[#A0522D] outline-none transition-all"
                                />
                            </div>
                        )}
                        
                        <div className="relative">
                            <span className="absolute left-4 top-3.5 text-gray-400 text-lg">✉️</span>
                            <input 
                                type="email" 
                                placeholder="Email Address"
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                                className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#A0522D] focus:ring-1 focus:ring-[#A0522D] outline-none transition-all"
                            />
                        </div>

                        <div className="relative">
                            <span className="absolute left-4 top-3.5 text-gray-400 text-lg">🔒</span>
                            <input 
                                type="password" 
                                placeholder="Password"
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                                className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#A0522D] focus:ring-1 focus:ring-[#A0522D] outline-none transition-all"
                            />
                        </div>

                        <button 
                            type="submit" 
                            className="w-full bg-[#A0522D] text-white py-3.5 rounded-xl font-bold hover:bg-[#8B4513] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                        >
                            {isRegistering ? 'Sign Up' : 'Sign In'}
                        </button>
                    </form>

                    <div className="flex items-center gap-4 my-6">
                        <div className="h-px bg-gray-200 flex-1"></div>
                        <span className="text-gray-400 text-sm font-medium">OR</span>
                        <div className="h-px bg-gray-200 flex-1"></div>
                    </div>

                    <button 
                        onClick={googleLoginHandler}
                        className="w-full border-2 border-gray-100 bg-white text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-3"
                    >
                        <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" className="w-5 h-5" />
                        Continue with Google
                    </button>

                    <p className="text-center mt-8 text-gray-500">
                        {isRegistering ? 'Already have an account? ' : "Don't have an account? "}
                        <button 
                            onClick={() => setIsRegistering(!isRegistering)}
                            className="text-[#A0522D] font-bold hover:underline"
                        >
                            {isRegistering ? 'Login' : 'Register'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;