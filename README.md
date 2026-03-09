# Snake Game

A small classic Snake game built as a minimal static web app with no external dependencies.

## Features

- Grid-based movement
- Food spawning and snake growth
- Score display
- Game-over and restart flow
- Keyboard controls plus on-screen buttons for smaller screens

## Run Locally

```bash
node server.mjs
```

Open [http://localhost:3000](http://localhost:3000).

## Controls

- Arrow keys or `WASD`: move
- `Space` or `P`: pause / resume
- `Enter`: restart after game over
- On-screen buttons: mobile-friendly direction controls

## Test

```bash
node tests/runTests.js
```

## Manual Check

- Start the game and confirm the snake begins moving on the grid.
- Verify keyboard and on-screen controls both work.
- Eat food and confirm the score increases and the snake grows.
- Hit a wall or the snake body and confirm game over is shown.
- Pause and resume, then restart and confirm a clean reset.