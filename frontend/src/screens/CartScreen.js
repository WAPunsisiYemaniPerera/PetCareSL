import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify'; 
import '../App.css'; 

const CartScreen = () => {
    const { cartItems, removeFromCart, clearCart, updateCartQty } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    // Total Calculation
    const total = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

    const checkoutHandler = () => {
        if (!user) {
            toast.warn("Please Login to Checkout! 🔒", { theme: "colored" }); // Login නැත්නම් Warning Toast
            navigate('/login');
        } else {
            navigate('/placeorder');
        }
    };

    
    const handleRemove = (id, name) => {
        removeFromCart(id);
        toast.error(`${name} removed from cart 🗑️`, {
            theme: "colored",
            autoClose: 1500,
            hideProgressBar: true,
            style: { backgroundColor: '#e74c3c', color: '#fff' }
        });
    };

    
    const handleQtyUpdate = (id, qty) => {
        updateCartQty(id, qty);
    };

    
    const handleClearCart = () => {
        if (window.confirm("Are you sure you want to clear the cart?")) {
            clearCart();
            toast.info("Cart Cleared! 🧹", { theme: "colored" });
        }
    };

    // --- Empty Cart State ---
    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-[#FFFBF7] flex flex-col justify-center items-center text-center p-4 animate-fade-in-up">
                <div className="w-40 h-40 bg-orange-50 rounded-full flex items-center justify-center mb-6 shadow-sm border border-orange-100">
                    <span className="text-8xl animate-bounce">🛒</span>
                </div>
                <h2 className="text-3xl font-extrabold text-[#3C3F36] mb-2">Your Cart is Empty</h2>
                <p className="text-gray-500 mb-8 max-w-md">
                    Looks like you haven't added any treats for your furry friend yet.
                </p>
                <Link 
                    to="/products" 
                    className="px-8 py-3 bg-[#A0522D] text-white font-bold rounded-full shadow-lg hover:bg-[#8B4513] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
                >
                    Start Shopping 🦴
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FFFBF7] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-extrabold text-[#3C3F36] mb-8 animate-fade-in-up">
                    Shopping Cart <span className="text-[#A0522D]">({cartItems.length} items)</span>
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    
                    {/* --- LEFT SIDE: Cart Items List --- */}
                    <div className="lg:col-span-2 space-y-6 animate-fade-in-up delay-100">
                        {cartItems.map((item, index) => (
                            <div 
                                key={item._id} 
                                className="bg-white rounded-[2rem] p-4 sm:p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-6 hover:shadow-md transition-shadow relative overflow-hidden"
                            >
                                {/* Remove Button (Top Right for Mobile / Absolute) */}
                                <button 
                                    onClick={() => handleRemove(item._id, item.name)} 
                                    className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors sm:hidden"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>

                                {/* Product Image */}
                                <div className="w-full sm:w-32 h-32 flex-shrink-0 bg-gray-50 rounded-2xl overflow-hidden">
                                    <img 
                                        src={item.image} 
                                        alt={item.name} 
                                        className="w-full h-full object-contain p-2" 
                                    />
                                </div>

                                {/* Product Details */}
                                <div className="flex-grow text-center sm:text-left">
                                    <Link to={`/product/${item._id}`} className="block group">
                                        <h3 className="text-lg font-bold text-gray-800 group-hover:text-[#A0522D] transition-colors mb-1">
                                            {item.name}
                                        </h3>
                                    </Link>
                                    <p className="text-[#A0522D] font-bold text-xl">Rs. {item.price.toFixed(2)}</p>
                                </div>

                                {/* Quantity Controls */}
                                <div className="flex items-center gap-3 bg-gray-50 rounded-full px-2 py-1 border border-gray-200">
                                    <button 
                                        onClick={() => handleQtyUpdate(item._id, Math.max(1, item.qty - 1))}
                                        className="w-8 h-8 flex items-center justify-center bg-white rounded-full text-gray-600 shadow-sm hover:text-[#A0522D] font-bold"
                                    >
                                        -
                                    </button>
                                    <span className="w-8 text-center font-bold text-gray-700">{item.qty}</span>
                                    <button 
                                        onClick={() => handleQtyUpdate(item._id, Math.min(item.countInStock, item.qty + 1))}
                                        className="w-8 h-8 flex items-center justify-center bg-white rounded-full text-gray-600 shadow-sm hover:text-[#A0522D] font-bold"
                                    >
                                        +
                                    </button>
                                </div>

                                {/* Remove Button (Desktop) */}
                                <button 
                                    onClick={() => handleRemove(item._id, item.name)} 
                                    className="hidden sm:block p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                                    title="Remove Item"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        ))}

                        <div className="flex justify-end">
                            <button 
                                onClick={handleClearCart} 
                                className="text-sm font-bold text-red-500 hover:text-red-700 hover:underline flex items-center gap-1 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                Clear Cart
                            </button>
                        </div>
                    </div>

                    {/* --- RIGHT SIDE: Order Summary --- */}
                    <div className="lg:col-span-1 animate-fade-in-up delay-200">
                        <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-gray-100 sticky top-28">
                            <h2 className="text-2xl font-extrabold text-[#3C3F36] mb-6">Order Summary</h2>
                            
                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)} items)</span>
                                    <span className="font-bold">Rs. {total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span className="text-green-600 font-bold text-sm">Calculated next step</span>
                                </div>
                                <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                                    <span className="text-lg font-bold text-gray-800">Total</span>
                                    <span className="text-2xl font-extrabold text-[#A0522D]">Rs. {total.toFixed(2)}</span>
                                </div>
                            </div>

                            <button 
                                onClick={checkoutHandler} 
                                className="w-full py-4 rounded-xl bg-[#A0522D] text-white font-bold text-lg shadow-lg hover:bg-[#8B4513] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex justify-center items-center gap-2"
                            >
                                Proceed to Checkout ➡️
                            </button>
                            
                            <div className="mt-6 flex justify-center gap-4 opacity-50 grayscale">
                                <img src="https://img.icons8.com/color/48/000000/visa.png" alt="Visa" className="h-8"/>
                                <img src="https://img.icons8.com/color/48/000000/mastercard.png" alt="Mastercard" className="h-8"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartScreen;