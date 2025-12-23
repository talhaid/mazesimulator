import { useState, useRef, useEffect } from 'react';
import { BFSEngine } from './logic/BFSEngine';
import { generateRandomMaze } from './logic/MazeGenerator';
import MazePanel from './components/MazePanel';
import TreePanel from './components/TreePanel';
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
            {phase === 'SEARCHING' ? (
              <button onClick={() => setPhase('IDLE')} className="px-6 py-2 bg-stone-200 text-stone-800 hover:bg-stone-200 rounded-xl uppercase font-black tracking-wider text-sm transition-all border-b-4 border-r-4 border-orange-400 active:border-b-0 active:border-r-0 active:translate-y-1 active:translate-x-1 shadow-sm">
                Pause
              </button>
            ) : (
              <button
                onClick={handleStart}
                disabled={phase === 'FINISHED' || phase === 'PLAYBACK'}
                className="px-6 py-2 bg-stone-200 text-stone-800 hover:bg-stone-200 rounded-xl uppercase font-black tracking-wider text-sm transition-all border-b-4 border-r-4 border-stone-400 active:border-b-0 active:border-r-0 active:translate-y-1 active:translate-x-1 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-x-0 disabled:active:translate-y-0 disabled:border-b-4 disabled:border-r-4"
              >
                Start
              </button>
            )}
            {/* Removed redundant SEARCHING block */}
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
            <button onClick={handleNewMaze} className="px-3 py-2 bg-stone-200 hover:bg-stone-200 text-stone-700 hover:text-stone-900 rounded-xl transition-all border-b-4 border-r-4 border-stone-400 active:border-b-0 active:border-r-0 active:translate-y-1 active:translate-x-1 flex items-center justify-center" title="New Maze">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
              </svg>
            </button>
            <button onClick={() => setShowStats(true)} className="px-3 py-2 bg-stone-200 hover:bg-stone-200 text-stone-700 hover:text-stone-900 rounded-xl transition-all border-b-4 border-r-4 border-stone-400 active:border-b-0 active:border-r-0 active:translate-y-1 active:translate-x-1 flex items-center justify-center" title="View Stats">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
            </button>
            <button onClick={() => setShowGuide(true)} className="px-3 py-2 bg-stone-200 hover:bg-stone-200 text-stone-700 hover:text-stone-900 rounded-xl transition-all border-b-4 border-r-4 border-stone-400 active:border-b-0 active:border-r-0 active:translate-y-1 active:translate-x-1 flex items-center justify-center" title="Why BFS?">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
              </svg>
            </button>
          </div>

          <div className="text-left ml-1">
            <span className={`text-xs font-black tracking-widest uppercase ${phase === 'SEARCHING' ? 'animate-pulse text-orange-600' : 'text-stone-400'}`}>
              {feedbackText}
            </span>
          </div>
        </div>

        {/* 2. Maze Centerpiece */}
        <div className="flex-1 px-8 flex flex-col justify-center relative gap-8">

          <div className="flex items-center gap-5">
            {/* Title */}
            <h1 className="font-black text-5xl tracking-tight text-stone-800 select-none [writing-mode:vertical-rl] rotate-180 drop-shadow-[3px_3px_0px_rgba(255,255,255,0.4)]">
              BFS SIMULATOR
            </h1>

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
          <button onClick={() => setZoom(z => Math.max(0.2, z - 0.1))} className="w-10 h-10 bg-stone-200 hover:bg-stone-200 text-stone-800 rounded-xl flex items-center justify-center font-black transition-all border-b-4 border-r-4 border-stone-400 active:border-b-0 active:border-r-0 active:translate-y-1 active:translate-x-1 shadow-sm" title="Zoom Out">
            -
          </button>
          <button onClick={() => setZoom(1)} className="px-3 h-10 bg-stone-200 hover:bg-stone-200 text-stone-800 rounded-xl flex items-center justify-center font-black text-xs transition-all border-b-4 border-r-4 border-stone-400 active:border-b-0 active:border-r-0 active:translate-y-1 active:translate-x-1 shadow-sm" title="Reset Zoom">
            {Math.round(zoom * 100)}%
          </button>
          <button onClick={() => setZoom(z => Math.min(3, z + 0.1))} className="w-10 h-10 bg-stone-200 hover:bg-stone-200 text-stone-800 rounded-xl flex items-center justify-center font-black transition-all border-b-4 border-r-4 border-stone-400 active:border-b-0 active:border-r-0 active:translate-y-1 active:translate-x-1 shadow-sm" title="Zoom In">
            +
          </button>
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
