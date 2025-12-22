import React from 'react';

const StatCard = ({ label, value, colorClass, description }) => (
    <div className="bg-gray-700/40 p-5 rounded-xl border border-gray-600 flex flex-col hover:bg-gray-700/60 transition-colors">
        <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</span>
            <span className={`text-3xl font-bold ${colorClass}`}>{value}</span>
        </div>
        <p className="text-xs text-gray-400 leading-relaxed mt-auto border-t border-gray-600/50 pt-2">
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
    const algorithmStatus = finished ? (found ? "Target Found" : "Target Unreachable") : "In Progress...";

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-md p-4">
            <div className="bg-gray-800 border border-gray-600 rounded-2xl shadow-2xl max-w-6xl w-full overflow-hidden animate-fade-in-up flex flex-col max-h-[95vh]">

                {/* Header */}
                <div className="bg-gray-900 p-6 border-b border-gray-700 flex justify-between items-center shrink-0">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Search Analysis</h2>
                        <p className="text-sm text-gray-400">Deep dive into algorithm performance</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl font-bold transition-colors">&times;</button>
                </div>

                {/* Scrollable Content */}
                <div className="p-8 space-y-8 overflow-y-auto">

                    {/* Status Banner */}
                    <div className={`p-6 rounded-xl text-center font-bold text-2xl shadow-lg ${found ? 'bg-gradient-to-r from-green-900/50 to-green-800/30 text-green-400 border border-green-500/30' : 'bg-gray-700 text-gray-300'}`}>
                        {algorithmStatus}
                    </div>

                    {/* Section 1: Algorithmic Efficiency */}
                    <section>
                        <h3 className="text-blue-400 text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                            Algorithmic Complexity (Work)
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <StatCard
                                label="Total Steps"
                                value={state.steps || 0}
                                colorClass="text-white"
                                description="The total number of operations (iterations) the algorithm performed. This represents the Time Complexity."
                            />
                            <StatCard
                                label="Max Queue Size"
                                value={state.maxQueueSize || 0}
                                colorClass="text-orange-400"
                                description="The peak number of nodes waiting in memory at once. This indicates the Space Complexity (RAM usage)."
                            />
                            <StatCard
                                label="Max Depth"
                                value={state.maxDepth || 0}
                                colorClass="text-pink-400"
                                description="The furthest distance 'layer' explored from the start. BFS explores all nodes at depth X before X+1."
                            />
                        </div>
                    </section>

                    {/* Section 2: Search Outcome */}
                    <section>
                        <h3 className="text-purple-400 text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                            Result Metrics (Outcome)
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <StatCard
                                label="Nodes Visited"
                                value={visitedCount}
                                colorClass="text-blue-400"
                                description="The total area covered on the map. In BFS, this is proportional to the area of a circle with radius = Depth."
                            />
                            <StatCard
                                label="Tree Nodes"
                                value={treeEdges.length + 1}
                                colorClass="text-purple-400"
                                description="The size of the 'Parent Pointer' map. Every visited node is part of this tree, allowing us to backtrack."
                            />
                        </div>
                    </section>

                    {/* Path Result */}
                    {found && (
                        <div className="bg-gray-700/20 p-6 rounded-xl border border-gray-600/50 flex flex-col md:flex-row justify-between items-center gap-4">
                            <div>
                                <span className="text-yellow-500 font-bold text-lg mb-1 block">Optimal Solution Found</span>
                                <p className="text-sm text-gray-400 max-w-md">
                                    Because this graph is unweighted (every step costs 1), BFS guarantees that no path exists shorter than this distance.
                                </p>
                            </div>
                            <div className="text-right">
                                <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Shortest Path</span>
                                <div className="text-4xl font-mono text-yellow-500 font-bold">{pathLength}</div>
                            </div>
                        </div>
                    )}

                    {!finished && (
                        <p className="text-center text-sm text-yellow-500/80 italic animate-pulse">
                            Simulation is still running...
                        </p>
                    )}

                </div>
            </div>
        </div>
    );
};

export default SearchStatsModal;
