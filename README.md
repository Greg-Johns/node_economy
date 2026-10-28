## p5 Autonomous Node Economy
A browser-based autonomous node simulation built with p5.js + TypeScript, focused on emergent motion and generative visuals through composable agent behaviors.
Despite the name, this project is best thought of as a visual autonomous-agent canvas experiment. “Economy” is an emergent metaphor, not a financial backend model.
Preview
Add a GIF or screenshot here (recommended).
![Simulation preview](./docs/preview.gif)
#### What this project is
This project renders a population of autonomous nodes to an HTML canvas and updates them frame-by-frame using pluggable behavior components:
- Motivations control movement logic
- Visualizations control drawing logic
- Restrictions apply optional frame-level constraints
The result is a lightweight sandbox for exploring emergent patterns, clustering, flow, and decay in agent systems.
#### Features
- Autonomous agent simulation in real time
- Composable movement logic via motivations
- Swappable rendering styles via visualizations
- Optional global/frame constraints via restrictions
- Simple keyboard controls for live iteration
- Export options for images and parameter snapshots
#### Quick start
Requirements
- Node.js
- pnpm
Run locally
pnpm dev
Starts the Vite dev server and opens the browser app.
Build
pnpm build
Runs TypeScript typechecking, then builds production assets.
Preview production build
pnpm preview
Serves the built output from dist/.
#### Controls
- r — restart simulation
- space — pause/resume
- s — save canvas as PNG
- c — clear canvas
- i — save parameter info
#### Architecture overview
Core entry point:
- src/sketch.ts — p5 setup/draw lifecycle, input controls, simulation bootstrapping
#### Main components:
- AutonomousNodeEconomy — high-level orchestration
- NodeGroup — manages node collection, per-frame updates/renders, applies restrictions
- Node — individual agent composed from behavior/rendering modules
#### Typical frame flow:
1. Render/update node group
2. Remove unhealthy nodes
3. Stop loop when all nodes are effectively stationary
#### Extending the system
Add a Motivation
Create a new motivation class to define how nodes move (forces, steering, pair interactions, etc.), then attach it to nodes in setup.
Add a Visualization
Create a visualization class to define node drawing style (shape, color, trails, layering), then assign it to nodes.
Add a Restriction
Create a restriction that applies frame-level constraints or transformations across nodes and register it in NodeGroup flow.
#### Important notes / gotchas
- INITIAL_NODE_COUNT in src/sketch.ts should remain even (pair-based logic depends on this).
- Browser-only project (no backend, no DB, no env var requirements).
- dist/ is a generated build artifact and should not be edited directly.
#### Development notes
- TypeScript config uses strict module semantics (verbatimModuleSyntax, moduleDetection: force), so type imports should use import type.
- No lint/test scripts are currently configured.
- Keep new behaviors modular and compositional to preserve experimentation speed.
#### Roadmap ideas (optional)
- Scene/preset system for quick behavior switching
- Runtime parameter panel
- Seeded reproducibility for deterministic runs
- Performance-oriented rendering mode for large node counts
#### License:
MIT License (see LICENSE.txt)
