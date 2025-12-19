import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import { toast } from 'react-toastify'; 
import '../App.css';

const AdminServiceEditScreen = () => {
    const { id: serviceId } = useParams();
    const navigate = useNavigate();

    
    const [name, setName] = useState('');
    const [type, setType] = useState('Vet Clinic');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    
    
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServiceDetails = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/api/services/${serviceId}`);
                
                setName(data.name);
                setType(data.type);
                setAddress(data.address);
                setPhone(data.phone);

                
                if (data.location && data.location.coordinates) {
                    setLng(data.location.coordinates[0]); 
                    setLat(data.location.coordinates[1]); 
                }

                setLoading(false);
            } catch (error) {
                console.error('Error fetching service details:', error);
                setLoading(false);
                toast.error("Failed to load service details. 🏥", { theme: "colored" });
            }
        };
        fetchServiceDetails();
    }, [serviceId]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('petCareToken');
            const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } };
            
            const serviceData = { 
                name, 
                type, 
                address, 
                phone,
                location: {
                    type: 'Point',
                    coordinates: [Number(lng), Number(lat)] 
                }
            };

            await axios.put(`http://localhost:5000/api/services/${serviceId}`, serviceData, config);
            
            
            toast.success('Service Updated Successfully! ✅', { 
                theme: "colored",
                style: { backgroundColor: '#27ae60', color: '#fff' }
            });
            
            navigate('/admin/servicelist');
        } catch (error) {
            
            toast.error('Failed to update service. ❌', { theme: "colored" });
        }
    };

    if (loading) return (
        <div className="md:ml-64 min-h-screen flex justify-center items-center bg-[#FFFBF7]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A0522D]"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FFFBF7]">
            <AdminSidebar />
            
            <div className="md:ml-64 p-8">
                <div className="max-w-4xl mx-auto mb-8 animate-fade-in-up">
                    <Link to="/admin/servicelist" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-[#A0522D] mb-4 transition-colors">
                        &larr; Back to Service List
                    </Link>
                    <h1 className="text-3xl font-extrabold text-[#3C3F36]">Edit Service Info 🛠️</h1>
                </div>

                <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-8 md:p-12 animate-fade-in-up delay-100">
                    <form onSubmit={submitHandler} className="space-y-6">
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Service Name</label>
                                <input type="text" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#A0522D] outline-none" value={name} onChange={(e) => setName(e.target.value)} required />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Service Type</label>
                                <select className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#A0522D] outline-none" value={type} onChange={(e) => setType(e.target.value)}>
                                    <option value="Vet Clinic">Vet Clinic 🏥</option>
                                    <option value="Groomer">Groomer ✂️</option>
                                    <option value="Pet Shop">Pet Shop 🛒</option>
                                    <option value="Boarding">Boarding 🏠</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                                <input type="text" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#A0522D] outline-none" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Address (Text)</label>
                                <input type="text" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#A0522D] outline-none" value={address} onChange={(e) => setAddress(e.target.value)} required />
                            </div>

                            {/* --- MAP COORDINATES INPUTS --- */}
                            <div className="md:col-span-2 bg-blue-50 p-6 rounded-2xl border border-blue-100">
                                <h3 className="text-lg font-bold text-[#3C3F36] mb-4 flex items-center gap-2">
                                    📍 Map Coordinates
                                </h3>
                                <p className="text-xs text-gray-500 mb-4">
                                    Please enter coordinates to show location on map. (Model uses GeoJSON format).
                                </p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Latitude</label>
                                        <input 
                                            type="number" 
                                            step="any"
                                            className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-blue-500 outline-none font-mono text-sm" 
                                            value={lat} 
                                            onChange={(e) => setLat(e.target.value)} 
                                            placeholder="e.g. 6.9271"
                                            required 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Longitude</label>
                                        <input 
                                            type="number" 
                                            step="any"
                                            className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-blue-500 outline-none font-mono text-sm" 
                                            value={lng} 
                                            onChange={(e) => setLng(e.target.value)} 
                                            placeholder="e.g. 79.8612"
                                            required 
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className="pt-4">
                            <button type="submit" className="w-full py-4 bg-[#3C3F36] text-white font-bold rounded-xl shadow-lg hover:bg-black transition-all duration-300">
                                Update Service 💾
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminServiceEditScreen;