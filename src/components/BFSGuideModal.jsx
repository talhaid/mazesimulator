import React from 'react';

const BFSGuideModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-md p-4">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl max-w-4xl w-full flex flex-col overflow-hidden animate-fade-in-up">

                {/* Header */}
                <div className="bg-gray-800 p-6 border-b border-gray-700 flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                        The Mechanics of BFS
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl font-bold transition-colors">&times;</button>
                </div>

                {/* Scrollable Content */}
                <div className="p-8 space-y-12 overflow-y-auto max-h-[75vh]">

                    {/* Concept 0: Unweighted Graph */}
                    <section className="flex flex-col md:flex-row gap-8 items-center bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
                        <div className="flex-1 space-y-4">
                            <h3 className="text-2xl font-bold text-yellow-400">1. Unweighted Maze Graph</h3>
                            <p className="text-gray-300 leading-relaxed">
                                In this maze, <strong>every step costs exactly 1</strong>. There are no "muddy" or "slow" spots.
                                Because every move is equal, the first time we discover the target, we represent the
                                <span className="text-yellow-300"> mathematical shortest path</span>.
                            </p>
                        </div>
                        <div className="flex-1 flex justify-center">
                            {/* Visual: Grid Grid */}
                            <div className="grid grid-cols-3 gap-1 p-2 bg-gray-900 rounded border border-gray-600">
                                {[...Array(9)].map((_, i) => (
                                    <div key={i} className="w-8 h-8 bg-gray-700 flex items-center justify-center text-xs text-gray-500 border border-gray-600">1</div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Concept 1: Waves */}
                    <section className="flex flex-col md:flex-row-reverse gap-8 items-center">
                        <div className="flex-1 space-y-4">
                            <h3 className="text-2xl font-bold text-blue-400">2. Waves (Level-by-Level)</h3>
                            <p className="text-gray-300 leading-relaxed">
                                BFS spreads like a ripple in a pond. It explores everything at <strong>Distance 1</strong>, then <strong>Distance 2</strong>.
                                It never jumps ahead. This ensures we don't miss a shorter path while chasing a long one.
                            </p>
                        </div>
                        <div className="flex-1 flex justify-center items-center h-32 relative">
                            {/* Visual: Ripple Animation */}
                            <div className="absolute w-4 h-4 bg-blue-500 rounded-full animate-ping opacity-75"></div>
                            <div className="absolute w-12 h-12 border-2 border-blue-400 rounded-full animate-[ping_2s_linear_infinite]" style={{ animationDelay: '0.5s' }}></div>
                            <div className="absolute w-24 h-24 border border-blue-300 rounded-full animate-[ping_2s_linear_infinite]" style={{ animationDelay: '1s' }}></div>
                            <div className="relative z-10 w-4 h-4 bg-white rounded-full"></div>
                        </div>
                    </section>

                    {/* Concept 2: Queue */}
                    <section className="flex flex-col md:flex-row gap-8 items-center bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
                        <div className="flex-1 space-y-4">
                            <h3 className="text-2xl font-bold text-green-400">3. The Queue (FIFO)</h3>
                            <p className="text-gray-300 leading-relaxed">
                                How does it stay organized? It uses a <strong>Queue</strong>.
                                <br />
                                <span className="text-sm font-mono bg-black px-2 py-1 rounded text-green-300">First In, First Out</span>
                                <br />
                                New neighbors join the back of the line. We only process the front. This strict order is the secret sauce.
                            </p>
                        </div>
                        <div className="flex-1 flex gap-2 overflow-hidden justify-center mask-image-gradient">
                            {/* Visual: Moving blocks */}
                            <div className="flex gap-2 animate-[slideLeft_2s_linear_infinite]">
                                {[1, 2, 3, 4].map(n => (
                                    <div key={n} className="w-10 h-10 bg-green-900 border border-green-500 flex items-center justify-center text-green-300 font-bold rounded">
                                        {n}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Concept 3: Parents */}
                    <section className="flex flex-col md:flex-row-reverse gap-8 items-center">
                        <div className="flex-1 space-y-4">
                            <h3 className="text-2xl font-bold text-purple-400">4. Parent Pointers</h3>
                            <p className="text-gray-300 leading-relaxed">
                                We don't "remember" the whole path while searching. Instead, every node just remembers
                                <strong>"Who found me?"</strong> (Its Parent).
                                <br />
                                When we hit the target, we just backtrack pointer-by-pointer to the start.
                            </p>
                        </div>
                        <div className="flex-1 flex justify-center gap-1">
                            {/* Visual: Linked nodes */}
                            <div className="flex items-center gap-1">
                                <div className="w-8 h-8 rounded-full bg-blue-900 border border-blue-500 flex items-center justify-center text-xs">S</div>
                                <div className="h-0.5 w-6 bg-gray-500"></div>
                                <div className="w-8 h-8 rounded-full bg-gray-700 border border-gray-500 flex items-center justify-center text-xs">P</div>
                                <div className="h-0.5 w-6 bg-gray-500"></div>
                                <div className="w-8 h-8 rounded-full bg-purple-900 border border-purple-500 flex items-center justify-center text-xs">T</div>
                            </div>
                        </div>
                    </section>

                </div>

                {/* Footer */}
                <div className="bg-gray-800 p-6 flex justify-end border-t border-gray-700">
                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-lg font-bold shadow-lg transform hover:scale-105 transition-all"
                    >
                        I Understand
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BFSGuideModal;
