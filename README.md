# Meat-Mesh

A real-time soft-body deformation demo built with Three.js and a simplified Position Based Dynamics (PBD) solver.

**Live demo:** https://jason9075.github.io/Meat-Mesh/

## Features

- **PBD soft-body simulation** — shape-matching springs, gravity, and damping on every vertex
- **Direct mouse manipulation** — click and drag the mesh; surrounding vertices follow with radial falloff
- **Orbit controls** — drag empty space to rotate the camera; the two interactions are precisely separated
- **Real-time slider deformation** — length, width, thickness, bulge, and torsion update the mesh every frame
- **Meat physics controls** — stiffness, volume preservation, and gravity strength
- **Three render modes** — Wireframe, Shaded, and X-Ray (solid + translucent overlay)
- **💡 Math modal** — explains the underlying PBD, shape-matching, and torsion matrix; toggleable Eng/中文

## Tech Stack

| Tool | Purpose |
|------|---------|
| [Three.js](https://threejs.org/) | WebGL rendering and 3D scene |
| [Vite](https://vitejs.dev/) | Dev server and bundler |
| [KaTeX](https://katex.org/) | Math formula rendering in the modal |
| [Prism.js](https://prismjs.com/) + prism-themes | Syntax highlighting (Nord theme) |
| [Nix flake](https://nixos.wiki/wiki/Flakes) | Reproducible dev environment |
| [just](https://just.systems/) | Task runner |

## Getting Started

### Prerequisites

- [Nix](https://nixos.org/) with flakes enabled, or Node.js 22+

### With Nix (recommended)

```sh
direnv allow        # auto-loads the dev shell via .envrc
just install        # npm install --ignore-scripts
just dev            # starts Vite at http://localhost:8080
```

### Without Nix

```sh
npm install
npm run dev
```

### Available Commands

```sh
just install    # install npm dependencies
just dev        # start dev server on :8080
just build      # production build → dist/
just preview    # preview production build on :8080
just clean      # remove dist/ and node_modules/
```

## Project Structure

```
Meat-Mesh/
├── src/main.js               # Three.js scene, PBD solver, UI logic
├── index.html                # Two-column layout (viewport + control panel)
├── vite.config.js
├── package.json
├── flake.nix                 # Nix dev shell
├── Justfile
├── scripts/fix-noexec.cjs    # NixOS noexec workaround for esbuild
└── .github/workflows/
    └── deploy.yml            # Auto-deploy to GitHub Pages on push to main
```

## Deployment

Pushing to `main` triggers the GitHub Actions workflow which builds and deploys to GitHub Pages automatically. The Vite `base` is set to `/Meat-Mesh/` in production.

## License

MIT
