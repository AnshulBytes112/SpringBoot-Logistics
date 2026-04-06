import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LiveMap = ({ lat, lng, id, status, shipperId }) => {
    // If no coordinates provided, we show a default placeholder or hide
    if (!lat || !lng) {
        return (
            <div className="w-full h-48 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center text-textSecondary text-sm">
                No GPS data available yet.
            </div>
        );
    }

    return (
        <div className="w-full h-48 rounded-xl overflow-hidden shadow-lg border border-white/10 mt-4 relative z-0">
            <MapContainer center={[lat, lng]} zoom={13} scrollWheelZoom={false} className="w-full h-full">
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                />
                <Marker position={[lat, lng]}>
                    <Popup className="text-black">
                        <strong>Load ID:</strong> {id.substring(0,8)}<br/>
                        <strong>Status:</strong> {status}<br/>
                        <strong>Shipper:</strong> {shipperId}
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};

export default LiveMap;
