# BFS Simulator 🌲🔍

A beautiful, interactive visualization of the **Breadth-First Search (BFS)** algorithm in a 2D maze grid. Watch as the algorithm explores the "waves" of the graph and builds the shortest-path tree in real-time.

("C:\Users\tisma\OneDrive\Masaüstü\mazesimulator.png")

## ✨ Features

-   **Interactive Maze**: Generates random solvable mazes using a robust random-walk algorithm.
-   **BFS Visualization**:
    -   **Grid View**: See the algorithm "scan" neighbors (Up, Right, Down, Left).
    -   **Tree View**: Watch the **recursion tree** grow dynamically as nodes are discovered.
    -   **Queue View**: Real-time FIFO queue visualization.
-   **Step-by-Step Control**: Pause, Step, and Playback the search at your own pace.
-   **Educational Guide**: Built-in interactive guide explaining *Nodes*, *Edges*, *Waves*, and *Pathfinding*.
-   **Deep Stats**: Live metrics on exploring time, max depth, and tree breadth.
-   **Beautiful UI**: "Cozy Game" aesthetic with smooth animations, SVG icons, and a unified stone/amber color palette.

## 🛠️ Tech Stack

-   **React** (Vite) - Component-based UI.
-   **Tailwind CSS** - Modern, utility-first styling.
-   **Algorithms**: Custom pure-JS implementation of BFS and Maze Generation logic.

## 🚀 Getting Started

### Prerequisites

-   Node.js (v14+)
-   npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/bfs-simulator.git
    cd bfs-simulator
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Run the development server:
    ```bash
    npm run dev
    ```

4.  Open `http://localhost:5173` in your browser.

## 📦 Building for Production

To create a production build (static files):

```bash
npm run build
```

The output will be in the `dist` folder, ready to be deployed to GitHub Pages, Vercel, or Netlify.

## 🎨 Design

The project uses a "Warm Stone" aesthetic:
-   **Colors**: Stone-50 to Stone-900 (Grays), Amber-500 (Start/Highlights), Rose-800 (Target).
-   **Typography**: Bold, rounded sans-serif fonts.
-   **Visuals**: Custom SVG icons and heavily styled UI components for a polished feel.

## 📄 License

MIT License. Feel free to explore and learn!
