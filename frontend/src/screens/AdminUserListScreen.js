import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../App.css'; // Animations

const AdminUserListScreen = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // 1. Search State
    const [searchTerm, setSearchTerm] = useState('');

    const { user } = useAuth();
    const navigate = useNavigate();

/*************  ✨ Windsurf Command ⭐  *************/
/*******  706f414e-c1ee-4143-8e16-f245f77744b2  *******/
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('petCareToken');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get('https://yemani-petcare-backend.hf.space/api/admin/users', config);
            setUsers(data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch users.');
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user || !user.isAdmin) {
            navigate('/login');
        } else {
            fetchUsers();
        }
    }, [user, navigate]);

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            try {
                const token = localStorage.getItem('petCareToken');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                await axios.delete(`https://yemani-petcare-backend.hf.space/api/admin/users/${id}`, config);
                fetchUsers();
            } catch (err) {
                setError('Failed to delete user.');
            }
        }
    };

    // 2. Search Logic (Filter users by Name or Email)
    const filteredUsers = users.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="md:ml-64 min-h-screen flex justify-center items-center bg-[#FFFBF7]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A0522D]"></div>
        </div>
    );

    return (
        <div className="md:ml-64 min-h-screen bg-[#FFFBF7] p-8">
            
            {/* Header & Search Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 animate-fade-in-up">
                <div>
                    <h1 className="text-3xl font-extrabold text-[#3C3F36]">User Management</h1>
                    <p className="text-gray-500 mt-1">Manage system users and administrators.</p>
                </div>

                {/* Search Bar Design */}
                <div className="relative w-full md:w-96">
                    <span className="absolute left-4 top-3.5 text-gray-400">🔍</span>
                    <input 
                        type="text"
                        placeholder="Search by name or email..."
                        className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 focus:border-[#A0522D] focus:ring-1 focus:ring-[#A0522D] outline-none shadow-sm transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {error && <p className="text-red-500 font-bold mb-4">{error}</p>}

            {/* Table Container */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden animate-fade-in-up delay-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">User Profile</th>
                                <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Email</th>
                                <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Role</th>
                                <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-gray-500">
                                        No users found matching "{searchTerm}"
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map(u => (
                                    <tr key={u._id} className="hover:bg-[#FFFBF7] transition-colors">
                                        <td className="p-5">
                                            <div className="flex items-center gap-3">
                                                {/* Auto-generated Avatar */}
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm ${u.isAdmin ? 'bg-[#3C3F36]' : 'bg-[#A0522D]'}`}>
                                                    {u.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-800">{u.name}</p>
                                                    <p className="text-xs text-gray-400 font-mono">ID: {u._id.substring(0, 6)}...</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5 text-sm font-medium text-blue-600 hover:underline">
                                            <a href={`mailto:${u.email}`}>{u.email}</a>
                                        </td>
                                        <td className="p-5">
                                            {u.isAdmin ? (
                                                <span className="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full border border-purple-200 flex w-fit items-center gap-1">
                                                    🛡️ Admin
                                                </span>
                                            ) : (
                                                <span className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full border border-gray-200 flex w-fit items-center gap-1">
                                                    👤 User
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-5 text-right">
                                            {/* Prevent deleting oneself or other admins if needed */}
                                            {user && u._id !== user._id && (
                                                <button 
                                                    className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors shadow-sm"
                                                    onClick={() => deleteHandler(u._id)}
                                                    title="Delete User"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminUserListScreen;