import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify'; // 
import '../App.css';

const ServiceDetailScreen = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    // const [submitStatus, setSubmitStatus] = useState(''); // 👈 මේක තවදුරටත් ඕන නෑ

    const fetchServiceDetails = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`http://localhost:5000/api/services/${id}`);
            setService(data);
            setLoading(false);
        } catch (err) {
            setError('Could not fetch service details.');
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchServiceDetails();
    }, [id]);

    const submitHandler = async (e) => {
        e.preventDefault();
        
        // Validation Check
        if (rating === 0) {
            toast.warn('Please select a star rating! ⭐', {
                theme: "colored"
            });
            return;
        }

        try {
            const token = localStorage.getItem('petCareToken');
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            };

            const reviewData = { rating, comment };
            await axios.post(`http://localhost:5000/api/services/${id}/reviews`, reviewData, config);

            
            toast.success('Review Submitted Successfully! 🎉', {
                theme: "colored",
                style: { backgroundColor: '#A0522D', color: '#fff' }
            });

            setRating(0);
            setComment('');
            fetchServiceDetails(); 
        } catch (error) {
            // 👇 
            toast.error(error.response?.data?.message || 'Failed to submit review.', {
                theme: "colored"
            });
        }
    };

    const averageRating = service?.reviews.length 
        ? (service.reviews.reduce((acc, item) => acc + item.rating, 0) / service.reviews.length).toFixed(1)
        : 0;

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen bg-[#FFFBF7]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A0522D]"></div>
        </div>
    );

    if (error) return <div className="min-h-screen flex justify-center items-center text-red-500 font-bold">{error}</div>;
    if (!service) return <div className="min-h-screen flex justify-center items-center">Service not found.</div>;

    return (
        <div className="min-h-screen bg-[#FFFBF7] font-sans">
            
            {/* --- 1. MODERN CURVED HEADER --- */}
            <div className="relative bg-[#FFF0E5] pb-32 rounded-b-[3rem] overflow-hidden shadow-sm">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/paw-prints.png')]"></div>
                
                <div className="max-w-7xl mx-auto px-4 pt-10 pb-10 relative z-10 text-center">
                    <Link to="/services" className="absolute top-10 left-6 bg-white p-3 rounded-full shadow-md text-[#A0522D] hover:scale-110 transition-transform">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    </Link>

                    <div className="w-20 h-20 mx-auto bg-white rounded-2xl shadow-lg flex items-center justify-center text-4xl mb-4 border-4 border-white transform -rotate-6">
                        {service.type === 'Vet Clinic' ? '🏥' : 
                         service.type === 'Groomer' ? '✂️' : 
                         service.type === 'Pet Shop' ? '🦴' : '🏠'}
                    </div>

                    <h1 className="text-4xl md:text-5xl font-extrabold text-[#3C3F36] mb-2">
                        {service.name}
                    </h1>
                    
                    <div className="flex justify-center items-center gap-2 text-sm font-bold text-[#A0522D]/80 uppercase tracking-widest mb-4">
                        <span>{service.type}</span>
                        <span>•</span>
                        <span>{service.reviews.length} Reviews</span>
                    </div>

                    <div className="inline-flex items-center bg-white px-4 py-1.5 rounded-full shadow-sm border border-gray-100">
                        <span className="text-yellow-400 text-xl mr-2">⭐</span>
                        <span className="font-bold text-gray-800 text-lg">{averageRating}</span>
                        <span className="text-gray-400 text-sm ml-1">/ 5.0</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* --- LEFT COLUMN: INFO & FORM --- */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-white relative overflow-hidden">
                            <div className="space-y-6 relative z-10">
                                <h3 className="text-lg font-bold text-gray-400 uppercase tracking-wider mb-4">Contact Info</h3>
                                
                                <div className="flex gap-4 items-center group cursor-default">
                                    <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">📍</div>
                                    <div>
                                        <p className="text-gray-800 font-bold text-lg leading-tight">{service.address}</p>
                                    </div>
                                </div>

                                <div className="flex gap-4 items-center group cursor-default">
                                    <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">📞</div>
                                    <div>
                                        <p className="text-gray-800 font-bold text-lg">{service.phone}</p>
                                    </div>
                                </div>

                                <hr className="border-gray-100 my-4"/>

                                <a href={`tel:${service.phone}`} className="block w-full py-4 bg-[#3C3F36] hover:bg-[#A0522D] text-white text-center rounded-2xl font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                                    Call Now 📞
                                </a>
                            </div>
                        </div>

                        {/* Review Input Box */}
                        <div className="bg-white rounded-[2rem] p-8 shadow-lg border border-white">
                            <h3 className="text-xl font-bold text-[#3C3F36] mb-2 flex items-center gap-2">
                                Rate this place ✨
                            </h3>
                            
                            {user ? (
                                <form onSubmit={submitHandler} className="space-y-4">
                                    <div className="flex justify-between bg-gray-50 p-2 rounded-2xl">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                className={`text-3xl transition-transform hover:scale-125 ${rating >= star ? 'grayscale-0' : 'grayscale opacity-20'}`}
                                            >
                                                ⭐
                                            </button>
                                        ))}
                                    </div>
                                    
                                    <textarea
                                        rows="3"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        required
                                        className="w-full p-4 rounded-2xl border-2 border-gray-100 focus:border-[#A0522D] focus:bg-white outline-none bg-gray-50 transition-all text-gray-700"
                                        placeholder="Share your experience..."
                                    ></textarea>

                                    <button type="submit" className="w-full py-3 bg-[#A0522D] hover:bg-[#8B4513] text-white font-bold rounded-xl shadow-md transition-all">
                                        Post Review 🚀
                                    </button>
                                </form>
                            ) : (
                                <div className="bg-orange-50 p-6 rounded-2xl text-center">
                                    <p className="text-gray-600 mb-3 text-sm">Have you visited here?</p>
                                    <Link to="/login" className="inline-block px-6 py-2 bg-white text-[#A0522D] font-bold rounded-full shadow-sm hover:shadow-md transition-all text-sm">
                                        Login to Review
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* --- RIGHT COLUMN: REVIEWS LIST --- */}
                    <div className="lg:col-span-8">
                        <div className="flex items-center justify-between mb-6 pl-2">
                            <h2 className="text-2xl font-extrabold text-[#3C3F36]">Community Reviews</h2>
                            <div className="bg-white px-4 py-1 rounded-full text-sm font-bold text-gray-500 shadow-sm border border-gray-100">
                                {service.reviews.length} Comments
                            </div>
                        </div>

                        <div className="space-y-5">
                            {service.reviews.length === 0 ? (
                                <div className="bg-white rounded-[2rem] p-12 text-center opacity-60 border-2 border-dashed border-gray-200">
                                    <div className="text-6xl mb-4 grayscale">💬</div>
                                    <p className="font-bold text-gray-500">No reviews yet. Be the first!</p>
                                </div>
                            ) : (
                                service.reviews.map((review, index) => (
                                    <div 
                                        key={review._id} 
                                        className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-50 hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row gap-5 animate-fade-in-up"
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        <div className="flex-shrink-0">
                                            <div className="w-14 h-14 rounded-2xl bg-[#FFF0E5] flex items-center justify-center text-3xl border-2 border-white shadow-sm">
                                                {['🐶', '🐱', '🐹', '🐰', '🐼', '🦊'][index % 6]}
                                            </div>
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h4 className="font-bold text-gray-800 text-lg">{review.name}</h4>
                                                    <p className="text-xs text-gray-400 font-medium">Verified Pet Parent</p>
                                                </div>
                                                <div className="flex bg-yellow-50 px-3 py-1 rounded-xl text-yellow-500 font-bold text-sm border border-yellow-100">
                                                    {review.rating} ⭐
                                                </div>
                                            </div>
                                            
                                            <p className="text-gray-600 leading-relaxed bg-gray-50/50 p-4 rounded-2xl rounded-tl-none">
                                                "{review.comment}"
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ServiceDetailScreen;