import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify'; 
import '../App.css';

const AdminOrderDetailsScreen = () => {
    const { id: orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchOrderDetails = async () => {
        try {
            const token = localStorage.getItem('petCareToken');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            const { data } = await axios.get(`http://localhost:5000/api/orders/${orderId}`, config);
            setOrder(data);
            setLoading(false);
        } catch (err) {
            console.error("Fetch Error:", err);
            setError(err.response && err.response.data.message ? err.response.data.message : err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrderDetails();
    }, [orderId]);

    const deliverHandler = async () => {
        if (window.confirm('Are you sure you want to mark this order as delivered?')) {
            try {
                const token = localStorage.getItem('petCareToken');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                await axios.put(`http://localhost:5000/api/orders/${orderId}/deliver`, {}, config);
                
                toast.success('Order Marked as Delivered! 🚚✅', {
                    theme: "colored",
                    style: { backgroundColor: '#27ae60', color: '#fff' }
                });

                fetchOrderDetails();
            } catch (error) {
                toast.error('Error updating status. Please try again. 😿', {
                    theme: "colored"
                });
            }
        }
    };

    if (loading) return (
        <div className="md:ml-64 min-h-screen flex justify-center items-center bg-[#FFFBF7]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A0522D]"></div>
        </div>
    );
    
    if (error) return (
        <div className="md:ml-64 min-h-screen flex flex-col justify-center items-center bg-[#FFFBF7] p-4">
            <div className="bg-white p-8 rounded-[2rem] shadow-sm text-center border border-red-100">
                <div className="text-4xl mb-4">⚠️</div>
                <h2 className="text-xl font-bold text-red-500 mb-2">Error Loading Order</h2>
                <p className="text-gray-500 mb-6">{error}</p>
                <Link to="/admin/orderlist" className="px-6 py-2 bg-gray-100 text-gray-700 rounded-full font-bold hover:bg-gray-200 transition-colors">
                    Go Back
                </Link>
            </div>
        </div>
    );

    if (!order) return <div className="md:ml-64 p-8">Order Not Found</div>;

    return (
        <div className="md:ml-64 min-h-screen bg-[#FFFBF7] p-8">
            
            {/* Top Navigation */}
            <div className="flex items-center gap-4 mb-8 animate-fade-in-up">
                <Link to="/admin/orderlist" className="bg-white p-3 rounded-full shadow-sm text-gray-500 hover:text-[#A0522D] hover:shadow-md transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                </Link>
                <div>
                    <h1 className="text-3xl font-extrabold text-[#3C3F36]">Order Details</h1>
                    <p className="text-gray-400 text-sm font-mono">ID: {order._id}</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* --- LEFT COLUMN: Customer & Items --- */}
                <div className="lg:col-span-2 space-y-8 animate-fade-in-up delay-100">
                    
                    {/* Customer & Shipping Card */}
                    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mr-10 -mt-10"></div>
                        
                        <div className="flex items-center gap-3 mb-6 relative z-10">
                            <span className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-xl">👤</span>
                            <h2 className="text-2xl font-bold text-[#3C3F36]">Customer Info</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Name</p>
                                <p className="text-lg font-bold text-gray-800">{order.user?.name}</p>
                                <p className="text-gray-500 text-sm">{order.user?.email}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Contact</p>
                                <p className="text-lg font-bold text-gray-800">{order.shippingAddress?.phone}</p>
                            </div>
                            <div className="md:col-span-2 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Shipping Address</p>
                                <p className="text-gray-700 font-medium">
                                    {order.shippingAddress?.address}, <br/>
                                    {order.shippingAddress?.city}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Order Items Card */}
                    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-xl">📦</span>
                            <h2 className="text-2xl font-bold text-[#3C3F36]">Order Items</h2>
                        </div>

                        <div className="space-y-4">
                            {(order.orderItems || []).map((item, index) => (
                                <div key={index} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                    <div className="w-16 h-16 bg-white rounded-xl overflow-hidden flex-shrink-0 border border-gray-200">
                                        <img src={item.image || '/images/sample.jpg'} alt={item.name} className="w-full h-full object-contain" />
                                    </div>
                                    <div className="flex-grow">
                                        <p className="font-bold text-gray-800">{item.name}</p>
                                        <p className="text-sm text-gray-500">
                                            {item.qty} x Rs. {item.price}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-[#A0522D]">Rs. {(item.qty * item.price).toFixed(2)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* --- RIGHT COLUMN: Summary & Actions --- */}
                <div className="lg:col-span-1 animate-fade-in-up delay-200">
                    <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-gray-100 sticky top-10">
                        <h2 className="text-xl font-extrabold text-[#3C3F36] mb-6">Order Summary</h2>

                        {/* Status Badge */}
                        <div className={`p-4 rounded-xl mb-6 text-center border ${
                            order.isDelivered 
                            ? 'bg-green-50 border-green-200 text-green-700' 
                            : 'bg-yellow-50 border-yellow-200 text-yellow-700'
                        }`}>
                            <p className="text-xs font-bold uppercase tracking-widest mb-1">Delivery Status</p>
                            <p className="text-xl font-extrabold flex items-center justify-center gap-2">
                                {order.isDelivered ? '✅ DELIVERED' : '⏳ PENDING'}
                            </p>
                        </div>

                        <div className="space-y-4 mb-8">
                             <div className="flex justify-between items-center text-gray-600">
                                <span>Payment Method</span>
                                <span className="font-bold text-gray-800">COD</span>
                            </div>
                            <hr className="border-gray-100"/>
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-bold text-gray-800">Total Amount</span>
                                <span className="text-2xl font-extrabold text-[#A0522D]">
                                    Rs. {order.totalPrice ? order.totalPrice.toFixed(2) : '0.00'}
                                </span>
                            </div>
                        </div>

                        {/* Action Button */}
                        {!order.isDelivered && (
                            <button 
                                onClick={deliverHandler} 
                                className="w-full py-4 rounded-xl bg-[#3C3F36] text-white font-bold text-lg shadow-lg hover:bg-black hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex justify-center items-center gap-2"
                            >
                                Mark As Delivered 🚚
                            </button>
                        )}

                        {order.isDelivered && (
                             <div className="text-center text-gray-400 text-sm italic mt-4">
                                 Order completed on {new Date().toLocaleDateString()}
                             </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminOrderDetailsScreen;