import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link , useNavigate} from 'react-router-dom';
import { useCart } from '../context/CartContext';
import {toast} from 'react-toastify';
import '../App.css'; 

const ProductsScreen = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    
    const { addToCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await axios.get('https://yemani-petcare-backend.hf.space/api/products');
                setProducts(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching products", error);
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleAddToCart = (product)=>{
        addToCart(product, 1);

        const CustomToast = ({ closeToast }) => (
            <div className="p-1">
                <p className="font-bold text-gray-800 text-sm mb-3">
                    <span className="text-[#A0522D]">{product.name}</span> added! 🦴
                </p>
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            navigate('/cart');
                            closeToast();
                        }}
                        className="bg-[#A0522D] text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-[#8B4513] transition-colors flex-1 shadow-sm"
                    >
                        View Cart (OK)
                    </button>

                    <button
                        onClick={closeToast}
                        className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-gray-200 transition-colors flex-1"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        );

        
        toast(<CustomToast />, {
            position: "top-right",
            autoClose: 5000, 
            hideProgressBar: false,
            closeOnClick: false, 
            pauseOnHover: true,
            draggable: true,
            style: { borderLeft: '5px solid #A0522D' } 
        });
    }

    // 2. Filter Logic
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#FFFBF7] py-12 px-4 sm:px-6 lg:px-8">
            
            <div className="max-w-7xl mx-auto text-center mb-12 animate-fade-in-up">
                <span className="inline-block py-1 px-3 rounded-full bg-orange-100 text-[#A0522D] text-sm font-bold tracking-wide mb-3">
                    🛍️ Shop for your Best Friend
                </span>
                <h1 className="text-4xl md:text-5xl font-extrabold text-[#3C3F36] mb-4">
                    Pet Marketplace <span className="text-[#A0522D]">Bone-anza</span> 🦴
                </h1>
                
                
                <div className="mt-8 max-w-lg mx-auto relative group">
                    <input 
                        type="text" 
                        placeholder="Search for toys, food, brands..." 
                        className="w-full py-3 px-6 rounded-full border-2 border-orange-100 focus:border-[#A0522D] focus:outline-none shadow-sm transition-colors text-gray-600"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)} 
                    />
                    <button className="absolute right-2 top-1.5 bg-[#A0522D] text-white p-2 rounded-full hover:bg-[#8B4513] transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </button>
                </div>
            </div>
            
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A0522D]"></div>
                </div>
            ) : (
                <>
                    
                    {filteredProducts.length === 0 ? (
                        <div className="text-center py-20 animate-fade-in-up">
                            <div className="text-6xl mb-4">🐶❓</div>
                            <h3 className="text-2xl font-bold text-gray-600">No products found for "{searchTerm}"</h3>
                            <p className="text-gray-400">Try searching for something else!</p>
                        </div>
                    ) : (
                        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                            
                            {filteredProducts.map((product, index) => (
                                <div 
                                    key={product._id} 
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                    className={`group bg-white rounded-[2rem] p-4 border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col animate-fade-in-up ${product.countInStock === 0 ? 'opacity-75 grayscale' : ''}`}
                                >
                                    <div className="relative overflow-hidden rounded-[1.5rem] bg-gray-50 h-56 mb-4">
                                        <Link to={`/product/${product._id}`}>
                                            <img 
                                                src={product.image} 
                                                alt={product.name} 
                                                className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500 ease-in-out" 
                                            />
                                        </Link>
                                        {product.countInStock === 0 && (
                                            <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                                                <span className="bg-gray-800 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Sold Out</span>
                                            </div>
                                        )}
                                        {product.countInStock > 0 && (
                                            <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-600 text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm">
                                                {product.category || 'Item'}
                                            </span>
                                        )}
                                    </div>
                                    
                                    <div className="flex-grow px-2">
                                        <p className="text-xs text-[#A0522D] font-bold uppercase tracking-wider mb-1">{product.brand}</p>
                                        <Link to={`/product/${product._id}`}>
                                            <h3 className="text-lg font-bold text-gray-800 hover:text-[#A0522D] transition-colors line-clamp-2 leading-tight min-h-[3rem]">
                                                {product.name}
                                            </h3>
                                        </Link>
                                        
                                        <div className="flex justify-between items-center mt-3">
                                            <p className="text-[#6B8E23] font-extrabold text-xl">
                                                Rs. {product.price.toFixed(2)}
                                            </p>
                                            <div className="flex text-yellow-400 text-xs">
                                                {'⭐'.repeat(4)}
                                            </div>
                                        </div>
                                    </div>

                                    <button 
                                        className={`w-full py-3 rounded-xl mt-4 font-bold text-sm shadow-md transform transition-all duration-300 flex justify-center items-center gap-2 ${
                                            product.countInStock === 0 
                                            ? 'bg-gray-200 cursor-not-allowed text-gray-400 shadow-none' 
                                            : 'bg-[#A0522D] hover:bg-[#8B4513] text-white hover:shadow-lg hover:-translate-y-1'
                                        }`}
                                        onClick={() => handleAddToCart(product)} 
                                        disabled={product.countInStock === 0}
                                    >
                                        {product.countInStock === 0 ? 'Out of Stock' : <>Add to Cart <span className="group-hover:animate-bounce">🛒</span></>}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ProductsScreen;