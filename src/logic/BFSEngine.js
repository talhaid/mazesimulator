export class BFSEngine {
    constructor(grid) {
        // grid is 2D array: 0 = free, 1 = wall, 2 = start, 3 = target
        this.grid = grid;
        this.rows = grid.length;
        this.cols = grid[0].length;
        this.start = this.findNode(2);
        this.target = this.findNode(3);

        this.queue = [];
        this.visited = Array(this.rows).fill().map(() => Array(this.cols).fill(false));
        this.parentMap = new Map(); // Key: "r,c", Value: {r, c}
        this.treeEdges = []; // Array of {from: {r,c}, to: {r,c}, depth}

        // Search State
        this.current = null;
        this.found = false;
        this.finished = false;
        this.depths = new Map(); // Key: "r,c", Value: depth

        // Initialize
        if (this.start) {
            this.queue.push(this.start);
            this.visited[this.start.r][this.start.c] = true;
            this.depths.set(`${this.start.r},${this.start.c}`, 0);
        }
    }

    findNode(value) {
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (this.grid[r][c] === value) return { r, c };
            }
        }
        return null;
    }

    step() {
        if (this.finished || this.queue.length === 0) {
            this.finished = true;
            return false; // No more steps
        }

        // Dequeue
        const current = this.queue.shift();
        this.current = current;

        // Check target
        if (current.r === this.target.r && current.c === this.target.c) {
            this.found = true;
            this.finished = true;
            return true;
        }

        // Neighbors (Up, Right, Down, Left)
        const dr = [-1, 0, 1, 0];
        const dc = [0, 1, 0, -1];

        for (let i = 0; i < 4; i++) {
            const nr = current.r + dr[i];
            const nc = current.c + dc[i];

            if (this.isValid(nr, nc) && !this.visited[nr][nc]) {
                this.visited[nr][nc] = true;
                this.queue.push({ r: nr, c: nc });

                // Track Parent
                this.parentMap.set(`${nr},${nc}`, current);

                // Track Depth
                const currentDepth = this.depths.get(`${current.r},${current.c}`);
                this.depths.set(`${nr},${nc}`, currentDepth + 1);

                // Track Tree Edge
                this.treeEdges.push({
                    from: current,
                    to: { r: nr, c: nc },
                    depth: currentDepth + 1
                });
            }
        }

        return true; // Step executed
    }

    isValid(r, c) {
        return (
            r >= 0 && r < this.rows &&
            c >= 0 && c < this.cols &&
            this.grid[r][c] !== 1 // Not a wall
        );
    }

    getShortestPath() {
        if (!this.found) return [];

        const path = [];
        let curr = this.target;
        while (curr) {
            path.push(curr);
            const key = `${curr.r},${curr.c}`;
            if (curr.r === this.start.r && curr.c === this.start.c) break;
            curr = this.parentMap.get(key);
        }
        return path.reverse();
    }

    getState() {
        return {
            grid: this.grid,
            visited: this.visited.map(row => [...row]), // Deep copy
            current: this.current,
            queue: [...this.queue],
            treeEdges: [...this.treeEdges],
            found: this.found,
            finished: this.finished,
            shortestPath: this.finished && this.found ? this.getShortestPath() : []
        };
    }
}
