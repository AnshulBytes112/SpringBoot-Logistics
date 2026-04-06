import React from 'react';

const Dashboard = ({ loads, bookings }) => {
    const totalLoads = loads.length;
    const activeLoads = loads.filter(l => l.status === 'POSTED').length;
    const bookedLoads = loads.filter(l => l.status === 'BOOKED').length;
    
    const acceptedBookings = bookings.filter(b => b.status === 'ACCEPTED');
    const revenue = acceptedBookings.reduce((sum, b) => sum + (b.proposedRate || 0), 0);

    const history = [...bookings].sort((a,b) => new Date(b.createdDate || 0) - new Date(a.createdDate || 0)).slice(0, 5);

    return (
        <div className="flex flex-col gap-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glass-panel p-6 flex items-center gap-4 hover:-translate-y-1 transition-transform cursor-default">
                    <span className="text-4xl bg-black/30 w-16 h-16 rounded-2xl flex items-center justify-center">📦</span>
                    <div>
                        <h3 className="text-3xl font-bold">{totalLoads}</h3>
                        <p className="text-xs text-textSecondary uppercase tracking-wider">Total Loads</p>
                    </div>
                </div>
                <div className="glass-panel p-6 flex items-center gap-4 hover:-translate-y-1 transition-transform cursor-default">
                    <span className="text-4xl text-statusPosted bg-black/30 w-16 h-16 rounded-2xl flex items-center justify-center">⚡</span>
                    <div>
                        <h3 className="text-3xl font-bold">{activeLoads}</h3>
                        <p className="text-xs text-textSecondary uppercase tracking-wider">Active (Unbooked)</p>
                    </div>
                </div>
                <div className="glass-panel p-6 flex items-center gap-4 hover:-translate-y-1 transition-transform cursor-default">
                    <span className="text-4xl text-statusAccepted bg-black/30 w-16 h-16 rounded-2xl flex items-center justify-center">💰</span>
                    <div>
                        <h3 className="text-3xl font-bold">₹{revenue.toLocaleString()}</h3>
                        <p className="text-xs text-textSecondary uppercase tracking-wider">Secured Revenue</p>
                    </div>
                </div>
                <div className="glass-panel p-6 flex items-center gap-4 hover:-translate-y-1 transition-transform cursor-default">
                    <span className="text-4xl text-statusBooked bg-black/30 w-16 h-16 rounded-2xl flex items-center justify-center">🚚</span>
                    <div>
                        <h3 className="text-3xl font-bold">{bookedLoads}</h3>
                        <p className="text-xs text-textSecondary uppercase tracking-wider">Dispatched Trucks</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 glass-panel p-6">
                    <h3 className="text-xl font-semibold mb-6 border-b border-glassBorder pb-4">Recent Bookings</h3>
                    <div className="flex flex-col gap-4">
                        {history.length === 0 ? <p className="text-textSecondary italic">No recent activity.</p> :
                            history.map(b => (
                                <div key={b.id} className="flex items-start gap-4 p-4 bg-black/20 rounded-xl hover:bg-black/30 transition-colors">
                                    <div className={`mt-1.5 w-3 h-3 rounded-full shrink-0 shadow-[0_0_8px_rgba(255,255,255,0.3)] ${
                                        b.status === 'ACCEPTED' ? 'bg-statusAccepted' : 
                                        b.status === 'PENDING' ? 'bg-statusPosted' : 'bg-statusCancelled'
                                    }`}></div>
                                    <div>
                                        <p className="text-sm">Transporter <strong className="font-mono text-accentSolid">{b.transporterId}</strong> {b.status === 'PENDING' ? 'proposed' : b.status.toLowerCase()} a rate of <strong className="text-green-400 px-1 bg-green-400/20 rounded">₹{b.proposedRate?.toLocaleString()}</strong></p>
                                        <span className="text-xs text-textSecondary block mt-1">{b.createdDate ? new Date(b.createdDate).toLocaleString() : '—'}</span>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
                
                <div className="glass-panel p-6 flex flex-col items-center">
                    <h3 className="text-xl font-semibold w-full text-left mb-10 border-b border-glassBorder pb-4">Network Health</h3>
                    <div className="flex-grow flex items-center justify-center w-full">
                        <div className="w-[180px] h-[180px] rounded-full border-[10px] border-accentSolid border-t-glassBorder flex flex-col justify-center items-center shadow-[0_0_30px_rgba(0,195,255,0.2)]">
                            <h2 className="text-4xl font-bold">{totalLoads ? Math.round((bookedLoads / totalLoads) * 100) : 0}%</h2>
                            <span className="text-xs text-textSecondary uppercase tracking-widest mt-1">Fulfillment</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
