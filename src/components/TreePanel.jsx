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

        const minSpacing = 70; // Increased for bigger nodes
        const padding = 60;
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
                node.y = depth * 100 + 60; // Increased vertical spacing
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
        const neededHeight = Math.max(500, (maxDepth + 1) * 100 + 60);

        return {
            nodes: Array.from(nodes.values()),
            links,
            levels,
            width: neededWidth,
            height: neededHeight,
            nodeMap: nodes,
            maxDepth,
            maxBreadth: maxNodesInLevel
        };
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

    // Helper for Node Colors
    const getNodeStyle = (node) => {
        if (isCurrentNode(node)) return { face: '#F59E0B', shadow: '#B45309', text: '#FFF' }; // Amber-500 / Amber-700
        if (isPathNode(node)) return { face: '#FB923C', shadow: '#C2410C', text: '#FFF' };    // Orange-400 / Orange-700
        return { face: '#E7E5E4', shadow: '#A8A29E', text: '#292524' };                       // Stone-200 / Stone-400
    };

    // If we have no tree, just show placeholder
    if (layout.nodes.length === 0) {
        return <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold text-lg">WAITING FOR SEARCH...</div>;
    }

    // Dynamic Height based on depth
    // We want it to be scrollable if it gets tall
    const LEVEL_HEIGHT = 100;
    const NODE_WIDTH = 80;
    const canvasHeight = Math.max(800, (layout.maxDepth + 2) * LEVEL_HEIGHT);
    const canvasWidth = Math.max(1200, (layout.maxBreadth + 2) * NODE_WIDTH);

    return (
        <div ref={containerRef} className="w-full h-full overflow-visible flex justify-center p-0 relative">
            <div
                className="will-change-transform"
                style={{
                    // width: layout.width, // Removed as SVG will define its own width
                    // height: layout.height, // Removed as SVG will define its own height
                    // Use CSS alignment for X, Transform for Y and Scale
                    transformOrigin: 'top center',
                    transform: `translate3d(0, ${panY}px, 0) scale(${zoom})`,
                    transition: 'transform 500ms cubic-bezier(0.2, 0.8, 0.2, 1)'
                }}
            >
                <svg
                    width={canvasWidth}
                    height={canvasHeight}
                    className="block"
                    style={{ minWidth: '100%', minHeight: '100%' }}
                >
                    <defs>
                        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                            <feDropShadow dx="2" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.1" />
                        </filter>
                    </defs>
                    <g transform={`translate(${canvasWidth / 2 - layout.width / 2}, 40)`}>
                        {/* Links */}
                        {layout.links.map(link => (
                            <line
                                key={link.id}
                                x1={link.x1} y1={link.y1}
                                x2={link.x2} y2={link.y2}
                                stroke="#A8A29E"
                                strokeWidth="3"
                                strokeLinecap="round"
                            />
                        ))}

                        {/* Nodes */}
                        {layout.nodes.map(node => {
                            const style = getNodeStyle(node);
                            return (
                                <g key={node.id}>
                                    {/* 3D Bottom/Shadow Layer */}
                                    <circle
                                        cx={node.x} cy={node.y + 4} r="22"
                                        fill={style.shadow}
                                    />
                                    {/* Top Face Layer */}
                                    <circle
                                        cx={node.x} cy={node.y} r="22"
                                        fill={style.face}
                                    />
                                    {/* Text */}
                                    <text
                                        x={node.x} y={node.y}
                                        dy=".3em" textAnchor="middle"
                                        fill={style.text}
                                        fontSize="12"
                                        fontWeight="900"
                                        style={{ fontFamily: 'monospace' }}
                                    >
                                        {node.r},{node.c}
                                    </text>
                                </g>
                            );
                        })}
                    </g>
                </svg>
            </div>
        </div>
    );
};

export default TreePanel;
