import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../App.css'; // Animations

const MyPetsScreen = () => {
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    // Form States
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState('');
    const [petType, setPetType] = useState('Dog');
    const [breed, setBreed] = useState('');
    const [age, setAge] = useState('');

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            fetchPets();
        }
    }, [user, navigate]);

    const fetchPets = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('petCareToken');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get('https://yemani-petcare-backend.hf.space/api/pets/mypets', config);
            setPets(data);
            setLoading(false);
        } catch (err) {
            setError('Could not fetch your pets.');
            setLoading(false);
        }
    };

    const addPetHandler = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const token = localStorage.getItem('petCareToken');
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            };
            const petData = { name, petType, breed, age: Number(age) };
            await axios.post('https://yemani-petcare-backend.hf.space/api/pets', petData, config);
            
            setShowForm(false);
            setName(''); setPetType('Dog'); setBreed(''); setAge('');
            fetchPets();
        } catch (err) {
            setError('Failed to add pet. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-[#FFFBF7] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                
                {/* Header */}
                <div className="flex justify-between items-center mb-10 animate-fade-in-up">
                    <div>
                        <h1 className="text-4xl font-extrabold text-[#3C3F36]">My Furry Family 🐾</h1>
                        <p className="text-gray-500 mt-2">Manage the profiles of your beloved pets here.</p>
                    </div>
                    <button 
                        onClick={() => setShowForm(!showForm)} 
                        className={`px-6 py-3 rounded-full font-bold shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${
                            showForm ? 'bg-gray-200 text-gray-700' : 'bg-[#A0522D] text-white hover:bg-[#8B4513]'
                        }`}
                    >
                        {showForm ? 'Cancel' : '+ Add New Pet'}
                    </button>
                </div>

                {/* Add Pet Form (Popup style) */}
                {showForm && (
                    <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-gray-100 mb-12 animate-fade-in-up">
                        <h3 className="text-2xl font-bold text-[#3C3F36] mb-6">Tell us about your pet 📝</h3>
                        <form onSubmit={addPetHandler} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Pet's Name</label>
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#A0522D] outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Type</label>
                                <select value={petType} onChange={(e) => setPetType(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#A0522D] outline-none">
                                    <option value="Dog">Dog 🐶</option>
                                    <option value="Cat">Cat 🐱</option>
                                    <option value="Bird">Bird 🐦</option>
                                    <option value="Other">Other 🐾</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Breed</label>
                                <input type="text" value={breed} onChange={(e) => setBreed(e.target.value)} required className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#A0522D] outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Age (Years)</label>
                                <input type="number" value={age} onChange={(e) => setAge(e.target.value)} required className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#A0522D] outline-none" />
                            </div>
                            <div className="md:col-span-2">
                                <button type="submit" className="w-full py-3 bg-[#6B8E23] text-white font-bold rounded-xl hover:bg-[#556B2F] transition-colors shadow-md">
                                    Save Pet Profile 💾
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Pet List */}
                {loading ? (
                    <div className="flex justify-center h-32 items-center"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-[#A0522D]"></div></div>
                ) : error ? (
                    <p className="text-red-500 font-bold text-center">{error}</p>
                ) : pets.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-gray-300">
                        <div className="text-6xl mb-4">🐕</div>
                        <p className="text-gray-500 text-lg">You haven't added any pets yet.</p>
                        <p className="text-gray-400">Click the button above to get started!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {pets.map((pet, index) => (
                            <div 
                                key={pet._id} 
                                className="bg-white rounded-[2rem] p-6 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 relative overflow-hidden group animate-fade-in-up"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-full blur-2xl -mr-8 -mt-8 transition-all group-hover:bg-orange-100"></div>
                                
                                <div className="relative z-10 flex items-center gap-4 mb-4">
                                    <div className="w-16 h-16 rounded-full bg-[#FFFBF7] flex items-center justify-center text-3xl border-2 border-orange-100">
                                        {pet.petType === 'Dog' ? '🐶' : pet.petType === 'Cat' ? '🐱' : '🐾'}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800">{pet.name}</h3>
                                        <p className="text-xs text-[#A0522D] font-bold uppercase tracking-wider">{pet.petType}</p>
                                    </div>
                                </div>

                                <div className="space-y-2 border-t border-gray-50 pt-4">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 text-sm">Breed</span>
                                        <span className="font-medium text-gray-700">{pet.breed}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 text-sm">Age</span>
                                        <span className="font-medium text-gray-700">{pet.age} Years</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyPetsScreen;