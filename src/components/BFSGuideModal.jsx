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
                <div className="p-8 space-y-12 overflow-y-auto max-h-[75vh] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">

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
                            <h3 className="text-stone-400 text-xs font-black uppercase tracking-widest">2. Waves (Level Order Traversal)</h3>
                            <p className="text-stone-600 leading-relaxed font-medium">
                                BFS spreads like a ripple in a pond. It explores everything at <strong className="text-stone-800">Distance 1</strong>, then <strong className="text-stone-800">Distance 2</strong>.
                                It never jumps ahead. This ensures we don't miss a shorter path while chasing a long one.
                            </p>
                        </div>
                        <div className="flex-1 flex justify-center items-center h-48 bg-stone-50 rounded-xl border border-stone-200">
                            {/* Visual: Tree Level Animation using SVG */}
                            <svg width="200" height="140" viewBox="0 0 200 140" className="drop-shadow-sm">
                                {/* Connectors (Level 0 to 1) */}
                                <line x1="100" y1="20" x2="60" y2="60" stroke="#d6d3d1" strokeWidth="2" />
                                <line x1="100" y1="20" x2="140" y2="60" stroke="#d6d3d1" strokeWidth="2" />

                                {/* Connectors (Level 1 to 2) */}
                                <line x1="60" y1="60" x2="40" y2="100" stroke="#d6d3d1" strokeWidth="2" />
                                <line x1="60" y1="60" x2="80" y2="100" stroke="#d6d3d1" strokeWidth="2" />
                                <line x1="140" y1="60" x2="120" y2="100" stroke="#d6d3d1" strokeWidth="2" />
                                <line x1="140" y1="60" x2="160" y2="100" stroke="#d6d3d1" strokeWidth="2" />

                                {/* Level 0 Node (Root) */}
                                <circle cx="100" cy="20" r="12" fill="#f59e0b" className="animate-[pulse_3s_infinite]" />
                                <text x="100" y="24" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">0</text>

                                {/* Level 1 Nodes (Dist 1) */}
                                <g className="animate-[pulse_3s_infinite]" style={{ animationDelay: '1s' }}>
                                    <circle cx="60" cy="60" r="10" fill="#fcd34d" />
                                    <text x="60" y="64" textAnchor="middle" fill="#78350f" fontSize="9" fontWeight="bold">1</text>

                                    <circle cx="140" cy="60" r="10" fill="#fcd34d" />
                                    <text x="140" y="64" textAnchor="middle" fill="#78350f" fontSize="9" fontWeight="bold">1</text>
                                </g>

                                {/* Level 2 Nodes (Dist 2) */}
                                <g className="animate-[pulse_3s_infinite]" style={{ animationDelay: '2s' }}>
                                    <circle cx="40" cy="100" r="8" fill="#e7e5e4" />
                                    <circle cx="80" cy="100" r="8" fill="#e7e5e4" />
                                    <circle cx="120" cy="100" r="8" fill="#e7e5e4" />
                                    <circle cx="160" cy="100" r="8" fill="#e7e5e4" />
                                </g>

                                {/* Labels */}
                                <text x="180" y="24" textAnchor="end" fill="#a8a29e" fontSize="8" fontWeight="bold">START</text>
                                <text x="180" y="64" textAnchor="end" fill="#a8a29e" fontSize="8" fontWeight="bold">DIST 1</text>
                                <text x="180" y="104" textAnchor="end" fill="#a8a29e" fontSize="8" fontWeight="bold">DIST 2</text>
                            </svg>
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
                                <div className="w-8 h-8 rounded-full bg-rose-800 border-2 border-rose-900 flex items-center justify-center text-xs font-bold text-white shadow-sm">T</div>
                            </div>
                        </div>
                    </section>

                    {/* Technical Deep Dive Header */}
                    <div className="flex items-center gap-4 py-4">
                        <div className="h-px bg-stone-300 flex-1"></div>
                        <h2 className="text-xl font-black text-stone-400 uppercase tracking-widest">Technical Deep Dive</h2>
                        <div className="h-px bg-stone-300 flex-1"></div>
                    </div>

                    {/* 5A: World Generation */}
                    <section className="bg-stone-50 p-6 rounded-2xl border border-stone-200 hover:border-orange-200 transition-colors">
                        <h3 className="text-stone-500 text-sm font-black uppercase tracking-wide mb-4 flex items-center gap-2">
                            <span className="w-6 h-6 rounded bg-stone-200 flex items-center justify-center text-xs">A</span>
                            The World (Maze Generation)
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <p className="text-stone-600 text-sm leading-relaxed">
                                    We use a <strong className="text-stone-800">Random Walk</strong> to ensure solvability.
                                    First, we scatter random walls (30% density). Then, to prevent impossible mazes, a "drunken walker" stumbles from Start to Target, clearing a guaranteed path.
                                </p>
                            </div>
                            <div className="bg-stone-800 rounded-lg p-3 font-mono text-xs text-stone-300 overflow-x-auto border border-stone-700">
                                <span className="text-purple-400">while</span> (curr != target) {'{'}<br />
                                &nbsp;&nbsp;<span className="text-stone-500">// 1. Randomly move closer</span><br />
                                &nbsp;&nbsp;<span className="text-purple-400">if</span> (Math.<span className="text-blue-300">random</span>() &gt; 0.5) moveRow();<br />
                                &nbsp;&nbsp;<span className="text-purple-400">else</span> moveCol();<br />
                                &nbsp;&nbsp;<span className="text-stone-500">// 2. Carve path (set to 0)</span><br />
                                &nbsp;&nbsp;grid[curr.r][curr.c] = <span className="text-orange-300">0</span>;<br />
                                {'}'}
                            </div>
                        </div>
                    </section>

                    {/* 5B: The Engine (BFS) */}
                    <section className="bg-stone-50 p-6 rounded-2xl border border-stone-200 hover:border-orange-200 transition-colors">
                        <h3 className="text-stone-500 text-sm font-black uppercase tracking-wide mb-4 flex items-center gap-2">
                            <span className="w-6 h-6 rounded bg-stone-200 flex items-center justify-center text-xs">B</span>
                            The Engine (BFS Loop)
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <p className="text-stone-600 text-sm leading-relaxed">
                                    The heart of the algorithm is the <strong className="text-stone-800">Loop</strong>.
                                    We rely on a JavaScript <code className="bg-stone-200 text-stone-700 px-1 rounded">Array</code> acting as a Queue.
                                    <br /><br />
                                    1. <strong>Shift()</strong>: Takes from front (Oldest).<br />
                                    2. <strong>Push()</strong>: Adds to back (Newest).
                                </p>
                            </div>
                            <div className="bg-stone-800 rounded-lg p-3 font-mono text-xs text-stone-300 overflow-x-auto border border-stone-700">
                                <span className="text-purple-400">while</span> (queue.<span className="text-blue-300">length</span> &gt; <span className="text-orange-300">0</span>) {'{'}<br />
                                &nbsp;&nbsp;<span className="text-purple-400">const</span> current = queue.<span className="text-blue-300">shift</span>();<br />
                                &nbsp;&nbsp;<span className="text-purple-400">for</span> (neighbor <span className="text-purple-400">of</span> graph[current]) {'{'}<br />
                                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">if</span> (!visited[neighbor]) {'{'}<br />
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;visited[neighbor] = <span className="text-orange-300">true</span>;<br />
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;queue.<span className="text-blue-300">push</span>(neighbor);<br />
                                &nbsp;&nbsp;&nbsp;&nbsp;{'}'}<br />
                                &nbsp;&nbsp;{'}'}<br />
                                {'}'}
                            </div>
                        </div>
                    </section>

                    {/* 5C: The Memory (Tree Construction) */}
                    <section className="bg-stone-50 p-6 rounded-2xl border border-stone-200 hover:border-orange-200 transition-colors">
                        <h3 className="text-stone-500 text-sm font-black uppercase tracking-wide mb-4 flex items-center gap-2">
                            <span className="w-6 h-6 rounded bg-stone-200 flex items-center justify-center text-xs">C</span>
                            The Memory (Backtracking)
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <p className="text-stone-600 text-sm leading-relaxed">
                                    We don't get the path for free. We must build it.<br />
                                    We use a <strong className="text-stone-800">Parent Map</strong> (Hash Map).
                                    Every time we step on a fresh tile, we note down exactly which tile sent us there.
                                    <br /><br />
                                    <strong>Reconstruction:</strong> Start at Target &rarr; Look up Parent &rarr; Repeat until Start.
                                </p>
                            </div>
                            <div className="bg-stone-800 rounded-lg p-3 font-mono text-xs text-stone-300 overflow-x-auto border border-stone-700">
                                <span className="text-stone-500">// 1. Recording</span><br />
                                parentMap.<span className="text-blue-300">set</span>(neighbor, current);<br /><br />
                                <span className="text-stone-500">// 2. Reconstructing</span><br />
                                <span className="text-purple-400">let</span> path = [];<br />
                                <span className="text-purple-400">let</span> curr = target;<br />
                                <span className="text-purple-400">while</span> (curr != start) {'{'}<br />
                                &nbsp;&nbsp;path.<span className="text-blue-300">push</span>(curr);<br />
                                &nbsp;&nbsp;curr = parentMap.<span className="text-blue-300">get</span>(curr);<br />
                                {'}'}
                            </div>
                        </div>
                    </section>

                    {/* 5D: Simulatneous Execution */}
                    <section className="bg-stone-50 p-6 rounded-2xl border border-stone-200 hover:border-orange-200 transition-colors">
                        <h3 className="text-stone-500 text-sm font-black uppercase tracking-wide mb-4 flex items-center gap-2">
                            <span className="w-6 h-6 rounded bg-stone-200 flex items-center justify-center text-xs">D</span>
                            The Bridge (Simultaneous Execution)
                        </h3>
                        <p className="text-stone-600 text-sm leading-relaxed mb-6">
                            Crucially, we don't scan the maze first and <em>then</em> build the tree.
                            <strong className="text-stone-800"> It happens at the exact same time.</strong>
                            <br />
                            Every single time we "look" at a neighbor on the grid, we immediately "draw" a line in the tree.
                        </p>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Left: Maze Action */}
                            <div className="bg-white p-4 rounded-xl border border-stone-200 flex flex-col items-center text-center gap-3">
                                <span className="text-xs font-black bg-stone-100 text-stone-500 px-2 py-1 rounded uppercase tracking-wider">In The Maze</span>
                                <div className="grid grid-cols-2 gap-1 w-16 h-16">
                                    <div className="bg-amber-500 rounded-sm"></div>
                                    <div className="bg-stone-200 rounded-sm animate-pulse border-2 border-amber-500"></div>
                                    <div className="bg-stone-200 rounded-sm"></div>
                                    <div className="bg-stone-200 rounded-sm"></div>
                                </div>
                                <p className="text-xs text-stone-500 font-bold">
                                    "I see a neighbor to my Right!"
                                </p>
                            </div>

                            {/* Right: Tree Action */}
                            <div className="bg-white p-4 rounded-xl border border-stone-200 flex flex-col items-center text-center gap-3">
                                <span className="text-xs font-black bg-stone-100 text-stone-500 px-2 py-1 rounded uppercase tracking-wider">In The Tree</span>
                                <div className="flex flex-col items-center gap-1 h-16 justify-center">
                                    <div className="w-6 h-6 rounded-full bg-amber-500"></div>
                                    <div className="w-0.5 h-4 bg-stone-300"></div>
                                    <div className="w-6 h-6 rounded-full bg-stone-200 border-2 border-amber-500"></div>
                                </div>
                                <p className="text-xs text-stone-500 font-bold">
                                    "Add child node to current parent."
                                </p>
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
