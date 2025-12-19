import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css'; 

const HomeScreen = () => {
    return (
        <div className="min-h-screen bg-[#FFFBF7]">
            
            {/* 1. HERO SECTION */}
            <div className="relative pt-32 pb-10 px-6 overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-200/40 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4 animate-pulse-slow"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-green-200/40 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 animate-pulse-slow delay-700"></div>

                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
                    
                    {/* Text Content */}
                    <div className="text-center md:text-left animate-fade-in-up">
                        <div className="inline-flex items-center gap-2 bg-white border border-orange-100 py-2 px-4 rounded-full shadow-sm mb-6">
                            <span className="animate-bounce">🐾</span> 
                            <span className="text-sm font-bold text-[#A0522D] tracking-wide">#1 Pet Care Platform in Sri Lanka</span>
                        </div>
                        
                        <h1 className="text-5xl md:text-7xl font-extrabold text-[#3C3F36] mb-6 leading-[1.1]">
                            Paws, Love, & <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A0522D] to-[#D2691E]">
                                Happiness
                            </span> 🦴
                        </h1>
                        
                        <p className="text-lg text-gray-500 mb-10 leading-relaxed max-w-lg mx-auto md:mx-0">
                            From premium food to finding a forever home, we are here to make your furry friend's life wag-tastic! Join our family today.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                            <Link to="/products" className="px-8 py-4 bg-[#3C3F36] text-white rounded-full font-bold shadow-lg hover:bg-black hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3">
                                <span>Shop Essentials</span>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                            </Link>
                            <Link to="/adoption" className="px-8 py-4 bg-white text-[#A0522D] border-2 border-[#A0522D]/20 rounded-full font-bold hover:border-[#A0522D] hover:bg-orange-50 transition-all duration-300 flex items-center justify-center gap-3">
                                <span>Adopt a Friend</span>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                            </Link>
                        </div>

                        {/* Stats Row */}
                        <div className="mt-12 flex justify-center md:justify-start gap-8 border-t border-gray-200 pt-8">
                            <div>
                                <h4 className="text-3xl font-extrabold text-[#A0522D]">2k+</h4>
                                <p className="text-xs text-gray-500 font-bold uppercase">Happy Pets</p>
                            </div>
                            <div>
                                <h4 className="text-3xl font-extrabold text-[#A0522D]">500+</h4>
                                <p className="text-xs text-gray-500 font-bold uppercase">Adoptions</p>
                            </div>
                            <div>
                                <h4 className="text-3xl font-extrabold text-[#A0522D]">100%</h4>
                                <p className="text-xs text-gray-500 font-bold uppercase">Safe Products</p>
                            </div>
                        </div>
                    </div>

                    {/* Image Side */}
                    <div className="relative animate-float">
                        <div className="absolute inset-0 bg-[#3C3F36] rounded-[3rem] rotate-3 opacity-10 blur-md transform scale-95"></div>
                        <img 
                            src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                            alt="Cute Dog" 
                            className="relative z-10 rounded-[3rem] shadow-2xl border-[6px] border-white w-full object-cover h-[500px]"
                        />
                        
                        {/* Floating Cards */}
                        <div className="absolute top-10 -left-6 bg-white p-4 rounded-2xl shadow-xl animate-bounce-slow hidden lg:flex items-center gap-3 z-20">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-xl">🥗</div>
                            <div>
                                <p className="text-xs text-gray-400 font-bold uppercase">Diet</p>
                                <p className="text-sm font-bold text-gray-800">100% Organic</p>
                            </div>
                        </div>
                        <div className="absolute bottom-10 -right-6 bg-white p-4 rounded-2xl shadow-xl animate-bounce-slow delay-300 hidden lg:flex items-center gap-3 z-20">
                            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-xl">🏠</div>
                            <div>
                                <p className="text-xs text-gray-400 font-bold uppercase">Care</p>
                                <p className="text-sm font-bold text-gray-800">Loving Homes</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Pet Care Tips Section (Cards with Hover Effects) */}
            <div className="max-w-7xl mx-auto px-4 py-20">
                <div className="text-center mb-16 animate-fade-in-up delay-100">
                    <h2 className="text-4xl font-bold text-[#3C3F36] mb-4">Pet Care Tips 💡</h2>
                    <p className="text-gray-500">Little things that make a big difference</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Tip Card 1 */}
                    <div className="bg-white p-8 rounded-3xl shadow-md border border-gray-50 hover:shadow-2xl hover:-translate-y-2 hover:rotate-1 transition-all duration-300 group cursor-pointer animate-fade-in-up delay-100">
                        <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform">
                            🥗
                        </div>
                        <h3 className="text-2xl font-bold mb-3 text-gray-800 group-hover:text-[#A0522D] transition-colors">Balanced Diet</h3>
                        <p className="text-gray-500 leading-relaxed">Ensure your pet gets a mix of proteins and vitamins. Good food = Good mood!</p>
                    </div>

                    {/* Tip Card 2 */}
                    <div className="bg-white p-8 rounded-3xl shadow-md border border-gray-50 hover:shadow-2xl hover:-translate-y-2 hover:-rotate-1 transition-all duration-300 group cursor-pointer animate-fade-in-up delay-200">
                        <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform">
                            🏃‍♂️
                        </div>
                        <h3 className="text-2xl font-bold mb-3 text-gray-800 group-hover:text-[#6B8E23] transition-colors">Play Time</h3>
                        <p className="text-gray-500 leading-relaxed">Daily walks and games keep your pet fit. A tired pet is a happy pet.</p>
                    </div>

                    {/* Tip Card 3 */}
                    <div className="bg-white p-8 rounded-3xl shadow-md border border-gray-50 hover:shadow-2xl hover:-translate-y-2 hover:rotate-1 transition-all duration-300 group cursor-pointer animate-fade-in-up delay-300">
                        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform">
                            🏥
                        </div>
                        <h3 className="text-2xl font-bold mb-3 text-gray-800 group-hover:text-blue-600 transition-colors">Health Checkups</h3>
                        <p className="text-gray-500 leading-relaxed">Regular vet visits are crucial. Prevention is always better than cure.</p>
                    </div>
                </div>
            </div>

            {/* 3. Why Choose Us (Colorful Section) */}
            <div className="py-20 bg-gradient-to-b from-[#FFFBF7] to-[#FFF0E6] rounded-t-[4rem]">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold text-[#3C3F36] mb-12 animate-fade-in-up">Why Choose PetCareSL?</h2>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { icon: "🚚", title: "Fast Delivery", desc: "Island-wide in 3 days" },
                            { icon: "❤️", title: "Ethical Adoption", desc: "Find your best friend" },
                            { icon: "⭐", title: "Top Quality", desc: "Only the best brands" },
                            { icon: "🤖", title: "Smart Chatbot", desc: "24/7 AI Assistance" }
                        ].map((item, index) => (
                            <div key={index} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105 animate-fade-in-up" style={{animationDelay: `${index * 0.1}s`}}>
                                <div className="text-4xl mb-3">{item.icon}</div>
                                <h4 className="font-bold text-lg mb-1 text-gray-800">{item.title}</h4>
                                <p className="text-xs text-gray-500">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeScreen;