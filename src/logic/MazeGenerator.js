export const generateRandomMaze = (rows, cols, wallProb = 0.3) => {
    // 0: free, 1: wall, 2: start, 3: target
    const grid = [];

    // 1. Initialize with random walls
    for (let r = 0; r < rows; r++) {
        const row = [];
        for (let c = 0; c < cols; c++) {
            // Edges are walls
            if (r === 0 || r === rows - 1 || c === 0 || c === cols - 1) {
                row.push(1);
            } else {
                row.push(Math.random() < wallProb ? 1 : 0);
            }
        }
        grid.push(row);
    }

    // 2. Place Start (Top-Left area but not corner wall)
    const start = { r: 1, c: 1 };
    grid[start.r][start.c] = 2;

    // 3. Place Target (Bottom-Right area)
    const target = { r: rows - 2, c: cols - 2 };
    grid[target.r][target.c] = 3;

    // 4. Ensure path exists? 
    // For educational purpose, basic random might block. 
    // We can just trust random or use a simplistic DFS/BFS to ensure connection.
    // Let's rely on simple random for now and if user complains, we improve.
    // Actually, let's carve a guaranteed simple path just in case to avoid frustration.
    // Simple "L" shape clear or random walk clearing.

    // Let's do a simple random walk from start to target to clear a path
    let curr = { ...start };
    while (curr.r !== target.r || curr.c !== target.c) {
        grid[curr.r][curr.c] = (grid[curr.r][curr.c] === 2) ? 2 : 0;

        // Move towards target roughly
        if (Math.random() > 0.5) {
            // Move Row
            if (curr.r < target.r) curr.r++;
            else if (curr.r > target.r) curr.r--;
        } else {
            // Move Col
            if (curr.c < target.c) curr.c++;
            else if (curr.c > target.c) curr.c--;
        }
    }
    grid[target.r][target.c] = 3; // Ensure target is there

    return grid;
};
