import React from 'react';

const MazePanel = ({ grid, visited, current, path, parentMap, playbackNode }) => {
    // Grid colors
    const getCellColor = (r, c, value) => {
        // 0: free, 1: wall, 2: start, 3: target
        if (value === 1) return 'bg-stone-800 shadow-sm rounded-sm scale-95'; // Dark Block Obstacle
        if (value === 2) return 'bg-amber-500 rounded-md shadow-sm scale-90'; // Sentinel Node (Dark Yellow)
        if (value === 3) return 'bg-rose-400 rounded-md shadow-sm scale-90'; // Target Node

        // Playback Character
        if (playbackNode && playbackNode.r === r && playbackNode.c === c) {
            return 'bg-amber-500 border-4 border-white shadow-xl z-20 rounded-full scale-110';
        }

        // Visualization Overlays
        // Path (final)
        const isPath = path.some(p => p.r === r && p.c === c);
        if (isPath && value !== 2 && value !== 3) return 'bg-orange-400 rounded-sm shadow-inner';

        // Current Node (Processing BFS)
        if (current && current.r === r && current.c === c && value !== 2 && value !== 3) return 'bg-transparent z-10 scale-125';

        // Visited
        if (visited[r][c] && value !== 2 && value !== 3) return 'bg-amber-200'; // Visited floor (Light Amber trail)

        return 'bg-stone-100'; // Default Floor
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
                    row.map((cell, c) => (
                        <div
                            key={`${r}-${c}`}
                            className={`w-8 h-8 flex items-center justify-center transition-all duration-300 ${getCellColor(r, c, cell)}`}
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
                    ))
                ))}
            </div>
        </div >
    );
};

export default MazePanel;
