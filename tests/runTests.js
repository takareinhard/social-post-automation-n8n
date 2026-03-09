import assert from "node:assert/strict";

import { createGameState, queueDirection, spawnFood, stepGame } from "../src/gameLogic.js";

function runTest(name, fn) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    console.error(error);
    process.exitCode = 1;
  }
}

runTest("moves one cell in the queued direction", () => {
  const state = {
    ...createGameState({
      snake: [
        { x: 3, y: 3 },
        { x: 2, y: 3 },
        { x: 1, y: 3 }
      ],
      direction: "right",
      food: { x: 10, y: 10 },
      status: "running"
    }),
    queuedDirection: "down"
  };

  const nextState = stepGame(state, () => 0);

  assert.deepEqual(nextState.snake, [
    { x: 3, y: 4 },
    { x: 3, y: 3 },
    { x: 2, y: 3 }
  ]);
  assert.equal(nextState.direction, "down");
});

runTest("grows and increments score after eating food", () => {
  const state = {
    ...createGameState({
      snake: [
        { x: 3, y: 3 },
        { x: 2, y: 3 },
        { x: 1, y: 3 }
      ],
      direction: "right",
      food: { x: 4, y: 3 },
      status: "running"
    }),
    queuedDirection: "right"
  };

  const nextState = stepGame(state, () => 0);

  assert.equal(nextState.score, 1);
  assert.equal(nextState.snake.length, 4);
  assert.deepEqual(nextState.snake[0], { x: 4, y: 3 });
  assert.notDeepEqual(nextState.food, { x: 4, y: 3 });
});

runTest("marks game over when the snake hits a wall", () => {
  const state = {
    ...createGameState({
      columns: 5,
      rows: 5,
      snake: [
        { x: 4, y: 2 },
        { x: 3, y: 2 },
        { x: 2, y: 2 }
      ],
      direction: "right",
      food: { x: 0, y: 0 },
      status: "running"
    }),
    queuedDirection: "right"
  };

  const nextState = stepGame(state);

  assert.equal(nextState.status, "game-over");
});

runTest("marks game over when the snake runs into itself", () => {
  const state = {
    ...createGameState({
      columns: 6,
      rows: 6,
      snake: [
        { x: 2, y: 2 },
        { x: 3, y: 2 },
        { x: 3, y: 3 },
        { x: 2, y: 3 }
      ],
      direction: "up",
      food: { x: 5, y: 5 },
      status: "running"
    }),
    queuedDirection: "right"
  };

  const nextState = stepGame(state);

  assert.equal(nextState.status, "game-over");
});

runTest("ignores direct reversal into the opposite direction", () => {
  const state = createGameState({
    direction: "right"
  });

  const nextState = queueDirection(state, "left");

  assert.equal(nextState.queuedDirection, "right");
});

runTest("spawns food on an open cell only", () => {
  const food = spawnFood(
    [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 }
    ],
    2,
    2,
    () => 0
  );

  assert.deepEqual(food, { x: 1, y: 1 });
});

if (!process.exitCode) {
  console.log("All tests passed.");
}