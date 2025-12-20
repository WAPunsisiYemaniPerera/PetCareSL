import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify'; 
import '../App.css'; 

const AdminProductListScreen = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    // const [error, setError] = useState(''); 
    
    const [searchTerm, setSearchTerm] = useState('');

    const { user } = useAuth();
    const navigate = useNavigate();

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('https://yemani-petcare-backend.hf.space/api/products');
            setProducts(data);
            setLoading(false);
        } catch (err) {
           
            setLoading(false);
            toast.error("Failed to load product inventory. 📦", { theme: "colored" });
        }
    };

    useEffect(() => {
        if (!user || !user.isAdmin) {
            navigate('/login');
        } else {
            fetchProducts();
        }
    }, [user, navigate]);

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const token = localStorage.getItem('petCareToken');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                await axios.delete(`https://yemani-petcare-backend.hf.space/api/products/${id}`, config);
                
                
                toast.success('Product Deleted Successfully! 🗑️', { 
                    theme: "colored",
                    style: { backgroundColor: '#e74c3c', color: '#fff' }
                });
                
                fetchProducts(); 
            } catch (err) {
                
                toast.error('Failed to delete product.', { theme: "colored" });
            }
        }
    };

    const createProductHandler = async () => {
        try {
            const token = localStorage.getItem('petCareToken');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const {data} = await axios.post('https://yemani-petcare-backend.hf.space/api/products', {}, config);
            
            toast.info("Creating new product... 📦", { theme: "colored" });
            navigate(`/admin/product/${data._id}/edit`);
        } catch (error) {
        
            toast.error('Failed to create new product.', { theme: "colored" });
        }
    };

    // 2. Search Logic
    const filteredProducts = products.filter(product => 
        (product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.brand && product.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product._id && product._id.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) return (
        <div className="md:ml-64 min-h-screen flex justify-center items-center bg-[#FFFBF7]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A0522D]"></div>
        </div>
    );

    return (
        <div className="md:ml-64 min-h-screen bg-[#FFFBF7] p-8">
            
            {/* Header Section with Search */}
            <div className="flex flex-col xl:flex-row justify-between items-center mb-8 gap-6 animate-fade-in-up">
                <div>
                    <h1 className="text-3xl font-extrabold text-[#3C3F36]">Product Inventory</h1>
                    <p className="text-gray-500 mt-1">Manage store products and stock.</p>
                </div>

                <div className="flex flex-col md:flex-row gap-4 w-full xl:w-auto">
                    {/* Search Bar */}
                    <div className="relative w-full md:w-80">
                        <span className="absolute left-4 top-3.5 text-gray-400">🔍</span>
                        <input 
                            type="text"
                            placeholder="Search by name, brand, or category..."
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#A0522D] focus:ring-1 focus:ring-[#A0522D] outline-none shadow-sm transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <button 
                        onClick={createProductHandler} 
                        className="flex items-center justify-center gap-2 bg-[#A0522D] text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-[#8B4513] hover:-translate-y-1 transition-all duration-300 min-w-max"
                    >
                        <span className="text-xl">+</span> Create Product
                    </button>
                </div>
            </div>

            {products.length === 0 && !loading ? (
                <div className="bg-white rounded-[2rem] p-12 text-center shadow-sm border border-gray-100 animate-fade-in-up">
                    <div className="text-5xl mb-4">📦</div>
                    <p className="text-gray-500 text-lg">No products found in inventory.</p>
                </div>
            ) : (
                <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden animate-fade-in-up delay-100">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Product</th>
                                    <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Price</th>
                                    <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Category</th>
                                    <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Brand</th>
                                    <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Stock</th>
                                    <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredProducts.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="p-8 text-center text-gray-500">
                                            No products found matching <span className="font-bold">"{searchTerm}"</span>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredProducts.map(product => (
                                        <tr key={product._id} className="hover:bg-[#FFFBF7] transition-colors">
                                            <td className="p-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                                                        <img 
                                                            src={product.image} 
                                                            alt={product.name} 
                                                            className="w-full h-full object-contain p-1" 
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-800 line-clamp-1">{product.name}</p>
                                                        <p className="text-xs text-gray-400 font-mono">ID: {product._id.substring(0, 6)}...</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-5 font-bold text-[#A0522D]">
                                                Rs. {product.price.toFixed(2)}
                                            </td>
                                            <td className="p-5 text-sm text-gray-600">
                                                {product.category}
                                            </td>
                                            <td className="p-5 text-sm text-gray-600">
                                                {product.brand}
                                            </td>
                                            <td className="p-5">
                                                {product.countInStock === 0 ? (
                                                    <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold border border-red-200">
                                                        Out of Stock (0)
                                                    </span>
                                                ) : product.countInStock < 5 ? (
                                                    <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-bold border border-orange-200">
                                                        Low Stock ({product.countInStock})
                                                    </span>
                                                ) : (
                                                    <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs font-bold border border-green-200">
                                                        In Stock ({product.countInStock})
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-5 text-right">
                                                <div className="flex justify-end gap-3">
                                                    <Link 
                                                        to={`/admin/product/${product._id}/edit`} 
                                                        className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-[#A0522D] hover:text-white transition-colors"
                                                        title="Edit"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 00 2 2h11a2 2 0 00 2-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                                    </Link>
                                                    <button 
                                                        onClick={() => deleteHandler(product._id)} 
                                                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                                        title="Delete"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProductListScreen;