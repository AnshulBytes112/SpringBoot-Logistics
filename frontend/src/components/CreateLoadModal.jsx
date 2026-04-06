import React, { useState, useCallback } from 'react';

const API_BASE = 'http://localhost:8081';

// Free geocoding via OpenStreetMap Nominatim — no API key needed
const geocodeCity = async (cityName) => {
    if (!cityName || cityName.trim().length < 2) return null;
    try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityName)}&format=json&limit=1`, {
            headers: { 'Accept-Language': 'en' }
        });
        const data = await res.json();
        if (data.length > 0) {
            return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon), display: data[0].display_name };
        }
    } catch (e) { console.error('Geocode failed:', e); }
    return null;
};

const CreateLoadModal = ({ onClose, onSuccess, token, userProfile }) => {
    const [formData, setFormData] = useState({
        loadPoint: '',
        unloadingPoint: '',
        productType: '',
        truckType: 'FLATBED',
        noOfTrucks: 1,
        weight: 10,
        comment: '',
        loadingDate: '',
        unloadingDate: '',
        currentLat: '',
        currentLng: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [geoStatus, setGeoStatus] = useState(''); // Shows geocoding feedback
    const [geoDisplay, setGeoDisplay] = useState(''); // Shows resolved location name

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Auto-geocode when the user leaves the Origin City field
    const handleOriginBlur = useCallback(async () => {
        if (!formData.loadPoint.trim()) return;
        setGeoStatus('locating');
        const result = await geocodeCity(formData.loadPoint);
        if (result) {
            setFormData(prev => ({ ...prev, currentLat: result.lat.toFixed(4), currentLng: result.lng.toFixed(4) }));
            setGeoDisplay(result.display);
            setGeoStatus('found');
        } else {
            setGeoStatus('notfound');
            setGeoDisplay('');
        }
    }, [formData.loadPoint]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const payload = {
            shipperId: userProfile?.sub || 'unknown',
            facility: {
                loadPoint: formData.loadPoint,
                unloadingPoint: formData.unloadingPoint,
                loadingDate: formData.loadingDate ? new Date(formData.loadingDate).toISOString() : new Date().toISOString(),
                unloadingDate: formData.unloadingDate ? new Date(formData.unloadingDate).toISOString() : new Date(Date.now() + 86400000).toISOString()
            },
            productType: formData.productType,
            truckType: formData.truckType,
            noOfTrucks: parseInt(formData.noOfTrucks),
            weight: parseFloat(formData.weight),
            comment: formData.comment || null,
            status: 'POSTED',
            currentLat: formData.currentLat ? parseFloat(formData.currentLat) : null,
            currentLng: formData.currentLng ? parseFloat(formData.currentLng) : null
        };

        try {
            const resp = await fetch(`${API_BASE}/api/loads`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(payload)
            });
            if (resp.ok) {
                onSuccess();
            } else {
                const errText = await resp.text();
                setError(`Failed: ${errText || resp.statusText}`);
            }
        } catch (err) {
            setError('Network error — is the backend running?');
        }
        setLoading(false);
    };

    const inputClass = "w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-accentSolid focus:outline-none transition-colors";
    const labelClass = "text-[0.7rem] text-textSecondary uppercase tracking-wider block mb-1";

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="glass-panel w-full max-w-xl p-6 m-4 relative max-h-[90vh] overflow-y-auto">
                <button onClick={onClose} className="absolute top-4 right-4 text-textSecondary hover:text-white text-xl">×</button>
                <h2 className="text-2xl font-bold mb-1 text-gradient">Post New Load</h2>
                <p className="text-xs text-textSecondary mb-5">Fill in shipment details. GPS is auto-detected from Origin City.</p>

                {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg mb-4 text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* Route */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Origin City</label>
                            <input
                                required name="loadPoint"
                                value={formData.loadPoint}
                                onChange={handleChange}
                                onBlur={handleOriginBlur}
                                placeholder="e.g. Mumbai"
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Destination City</label>
                            <input required name="unloadingPoint" value={formData.unloadingPoint} onChange={handleChange} placeholder="e.g. Delhi" className={inputClass} />
                        </div>
                    </div>

                    {/* Product & Truck */}
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className={labelClass}>Product Type</label><input required name="productType" value={formData.productType} onChange={handleChange} placeholder="e.g. Electronics" className={inputClass} /></div>
                        <div>
                            <label className={labelClass}>Truck Type</label>
                            <select name="truckType" value={formData.truckType} onChange={handleChange} className={inputClass}>
                                <option value="FLATBED">Flatbed</option>
                                <option value="OPEN_BODY">Open Body</option>
                                <option value="REEFER">Reefer (Refrigerated)</option>
                                <option value="CONTAINER">Container</option>
                                <option value="TANKER">Tanker</option>
                                <option value="TRAILER">Trailer</option>
                            </select>
                        </div>
                    </div>

                    {/* Quantity */}
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className={labelClass}>No. of Trucks</label><input required type="number" name="noOfTrucks" min="1" value={formData.noOfTrucks} onChange={handleChange} className={inputClass} /></div>
                        <div><label className={labelClass}>Weight (Tons)</label><input required type="number" step="0.1" min="0.1" name="weight" value={formData.weight} onChange={handleChange} className={inputClass} /></div>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className={labelClass}>Loading Date</label><input type="datetime-local" name="loadingDate" value={formData.loadingDate} onChange={handleChange} className={inputClass} /></div>
                        <div><label className={labelClass}>Unloading Date</label><input type="datetime-local" name="unloadingDate" value={formData.unloadingDate} onChange={handleChange} className={inputClass} /></div>
                    </div>

                    {/* GPS — Auto-detected */}
                    <div>
                        <label className={labelClass}>📍 GPS Coordinates (Auto-detected from Origin)</label>
                        <div className="grid grid-cols-2 gap-4 mt-1">
                            <input type="number" step="any" name="currentLat" value={formData.currentLat} onChange={handleChange} placeholder="Latitude" className={inputClass} />
                            <input type="number" step="any" name="currentLng" value={formData.currentLng} onChange={handleChange} placeholder="Longitude" className={inputClass} />
                        </div>
                        {/* Geocoding feedback */}
                        {geoStatus === 'locating' && (
                            <p className="text-[0.65rem] text-accentSolid mt-1.5 animate-pulse">🔍 Looking up coordinates for "{formData.loadPoint}"...</p>
                        )}
                        {geoStatus === 'found' && (
                            <p className="text-[0.65rem] text-green-400 mt-1.5">✅ Resolved: {geoDisplay}</p>
                        )}
                        {geoStatus === 'notfound' && (
                            <p className="text-[0.65rem] text-yellow-400 mt-1.5">⚠️ City not found. You can enter coordinates manually.</p>
                        )}
                        {!geoStatus && (
                            <p className="text-[0.65rem] text-textSecondary mt-1.5">Auto-fills when you type Origin City and click away. Or enter manually.</p>
                        )}
                    </div>

                    {/* Comment */}
                    <div>
                        <label className={labelClass}>Comments / Special Instructions</label>
                        <textarea name="comment" value={formData.comment} onChange={handleChange} placeholder="e.g. Fragile, handle with care" rows={2} className={inputClass + " resize-none"} />
                    </div>

                    <button disabled={loading} type="submit" className="mt-2 w-full bg-accentSolid text-black font-bold py-3 rounded-xl hover:bg-accentHover shadow-[0_0_15px_rgba(0,195,255,0.4)] transition-all disabled:opacity-50">
                        {loading ? 'Broadcasting...' : '🚀 Broadcast to Network'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateLoadModal;
