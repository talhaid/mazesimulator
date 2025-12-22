import React, { useRef, useEffect } from 'react';

const QueuePanel = ({ queue, current }) => {
    const scrollRef = useRef(null);

    // Auto-scroll to end or keep head visible? 
    // Usually in BFS we want to simplify viewing processing. 
    // Let's just keep it simple.

    // Node Style Helper
    const getNodeStyle = (type) => {
        if (type === 'active') return { face: '#F59E0B', shadow: '#B45309', text: '#FFF' }; // Amber
        return { face: '#E7E5E4', shadow: '#A8A29E', text: '#292524' };                     // Stone
    };

    return (
        <div className="w-full h-full flex flex-col">
            <h3 className="text-xs font-black text-stone-400 uppercase tracking-widest mb-1 pl-2">
                FIFO Queue
            </h3>
            <div ref={scrollRef} className="flex-1 flex gap-4 overflow-x-auto overflow-y-hidden items-center px-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">

                {/* Active Node (Popped) */}
                {current && (
                    <div className="flex-shrink-0 flex flex-col items-center opacity-70 grayscale-[30%]">
                        <svg width="48" height="48" viewBox="0 0 48 48" className="drop-shadow-sm">
                            <circle cx="24" cy="28" r="20" fill="#B45309" />
                            <circle cx="24" cy="24" r="20" fill="#F59E0B" />
                            <text x="24" y="24" dy=".3em" textAnchor="middle" fill="#FFF" fontSize="11" fontWeight="900" style={{ fontFamily: 'monospace' }}>
                                {current.r},{current.c}
                            </text>
                        </svg>
                        <span className="text-[10px] text-stone-500 uppercase font-black tracking-wider mt-1">Processing</span>
                    </div>
                )}

                {/* Separator */}
                {current && queue.length > 0 && (
                    <div className="text-stone-300 font-black text-xl">➞</div>
                )}

                {/* Queue Items */}
                {queue.slice(0, 50).map((node, i) => (
                    <div key={`${node.r}-${node.c}`} className="flex-shrink-0 flex flex-col items-center animate-fade-in-right">
                        <svg width="44" height="44" viewBox="0 0 44 44" className="drop-shadow-sm">
                            <circle cx="22" cy="26" r="18" fill="#A8A29E" />
                            <circle cx="22" cy="22" r="18" fill="#E7E5E4" />
                            <text x="22" y="22" dy=".3em" textAnchor="middle" fill="#292524" fontSize="10" fontWeight="900" style={{ fontFamily: 'monospace' }}>
                                {node.r},{node.c}
                            </text>
                        </svg>
                    </div>
                ))}

                {queue.length > 50 && (
                    <div className="text-xs text-stone-400 font-bold italic px-2">
                        +{queue.length - 50} more...
                    </div>
                )}

                {queue.length === 0 && !current && (
                    <span className="text-stone-400 text-sm font-bold italic w-full text-center">QUEUE EMPTY</span>
                )}
            </div>
        </div>
    );
};

export default QueuePanel;
