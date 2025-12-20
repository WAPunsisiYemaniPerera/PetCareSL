import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../App.css'; // Animations import

const AdoptionScreen = () => {
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAdoptionPets = async () => {
            try {
                const { data } = await axios.get('https://yemani-petcare-backend.hf.space/api/pets/adoption');
                setPets(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching adoption pets:', error);
                setLoading(false);
            }
        }
        fetchAdoptionPets();
    }, []);

    return (
        <div className="min-h-screen bg-[#FFFBF7] py-12 px-4 sm:px-6 lg:px-8">
            
            {/* 1. Header Section */}
            <div className="max-w-7xl mx-auto text-center mb-16 animate-fade-in-up">
                <span className="inline-block py-1 px-3 rounded-full bg-red-100 text-red-600 text-sm font-bold tracking-wide mb-3">
                    ❤️ Adopt, Don't Shop
                </span>
                <h1 className="text-4xl md:text-6xl font-extrabold text-[#3C3F36] mb-6">
                    Find a Loving <span className="text-[#A0522D]">Friend</span> 🐾
                </h1>
                <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
                    These adorable souls are looking for a forever home. They promise to bring joy, loyalty, and endless cuddles to your life.
                </p>
            </div>

            {/* 2. Content Section */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A0522D]"></div>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto">
                    {pets.length === 0 ? (
                        <div className="text-center py-20 text-gray-400 animate-fade-in-up">
                            <div className="text-6xl mb-4">🏠</div>
                            <p className="text-xl font-medium">No pets available for adoption right now.</p>
                            <p className="text-sm">Check back later!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {pets.map((pet, index) => (
                                <Link 
                                    to={`/adoption/${pet._id}`} 
                                    key={pet._id} 
                                    className="group block"
                                    style={{ animationDelay: `${index * 0.1}s` }} // Staggered Animation
                                >
                                    <div className="bg-white rounded-[2rem] p-4 shadow-sm border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 animate-fade-in-up h-full flex flex-col">
                                        
                                        {/* Image Container */}
                                        <div className="relative h-72 overflow-hidden rounded-[1.5rem] mb-5 bg-gray-100">
                                            <img 
                                                src={pet.image || '/images/sample.jpg'} 
                                                alt={pet.name} 
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                            />
                                            
                                            {/* Type Badge (Dog/Cat) */}
                                            <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-[#A0522D] text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                                                {pet.petType === 'Dog' ? '🐶 Dog' : pet.petType === 'Cat' ? '🐱 Cat' : '🐾 Pet'}
                                            </span>

                                            {/* Age Badge */}
                                            <span className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/20">
                                                {pet.age} Years Old
                                            </span>
                                        </div>

                                        {/* Pet Details */}
                                        <div className="px-2 flex-grow flex flex-col">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-2xl font-bold text-gray-800 group-hover:text-[#A0522D] transition-colors">
                                                    {pet.name}
                                                </h3>
                                                {/* Gender Icon (Optional logic) */}
                                                <span className="text-gray-400 text-lg">♂️</span> 
                                            </div>
                                            
                                            <p className="text-sm text-gray-500 font-medium mb-6 bg-gray-50 inline-block px-3 py-1 rounded-lg self-start">
                                                🧬 {pet.breed}
                                            </p>

                                            {/* Action Button */}
                                            <div className="mt-auto w-full py-3 rounded-xl bg-[#FFFBF7] border-2 border-[#A0522D]/20 text-[#A0522D] font-bold text-center group-hover:bg-[#A0522D] group-hover:text-white transition-all duration-300">
                                                Meet {pet.name} ❤️
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default AdoptionScreen;