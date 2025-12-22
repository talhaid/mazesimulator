import React from 'react';

const MazePanel = ({ grid, visited, current, path, parentMap, playbackNode }) => {
    // Grid colors
    const getCellColor = (r, c, value) => {
        // 0: free, 1: wall, 2: start, 3: target
        if (value === 1) return 'bg-black';
        if (value === 2) return 'bg-green-500';
        if (value === 3) return 'bg-red-500';

        // Playback Character
        if (playbackNode && playbackNode.r === r && playbackNode.c === c) {
            return 'bg-purple-600 border-4 border-white shadow-xl scale-110 z-20 rounded-full';
        }

        // Visualization Overlays
        // Path (final)
        const isPath = path.some(p => p.r === r && p.c === c);
        if (isPath && value !== 2 && value !== 3) return 'bg-blue-500 scale-90 rounded-sm';

        // Current Node (Processing BFS)
        if (current && current.r === r && current.c === c && value !== 2 && value !== 3) return 'bg-yellow-400 scale-110 shadow-lg z-10';

        // Visited
        if (visited[r][c] && value !== 2 && value !== 3) return 'bg-blue-200';

        return 'bg-white border-gray-200';
    };

    return (
        <div className="flex flex-col items-center justify-center w-full h-full">
            <div
                className="grid gap-1 bg-gray-700 p-2 rounded-lg shadow-2xl border border-gray-600"
                style={{
                    gridTemplateColumns: `repeat(${grid[0].length}, minmax(0, 1fr))`
                }}
            >
                {grid.map((row, r) => (
                    row.map((cell, c) => (
                        <div
                            key={`${r}-${c}`}
                            className={`w-8 h-8 flex items-center justify-center transition-all duration-300 border ${getCellColor(r, c, cell)}`}
                        >
                            <span className="text-[10px] text-gray-500 opacity-0 hover:opacity-100 cursor-default">
                                {r},{c}
                            </span>
                        </div>
                    ))
                ))}
            </div>
        </div>
    );
};

export default MazePanel;
