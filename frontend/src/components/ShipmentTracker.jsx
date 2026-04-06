import React from 'react';

const ShipmentTracker = ({ status }) => {
    const steps = [
        { id: 'POSTED', label: 'Order Posted', icon: '📝' },
        { id: 'BOOKED', label: 'Assigned', icon: '🚚' },
        { id: 'TRANSIT', label: 'In Transit', icon: '🛣️' },
        { id: 'DELIVERED', label: 'Delivered', icon: '✅' }
    ];

    let currentStepIndex = 0;
    
    if (status === 'POSTED' || status === 'PENDING') currentStepIndex = 0;
    else if (status === 'BOOKED' || status === 'ACCEPTED') currentStepIndex = 1;
    else if (status === 'TRANSIT') currentStepIndex = 2;
    else if (status === 'DELIVERED') currentStepIndex = 3;

    if (status === 'CANCELLED' || status === 'REJECTED') {
        return (
            <div className="p-3 flex items-center gap-3 border-l-4 border-statusCancelled bg-black/20 rounded-r-lg mt-4">
                <span className="text-xl">🛑</span>
                <div>
                    <h4 className="font-semibold text-sm">Shipment Cancelled</h4>
                    <p className="text-[0.75rem] text-textSecondary">This order was aborted.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-black/20 rounded-xl p-4 mt-4 border border-white/5">
            <div className="flex justify-between items-center mb-6">
                <h4 className="text-sm font-semibold text-textSecondary uppercase tracking-widest">Live Status Tracker</h4>
                <div className="w-2.5 h-2.5 bg-statusPosted rounded-full animate-pulse"></div>
            </div>
            
            <div className="flex justify-between items-start relative">
                {steps.map((step, index) => {
                    const isActive = index === currentStepIndex;
                    const isCompleted = index < currentStepIndex;
                    
                    return (
                        <div key={step.id} className="flex flex-col items-center relative z-10 flex-1">
                            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm transition-all duration-500
                                ${isActive ? 'bg-bgPrimary border-accentSolid shadow-[0_0_12px_rgba(0,195,255,0.6)] text-white' : 
                                  isCompleted ? 'bg-statusAccepted border-statusAccepted text-white shadow-[0_0_10px_rgba(34,197,94,0.3)]' : 
                                  'bg-bgPrimary border-glassBorder text-textSecondary'}`}>
                                {isCompleted ? '✓' : step.icon}
                            </div>
                            <div className={`mt-2 text-[0.65rem] text-center font-bold tracking-wide uppercase ${isActive ? 'text-accentSolid' : isCompleted ? 'text-textPrimary' : 'text-textSecondary/50'}`}>
                                {step.label}
                            </div>
                            {index < steps.length - 1 && (
                                <div className={`absolute top-4 left-[50%] w-full h-[2px] -z-10 transition-colors duration-500
                                    ${isCompleted ? 'bg-statusAccepted drop-shadow-[0_0_2px_rgba(34,197,94,0.8)]' : 'bg-glassBorder'}`}></div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ShipmentTracker;
