import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'; 
import '../App.css'; 

const AdminAdoptionRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = async () => {
        try {
            const token = localStorage.getItem('petCareToken');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get('http://localhost:5000/api/adoption', config);
            setRequests(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching requests", error);
            setLoading(false);
            toast.error("Failed to fetch requests. 🔌");
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const updateStatusHandler = async (id, newStatus) => {
        if (window.confirm(`Are you sure you want to mark this as ${newStatus}?`)) {
            try {
                const token = localStorage.getItem('petCareToken');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                
                await axios.put(`http://localhost:5000/api/adoption/${id}`, { status: newStatus }, config);
                
                toast.success(`Request marked as ${newStatus}! ✅`, {
                    theme: "colored",
                    style: { backgroundColor: newStatus === 'Approved' ? '#2ecc71' : '#e74c3c', color: '#fff' }
                });

                fetchRequests();
            } catch (error) {
                toast.error('Failed to update status. Please try again. 😿', {
                    theme: "colored"
                });
            }
        }
    };

    // Helper for Status Styles
    const getStatusStyle = (status) => {
        switch(status) {
            case 'Approved': return 'bg-green-100 text-green-700 border-green-200';
            case 'Rejected': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        }
    };

    if (loading) return (
        <div className="md:ml-64 min-h-screen flex justify-center items-center bg-[#FFFBF7]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A0522D]"></div>
        </div>
    );

    return (
        <div className="md:ml-64 min-h-screen bg-[#FFFBF7] p-8">
            <div className="flex justify-between items-center mb-8 animate-fade-in-up">
                <div>
                    <h1 className="text-3xl font-extrabold text-[#3C3F36]">Adoption Requests</h1>
                    <p className="text-gray-500 mt-1">Review and manage adoption applications.</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-xl shadow-sm text-sm font-bold text-gray-600 border border-gray-100">
                    Total Requests: {requests.length}
                </div>
            </div>
            
            {requests.length === 0 ? (
                <div className="bg-white rounded-[2rem] p-12 text-center shadow-sm border border-gray-100 animate-fade-in-up">
                    <div className="text-5xl mb-4">📭</div>
                    <p className="text-gray-500 text-lg">No adoption requests found.</p>
                </div>
            ) : (
                <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden animate-fade-in-up delay-100">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">User</th>
                                    <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Pet</th>
                                    <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Contact</th>
                                    <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Message</th>
                                    <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {requests.map(req => (
                                    <tr key={req._id} className="hover:bg-[#FFFBF7] transition-colors">
                                        <td className="p-5 font-medium text-gray-700">
                                            {req.user?.name || <span className="text-red-400">Unknown User</span>}
                                        </td>
                                        <td className="p-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-100 rounded-full overflow-hidden flex-shrink-0 border border-gray-200">
                                                    <img 
                                                        src={req.pet?.image || '/images/sample.jpg'} 
                                                        alt="" 
                                                        className="w-full h-full object-cover" 
                                                    />
                                                </div>
                                                <span className="font-bold text-gray-800">{req.pet?.name || 'Unknown'}</span>
                                            </div>
                                        </td>
                                        <td className="p-5 text-gray-600 text-sm">
                                            {req.contactNumber}
                                        </td>
                                        <td className="p-5 text-gray-500 text-sm max-w-xs truncate" title={req.message}>
                                            "{req.message}"
                                        </td>
                                        <td className="p-5">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(req.status)}`}>
                                                {req.status}
                                            </span>
                                        </td>
                                        <td className="p-5">
                                            {req.status === 'Pending' ? (
                                                <div className="flex gap-2">
                                                    <button 
                                                        onClick={() => updateStatusHandler(req._id, 'Approved')}
                                                        className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                                                        title="Approve"
                                                    >
                                                        ✅
                                                    </button>
                                                    <button 
                                                        onClick={() => updateStatusHandler(req._id, 'Rejected')}
                                                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                                        title="Reject"
                                                    >
                                                        ❌
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-gray-400 italic">No actions</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminAdoptionRequests;