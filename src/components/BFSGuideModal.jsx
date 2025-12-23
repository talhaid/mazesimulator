import React from 'react';

const BFSGuideModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-stone-900/20 flex items-center justify-center z-50 backdrop-blur-sm p-4">
            <div className="bg-stone-100 border-4 border-stone-300 rounded-3xl shadow-2xl max-w-4xl w-full flex flex-col overflow-hidden animate-fade-in-up">

                {/* Header */}
                <div className="bg-stone-200 p-6 border-b-4 border-stone-300 flex justify-between items-center">
                    <h2 className="text-3xl font-black text-stone-700 uppercase tracking-tight">
                        The Mechanics of BFS
                    </h2>
                    <button onClick={onClose} className="text-stone-400 hover:text-stone-600 text-3xl font-black transition-colors">&times;</button>
                </div>

                {/* Scrollable Content */}
                <div className="p-8 space-y-12 overflow-y-auto max-h-[75vh]">

                    {/* Concept 0: Unweighted Graph */}
                    <section className="flex flex-col md:flex-row gap-8 items-center bg-white p-6 rounded-2xl border border-stone-200 shadow-sm hover:border-orange-200 transition-colors">
                        <div className="flex-1 space-y-4">
                            <h3 className="text-stone-400 text-xs font-black uppercase tracking-widest">1. Unweighted Maze Graph</h3>
                            <p className="text-stone-600 leading-relaxed font-medium">
                                In this maze, <strong className="text-stone-800">every step costs exactly 1</strong>. There are no "muddy" or "slow" spots.
                                Because every move is equal, the first time we discover the target, we represent the
                                <span className="text-amber-600 font-bold"> mathematical shortest path</span>.
                            </p>
                        </div>
                        <div className="flex-1 flex justify-center">
                            {/* Visual: Grid Grid */}
                            <div className="grid grid-cols-3 gap-1 p-2 bg-stone-200 rounded-xl border border-stone-300">
                                {[...Array(9)].map((_, i) => (
                                    <div key={i} className="w-8 h-8 bg-stone-100 flex items-center justify-center text-xs text-stone-400 font-bold border border-stone-300 rounded-md">1</div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Concept 1: Waves */}
                    <section className="flex flex-col md:flex-row-reverse gap-8 items-center">
                        <div className="flex-1 space-y-4">
                            <h3 className="text-stone-400 text-xs font-black uppercase tracking-widest">2. Waves (Level-by-Level)</h3>
                            <p className="text-stone-600 leading-relaxed font-medium">
                                BFS spreads like a ripple in a pond. It explores everything at <strong className="text-stone-800">Distance 1</strong>, then <strong className="text-stone-800">Distance 2</strong>.
                                It never jumps ahead. This ensures we don't miss a shorter path while chasing a long one.
                            </p>
                        </div>
                        <div className="flex-1 flex justify-center items-center h-32 relative">
                            {/* Visual: Ripple Animation */}
                            <div className="absolute w-4 h-4 bg-amber-500 rounded-full animate-ping opacity-75"></div>
                            <div className="absolute w-12 h-12 border-2 border-amber-400 rounded-full animate-[ping_2s_linear_infinite]" style={{ animationDelay: '0.5s' }}></div>
                            <div className="absolute w-24 h-24 border border-amber-300 rounded-full animate-[ping_2s_linear_infinite]" style={{ animationDelay: '1s' }}></div>
                            <div className="relative z-10 w-4 h-4 bg-white rounded-full border-2 border-amber-500"></div>
                        </div>
                    </section>

                    {/* Concept 2: Queue */}
                    <section className="flex flex-col md:flex-row gap-8 items-center bg-white p-6 rounded-2xl border border-stone-200 shadow-sm hover:border-orange-200 transition-colors">
                        <div className="flex-1 space-y-4">
                            <h3 className="text-stone-400 text-xs font-black uppercase tracking-widest">3. The Queue (FIFO)</h3>
                            <p className="text-stone-600 leading-relaxed font-medium">
                                How does it stay organized? It uses a <strong className="text-stone-800">Queue</strong>.
                                <br />
                                <span className="text-xs font-black bg-stone-800 px-2 py-1 rounded text-stone-100 inline-block mt-2">FIRST IN, FIRST OUT</span>
                                <br />
                                New neighbors join the back of the line. We only process the front. This strict order is the secret sauce.
                            </p>
                        </div>
                        <div className="flex-1 flex gap-2 overflow-hidden justify-center mask-image-gradient">
                            {/* Visual: Moving blocks */}
                            <div className="flex gap-2 animate-[slideLeft_2s_linear_infinite]">
                                {[1, 2, 3, 4].map(n => (
                                    <div key={n} className="w-10 h-10 bg-stone-100 border-b-4 border-stone-300 flex items-center justify-center text-stone-600 font-black rounded-lg">
                                        {n}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Concept 3: Parents */}
                    <section className="flex flex-col md:flex-row-reverse gap-8 items-center">
                        <div className="flex-1 space-y-4">
                            <h3 className="text-stone-400 text-xs font-black uppercase tracking-widest">4. Parent Pointers</h3>
                            <p className="text-stone-600 leading-relaxed font-medium">
                                We don't "remember" the whole path while searching. Instead, every node just remembers
                                <strong className="text-stone-800"> "Who found me?"</strong> (Its Parent).
                                <br />
                                When we hit the target, we just backtrack pointer-by-pointer to the start.
                            </p>
                        </div>
                        <div className="flex-1 flex justify-center gap-1">
                            {/* Visual: Linked nodes */}
                            <div className="flex items-center gap-1">
                                <div className="w-8 h-8 rounded-full bg-amber-500 border-2 border-amber-600 flex items-center justify-center text-xs font-bold text-white shadow-sm">S</div>
                                <div className="h-0.5 w-6 bg-stone-300"></div>
                                <div className="w-8 h-8 rounded-full bg-stone-200 border-2 border-stone-300 flex items-center justify-center text-xs font-bold text-stone-600">P</div>
                                <div className="h-0.5 w-6 bg-stone-300"></div>
                                <div className="w-8 h-8 rounded-full bg-rose-400 border-2 border-rose-500 flex items-center justify-center text-xs font-bold text-white shadow-sm">T</div>
                            </div>
                        </div>
                    </section>

                </div>

                {/* Footer */}
                <div className="bg-stone-200 p-6 flex justify-end border-t-4 border-stone-300">
                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-stone-800 text-stone-50 border-b-4 border-stone-950 rounded-xl font-black shadow-lg hover:-translate-y-0.5 active:translate-y-1 active:border-b-0 transition-all uppercase tracking-wide"
                    >
                        I Understand
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BFSGuideModal;
