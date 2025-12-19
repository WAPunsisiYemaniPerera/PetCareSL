import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify'; 
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import '../App.css';

// --- Fix for Leaflet Marker Icon ---
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
// Set Icon
L.Marker.prototype.options.icon = DefaultIcon;


const ServiceScreen = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All');

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/services');
                setServices(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
                // Display Toast
                toast.error("Failed to load services. Please check your connection. 🔌", {
                    theme: "colored"
                });
            }
        };
        fetchServices();
    }, []);

    // Call Function
    const handleCall = (name) => {
        toast.info(`Calling ${name}... 📞`, {
            theme: "colored",
            autoClose: 2000,
            style: { backgroundColor: '#3C3F36', color: '#fff' }
        });
    };

    // Filter Logic
    const filteredServices = services.filter(service => {
        const matchSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchType = filterType === 'All' || service.type === filterType;
        return matchSearch && matchType;
    });

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen bg-[#FFFBF7]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A0522D]"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FFFBF7] py-10 px-4 md:px-8">
            
            {/* Header Section */}
            <div className="text-center mb-10 animate-fade-in-up">
                <h1 className="text-4xl font-extrabold text-[#3C3F36] mb-4">Find Pet Services 🏥</h1>
                <p className="text-gray-500 max-w-2xl mx-auto">Discover the best Vet Clinics, Groomers, and Pet Shops near you.</p>
            </div>

            {/* Map Section */}
            <div className="max-w-7xl mx-auto mb-12 rounded-[2rem] overflow-hidden shadow-xl border-4 border-white animate-fade-in-up">
                <MapContainer 
                    center={[7.8731, 80.7718]} 
                    zoom={8} 
                    scrollWheelZoom={false} 
                    style={{ height: "400px", width: "100%", zIndex: 0 }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    
                    {filteredServices.map(service => (
                        service.location && service.location.coordinates ? (
                            <Marker 
                                key={service._id} 
                                position={[service.location.coordinates[1], service.location.coordinates[0]]}
                            >
                                <Popup>
                                    <div className="text-center">
                                        <h3 className="font-bold text-[#A0522D]">{service.name}</h3>
                                        <p className="text-xs text-gray-600">{service.type}</p>
                                        <Link to={`/services/${service._id}`} className="text-xs text-blue-500 underline mt-1 block">
                                            View Details
                                        </Link>
                                    </div>
                                </Popup>
                            </Marker>
                        ) : null
                    ))}
                </MapContainer>
            </div>

            {/* Filters */}
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 mb-8 justify-between items-center animate-fade-in-up">
                <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
                    {['All', 'Vet Clinic', 'Groomer', 'Pet Shop', 'Boarding'].map(type => (
                        <button 
                            key={type}
                            onClick={() => setFilterType(type)}
                            className={`px-6 py-2 rounded-full font-bold text-sm transition-all whitespace-nowrap ${
                                filterType === type 
                                ? 'bg-[#A0522D] text-white shadow-md' 
                                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                            }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
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
            </div>

            {/* Service Cards List */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredServices.length === 0 ? (
                    <div className="col-span-full text-center py-20 text-gray-500">No services found matching your criteria.</div>
                ) : (
                    filteredServices.map((service, index) => (
                        <div key={service._id} className="bg-white rounded-[2rem] p-6 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 group animate-fade-in-up" style={{animationDelay: `${index * 0.1}s`}}>
                            <div className="flex items-start justify-between mb-4">
                                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                    service.type === 'Vet Clinic' ? 'bg-red-100 text-red-600' :
                                    service.type === 'Groomer' ? 'bg-pink-100 text-pink-600' :
                                    service.type === 'Pet Shop' ? 'bg-blue-100 text-blue-600' :
                                    'bg-orange-100 text-orange-600'
                                }`}>
                                    {service.type}
                                </div>
                                <div className="bg-gray-50 p-2 rounded-full text-xl group-hover:scale-110 transition-transform">
                                    {service.type === 'Vet Clinic' ? '🏥' : 
                                     service.type === 'Groomer' ? '✂️' : 
                                     service.type === 'Pet Shop' ? '🛒' : '🏠'}
                                </div>
                            </div>
                            
                            <h3 className="text-xl font-bold text-gray-800 mb-2">{service.name}</h3>
                            
                            <div className="space-y-2 text-sm text-gray-500 mb-6">
                                <div className="flex items-center gap-2">
                                    <span>📍</span>
                                    <span className="truncate">{service.address}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span>📞</span>
                                    <span>{service.phone}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <Link 
                                    to={`/services/${service._id}`}
                                    className="block w-full py-3 bg-[#3C3F36] text-white text-center rounded-xl font-bold hover:bg-black transition-colors shadow-md text-sm flex items-center justify-center"
                                >
                                    View Details 📄
                                </Link>
                                
                                
                                <a 
                                    href={`tel:${service.phone}`}
                                    onClick={() => handleCall(service.name)}
                                    className="block w-full py-3 bg-white text-[#A0522D] border-2 border-[#A0522D] text-center rounded-xl font-bold hover:bg-[#A0522D] hover:text-white transition-colors text-sm flex items-center justify-center"
                                >
                                    Call Now 📞
                                </a>
                            </div>

                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ServiceScreen;