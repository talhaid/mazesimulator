import { useState, useRef, useEffect } from 'react';
import { BFSEngine } from './logic/BFSEngine';
import { generateRandomMaze } from './logic/MazeGenerator';
import MazePanel from './components/MazePanel';
import TreePanel from './components/TreePanel';
import ExplanationModal from './components/ExplanationModal';

// simple 10x10 maze
// 0: free, 1: wall, 2: start, 3: target
const INITIAL_GRID = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 2, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 1, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 0, 1, 0, 0, 0, 1, 0, 1],
  [1, 1, 0, 1, 1, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
  [1, 0, 0, 3, 1, 0, 0, 0, 0, 1],
  [1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

function App() {
  const engineRef = useRef(new BFSEngine(JSON.parse(JSON.stringify(INITIAL_GRID))));
  const [engineState, setEngineState] = useState(engineRef.current.getState());
  const [phase, setPhase] = useState('IDLE'); // IDLE, SEARCHING, FINISHED, PLAYBACK
  const [playbackIndex, setPlaybackIndex] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  // Timer for auto-playing BFS or Playback
  useEffect(() => {
    let timer;
    if (phase === 'SEARCHING') {
      timer = setInterval(() => {
        const hasNext = engineRef.current.step();
        setEngineState(engineRef.current.getState());

        if (!hasNext) {
          setPhase('FINISHED');
          clearInterval(timer);
        }
      }, 200); // BFS Speed
    } else if (phase === 'PLAYBACK') {
      const path = engineState.shortestPath;
      if (playbackIndex < path.length - 1) {
        timer = setInterval(() => {
          setPlaybackIndex(prev => prev + 1);
        }, 300); // Path Speed
      } else {
        // Reached end
      }
    }

    return () => clearInterval(timer);
  }, [phase, playbackIndex, engineState.shortestPath]);

  // Auto-play path after search finishes
  useEffect(() => {
    if (phase === 'FINISHED' && engineState.found) {
      const timeout = setTimeout(() => {
        setPhase('PLAYBACK');
        setPlaybackIndex(0);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [phase, engineState.found]);

  const handleStart = () => {
    if (phase === 'IDLE') {
      setPhase('SEARCHING');
    } else if (phase === 'FINISHED' && engineState.found) {
      setPhase('PLAYBACK');
      setPlaybackIndex(0);
    }
  };

  const handleStep = () => {
    if (phase === 'IDLE' || phase === 'SEARCHING') {
      if (!engineState.finished) {
        engineRef.current.step();
        setEngineState(engineRef.current.getState());
        if (engineRef.current.finished) setPhase('FINISHED');
      }
    }
  };

  const handleNewMaze = () => {
    const newGrid = generateRandomMaze(10, 10);
    engineRef.current = new BFSEngine(newGrid);
    setEngineState(engineRef.current.getState());
    setPhase('IDLE');
    setPlaybackIndex(0);
  };

  const handleReset = () => {
    // We want to reset the state but keep the current maze layout (walls).
    // The current engine instance has the grid with walls.
    // We just create a new engine with the SAME grid structure.
    const currentStructure = engineRef.current.grid.map(row => row.map(cell => cell));

    engineRef.current = new BFSEngine(currentStructure);
    setEngineState(engineRef.current.getState());
    setPhase('IDLE');
    setPlaybackIndex(0);
  };

  let feedbackText = "Ready to start BFS.";
  if (phase === 'SEARCHING') feedbackText = "Searching (BFS exploring)...";
  if (phase === 'FINISHED') {
    feedbackText = engineState.found ? "Target Found! Click 'Play Path' to visualize." : "Target unreachable.";
  }
  if (phase === 'PLAYBACK') feedbackText = "Shortest path playback...";

  const playbackNode = (phase === 'PLAYBACK' && engineState.shortestPath.length > 0)
    ? engineState.shortestPath[playbackIndex]
    : null;

  // Debug Counts
  const visitedCount = engineState.visited.flat().filter(Boolean).length;
  // Node count = Start (1) + Edges (which represent children discoveries)
  // Actually, let's just use startNode + treeEdges.length correctly?
  // BFSEngine treeEdges tracks every discovery.
  // Start node is not in treeEdges as a child. So treeNodes = 1 + treeEdges.length.
  // Wait, if we reset, treeEdges is empty.
  const treeCount = (engineRef.current.start ? 1 : 0) + engineState.treeEdges.length;

  const isConsistent = visitedCount === treeCount;

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white p-4 font-sans overflow-hidden">
      {/* Debug Overlay */}
      <div className={`fixed bottom-19 right-4 z-50 p-2 rounded shadow-lg border ${isConsistent ? 'bg-gray-800 border-green-500' : 'bg-red-900 border-red-500'}`}>
        <h3 className="text-xs font-bold uppercase mb-1 text-gray-400">Correctness Check</h3>
        <div className="flex gap-4 text-sm font-mono">
          <span>Maze Visited: <strong className="text-white">{visitedCount}</strong></span>
          <span>Tree Nodes: <strong className="text-white">{treeCount}</strong></span>
        </div>
        {!isConsistent && <div className="text-xs text-red-300 mt-1">MISMATCH ERROR!</div>}
      </div>
      {/* Header */}
      <header className="flex justify-between items-center mb-4 p-4 bg-gray-800 rounded-lg shadow-md">
        <div>
          <h1 className="text-2xl font-bold text-blue-400">BFS Visualizer</h1>
          <p className="text-sm text-gray-400">Step-by-step exploration & Tree generation</p>
        </div>
        <div className="flex gap-2">
          <div className="px-4 py-2 bg-gray-700 rounded text-center min-w-[200px] border border-gray-600 flex items-center justify-center">
            <span className="text-yellow-400 font-mono text-sm">{feedbackText}</span>
          </div>
          {phase === 'IDLE' && (
            <button onClick={handleStart} className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded font-bold shadow-lg transition-colors">
              Start Search
            </button>
          )}
          {phase === 'SEARCHING' && (
            <button onClick={() => setPhase('IDLE')} className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 rounded font-bold transition-colors">
              Pause
            </button>
          )}
          {phase === 'FINISHED' && engineState.found && (
            <button onClick={handleStart} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded font-bold transition-colors">
              Play Path
            </button>
          )}
          <button onClick={handleStep} disabled={phase === 'FINISHED' || phase === 'PLAYBACK'} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded disabled:opacity-50">
            Step
          </button>
          <button onClick={handleReset} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded">
            Reset
          </button>
          <button onClick={handleNewMaze} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded shadow-md border border-purple-500">
            🎲 New Maze
          </button>
          {/* Explain Button - Always visible or only when relevant? User said "after reached goal" mostly, but useful anytime. Let's make it always accessible but highlighted if finished. */}
          <button
            onClick={() => setShowExplanation(true)}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 border border-gray-500 rounded text-gray-200"
            title="How BFS Works"
          >
            ❓ Explain Logic
          </button>
        </div>
      </header>

      <ExplanationModal isOpen={showExplanation} onClose={() => setShowExplanation(false)} />

      {/* Main Layout */}
      <main className="flex flex-1 gap-6 overflow-hidden">
        {/* Left: Maze */}
        <section className="flex-1 bg-gray-800 rounded-lg p-4 shadow-inner flex flex-col items-center justify-center relative border border-gray-700">
          <MazePanel
            grid={engineState.grid}
            visited={engineState.visited}
            current={engineState.current}
            path={engineState.finished ? engineState.shortestPath : []}
            parentMap={engineState.parentMap}
            playbackNode={playbackNode}
          />
        </section>

        {/* Right: Tree */}
        <section className="flex-1 bg-gray-800 rounded-lg shadow-inner overflow-hidden flex flex-col border border-gray-700 relative">
          <div className="flex-1 overflow-hidden relative">
            <TreePanel
              treeEdges={engineState.treeEdges}
              current={engineState.current}
              path={engineState.finished ? engineState.shortestPath : []}
              startNode={engineRef.current.start}
              finished={engineState.finished}
            />
          </div>
        </section>
      </main>

      {/* Brief Explanation */}
      <footer className="mt-4 p-4 bg-gray-800 rounded border border-gray-700 text-sm text-gray-400 text-center">
        <h3 className="text-white font-bold mb-2">Why BFS?</h3>
        <p>
          A Maze is essentially an <strong className="text-yellow-400">Unweighted Graph</strong> (every step costs 1).
          BFS is the optimal algorithm here because it explores equally in all directions (level-by-level).
          This property <strong>guarantees</strong> that the first time we find the target, it is via the shortest possible path.
        </p>
      </footer>
    </div>
  )
}

export default App;
