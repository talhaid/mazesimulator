import React from 'react';

const ExplanationModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm p-4">
            <div className="bg-gray-800 border border-gray-600 rounded-xl shadow-2xl max-w-2xl w-full flex flex-col overflow-hidden animate-fade-in-up">

                {/* Header */}
                <div className="bg-gray-900 p-4 border-b border-gray-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-blue-400">⚡ How BFS Works</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl font-bold">&times;</button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6 text-gray-300 overflow-y-auto max-h-[70vh]">

                    {/* Concept 1 */}
                    <section className="flex gap-4">
                        <div className="text-3xl">🌊</div>
                        <div>
                            <h3 className="text-lg font-bold text-white mb-1">1. waves of Exploration</h3>
                            <p className="text-sm">
                                BFS spreads out like water directly from the start. It visits every cell at <strong>Distance 1</strong>,
                                then <strong>Distance 2</strong>, and so on. This "Level-by-Level" strategy we visualized in the Tree Panel
                                guarantees the shortest path in a maze.
                            </p>
                        </div>
                    </section>

                    {/* Concept 2 */}
                    <section className="flex gap-4">
                        <div className="text-3xl">🚶</div>
                        <div>
                            <h3 className="text-lg font-bold text-white mb-1">2. The Queue (FIFO)</h3>
                            <p className="text-sm">
                                The algorithm uses a <strong>Queue</strong> (First-In, First-Out).
                                Ideally, it puts neighbors in a line. The first ones discovered are the first ones explored.
                                This prevents "jumping ahead" and ensures the tree grows evenly.
                            </p>
                        </div>
                    </section>

                    {/* Concept 3 */}
                    <section className="flex gap-4">
                        <div className="text-3xl">🔗</div>
                        <div>
                            <h3 className="text-lg font-bold text-white mb-1">3. Parent Tracking</h3>
                            <p className="text-sm">
                                Did you see the connections in the Tree? Each processed node remembers its <strong>Parent</strong>
                                (the node that discovered it). When we hit the target, we simply walk backwards
                                (Target → Parent → Parent... → Start) to reconstruct the blue path!
                            </p>
                        </div>
                    </section>

                </div>

                {/* Footer */}
                <div className="bg-gray-900 p-4 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold transition-colors"
                    >
                        Got it!
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExplanationModal;
