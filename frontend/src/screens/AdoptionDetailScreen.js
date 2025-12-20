import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify'; // 👈 1. Import Toast
import '../App.css'; 

const AdoptionDetailScreen = () => {
    const { id } = useParams();
    const { user } = useAuth();

    const [showForm, setShowForm] = useState(false);
    const [contactNumber, setContactNumber] = useState('');
    const [message, setMessage] = useState('');
    // const [submitStatus, setSubmitStatus] = useState(''); 

    const [pet, setPet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPetDetails = async () => {
            try {
                const { data } = await axios.get(`https://yemani-petcare-backend.hf.space/api/pets/adoption/${id}`);
                setPet(data);
                setLoading(false);
            } catch (err) {
                setError('Could not load pet details.');
                setLoading(false);
            }
        };
        fetchPetDetails();
    }, [id]);

    const submitRequest = async (e) => {
        e.preventDefault();
        
        if (!user) {
            toast.warn("Please Login first! 🔒", { theme: "colored" });
            return;
        }

        try {
            const token = localStorage.getItem('petCareToken');
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            await axios.post('https://yemani-petcare-backend.hf.space/api/adoption', {
                petId: id,
                contactNumber,
                message
            }, config);

            
            toast.success(`Request Sent for ${pet.name}! 🐾 Admin will contact you.`, {
                theme: "colored",
                style: { backgroundColor: '#A0522D', color: '#fff' }
            });

            setShowForm(false);
            setContactNumber('');
            setMessage('');
            
        } catch (error) {
            
            toast.error('Failed to send the request. Please try again. 😿', {
                theme: "colored"
            });
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen bg-[#FFFBF7]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A0522D]"></div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex justify-center items-center bg-[#FFFBF7] text-red-500 font-bold">
            {error}
        </div>
    );

    if (!pet) return <div className="text-center py-20">Pet not found.</div>;

    return (
        <div className="min-h-screen bg-[#FFFBF7] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                
                {/* Back Button */}
                <Link to="/adoption" className="group inline-flex items-center px-5 py-2.5 bg-white border border-gray-200 rounded-full shadow-sm text-gray-600 hover:bg-[#A0522D] hover:text-white transition-all duration-300 mb-8 font-medium">
                    <svg className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Back to Adoption
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    
                    {/* --- Left Column: Pet Image --- */}
                    <div className="relative animate-fade-in-up">
                        <div className="absolute top-10 left-10 w-full h-full bg-[#A0522D]/5 rounded-[3rem] transform rotate-3 -z-10"></div>
                        
                        <div className="bg-white p-4 rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
                            <img 
                                src={pet.image || '/images/sample.jpg'} 
                                alt={pet.name} 
                                className="w-full h-[500px] object-cover rounded-[2rem] hover:scale-105 transition-transform duration-700" 
                            />
                        </div>

                        <div className="absolute -bottom-6 right-8 bg-white px-6 py-4 rounded-2xl shadow-lg border-2 border-orange-100 hidden md:block animate-bounce">
                            <p className="text-sm font-bold text-gray-400 uppercase">Status</p>
                            <p className="text-xl font-bold text-[#A0522D]">Ready for Love ❤️</p>
                        </div>
                    </div>

                    {/* --- Right Column: Pet Details & Form --- */}
                    <div className="space-y-8 animate-fade-in-up delay-100">
                        <div>
                            <div className="flex items-center space-x-3 mb-2">
                                <span className="bg-orange-100 text-[#A0522D] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                    {pet.petType || 'Pet'}
                                </span>
                                {pet.breed && (
                                    <span className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                        {pet.breed}
                                    </span>
                                )}
                            </div>
                            <h1 className="text-5xl font-extrabold text-[#3C3F36] mb-4">
                                Hi, I'm {pet.name} 👋
                            </h1>
                        </div>

                        {/* Info Grid */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-white p-4 rounded-2xl border border-gray-100 text-center shadow-sm">
                                <div className="text-2xl mb-1">🎂</div>
                                <p className="text-xs text-gray-400 font-bold uppercase">Age</p>
                                <p className="font-bold text-gray-700">{pet.age} Years</p>
                            </div>
                            <div className="bg-white p-4 rounded-2xl border border-gray-100 text-center shadow-sm">
                                <div className="text-2xl mb-1">🏥</div>
                                <p className="text-xs text-gray-400 font-bold uppercase">Vaccinated</p>
                                <p className="font-bold text-gray-700">Yes</p>
                            </div>
                            <div className="bg-white p-4 rounded-2xl border border-gray-100 text-center shadow-sm">
                                <div className="text-2xl mb-1">⚡</div>
                                <p className="text-xs text-gray-400 font-bold uppercase">Energy</p>
                                <p className="font-bold text-gray-700">Playful</p>
                            </div>
                        </div>

                        {/* Story Section */}
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative">
                            <span className="absolute top-4 left-4 text-4xl text-gray-200">“</span>
                            <p className="text-gray-600 leading-relaxed italic relative z-10 px-2">
                                {pet.story || "I am waiting for a loving family to take me home. I promise to be a good boy/girl!"}
                            </p>
                            <span className="absolute bottom-4 right-4 text-4xl text-gray-200">”</span>
                        </div>

                        {/* --- Adoption Form / Button --- */}
                        <div className="pt-4">
                            {!showForm ? (
                                <button 
                                    onClick={() => setShowForm(true)} 
                                    className="w-full py-5 rounded-2xl bg-[#A0522D] text-white text-xl font-bold shadow-lg hover:bg-[#8B4513] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3"
                                >
                                    <svg className="w-8 h-8 animate-pulse" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                                    Adopt {pet.name}
                                </button>
                            ) : (
                                <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-gray-100 animate-fade-in-up">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-2xl font-bold text-[#3C3F36]">Adoption Request 📝</h3>
                                        <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                        </button>
                                    </div>
                                    
                                    <form onSubmit={submitRequest} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Contact Number</label>
                                            <input 
                                                type="text" 
                                                required 
                                                value={contactNumber} 
                                                onChange={(e) => setContactNumber(e.target.value)} 
                                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#A0522D] focus:ring-1 focus:ring-[#A0522D] outline-none transition-all"
                                                placeholder="e.g., 077 123 4567"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Why do you want to adopt {pet.name}?</label>
                                            <textarea 
                                                rows="3" 
                                                required
                                                value={message} 
                                                onChange={(e) => setMessage(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#A0522D] focus:ring-1 focus:ring-[#A0522D] outline-none transition-all"
                                                placeholder="Tell us a bit about your home and experience..."
                                            ></textarea>
                                        </div>
                                        
                                        <div className="flex gap-4 pt-2">
                                            <button 
                                                type="button" 
                                                onClick={() => setShowForm(false)} 
                                                className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-600 font-bold hover:bg-gray-50 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button 
                                                type="submit" 
                                                className="flex-1 py-3 rounded-xl bg-[#A0522D] text-white font-bold hover:bg-[#8B4513] transition-colors shadow-md"
                                            >
                                                Send Request 🚀
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdoptionDetailScreen;