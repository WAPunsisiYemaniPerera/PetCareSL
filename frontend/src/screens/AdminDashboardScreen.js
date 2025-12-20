import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; 
import '../App.css';

const AdminDashboardScreen = () => {
    const [stats, setStats] = useState({ users: 0, pets: 0, forAdoption: 0, orders: 0 });
    const [loading, setLoading] = useState(true);
    const [time, setTime] = useState(new Date()); 
    
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || !user.isAdmin) {
            navigate('/login'); 
            return;
        }

        toast.info(`Welcome back, Admin ${user.name}! 👋`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
            toastId: "welcome-toast" 
        });

        const timerId = setInterval(() => {
            setTime(new Date());
        }, 1000); 

        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('petCareToken');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const { data } = await axios.get('https://yemani-petcare-backend.hf.space/api/admin/stats', config);
                
                setStats(data || { users: 0, pets: 0, forAdoption: 0, orders: 0 });
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch admin stats", error);
                setLoading(false);
                toast.error("Failed to load dashboard data 📉", { theme: "colored" });
            }
        };

        fetchStats();

        return () => clearInterval(timerId);
    }, [user, navigate]);

    if (loading) return (
        <div className="md:ml-64 min-h-screen flex justify-center items-center bg-[#FFFBF7]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A0522D]"></div>
        </div>
    );

    return (
        <div className="md:ml-64 min-h-screen bg-[#FFFBF7] p-8">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 animate-fade-in-up">
                <div>
                    <h1 className="text-3xl font-extrabold text-[#3C3F36]">Dashboard Overview</h1>
                    <p className="text-gray-500 mt-1">Here's what's happening in your store today.</p>
                </div>
                <div className="text-right mt-4 md:mt-0 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-2xl font-bold text-[#A0522D]">{time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                    <p className="text-xs text-gray-400 font-bold uppercase">{time.toLocaleDateString()}</p>
                </div>
            </div>

            {/* Stats Grid - Clickable Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 animate-fade-in-up delay-100">
                
                {/* Users Card */}
                <div 
                    onClick={() => navigate('/admin/userlist')} 
                    className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-[2rem] shadow-sm border border-blue-100 flex items-center gap-4 cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all"
                >
                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-2xl shadow-sm">👥</div>
                    <div>
                        <p className="text-xs font-bold text-blue-400 uppercase tracking-wider">Total Users</p>
                        <h3 className="text-3xl font-extrabold text-blue-900">{stats.users}</h3>
                    </div>
                </div>

                {/* Pets Card */}
                <div 
                    onClick={() => navigate('/admin/petlist')}
                    className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-[2rem] shadow-sm border border-green-100 flex items-center gap-4 cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all"
                >
                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-2xl shadow-sm">🐾</div>
                    <div>
                        <p className="text-xs font-bold text-green-500 uppercase tracking-wider">Total Pets</p>
                        <h3 className="text-3xl font-extrabold text-green-900">{stats.pets}</h3>
                    </div>
                </div>

                {/* Adoption Card */}
                <div 
                    onClick={() => navigate('/admin/adoption-requests')}
                    className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-[2rem] shadow-sm border border-orange-100 flex items-center gap-4 cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all"
                >
                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-2xl shadow-sm">🏠</div>
                    <div>
                        <p className="text-xs font-bold text-orange-400 uppercase tracking-wider">Adoptions</p>
                        <h3 className="text-3xl font-extrabold text-orange-900">{stats.forAdoption}</h3>
                    </div>
                </div>

                 {/* Orders Card (Fixed Label & Link) */}
                 <div 
                    onClick={() => navigate('/admin/orderlist')}
                    className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-[2rem] shadow-sm border border-purple-100 flex items-center gap-4 cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all"
                >
                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-2xl shadow-sm">🛒</div>
                    <div>
                        {/* Changed Label to "Total Orders" */}
                        <p className="text-xs font-bold text-purple-400 uppercase tracking-wider">Total Orders</p>
                        <h3 className="text-3xl font-extrabold text-purple-900">{stats.orders || 0}</h3>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in-up delay-200">
                
                {/* Action Shortcuts */}
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-[#3C3F36] mb-6">Quick Actions ⚡</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <button onClick={() => navigate('/admin/productlist')} className="p-4 bg-gray-50 rounded-2xl hover:bg-[#A0522D] hover:text-white transition-all text-sm font-bold text-gray-600 flex flex-col items-center gap-2">
                            <span>📦</span> Manage Products
                        </button>
                        <button onClick={() => navigate('/admin/adoption-requests')} className="p-4 bg-gray-50 rounded-2xl hover:bg-[#A0522D] hover:text-white transition-all text-sm font-bold text-gray-600 flex flex-col items-center gap-2">
                            <span>📄</span> Check Requests
                        </button>
                        <button onClick={() => navigate('/admin/userlist')} className="p-4 bg-gray-50 rounded-2xl hover:bg-[#A0522D] hover:text-white transition-all text-sm font-bold text-gray-600 flex flex-col items-center gap-2">
                            <span>👥</span> Manage Users
                        </button>
                        <button onClick={() => navigate('/admin/orderlist')} className="p-4 bg-gray-50 rounded-2xl hover:bg-[#A0522D] hover:text-white transition-all text-sm font-bold text-gray-600 flex flex-col items-center gap-2">
                            <span>🚚</span> View Orders
                        </button>
                    </div>
                </div>

                <div className="bg-[#3C3F36] p-8 rounded-[2rem] shadow-lg text-white flex flex-col justify-between">
                    <div>
                        <h3 className="text-xl font-bold mb-2">Admin Tips 💡</h3>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            Keep your pet database updated regularly. Check adoption requests daily to ensure pets find their homes quickly. Don't forget to mark orders as delivered!
                        </p>
                    </div>
                    <div className="mt-6 pt-6 border-t border-gray-600 flex justify-between items-center">
                        <span className="text-xs font-bold bg-white/10 px-3 py-1 rounded-full text-gray-300">System Status: Stable</span>
                        <span className="text-2xl animate-pulse">🟢</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardScreen;