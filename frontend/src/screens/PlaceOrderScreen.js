import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import {toast} from 'react-toastify';
import '../App.css'; // Animations

const PlaceOrderScreen = () => {
    const { cartItems, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [phone, setPhone] = useState('');

    const [isOrderPlaced, setIsOrderPlaced] = useState(false);

    // Calculations
    const itemsPrice = cartItems.reduce((acc, item) => acc + (Number(item.price || 0) * Number(item.qty || 1)), 0);
    const shippingPrice = itemsPrice > 5000 ? 0 : 350;
    const totalPrice = itemsPrice + shippingPrice;

    useEffect(()=>{
        //if cart is empty then redirect to products and order finished then too
        if(!cartItems.length === 0 && !isOrderPlaced){
            navigate('/');
        }
    }, [cartItems, isOrderPlaced, navigate]);

    const placeOrderHandler = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('petCareToken');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const orderData = {
                orderItems: cartItems.map(item => ({
                    product: item._id,
                    name: item.name,
                    qty: item.qty,
                    image: item.image,
                    price: item.price
                })),
                shippingAddress: { address, city, phone },
                totalPrice
            };

            await axios.post('https://yemani-petcare-backend.hf.space/api/orders', orderData, config);
            
            // Success Animation/Alert could go here
            toast.success('Order Placed Successfully! 🎉', {
                theme: "colored",
                style: { backgroundColor: '#A0522D', color: '#fff' } 
            });

            setIsOrderPlaced(true);
            clearCart();
            navigate('/products') 
        } catch (error) {
            console.error(error);
            toast.error('Failed to place order. Please try again. 😿', {
                theme: "colored"
            });
        }
    };

    return (
        <div className="min-h-screen bg-[#FFFBF7] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-10 animate-fade-in-up">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-[#3C3F36] mb-2">
                        Secure Checkout 🔒
                    </h1>
                    <p className="text-gray-500">Complete your order and get your paws on these treats!</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    
                    {/* --- LEFT SIDE: Shipping Form --- */}
                    <div className="lg:col-span-2 animate-fade-in-up delay-100">
                        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-xl">🚚</span>
                                <h2 className="text-2xl font-bold text-[#3C3F36]">Shipping Details</h2>
                            </div>

                            <form id="order-form" onSubmit={placeOrderHandler} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Address</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-3.5 text-gray-400">📍</span>
                                        <input 
                                            type="text" 
                                            required 
                                            value={address} 
                                            onChange={(e) => setAddress(e.target.value)} 
                                            placeholder="House No, Street Name"
                                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#A0522D] focus:ring-1 focus:ring-[#A0522D] outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">City</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-3.5 text-gray-400">🏙️</span>
                                            <input 
                                                type="text" 
                                                required 
                                                value={city} 
                                                onChange={(e) => setCity(e.target.value)} 
                                                placeholder="e.g. Colombo"
                                                className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#A0522D] focus:ring-1 focus:ring-[#A0522D] outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-3.5 text-gray-400">📞</span>
                                            <input 
                                                type="text" 
                                                required 
                                                value={phone} 
                                                onChange={(e) => setPhone(e.target.value)} 
                                                placeholder="077 123 4567"
                                                className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#A0522D] focus:ring-1 focus:ring-[#A0522D] outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100 flex items-start gap-3">
                                    <span className="text-xl">💵</span>
                                    <div>
                                        <h4 className="font-bold text-yellow-800">Payment Method</h4>
                                        <p className="text-sm text-yellow-700">Currently, we only support <strong>Cash on Delivery (COD)</strong>.</p>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* --- RIGHT SIDE: Order Summary --- */}
                    <div className="lg:col-span-1 animate-fade-in-up delay-200">
                        <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-gray-100 sticky top-28">
                            <h2 className="text-xl font-extrabold text-[#3C3F36] mb-6">Order Summary</h2>

                            {/* Mini Cart List */}
                            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                {cartItems.map(item => (
                                    <div key={item._id} className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                                        </div>
                                        <div className="flex-grow">
                                            <p className="text-sm font-bold text-gray-700 line-clamp-1">{item.name}</p>
                                            <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                                        </div>
                                        <span className="text-sm font-bold text-gray-800">Rs. {(item.price * item.qty).toFixed(0)}</span>
                                    </div>
                                ))}
                            </div>

                            <hr className="border-gray-100 mb-6" />
                            
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span className="font-bold">Rs. {itemsPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    {shippingPrice === 0 ? (
                                        <span className="text-green-600 font-bold text-sm bg-green-50 px-2 py-0.5 rounded-md">Free</span>
                                    ) : (
                                        <span className="font-bold">Rs. {shippingPrice.toFixed(2)}</span>
                                    )}
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-lg font-bold text-gray-800">Total</span>
                                    <span className="text-2xl font-extrabold text-[#A0522D]">Rs. {totalPrice.toFixed(2)}</span>
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                form="order-form"
                                className="w-full py-4 rounded-xl bg-[#A0522D] text-white font-bold text-lg shadow-lg hover:bg-[#8B4513] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex justify-center items-center gap-2"
                            >
                                Confirm Order ✅
                            </button>
                            
                            <p className="text-center text-xs text-gray-400 mt-4">
                                By placing this order, you agree to our Terms of Service.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default PlaceOrderScreen;