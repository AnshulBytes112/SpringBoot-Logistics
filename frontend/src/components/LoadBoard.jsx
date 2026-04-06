import React, { useState } from 'react';
import ShipmentTracker from './ShipmentTracker';
import LiveMap from './LiveMap';
import CreateLoadModal from './CreateLoadModal';
import CreateBookingModal from './CreateBookingModal';

const API_BASE = 'http://localhost:8081';

const LoadBoard = ({ loads, bookings, userProfile, token, refreshData }) => {
    const [showLoadModal, setShowLoadModal] = useState(false);
    const [selectedLoadId, setSelectedLoadId] = useState(null);
    const [activeView, setActiveView] = useState('loads'); // 'loads' | 'bookings'
    const [actionLoading, setActionLoading] = useState(null);

    const role = userProfile?.role || '';
    const isShipper    = role === 'ROLE_SHIPPER';
    const isTransporter = role === 'ROLE_TRANSPORTER';
    const isAdmin      = role === 'ROLE_ADMIN';
    const canPostLoad  = isShipper || isAdmin;
    const canBid       = isTransporter || isAdmin;
    const canManageBookings = isShipper || isAdmin;

    const authHeaders = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    const handleCreateSuccess = () => {
        setShowLoadModal(false);
        setSelectedLoadId(null);
        refreshData();
    };

    // Accept a booking → PUT /api/bookings/{id}  with status ACCEPTED
    const acceptBooking = async (booking) => {
        setActionLoading(booking.id);
        try {
            await fetch(`${API_BASE}/api/bookings/${booking.id}`, {
                method: 'PUT',
                headers: authHeaders,
                body: JSON.stringify({
                    loadId: booking.loadId,
                    transporterId: booking.transporterId,
                    proposedRate: booking.proposedRate,
                    comment: booking.comment,
                    status: 'ACCEPTED'
                })
            });
            refreshData();
        } catch (e) { console.error(e); }
        setActionLoading(null);
    };

    // Reject = update status to REJECTED
    const rejectBooking = async (booking) => {
        setActionLoading(booking.id);
        try {
            await fetch(`${API_BASE}/api/bookings/${booking.id}`, {
                method: 'PUT',
                headers: authHeaders,
                body: JSON.stringify({
                    loadId: booking.loadId,
                    transporterId: booking.transporterId,
                    proposedRate: booking.proposedRate,
                    comment: booking.comment,
                    status: 'REJECTED'
                })
            });
            refreshData();
        } catch (e) { console.error(e); }
        setActionLoading(null);
    };

    // Delete a load
    const deleteLoad = async (loadId) => {
        if (!confirm('Delete this load permanently?')) return;
        setActionLoading(loadId);
        try {
            await fetch(`${API_BASE}/api/loads/${loadId}`, { method: 'DELETE', headers: authHeaders });
            refreshData();
        } catch (e) { console.error(e); }
        setActionLoading(null);
    };

    // Delete a booking
    const deleteBooking = async (bookingId) => {
        if (!confirm('Remove this booking?')) return;
        setActionLoading(bookingId);
        try {
            await fetch(`${API_BASE}/api/bookings/${bookingId}`, { method: 'DELETE', headers: authHeaders });
            refreshData();
        } catch (e) { console.error(e); }
        setActionLoading(null);
    };

    const statusColor = {
        POSTED:   'bg-yellow-400/15 text-yellow-400',
        BOOKED:   'bg-blue-400/15 text-blue-400',
        CANCELLED:'bg-red-400/15 text-red-400',
        PENDING:  'bg-yellow-400/15 text-yellow-400',
        ACCEPTED: 'bg-green-400/15 text-green-400',
        REJECTED: 'bg-red-400/15 text-red-400',
    };

    return (
        <div>
            {/* Tab header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex gap-2 bg-black/20 p-1 rounded-xl">
                    <button
                        onClick={() => setActiveView('loads')}
                        className={`px-5 py-2 rounded-lg font-semibold text-sm transition-all ${activeView === 'loads' ? 'bg-white/10 text-white' : 'text-textSecondary hover:text-white'}`}
                    >
                        🗂 Loads ({loads.length})
                    </button>
                    {canManageBookings && (
                        <button
                            onClick={() => setActiveView('bookings')}
                            className={`px-5 py-2 rounded-lg font-semibold text-sm transition-all ${activeView === 'bookings' ? 'bg-white/10 text-white' : 'text-textSecondary hover:text-white'}`}
                        >
                            📋 Bookings ({bookings.length})
                        </button>
                    )}
                </div>
                {canPostLoad && (
                    <button
                        onClick={() => setShowLoadModal(true)}
                        className="bg-accentSolid text-black font-bold py-2 px-6 rounded-xl hover:bg-accentHover shadow-[0_0_15px_rgba(0,195,255,0.4)] transition-all text-sm"
                    >
                        + Post New Load
                    </button>
                )}
            </div>

            {/* ── LOADS VIEW ── */}
            {activeView === 'loads' && (
                loads.length === 0 ? (
                    <div className="glass-panel p-10 text-center text-textSecondary">No loads on the network yet.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {loads.map(load => (
                            <div key={load.id} className="glass-panel p-5 flex flex-col gap-3 relative overflow-hidden hover:-translate-y-1 transition-transform duration-300">
                                <div className="absolute top-0 left-0 w-1 h-full bg-accentSolid rounded-l-2xl"></div>

                                {/* Header */}
                                <div className="flex justify-between items-center pl-2">
                                    <span className="text-xs text-textSecondary font-mono bg-black/30 px-2 py-0.5 rounded">
                                        {load.id.substring(0, 8)}...
                                    </span>
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${statusColor[load.status] || ''}`}>
                                        {load.status}
                                    </span>
                                </div>

                                {/* Route */}
                                <div className="flex items-center gap-2 bg-black/10 p-2.5 rounded-xl ml-2 text-sm">
                                    <div className="flex-1">
                                        <span className="text-[0.65rem] text-textSecondary uppercase block">From</span>
                                        <span className="font-semibold">{load.facility?.loadPoint || 'N/A'}</span>
                                    </div>
                                    <span className="text-textSecondary">➔</span>
                                    <div className="flex-1">
                                        <span className="text-[0.65rem] text-textSecondary uppercase block">To</span>
                                        <span className="font-semibold">{load.facility?.unloadingPoint || 'N/A'}</span>
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="grid grid-cols-2 gap-2 ml-2 text-sm">
                                    <div><span className="text-[0.65rem] text-textSecondary uppercase block">Product</span><span>{load.productType}</span></div>
                                    <div><span className="text-[0.65rem] text-textSecondary uppercase block">Weight</span><span>{load.weight} tons</span></div>
                                    <div><span className="text-[0.65rem] text-textSecondary uppercase block">Trucks</span><span>{load.noOfTrucks}x {load.truckType}</span></div>
                                    <div><span className="text-[0.65rem] text-textSecondary uppercase block">Shipper</span><span className="font-mono text-xs truncate block">{load.shipperId}</span></div>
                                </div>

                                {/* Tracker */}
                                <div className="ml-2">
                                    <ShipmentTracker status={load.status} />
                                </div>

                                {/* Live Map */}
                                <div className="ml-2">
                                    <LiveMap lat={load.currentLat} lng={load.currentLng} id={load.id} status={load.status} shipperId={load.shipperId} />
                                </div>

                                {/* Actions */}
                                <div className="ml-2 flex flex-col gap-2 mt-1">
                                    {load.status === 'POSTED' && canBid && (
                                        <button
                                            onClick={() => setSelectedLoadId(load.id)}
                                            className="w-full border border-white/10 hover:bg-white/10 text-textPrimary font-semibold py-2 rounded-lg transition-all text-sm hover:shadow-[0_0_12px_rgba(0,195,255,0.3)]"
                                        >
                                            Submit Proposal
                                        </button>
                                    )}
                                    {/* Delete: Admin can delete any, Shipper can only delete their OWN */}
                                    {(isAdmin || (isShipper && load.shipperId === userProfile?.sub)) && (
                                        <button
                                            onClick={() => deleteLoad(load.id)}
                                            disabled={actionLoading === load.id}
                                            className="w-full border border-red-500/30 hover:bg-red-500/10 text-red-400 font-semibold py-2 rounded-lg transition-all text-sm"
                                        >
                                            {actionLoading === load.id ? 'Deleting...' : '🗑 Delete Load'}
                                        </button>
                                    )}
                                    {load.status === 'BOOKED' && (
                                        <div className="text-center text-xs text-textSecondary py-2 border border-white/5 rounded-lg">
                                            ✅ Transporter Assigned
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )
            )}

            {/* ── BOOKINGS MANAGEMENT VIEW ── */}
            {activeView === 'bookings' && canManageBookings && (
                <div>
                    {bookings.length === 0 ? (
                        <div className="glass-panel p-10 text-center text-textSecondary">No bookings yet.</div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {bookings.map(booking => (
                                <div key={booking.id} className="glass-panel p-5 flex flex-col md:flex-row md:items-center gap-4">
                                    {/* Status dot */}
                                    <div className={`w-3 h-3 rounded-full shrink-0 ${booking.status === 'ACCEPTED' ? 'bg-green-400' : booking.status === 'PENDING' ? 'bg-yellow-400 animate-pulse' : 'bg-red-400'}`}></div>

                                    {/* Info */}
                                    <div className="flex-grow grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                        <div>
                                            <span className="text-[0.65rem] text-textSecondary uppercase block">Booking ID</span>
                                            <span className="font-mono text-xs">{booking.id.substring(0,8)}...</span>
                                        </div>
                                        <div>
                                            <span className="text-[0.65rem] text-textSecondary uppercase block">Load Ref</span>
                                            <span className="font-mono text-xs">{booking.loadId?.toString().substring(0,8)}...</span>
                                        </div>
                                        <div>
                                            <span className="text-[0.65rem] text-textSecondary uppercase block">Transporter</span>
                                            <span className="font-mono text-xs truncate block max-w-[120px]">{booking.transporterId}</span>
                                        </div>
                                        <div>
                                            <span className="text-[0.65rem] text-textSecondary uppercase block">Proposed Rate</span>
                                            <span className="font-bold text-green-400">₹{booking.proposedRate?.toLocaleString()}</span>
                                        </div>
                                        {booking.comment && (
                                            <div className="col-span-2 md:col-span-4">
                                                <span className="text-[0.65rem] text-textSecondary uppercase block">Comment</span>
                                                <span className="italic text-textSecondary">"{booking.comment}"</span>
                                            </div>
                                        )}
                                        <div>
                                            <span className="text-[0.65rem] text-textSecondary uppercase block">Status</span>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${statusColor[booking.status] || ''}`}>{booking.status}</span>
                                        </div>
                                        <div>
                                            <span className="text-[0.65rem] text-textSecondary uppercase block">Submitted</span>
                                            <span className="text-xs">{booking.createdDate ? new Date(booking.createdDate).toLocaleString() : '—'}</span>
                                        </div>
                                    </div>

                                    {/* Action buttons */}
                                    <div className="flex flex-row md:flex-col gap-2 shrink-0">
                                        {booking.status === 'PENDING' && (isAdmin || isShipper) && (
                                            <>
                                                <button
                                                    onClick={() => acceptBooking(booking)}
                                                    disabled={actionLoading === booking.id}
                                                    className="px-4 py-2 bg-green-500/20 border border-green-500/40 hover:bg-green-500/30 text-green-400 font-bold rounded-lg text-xs transition-all"
                                                >
                                                    {actionLoading === booking.id ? '...' : '✓ Accept'}
                                                </button>
                                                <button
                                                    onClick={() => rejectBooking(booking)}
                                                    disabled={actionLoading === booking.id}
                                                    className="px-4 py-2 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 font-bold rounded-lg text-xs transition-all"
                                                >
                                                    ✕ Reject
                                                </button>
                                            </>
                                        )}
                                        {/* Only admin can remove bookings */}
                                        {isAdmin && (
                                            <button
                                                onClick={() => deleteBooking(booking.id)}
                                                disabled={actionLoading === booking.id}
                                                className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 text-textSecondary font-bold rounded-lg text-xs transition-all"
                                            >
                                                🗑 Remove
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Modals */}
            {showLoadModal && (
                <CreateLoadModal onClose={() => setShowLoadModal(false)} onSuccess={handleCreateSuccess} token={token} userProfile={userProfile} />
            )}
            {selectedLoadId && (
                <CreateBookingModal loadId={selectedLoadId} onClose={() => setSelectedLoadId(null)} onSuccess={handleCreateSuccess} token={token} userProfile={userProfile} />
            )}
        </div>
    );
};

export default LoadBoard;
