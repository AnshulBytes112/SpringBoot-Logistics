import React, { useState } from 'react';

const API_BASE = 'http://localhost:8081';

const CreateBookingModal = ({ loadId, onClose, onSuccess, token, userProfile }) => {
    const [rate, setRate] = useState('');
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const payload = {
            loadId: loadId,
            transporterId: userProfile?.sub || 'unknown',
            proposedRate: parseFloat(rate),
            comment: comment || null
        };

        try {
            const resp = await fetch(`${API_BASE}/api/bookings`, {
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
            setError('Network error');
        }
        setLoading(false);
    };

    const inputClass = "w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-green-400 focus:outline-none transition-colors";

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="glass-panel w-full max-w-md p-6 m-4 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-textSecondary hover:text-white text-xl">×</button>
                <h2 className="text-2xl font-bold mb-1 text-gradient">Submit Proposal</h2>
                <p className="text-xs text-textSecondary mb-5">Propose your rate for this load. The shipper will review and accept or reject.</p>

                <div className="mb-4 bg-black/20 p-3 rounded-xl border border-white/5">
                    <span className="text-[0.65rem] text-textSecondary uppercase">Targeting Load</span>
                    <p className="font-mono text-sm mt-1">{loadId}</p>
                </div>

                {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg mb-4 text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="text-[0.7rem] text-textSecondary uppercase tracking-wider block mb-1">Proposed Rate (₹)</label>
                        <input required type="number" step="0.01" min="1" value={rate} onChange={e => setRate(e.target.value)} placeholder="e.g. 85000" className={inputClass} />
                    </div>
                    <div>
                        <label className="text-[0.7rem] text-textSecondary uppercase tracking-wider block mb-1">Comments / Terms (Optional)</label>
                        <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="e.g. Delivery in 48 hours, fully insured" rows={3} className={inputClass + " resize-none"} />
                    </div>
                    <button disabled={loading} type="submit" className="mt-2 w-full bg-green-500 text-white font-bold py-3 rounded-xl hover:bg-green-400 shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all disabled:opacity-50">
                        {loading ? 'Submitting...' : '✓ Send Proposal'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateBookingModal;
