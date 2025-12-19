import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cartItems } = useCart();
    const navigate = useNavigate();
    
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false); 

    const handleLogout = () => {
        logout();
        setIsProfileOpen(false);
        setIsMobileMenuOpen(false);
        navigate('/login');
    };

    const getLinkClass = ({ isActive }) => 
        isActive 
        ? "text-[#A0522D] font-bold border-b-2 border-[#A0522D] pb-1 transition-all duration-300" 
        : "text-gray-600 hover:text-[#A0522D] font-medium pb-1 border-b-2 border-transparent hover:border-[#A0522D]/50 transition-all duration-300";

    return (
        <nav className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center cursor-pointer group" onClick={() => navigate('/')}>
                        <span className="text-3xl font-extrabold text-[#A0522D] tracking-tight group-hover:scale-105 transition-transform duration-300">
                            PetCareSL <span className="text-2xl animate-bounce inline-block">🐾</span>
                        </span>
                    </div>

                    {/* Desktop Links */}
                    <div className="hidden md:flex space-x-8 items-center">
                        <NavLink to="/" className={getLinkClass}>Home</NavLink>
                        <NavLink to="/products" className={getLinkClass}>Products</NavLink>
                        <NavLink to="/services" className={getLinkClass}>Services</NavLink>
                        <NavLink to="/adoption" className={getLinkClass}>Adoption</NavLink>
                        <NavLink to="/chat" className={getLinkClass}>Chat Support</NavLink>
                    </div>

                    {/* Right Side */}
                    <div className="hidden md:flex items-center gap-6">
                        {/* Cart */}
                        <NavLink to="/cart" className="relative group">
                            <div className="p-2 text-gray-600 group-hover:text-[#A0522D] transition-colors duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            {cartItems.length > 0 && (
                                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white transform translate-x-1 -translate-y-1 shadow-sm">
                                    {cartItems.length}
                                </span>
                            )}
                        </NavLink>

                        {/* User Profile Dropdown */}
                        {user ? (
                            <div className="relative">
                                <button 
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center gap-2 pl-4 border-l border-gray-200 focus:outline-none"
                                >
                                    <div className="text-right hidden lg:block">
                                        <span className="block text-xs text-gray-500 font-semibold uppercase tracking-wider">Hello,</span>
                                        <span className="block text-sm font-bold text-[#A0522D]">{user.name}</span>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-[#A0522D] text-white flex items-center justify-center font-bold text-lg border-2 border-orange-100">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                </button>

                                {/* Dropdown Menu */}
                                {isProfileOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 animate-fade-in-up">
                                        {user.isAdmin && (
                                            <Link to="/admin/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#A0522D]" onClick={() => setIsProfileOpen(false)}>
                                                🛠️ Admin Dashboard
                                            </Link>
                                        )}
                                        <Link to="/mypets" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#A0522D]" onClick={() => setIsProfileOpen(false)}>
                                            🐾 My Pets
                                        </Link>
                                        <Link to="/my-adoption-requests" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#A0522D]" onClick={() => setIsProfileOpen(false)}>
                                            📄 Adoption Requests
                                        </Link>
                                        <div className="border-t border-gray-100 my-1"></div>
                                        <button 
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-bold"
                                        >
                                            🚪 Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link 
                                to="/login" 
                                className="bg-[#A0522D] text-white px-6 py-2.5 rounded-full font-semibold shadow-md hover:bg-[#8B4513] transition-all duration-300"
                            >
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-4">
                        <NavLink to="/cart" className="relative text-gray-600">
                           {/* Mobile Cart Icon Code same as before */}
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                           {cartItems.length > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">{cartItems.length}</span>}
                        </NavLink>
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-600">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Expanded */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 px-4 pt-2 pb-6 shadow-xl absolute w-full top-20 left-0 z-40">
                    <div className="flex flex-col space-y-4 mt-4">
                        <NavLink to="/" className="text-gray-600 hover:text-[#A0522D]" onClick={() => setIsMobileMenuOpen(false)}>Home</NavLink>
                        <NavLink to="/products" className="text-gray-600 hover:text-[#A0522D]" onClick={() => setIsMobileMenuOpen(false)}>Products</NavLink>
                        <NavLink to="/services" className="text-gray-600 hover:text-[#A0522D]" onClick={() => setIsMobileMenuOpen(false)}>Services</NavLink>
                        <NavLink to="/adoption" className="text-gray-600 hover:text-[#A0522D]" onClick={() => setIsMobileMenuOpen(false)}>Adoption</NavLink>
                        
                        <div className="border-t border-gray-100 pt-4 mt-2">
                            {user ? (
                                <div className="flex flex-col gap-3">
                                    <span className="text-gray-500 font-medium">Hi, {user.name}</span>
                                    <Link to="/mypets" className="text-gray-700 hover:text-[#A0522D]" onClick={() => setIsMobileMenuOpen(false)}>🐾 My Pets</Link>
                                    <Link to="/my-adoption-requests" className="text-gray-700 hover:text-[#A0522D]" onClick={() => setIsMobileMenuOpen(false)}>📄 Requests</Link>
                                    <button onClick={handleLogout} className="text-red-500 font-bold text-left">Logout</button>
                                </div>
                            ) : (
                                <Link to="/login" className="block w-full bg-[#A0522D] text-white text-center py-3 rounded-lg font-bold">Login</Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;