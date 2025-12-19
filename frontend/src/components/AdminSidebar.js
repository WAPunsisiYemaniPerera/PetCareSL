import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Auth Context

const AdminSidebar = () => {
    const { logout } = useAuth(); // Logout function
    const navigate = useNavigate();

    // Logout Function
    const handleLogout = () => {
        if(window.confirm("Are you sure you want to logout?")) {
            logout();
            navigate('/admin/login'); 
        }
    };

    const getLinkClasses = ({ isActive }) => {
        return `flex items-center gap-3 px-6 py-4 text-sm font-bold transition-all duration-200 border-l-4 ${
            isActive 
            ? 'bg-orange-50 text-[#A0522D] border-[#A0522D]' 
            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700 border-transparent'
        }`;
    };

    return (
        <aside className="w-64 bg-white border-r border-gray-100 h-screen fixed left-0 top-0 overflow-y-auto z-40 hidden md:block shadow-sm flex flex-col justify-between">
            
            {/* Top Section: Logo & Nav */}
            <div>
                {/* Logo Area */}
                <div className="h-20 flex items-center px-8 border-b border-gray-100">
                    <span className="text-2xl font-extrabold text-[#A0522D] tracking-tight">
                        Admin <span className="text-gray-800">Panel</span> ⚙️
                    </span>
                </div>

                {/* Navigation Links */}
                <nav className="mt-6 flex flex-col gap-1">
                    <NavLink to="/admin/dashboard" className={getLinkClasses}>
                        <span>📊</span> Dashboard
                    </NavLink>
                    
                    <p className="px-6 mt-6 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Management</p>
                    
                    <NavLink to="/admin/userlist" className={getLinkClasses}>
                        <span>👥</span> Users
                    </NavLink>
                    <NavLink to="/admin/productlist" className={getLinkClasses}>
                        <span>📦</span> Products
                    </NavLink>
                    <NavLink to="/admin/servicelist" className={getLinkClasses}>
                        <span>🛠️</span> Services
                    </NavLink>
                    <NavLink to="/admin/petlist" className={getLinkClasses}>
                        <span>🐾</span> Pets
                    </NavLink>
                    
                    <p className="px-6 mt-6 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Requests & Orders</p>
                    
                    <NavLink to="/admin/adoption-requests" className={getLinkClasses}>
                        <span>🏠</span> Adoption Req.
                    </NavLink>
                    <NavLink to="/admin/orderlist" className={getLinkClasses}>
                        <span>🛒</span> Orders
                    </NavLink>
                </nav>
            </div>

            {/* Bottom Section: User Info & Logout */}
            <div className="p-6 border-t border-gray-100 bg-gray-50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#3C3F36] text-white flex items-center justify-center font-bold text-sm shadow-md">
                            A
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-800">Admin</p>
                            <div className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                <p className="text-[10px] text-gray-500 font-bold uppercase">Online</p>
                            </div>
                        </div>
                    </div>

                    
                    <button 
                        onClick={handleLogout}
                        className="p-2 bg-white text-gray-400 rounded-lg hover:bg-red-50 hover:text-red-500 transition-all shadow-sm border border-gray-200"
                        title="Logout"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </button>
                </div>
            </div>

        </aside>
    );
};

export default AdminSidebar;