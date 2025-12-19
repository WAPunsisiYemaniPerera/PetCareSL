import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../App.css'; 

const MyAdoptionRequestsScreen = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            const fetchMyRequests = async () => {
                try {
                    const token = localStorage.getItem('petCareToken');
                    const config = { headers: { Authorization: `Bearer ${token}` } };
                    const { data } = await axios.get('http://localhost:5000/api/adoption/my-requests', config);
                    setRequests(data);
                    setLoading(false);
                } catch (error) {
                    console.error("Error fetching my requests", error);
                    setLoading(false);
                }
            };
            fetchMyRequests();
        }
    }, [user, navigate]);

    // Status Badge Logic
    const getStatusStyle = (status) => {
        switch(status) {
            case 'Approved': return 'bg-green-100 text-green-700 border-green-200';
            case 'Rejected': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        }
    };

    return (
        <div className="min-h-screen bg-[#FFFBF7] py-12 px-4">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-extrabold text-[#3C3F36] mb-8 animate-fade-in-up">
                    My Adoption Requests 📬
                </h1>

                {loading ? (
                    <div className="flex justify-center h-32 items-center"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-[#A0522D]"></div></div>
                ) : requests.length === 0 ? (
                    <div className="bg-white rounded-[2rem] p-12 text-center shadow-sm animate-fade-in-up">
                        <div className="text-5xl mb-4">📭</div>
                        <p className="text-gray-500 text-lg">You haven't made any adoption requests yet.</p>
                        <p className="text-gray-400">Visit our adoption page to find a friend!</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100 animate-fade-in-up delay-100">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Pet</th>
                                        <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Your Message</th>
                                        <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Date Sent</th>
                                        <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {requests.map(req => (
                                        <tr key={req._id} className="hover:bg-[#FFFBF7] transition-colors">
                                            <td className="p-6">
                                                <div className="flex items-center gap-4">
                                                    <img 
                                                        src={req.pet?.image || '/images/sample.jpg'} 
                                                        alt="pet" 
                                                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                                                    />
                                                    <span className="font-bold text-gray-800">{req.pet?.name || 'Unknown Pet'}</span>
                                                </div>
                                            </td>
                                            <td className="p-6 max-w-xs truncate text-gray-600 font-medium">
                                                "{req.message}"
                                            </td>
                                            <td className="p-6 text-gray-500 text-sm">
                                                {new Date(req.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="p-6">
                                                <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${getStatusStyle(req.status)}`}>
                                                    {req.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyAdoptionRequestsScreen;