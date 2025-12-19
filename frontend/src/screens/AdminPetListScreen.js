import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify'; 
import '../App.css'; 

const AdminPetListScreen = () => {
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    // const [error, setError] = useState(''); 
    
    // 1. Search State
    const [searchTerm, setSearchTerm] = useState('');

    const { user } = useAuth();
    const navigate = useNavigate();

    const fetchPets = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('petCareToken');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get('http://localhost:5000/api/admin/pets', config);
            setPets(data);
            setLoading(false);
        } catch (err) {
            // setError('Failed to fetch pets.'); // Using toast instead
            setLoading(false);
            toast.error("Failed to load pet list. 😿", { theme: "colored" });
        }
    };

    useEffect(() => {
        if (!user || !user.isAdmin) {
            navigate('/admin/login');
        } else {
            fetchPets();
        }
    }, [user, navigate]);

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this pet record?')) {
            try {
                const token = localStorage.getItem('petCareToken');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                await axios.delete(`http://localhost:5000/api/admin/pets/${id}`, config);
                
                toast.success("Pet record deleted! 🗑️", { 
                    theme: "colored",
                    style: { backgroundColor: '#e74c3c', color: '#fff' }
                });
                
                fetchPets(); 
            } catch (err) {
                toast.error('Failed to delete pet.', { theme: "colored" });
            }
        }
    };

    const createPetHandler = async () => {
        try {
            const token = localStorage.getItem('petCareToken');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.post('http://localhost:5000/api/admin/pets', {}, config);
            
            toast.info("Creating new pet profile... 🐾", { theme: "colored" });
            navigate(`/admin/pet/${data._id}/edit`);
        } catch (error) {
            toast.error('Failed to initialize new pet entry.', { theme: "colored" });
        }
    };

    const getStatusStyle = (status) => {
        if (status === 'Adopted') return 'bg-green-100 text-green-700 border-green-200';
        if (status === 'For Adoption') return 'bg-blue-100 text-blue-700 border-blue-200';
        return 'bg-gray-100 text-gray-700 border-gray-200';
    };

    // 2. Search Logic
    const filteredPets = pets.filter(pet => 
        (pet.name && pet.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (pet.petType && pet.petType.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (pet.breed && pet.breed.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (pet.status && pet.status.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) return (
        <div className="md:ml-64 min-h-screen flex justify-center items-center bg-[#FFFBF7]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A0522D]"></div>
        </div>
    );

    return (
        <div className='md:ml-64 min-h-screen bg-[#FFFBF7] p-8'>
            
            {/* Header Section with Search */}
            <div className="flex flex-col xl:flex-row justify-between items-center mb-8 gap-6 animate-fade-in-up">
                <div>
                    <h1 className="text-3xl font-extrabold text-[#3C3F36]">Pet Management</h1>
                    <p className="text-gray-500 mt-1">Manage adoption listings and pet profiles.</p>
                </div>

                <div className="flex flex-col md:flex-row gap-4 w-full xl:w-auto">
                    {/* Search Bar */}
                    <div className="relative w-full md:w-80">
                        <span className="absolute left-4 top-3.5 text-gray-400">🔍</span>
                        <input 
                            type="text"
                            placeholder="Search by name, type, or breed..."
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#A0522D] focus:ring-1 focus:ring-[#A0522D] outline-none shadow-sm transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <button 
                        onClick={createPetHandler} 
                        className="flex items-center justify-center gap-2 bg-[#A0522D] text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-[#8B4513] hover:-translate-y-1 transition-all duration-300 min-w-max"
                    >
                        <span className="text-xl">+</span> Add New Pet
                    </button>
                </div>
            </div>

            {/* Table or Empty State */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden animate-fade-in-up delay-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Pet</th>
                                <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Type</th>
                                <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Contact</th>
                                <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredPets.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-12 text-center text-gray-500">
                                        {pets.length === 0 
                                            ? "No pets available. Add one to get started!" 
                                            : <span>No pets found matching <span className="font-bold">"{searchTerm}"</span></span>
                                        }
                                    </td>
                                </tr>
                            ) : (
                                filteredPets.map(pet => (
                                    <tr key={pet._id} className="hover:bg-[#FFFBF7] transition-colors">
                                        <td className="p-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-100 rounded-full overflow-hidden flex-shrink-0 border border-gray-200">
                                                    <img 
                                                        src={pet.image || '/images/sample.jpg'} 
                                                        alt={pet.name} 
                                                        className="w-full h-full object-cover" 
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-800">{pet.name}</p>
                                                    <p className="text-xs text-gray-400">{pet.breed}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5 text-sm font-medium text-gray-600">
                                            {pet.petType}
                                        </td>
                                        <td className="p-5">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(pet.status)}`}>
                                                {pet.status || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="p-5 text-sm text-gray-500 font-mono">
                                            {pet.contact}
                                        </td>
                                        <td className="p-5 text-right">
                                            <div className="flex justify-end gap-2">
                                                
                                                {/* View Button */}
                                                <Link 
                                                    to={`/adoption/${pet._id}`} 
                                                    target="_blank" 
                                                    className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                                                    title="View Public Page"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                                </Link>

                                                {/* Edit Button */}
                                                <Link 
                                                    to={`/admin/pet/${pet._id}/edit`} 
                                                    className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-[#A0522D] hover:text-white transition-colors"
                                                    title="Edit"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 00 2 2h11a2 2 0 00 2-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                                </Link>
                                                
                                                {/* Delete Button */}
                                                <button 
                                                    onClick={() => deleteHandler(pet._id)} 
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
        </div>
    );
};

export default AdminPetListScreen;