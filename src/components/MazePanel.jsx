import React from 'react';

const MazePanel = ({ grid, visited, current, path, parentMap, playbackNode, depths, maxDepth }) => {
    // Color interpolation helper
    const interpolateColor = (color1, color2, factor) => {
        const result = color1.slice();
        for (let i = 0; i < 3; i++) {
            result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
        }
        return `rgb(${result[0]}, ${result[1]}, ${result[2]})`;
    };

    // Grid colors
    const getCellColor = (r, c, value) => {
        // 0: free, 1: wall, 2: start, 3: target
        if (value === 1) return { className: 'bg-stone-800 shadow-sm rounded-sm scale-95', style: {} }; // Dark Block Obstacle
        if (value === 2) return { className: 'bg-amber-500 rounded-md shadow-sm scale-90', style: {} }; // Sentinel Node (Dark Yellow)
        if (value === 3) return { className: 'bg-rose-400 rounded-md shadow-sm scale-90', style: {} }; // Target Node

        // Playback Character
        if (playbackNode && playbackNode.r === r && playbackNode.c === c) {
            return { className: 'bg-amber-500 border-4 border-white shadow-xl z-20 rounded-full scale-110', style: {} };
        }

        // Visualization Overlays
        // Path (final)
        const isPath = path.some(p => p.r === r && p.c === c);
        if (isPath && value !== 2 && value !== 3) return { className: 'bg-orange-400 rounded-sm shadow-inner', style: {} };

        // Current Node (Processing BFS)
        if (current && current.r === r && current.c === c && value !== 2 && value !== 3) return { className: 'bg-transparent z-10 scale-125', style: {} };

        // Visited
        if (visited[r][c] && value !== 2 && value !== 3) {
            // Calculate depth-based color
            let style = {};
            if (depths) {
                // BUG FIX: depths is a Map, use .get()
                // If the map doesn't have the key, default to 0
                const depth = depths.get(`${r},${c}`) || 0;

                const safeMax = maxDepth || 1;
                const ratio = Math.min(1, Math.max(0, depth / safeMax));

                // Clear Gradient: Amber-100 (Light) to Amber-900 (Dark)
                const startColor = [254, 243, 199]; // Amber-100
                const endColor = [120, 53, 15];     // Amber-900

                style = { backgroundColor: interpolateColor(startColor, endColor, ratio) };
            } else {
                return { className: 'bg-amber-200', style: {} }; // Fallback
            }
            return { className: 'shadow-sm', style };
        }

        return { className: 'bg-stone-100', style: {} }; // Default Floor
    };

    return (
        <div className="flex flex-col items-center justify-center w-full h-full">
            <div
                className="grid p-4 rounded-2xl bg-stone-300 border-b-8 border-r-8 border-stone-400 shadow-xl"
                style={{
                    gridTemplateColumns: `repeat(${grid[0].length}, 32px)`,
                    gap: '2px' // Explicit gap to separate tiles
                }}
            >
                {grid.map((row, r) => (
                    row.map((cell, c) => {
                        const { className, style } = getCellColor(r, c, cell);
                        return (
                            <div
                                key={`${r}-${c}`}
                                className={`w-8 h-8 flex items-center justify-center transition-all duration-300 ${className}`}
                                style={style}
                            >
                                {current && current.r === r && current.c === c && cell !== 2 && cell !== 3 && (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 text-amber-800 drop-shadow-md animate-pulse">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m9-9H3m9-9a9 9 0 110 18 9 9 0 010-18z" />
                                    </svg>
                                )}
                                <span className="text-[10px] text-gray-500 opacity-0 hover:opacity-100 cursor-default absolute">
                                    {r},{c}
                                </span>
                            </div>
                        );
                    })
                ))}
            </div>
        </div >
    );
};

export default MazePanel;
