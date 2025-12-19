import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminSidebar from '../components/AdminSidebar'; 
import { showSuccess, showError, showConfirm } from '../utils/customAlert';
import '../App.css'; 

const AdminServiceListScreen = () => {
    
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    const fetchServices = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('http://localhost:5000/api/services');
            setServices(data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user || !user.isAdmin) {
            navigate('/admin/login');
        } else {
            fetchServices();
        }
    }, [user, navigate]);

    const deleteHandler = async (id) => {
        const isConfirmed = await showConfirm(
            'Delete Service?', 
            'This service will be permanently removed!'
        );

        if (isConfirmed) {
            try {
                const token = localStorage.getItem('petCareToken');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                await axios.delete(`http://localhost:5000/api/services/${id}`, config);
                
                showSuccess('Service deleted successfully! 🗑️'); // Success Box
                fetchServices(); 
            } catch (err) {
                showError('Failed to delete service.'); // Error Box
            }
        }
    };

    const createServiceHandler = async () => {
        try {
            const token = localStorage.getItem('petCareToken');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.post('http://localhost:5000/api/services', {}, config);
            navigate(`/admin/service/${data._id}/edit`);
        } catch (error) {
            alert('Failed to create new service.');
        }
    };

    const filteredServices = services.filter(service => 
        (service.name && service.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const getTypeStyle = (type) => {
        switch(type) {
            case 'Vet Clinic': return 'bg-red-100 text-red-700 border-red-200';
            case 'Groomer': return 'bg-pink-100 text-pink-700 border-pink-200';
            case 'Pet Shop': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    if (loading) return (
        // Loading Spinner
        <div className="flex justify-center items-center min-h-screen">Loading...</div>
    );

    return (
        <div className="min-h-screen bg-[#FFFBF7]">
            
            <AdminSidebar /> 
            
            <div className='md:ml-64 p-8'> 
                
                <div className="flex flex-col xl:flex-row justify-between items-center mb-8 gap-6 animate-fade-in-up">
                    <div>
                        <h1 className="text-3xl font-extrabold text-[#3C3F36]">Service Directory</h1>
                    </div>
                    {/* ... Search Bar & Add Button ... */}
                     <div className="flex flex-col md:flex-row gap-4 w-full xl:w-auto">
                        <div className="relative w-full md:w-80">
                            <span className="absolute left-4 top-3.5 text-gray-400">🔍</span>
                            <input 
                                type="text"
                                placeholder="Search services..."
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#A0522D] outline-none shadow-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button onClick={createServiceHandler} className="flex items-center justify-center gap-2 bg-[#A0522D] text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-[#8B4513] transition-all">
                            <span className="text-xl">+</span> Add Service
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden animate-fade-in-up delay-100">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Service</th>
                                    <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Type</th>
                                    <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Details</th>
                                    <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredServices.map(service => (
                                    <tr key={service._id} className="hover:bg-[#FFFBF7] transition-colors">
                                        <td className="p-5 font-bold">{service.name}</td>
                                        <td className="p-5"><span className={`px-3 py-1 rounded-full text-xs font-bold border ${getTypeStyle(service.type)}`}>{service.type}</span></td>
                                        <td className="p-5 text-sm">{service.address} <br/> {service.phone}</td>
                                        <td className="p-5 text-right">
                                            <div className="flex justify-end gap-3">
                                                <Link to={`/admin/service/${service._id}/edit`} className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-[#A0522D] hover:text-white">✏️</Link>
                                                <button onClick={() => deleteHandler(service._id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100">🗑️</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminServiceListScreen;