import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Leaflet Icon Fix 
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;


const AutoZoom = ({ services }) => {
    const map = useMap();

    useEffect(() => {
        if (services.length > 0) {
            
            const markers = services.map(s => [
                s.lat || 6.9271, 
                s.lng || 79.8612
            ]);

            
            const bounds = L.latLngBounds(markers);
            
           
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [services, map]);

    return null;
};

const ServiceMap = ({ services }) => {
   
    const defaultCenter = [7.8731, 80.7718]; 

    return (
        <MapContainer 
            center={defaultCenter} 
            zoom={7} 
            scrollWheelZoom={false} 
            style={{ height: "100%", width: "100%", zIndex: 0 }}
        >
            <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            
            <AutoZoom services={services} />

            {services.map(service => (
                <Marker 
                    key={service._id} 
                    position={[service.lat || 6.9271, service.lng || 79.8612]} 
                >
                    <Popup>
                        <div className="text-center">
                            <h3 className="font-bold text-[#A0522D]">{service.name}</h3>
                            <p className="text-xs font-bold">{service.type}</p>
                            <p className="text-xs text-gray-500">{service.address}</p>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default ServiceMap;