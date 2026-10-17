# p5 Autonomous Node Economy

Single-page p5.js simulation built with TypeScript + Vite. Entry point is `src/sketch.ts`, which bootstraps `AutonomousNodeEconomy` (engine orchestration) + `NodeGroup` (collection of `Node`s). Nodes combine `Motivation`s (movement logic) and `Visualization`s (rendering logic); optional `Restriction`s are applied per frame by `NodeGroup.render()`.

## Commands

Package manager is **pnpm** (lockfile is `pnpm-lock.yaml`). `node_modules/` is already installed.

- `pnpm dev` — start Vite dev server (serves `index.html` which loads `/src/sketch.ts`)
- `pnpm build` — `tsc && vite build` (typechecks, then emits to `dist/`)
- `pnpm preview` — serve the `dist/` build locally

No test, lint, or format scripts exist. `tsconfig` has `noEmit: true` so `tsc` typechecks without emitting.

## Architecture gotchas

- `INITIAL_NODE_COUNT = 1000` in `sketch.ts` must stay even because `MagnetPairMotivation` pairs nodes.
- `sketch.ts` drives `p.draw()` calling `nodeGroup.render()` then `removeUnhealthyNodes()`; the loop stops when all nodes stop moving (speed ≤ 0.01). Press `r` to restart, ` ` to pause, `s` to save a PNG, `c` to clear the canvas.
- `tsconfig.json` uses `verbatimModuleSyntax` + `moduleDetection: force` + `allowImportingTsExtensions`, so type-only imports must use `import type` and `.ts` extensions may be imported explicitly.
- `dist/` is a build artifact (gitignored) — do not edit files there.

## Notes

- No CI workflows, no pre-commit config, no ESLint/Prettier config present in this repo.
- Browser-only: no backend, no database, no env vars required.
