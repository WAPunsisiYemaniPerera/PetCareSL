import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify'; 
import '../App.css'; 

const AdminOrderListScreen = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || !user.isAdmin) {
            navigate('/login');
        } else {
            const fetchOrders = async () => {
                try {
                    const token = localStorage.getItem('petCareToken');
                    const config = { headers: { Authorization: `Bearer ${token}` } };
                    const { data } = await axios.get('http://localhost:5000/api/orders', config);
                    setOrders(data);
                    setLoading(false);
                } catch (error) {
                    console.error("Error fetching orders", error);
                    setLoading(false);
                    
                    toast.error("Failed to load orders list. 📉", {
                        theme: "colored"
                    });
                }
            };
            fetchOrders();
        }
    }, [user, navigate]);

    if (loading) return (
        <div className="md:ml-64 min-h-screen flex justify-center items-center bg-[#FFFBF7]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A0522D]"></div>
        </div>
    );

    return (
        <div className="md:ml-64 min-h-screen bg-[#FFFBF7] p-8">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-8 animate-fade-in-up">
                <div>
                    <h1 className="text-3xl font-extrabold text-[#3C3F36]">Manage Orders</h1>
                    <p className="text-gray-500 mt-1">Track and manage customer orders.</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 font-bold text-gray-600">
                    Total Orders: <span className="text-[#A0522D]">{orders.length}</span>
                </div>
            </div>

            {orders.length === 0 ? (
                <div className="bg-white rounded-[2rem] p-12 text-center shadow-sm border border-gray-100 animate-fade-in-up">
                    <div className="text-5xl mb-4">🛒</div>
                    <p className="text-gray-500 text-lg">No orders found.</p>
                </div>
            ) : (
                <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden animate-fade-in-up delay-100">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Order ID</th>
                                    <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Customer</th>
                                    <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
                                    <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Total</th>
                                    <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {orders.map(order => (
                                    <tr key={order._id} className="hover:bg-[#FFFBF7] transition-colors">
                                        <td className="p-5 font-mono text-xs text-gray-500">
                                            {order._id.substring(0, 10)}...
                                        </td>
                                        <td className="p-5 font-bold text-gray-700">
                                            {order.user?.name || 'Unknown'}
                                        </td>
                                        <td className="p-5 text-sm text-gray-500">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-5 font-bold text-[#A0522D]">
                                            Rs. {order.totalPrice.toFixed(2)}
                                        </td>
                                        <td className="p-5">
                                            {order.isDelivered ? (
                                                <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full border border-green-200">
                                                    Delivered
                                                </span>
                                            ) : (
                                                <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1 rounded-full border border-yellow-200">
                                                    Pending
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-5">
                                            <Link 
                                                to={`/admin/order/${order._id}`} 
                                                className="bg-gray-100 text-gray-600 hover:bg-[#A0522D] hover:text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-sm"
                                            >
                                                View Details
                                            </Link>
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

export default AdminOrderListScreen;