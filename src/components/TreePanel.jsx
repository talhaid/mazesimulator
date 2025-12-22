import React, { useMemo, useEffect, useRef, useState } from 'react';

const TreePanel = ({ treeEdges, current, path, startNode, finished }) => {
    const containerRef = useRef(null);
    const [zoom, setZoom] = useState(1);
    const [panY, setPanY] = useState(20); // Only track Y offset

    const layout = useMemo(() => {
        // If no start node, return empty
        if (!startNode) return { nodes: [], links: [], levels: new Map(), width: 100, height: 100, nodeMap: new Map() };

        const levels = new Map();
        const nodes = new Map();

        // Add root
        const rootId = `${startNode.r},${startNode.c}`;
        nodes.set(rootId, { id: rootId, depth: 0, r: startNode.r, c: startNode.c });
        levels.set(0, [rootId]);

        // Process edges
        treeEdges.forEach(edge => {
            const childId = `${edge.to.r},${edge.to.c}`;
            if (!nodes.has(childId)) {
                nodes.set(childId, {
                    id: childId,
                    depth: edge.depth,
                    r: edge.to.r,
                    c: edge.to.c,
                    parentId: `${edge.from.r},${edge.from.c}`
                });
                if (!levels.has(edge.depth)) levels.set(edge.depth, []);
                levels.get(edge.depth).push(childId);
            }
        });

        // Calculate dynamic dimensions
        let maxNodesInLevel = 0;
        levels.forEach(ids => {
            if (ids.length > maxNodesInLevel) maxNodesInLevel = ids.length;
        });

        const minSpacing = 50; // slightly wider for better look
        const padding = 50;
        // Remove the hardcoded 600 min-width to allow true centering of small trees
        const neededWidth = Math.max(200, maxNodesInLevel * minSpacing + padding * 2);

        // Position nodes
        levels.forEach((nodeIds, depth) => {
            const count = nodeIds.length;
            // Distribute nodes evenly across the neededWidth
            const step = neededWidth / (count + 1);

            nodeIds.forEach((id, index) => {
                const node = nodes.get(id);
                node.x = step * (index + 1);
                node.y = depth * 80 + 50;
            });
        });

        const links = [];
        nodes.forEach(node => {
            if (node.parentId && nodes.has(node.parentId)) {
                const parent = nodes.get(node.parentId);
                links.push({
                    x1: parent.x,
                    y1: parent.y,
                    x2: node.x,
                    y2: node.y,
                    id: `${parent.id}-${node.id}`
                });
            }
        });

        const maxDepth = Math.max(...Array.from(levels.keys()));
        const neededHeight = Math.max(500, (maxDepth + 1) * 80 + 50);

        return { nodes: Array.from(nodes.values()), links, levels, width: neededWidth, height: neededHeight, nodeMap: nodes };
    }, [treeEdges, startNode]);

    // View Update Logic (Vertical Only)
    useEffect(() => {
        if (!containerRef.current) return;
        const container = containerRef.current;
        const cHeight = container.clientHeight;

        if (finished) {
            // Auto-Zoom to fit (calculated based on ratios)
            // Center horizontally is handled by CSS, we just need scale
            const wRatio = container.clientWidth / layout.width;
            const hRatio = cHeight / layout.height;
            const newZoom = Math.min(1, Math.min(wRatio, hRatio) * 0.9);

            setZoom(newZoom);
            setPanY(20); // Reset to top with padding
        } else {
            // Searching: Zoom 1, Follow Current Node Y
            setZoom(1);

            if (current) {
                const nodeId = `${current.r},${current.c}`;
                const node = layout.nodeMap.get(nodeId);
                if (node) {
                    // Try to keep the current node at the vertical center of the screen
                    setPanY(cHeight / 2 - node.y);
                } else {
                    setPanY(20);
                }
            } else {
                setPanY(20);
            }
        }
    }, [finished, current, layout, containerRef.current?.clientHeight, containerRef.current?.clientWidth]);

    const isPathNode = (node) => path.some(p => p.r === node.r && p.c === node.c);
    const isCurrentNode = (node) => current && current.r === node.r && current.c === node.c;

    return (
        // Flex row + justify-center handles Horizontal Centering automatically!
        <div ref={containerRef} className="flex justify-center w-full h-full overflow-hidden bg-gray-800 rounded-lg p-0 relative">
            {/* Minimal Overlay Title */}
            <h2 className="absolute top-4 left-0 w-full text-center text-gray-500/50 text-xs font-bold z-10 pointer-events-none uppercase tracking-[0.2em]">
                BFS Tree Live
            </h2>

            <div
                className="will-change-transform"
                style={{
                    width: layout.width,
                    height: layout.height,
                    // Use CSS alignment for X, Transform for Y and Scale
                    transformOrigin: 'top center',
                    transform: `translate3d(0, ${panY}px, 0) scale(${zoom})`,
                    transition: 'transform 500ms cubic-bezier(0.2, 0.8, 0.2, 1)'
                }}
            >
                <svg width={layout.width} height={layout.height}>
                    {/* Links */}
                    {layout.links.map(link => (
                        <line
                            key={link.id}
                            x1={link.x1} y1={link.y1}
                            x2={link.x2} y2={link.y2}
                            stroke="#4B5563"
                            strokeWidth="1.5"
                        />
                    ))}

                    {/* Nodes */}
                    {layout.nodes.map(node => (
                        <g key={node.id}>
                            <circle
                                cx={node.x} cy={node.y} r="14"
                                fill={isCurrentNode(node) ? '#FBBF24' : (isPathNode(node) ? '#3B82F6' : '#E5E7EB')}
                                stroke={isPathNode(node) ? 'white' : '#9CA3AF'}
                                strokeWidth={isPathNode(node) ? 2 : 1}
                            />
                            <text
                                x={node.x} y={node.y}
                                dy=".3em" textAnchor="middle"
                                fill="black" fontSize="9" fontWeight="bold"
                            >
                                {node.r},{node.c}
                            </text>
                        </g>
                    ))}
                </svg>
            </div>
        </div>
    );
};

export default TreePanel;
