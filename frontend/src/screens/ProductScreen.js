import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import {toast} from 'react-toastify';
import '../App.css';

const ProductScreen = () => {
    const { id: productId } = useParams(); 
    const navigate = useNavigate();
    const { addToCart } = useCart();
    
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [qty, setQty] = useState(1);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`https://yemani-petcare-backend.hf.space/api/products/${productId}`);
                setProduct(data);
                setLoading(false);
            } catch (err) {
                setError('Could not load product details.');
                setLoading(false);
            }
        };
        fetchProduct();
    }, [productId]);

    const addToCartHandler = () => {
        addToCart(product, qty);

        toast.success(`${product.name} Added to cart! 🛒`, {
            theme: "colored",
            style: { backgroundColor: '#A0522D', color: '#fff' },
            autoClose: 2000
        })

        navigate('/cart');
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A0522D]"></div>
        </div>
    );

    if (error) return (
        <div className="text-center py-20 text-red-600 font-bold text-xl">{error}</div>
    );

    if (!product) return <div className="text-center py-20">Product not found.</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Back Button */}
            <Link to="/products" className="group inline-flex items-center px-6 py-3 bg-white border border-gray-200 rounded-full shadow-sm text-gray-700 hover:bg-[#fffbf7] hover:border-[#A0522D] hover:text-[#A0522D] transition-all duration-300 mb-8">
                <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="font-semibold">Back to Marketplace</span>
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                
                {/* 1. Product Image Section */}
                <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100">
                    <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-96 object-contain rounded-2xl hover:scale-105 transition-transform duration-500" 
                    />
                </div>

                {/* 2. Product Details Section */}
                <div className="space-y-6">
                    <div>
                        <p className="text-sm text-[#A0522D] font-bold tracking-wide uppercase">{product.brand}</p>
                        <h1 className="text-4xl font-extrabold text-[#3C3F36] mt-2 leading-tight">{product.name}</h1>
                        <p className="text-sm text-gray-400 mt-2">Category: {product.category}</p>
                    </div>

                    <div className="text-3xl font-bold text-[#6B8E23]">
                        Rs. {product.price.toFixed(2)}
                    </div>

                    <div className="prose prose-sm text-gray-600 leading-relaxed">
                        <p>{product.description}</p>
                    </div>

                    <hr className="border-gray-200" />

                    {/* Stock Status & Quantity */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-700">Status:</span>
                            <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                                product.countInStock > 0 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                                {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                            </span>
                        </div>

                        {product.countInStock > 0 && (
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-700">Quantity:</span>
                                <div className="flex items-center border border-gray-300 rounded-lg">
                                    <button 
                                        onClick={() => setQty(Math.max(1, qty - 1))}
                                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-l-lg transition"
                                    >
                                        -
                                    </button>
                                    <span className="px-4 py-2 font-bold text-gray-800 border-l border-r border-gray-300 bg-gray-50">
                                        {qty}
                                    </span>
                                    <button 
                                        onClick={() => setQty(Math.min(product.countInStock, qty + 1))}
                                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-r-lg transition"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        )}

                        <button 
                            onClick={addToCartHandler}
                            disabled={product.countInStock === 0}
                            className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transform transition hover:-translate-y-1 ${
                                product.countInStock === 0
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-[#A0522D] text-white hover:bg-[#8B4513] hover:shadow-xl'
                            }`}
                        >
                            {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart 🛒'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductScreen;