import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../App.css'; 

const AdminProductEditScreen = () => {
    const { id: productId } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const { data } = await axios.get(`https://yemani-petcare-backend.hf.space/api/products/${productId}`);
                setName(data.name);
                setPrice(data.price);
                setImage(data.image);
                setBrand(data.brand);
                setCategory(data.category);
                setCountInStock(data.countInStock);
                setDescription(data.description);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching product details:', error);
                setLoading(false);
                toast.error("Failed to load product details. 📦", { theme: "colored" });
            }
        };
        fetchProductDetails();
    }, [productId]);

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);

        try {
            const config = { headers: { 'Content-Type': 'multipart/form-data' } }
            const { data } = await axios.post('https://yemani-petcare-backend.hf.space/api/upload', formData, config);
            setImage(data);
            setUploading(false);
            
            toast.success("Image Uploaded! 📸", { theme: "colored" });
        } catch (error) {
            console.error(error);
            setUploading(false);
            
            toast.error('Image upload failed!', { theme: "colored" });
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('petCareToken');
            const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } };
            
            const productData = { name, price, image, brand, category, countInStock, description };

            await axios.put(`https://yemani-petcare-backend.hf.space/api/products/${productId}`, productData, config);
            
            
            toast.success('Product Updated Successfully! ✅', { 
                theme: "colored",
                style: { backgroundColor: '#27ae60', color: '#fff' }
            });
            
            navigate('/admin/productlist');
        } catch (error) {
            console.error('Failed to update product', error);
            
            toast.error('Failed to update product. ❌', { theme: "colored" });
        }
    };

    if (loading) return (
        <div className="md:ml-64 min-h-screen flex justify-center items-center bg-[#FFFBF7]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A0522D]"></div>
        </div>
    );

    return (
        <div className="md:ml-64 min-h-screen bg-[#FFFBF7] p-8">
            
            {/* Header */}
            <div className="max-w-5xl mx-auto mb-8 animate-fade-in-up">
                <Link to="/admin/productlist" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-[#A0522D] mb-4 transition-colors">
                    &larr; Back to Product List
                </Link>
                <h1 className="text-3xl font-extrabold text-[#3C3F36]">Edit Product 📦</h1>
                <p className="text-gray-500">Update product details, pricing, and inventory.</p>
            </div>

            <div className="max-w-5xl mx-auto bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-8 md:p-12 animate-fade-in-up delay-100">
                <form onSubmit={submitHandler} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    
                    {/* --- LEFT COLUMN: Image Upload --- */}
                    <div className="lg:col-span-1 space-y-6">
                        <label className="block text-sm font-bold text-gray-700">Product Image</label>
                        
                        <div className="relative group">
                            <div className="w-full h-80 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden relative">
                                {image ? (
                                    <img src={image} alt="Preview" className="w-full h-full object-contain p-4" />
                                ) : (
                                    <div className="text-center text-gray-400">
                                        <span className="text-4xl block mb-2">🖼️</span>
                                        <span className="text-sm font-medium">No image</span>
                                    </div>
                                )}
                                
                                {uploading && (
                                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A0522D]"></div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase">Image URL</label>
                                <input 
                                    type="text" 
                                    className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:border-[#A0522D] outline-none"
                                    value={image} 
                                    onChange={(e) => setImage(e.target.value)} 
                                    placeholder="https://example.com/product.jpg"
                                />
                            </div>
                            <div className="text-center text-gray-400 text-xs font-bold">- OR -</div>
                            <div>
                                <label className="block w-full cursor-pointer bg-[#A0522D] text-white text-center py-3 rounded-xl font-bold hover:bg-[#8B4513] transition-colors shadow-md">
                                    Upload New Image 📤
                                    <input type="file" className="hidden" onChange={uploadFileHandler} />
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* --- RIGHT COLUMN: Form Fields --- */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Product Name</label>
                                <input type="text" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#A0522D] outline-none font-medium" value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Price (Rs.)</label>
                                <input type="number" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#A0522D] outline-none font-bold text-[#A0522D]" value={price} onChange={(e) => setPrice(e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Count In Stock</label>
                                <input type="number" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#A0522D] outline-none" value={countInStock} onChange={(e) => setCountInStock(e.target.value)} />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Brand</label>
                                <input type="text" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#A0522D] outline-none" value={brand} onChange={(e) => setBrand(e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                                <input type="text" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#A0522D] outline-none" value={category} onChange={(e) => setCategory(e.target.value)} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                            <textarea rows="6" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#A0522D] outline-none resize-none" value={description} onChange={(e) => setDescription(e.target.value)} />
                        </div>

                        <div className="pt-4">
                            <button type="submit" className="w-full py-4 bg-[#3C3F36] text-white font-bold rounded-xl shadow-lg hover:bg-black hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                Update Product 💾
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminProductEditScreen;