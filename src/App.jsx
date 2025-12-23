import { useState, useRef, useEffect } from 'react';
import { BFSEngine } from './logic/BFSEngine';
import { generateRandomMaze } from './logic/MazeGenerator';
import MazePanel from './components/MazePanel';
import TreePanel from './components/TreePanel';
// import ExplanationModal from './components/ExplanationModal'; // Deprecated
import BFSGuideModal from './components/BFSGuideModal';
import SearchStatsModal from './components/SearchStatsModal';
import QueuePanel from './components/QueuePanel';

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
  const [showGuide, setShowGuide] = useState(false);
  const [showStats, setShowStats] = useState(false);

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
      }, 100);
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



  const [zoom, setZoom] = useState(1);

  return (
    <div className="flex h-screen bg-orange-50 text-stone-700 font-sans overflow-hidden selection:bg-orange-200">

      {/* Left Sidebar: Minimalist & Unified */}
      <aside className="w-[40%] flex flex-col z-10 relative">


        {/* 1. Header / Controls - Aligned with TREE label */}
        <div className="px-8 pt-14 pb-4 flex flex-col gap-6 z-20">
          <div className="flex flex-wrap gap-3">
            {phase === 'IDLE' && (
              <button onClick={handleStart} className="px-6 py-2 bg-stone-200 text-stone-800 hover:bg-stone-200 rounded-xl uppercase font-black tracking-wider text-sm transition-all border-b-4 border-r-4 border-stone-400 active:border-b-0 active:border-r-0 active:translate-y-1 active:translate-x-1 shadow-sm">
                Start
              </button>
            )}
            {phase === 'SEARCHING' && (
              <button onClick={() => setPhase('IDLE')} className="px-6 py-2 bg-stone-200 text-stone-800 hover:bg-stone-200 rounded-xl uppercase font-black tracking-wider text-sm transition-all border-b-4 border-r-4 border-orange-400 active:border-b-0 active:border-r-0 active:translate-y-1 active:translate-x-1 shadow-sm">
                Pause
              </button>
            )}
            {phase === 'FINISHED' && engineState.found && (
              <button onClick={handleStart} className="px-6 py-2 bg-orange-400 text-white hover:bg-orange-500 rounded-xl uppercase font-black tracking-wider text-sm transition-all border-b-4 border-r-4 border-orange-600 active:border-b-0 active:border-r-0 active:translate-y-1 active:translate-x-1 shadow-sm">
                Replay
              </button>
            )}

            <button onClick={handleStep} disabled={phase === 'FINISHED' || phase === 'PLAYBACK'} className="px-4 py-2 bg-stone-200 hover:bg-stone-200 text-stone-800 rounded-xl disabled:opacity-50 uppercase font-black tracking-wider text-xs transition-all border-b-4 border-r-4 border-stone-400 active:border-b-0 active:border-r-0 active:translate-y-1 active:translate-x-1">
              Step
            </button>
            <button onClick={handleReset} className="px-4 py-2 bg-stone-200 hover:bg-stone-200 text-stone-800 rounded-xl uppercase font-black tracking-wider text-xs transition-all border-b-4 border-r-4 border-stone-400 active:border-b-0 active:border-r-0 active:translate-y-1 active:translate-x-1">
              Reset
            </button>
            <button onClick={handleNewMaze} className="px-4 py-2 bg-stone-200 hover:bg-stone-200 text-stone-800 rounded-xl uppercase font-black tracking-wider text-xs transition-all border-b-4 border-r-4 border-stone-400 active:border-b-0 active:border-r-0 active:translate-y-1 active:translate-x-1" title="New Maze">
              🎲
            </button>
            <button onClick={() => setShowStats(true)} className="px-4 py-2 bg-stone-200 hover:bg-stone-200 text-stone-800 rounded-xl uppercase font-black tracking-wider text-xs transition-all border-b-4 border-r-4 border-stone-400 active:border-b-0 active:border-r-0 active:translate-y-1 active:translate-x-1" title="View Stats">
              📊
            </button>
            <button onClick={() => setShowGuide(true)} className="px-4 py-2 bg-stone-200 hover:bg-stone-200 text-stone-800 rounded-xl uppercase font-black tracking-wider text-xs transition-all border-b-4 border-r-4 border-stone-400 active:border-b-0 active:border-r-0 active:translate-y-1 active:translate-x-1" title="Why BFS?">
              ❓
            </button>
          </div>

          <div className="text-left ml-1">
            <span className={`text-xs font-black tracking-widest uppercase ${phase === 'SEARCHING' ? 'animate-pulse text-orange-600' : 'text-stone-400'}`}>
              {feedbackText}
            </span>
          </div>
        </div>

        {/* 2. Maze Centerpiece */}
        <div className="flex-1 px-8 flex flex-col items-center justify-center relative gap-8">



          <div className="relative p-1">
            {/* Subtle Glow behind maze - Warm glow */}
            <div className="absolute inset-0 bg-orange-300/20 blur-3xl rounded-full"></div>
            <MazePanel
              grid={engineState.grid}
              visited={engineState.visited}
              current={engineState.current}
              path={engineState.finished ? engineState.shortestPath : []}
              parentMap={engineState.parentMap}
              playbackNode={playbackNode}
              depths={engineState.depths}
              maxDepth={engineState.maxDepth}
            />
          </div>
        </div>


        {/* 3. Bottom: Queue - Seamless */}
        <div className="px-8 pb-8 pt-4 flex flex-col gap-4 h-48 shrink-0">
          {/* Queue Panel - Minimal */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 relative overflow-hidden">
              <QueuePanel queue={engineState.queue} current={engineState.current} />
            </div>
          </div>
        </div>

      </aside >

      {/* Right Main Interface: BFS Tree - Boundless */}
      < main className="flex-1 relative flex flex-col overflow-hidden bg-orange-50" >
        {/* Subtle grid pattern for the tree background - Dots */}
        < div className="absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: 'radial-gradient(circle, #78716c 1px, transparent 1px)', backgroundSize: '40px 40px' }
          }>
        </div >

        {/* Tree Header / Controls */}
        < div className="absolute top-8 left-8 z-10 pointer-events-none" >
          <h2 className="text-[#ff800f] text-6xl font-black tracking-tight select-none drop-shadow-[2px_2px_0px_rgba(87,83,78,1)]">TREE</h2>
        </div >

        {/* Minimal Zoom Controls - Light Mode */}
        < div className="absolute bottom-8 right-8 z-20 flex gap-2" >
          <div className="flex bg-white shadow-[4px_4px_0px_0px_rgba(214,211,209,0.5)] rounded-full p-1 border-2 border-stone-100">
            <button onClick={() => setZoom(z => Math.max(0.2, z - 0.1))} className="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-stone-800 rounded-full transition-colors font-bold">-</button>
            <button onClick={() => setZoom(1)} className="px-2 text-xs font-black text-stone-300 hover:text-stone-800 transition-colors">{Math.round(zoom * 100)}%</button>
            <button onClick={() => setZoom(z => Math.min(3, z + 0.1))} className="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-stone-800 rounded-full transition-colors font-bold">+</button>
          </div>
        </div >

        {/* Tree Container */}
        < div className="flex-1 overflow-auto relative z-0 no-scrollbar" >
          <div
            className="min-w-full min-h-full origin-top-left transition-transform duration-200 ease-out"
            style={{
              transform: `scale(${zoom})`,
              width: `${100 / zoom}%`,
            }}
          >
            <TreePanel
              treeEdges={engineState.treeEdges}
              current={engineState.current}
              path={engineState.finished ? engineState.shortestPath : []}
              startNode={engineRef.current.start}
              finished={engineState.finished}
            />
          </div>
        </div >
      </main >

      <BFSGuideModal isOpen={showGuide} onClose={() => setShowGuide(false)} />
      <SearchStatsModal isOpen={showStats} onClose={() => setShowStats(false)} state={engineState} />

    </div >
  )
}

export default App;
