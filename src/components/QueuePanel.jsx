import React, { useRef, useEffect } from 'react';

const QueuePanel = ({ queue, current }) => {
    const scrollRef = useRef(null);

    // Auto-scroll to end or keep head visible? 
    // Usually in BFS we want to simplify viewing processing. 
    // Let's just keep it simple.

    return (
        <div className="w-full h-full flex flex-col">
            <h3 className="text-xs font-black text-stone-400 uppercase tracking-widest mb-2">
                FIFO Queue
            </h3>
            <div ref={scrollRef} className="flex-1 flex gap-2 overflow-x-auto overflow-y-hidden items-center px-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                {/* Current (Processing) Node - Visualized as just popped */}
                {current && (
                    <div className="flex-shrink-0 flex flex-col items-center opacity-50 grayscale">
                        <div className="w-8 h-8 rounded-full border-2 border-yellow-500 bg-yellow-900/50 flex items-center justify-center text-xs font-bold tracking-tight text-yellow-500 mb-1">
                            {current.r},{current.c}
                        </div>
                        <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Active</span>
                    </div>
                )}

                {/* Separator */}
                {current && queue.length > 0 && <div className="text-gray-400 font-bold">➞</div>}

                {/* Queue Items */}
                {queue.slice(0, 50).map((node, i) => ( // limit rendering for perf
                    <div key={`${node.r}-${node.c}`} className="flex-shrink-0 flex flex-col items-center animate-fade-in-right">
                        <div className="w-8 h-8 rounded-full border border-blue-500/50 bg-white flex items-center justify-center text-xs font-bold tracking-tight text-blue-500 shadow-sm">
                            {node.r},{node.c}
                        </div>
                    </div>
                ))}

                {queue.length > 50 && (
                    <div className="text-xs text-gray-500 italic px-2">
                        +{queue.length - 50} more...
                    </div>
                )}

                {queue.length === 0 && !current && (
                    <span className="text-gray-600 text-sm italic w-full text-center">Empty</span>
                )}
            </div>
        </div>
    );
};

export default QueuePanel;
