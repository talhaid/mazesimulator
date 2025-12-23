import React from 'react';

const StatCard = ({ label, value, colorClass, description }) => (
    <div className="bg-white p-5 rounded-2xl border border-stone-200 flex flex-col hover:border-orange-200 hover:shadow-md transition-all shadow-sm">
        <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-black text-stone-400 uppercase tracking-widest">{label}</span>
            <span className={`text-3xl font-black ${colorClass}`}>{value}</span>
        </div>
        <p className="text-xs text-stone-500 leading-relaxed mt-auto border-t border-stone-100 pt-2 font-medium">
            {description}
        </p>
    </div>
);

const SearchStatsModal = ({ isOpen, onClose, state }) => {
    if (!isOpen) return null;

    const { finished, found, shortestPath, visited, treeEdges } = state;

    // Calculate Stats
    const visitedCount = visited.flat().filter(Boolean).length;
    const pathLength = shortestPath.length > 0 ? shortestPath.length - 1 : 0;
    const algorithmStatus = finished ? (found ? "TARGET FOUND" : "TARGET UNREACHABLE") : "IN PROGRESS...";

    return (
        <div className="fixed inset-0 bg-stone-900/20 flex items-center justify-center z-50 backdrop-blur-sm p-4">
            <div className="bg-stone-100 border-4 border-stone-300 rounded-3xl shadow-2xl max-w-6xl w-full overflow-hidden animate-fade-in-up flex flex-col max-h-[95vh]">

                {/* Header */}
                <div className="bg-stone-200 p-6 border-b-4 border-stone-300 flex justify-between items-center shrink-0">
                    <div>
                        <h2 className="text-3xl font-black text-stone-700 uppercase tracking-tight">Search Analysis</h2>
                        <p className="text-sm text-stone-500 font-bold">Deep dive into algorithm performance</p>
                    </div>
                    <button onClick={onClose} className="text-stone-400 hover:text-stone-600 text-3xl font-black transition-colors">&times;</button>
                </div>

                {/* Scrollable Content */}
                <div className="p-8 space-y-8 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">

                    {/* Unified Status Section */}
                    {found ? (
                        <div className="bg-orange-50 p-6 rounded-2xl border-2 border-orange-100 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm">
                            <div>
                                <span className="text-orange-600 font-black text-2xl mb-1 block uppercase tracking-tight">Optimal Solution Found</span>
                                <p className="text-sm text-stone-500 font-bold max-w-md">
                                    BFS guarantees the shortest path in unweighted graphs.
                                </p>
                            </div>
                            <div className="text-right">
                                <span className="text-xs text-stone-400 uppercase font-black tracking-wider">Shortest Path</span>
                                <div className="text-5xl font-mono text-orange-500 font-black">{pathLength}</div>
                            </div>
                        </div>
                    ) : finished ? (
                        <div className="bg-stone-200 p-6 rounded-2xl border-2 border-stone-300 text-center shadow-sm">
                            <span className="text-stone-500 font-black text-2xl uppercase tracking-tight">Target Unreachable</span>
                            <p className="text-sm text-stone-400 font-bold mt-1">
                                The target cannot be reached from the start node.
                            </p>
                        </div>
                    ) : (
                        <div className="bg-stone-100 p-6 rounded-2xl border-2 border-stone-200 text-center shadow-sm animate-pulse">
                            <span className="text-stone-400 font-black text-2xl uppercase tracking-tight">Simulation Running...</span>
                        </div>
                    )}

                    {/* Section 1: Algorithmic Efficiency */}
                    <section>
                        <h3 className="text-stone-400 text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2 pl-1">
                            <span className="w-2 h-2 rounded-full bg-stone-400"></span>
                            Algorithmic Complexity (Work)
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <StatCard
                                label="Total Steps"
                                value={state.steps || 0}
                                colorClass="text-stone-700"
                                description="The total number of operations (iterations) the algorithm performed. This represents the Time Complexity."
                            />
                            <StatCard
                                label="Max Queue Size"
                                value={state.maxQueueSize || 0}
                                colorClass="text-stone-700"
                                description="The peak number of nodes waiting in memory at once. This indicates the Space Complexity (RAM usage)."
                            />
                            <StatCard
                                label="Max Depth"
                                value={state.maxDepth || 0}
                                colorClass="text-stone-700"
                                description="The furthest distance 'layer' explored from the start. BFS explores all nodes at depth X before X+1."
                            />
                        </div>
                    </section>

                    {/* Section 2: Search Outcome */}
                    <section>
                        <h3 className="text-stone-400 text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2 pl-1">
                            <span className="w-2 h-2 rounded-full bg-stone-400"></span>
                            Result Metrics (Outcome)
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <StatCard
                                label="Nodes Visited"
                                value={visitedCount}
                                colorClass="text-stone-700"
                                description="The total area covered on the map. In BFS, this is proportional to the area of a circle with radius = Depth."
                            />
                            <StatCard
                                label="Tree Nodes"
                                value={treeEdges.length + 1}
                                colorClass="text-stone-700"
                                description="The size of the 'Parent Pointer' map. Every visited node is part of this tree, allowing us to backtrack."
                            />
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
};

export default SearchStatsModal;
