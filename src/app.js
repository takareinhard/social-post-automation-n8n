import {
  createGameState,
  queueDirection,
  resumeGame,
  startGame,
  stepGame,
  togglePause
} from "./gameLogic.js";

const TICK_MS = 140;

const boardElement = document.querySelector("#board");
const scoreElement = document.querySelector("#score");
const statusElement = document.querySelector("#status");
const startButton = document.querySelector("#start-button");
const pauseButton = document.querySelector("#pause-button");
const restartButton = document.querySelector("#restart-button");
const directionButtons = document.querySelectorAll("[data-direction]");

let state = createGameState();
let tickHandle = null;

function labelStatus(status) {
  switch (status) {
    case "ready":
      return "Ready";
    case "running":
      return "Running";
    case "paused":
      return "Paused";
    case "game-over":
      return "Game Over";
    case "won":
      return "Won";
    default:
      return status;
  }
}

function renderBoard(currentState) {
  const snakeLookup = new Map(currentState.snake.map((segment, index) => [`${segment.x},${segment.y}`, index]));
  const foodKey = currentState.food ? `${currentState.food.x},${currentState.food.y}` : null;

  boardElement.innerHTML = "";
  boardElement.style.gridTemplateColumns = `repeat(${currentState.columns}, 1fr)`;
  boardElement.style.gridTemplateRows = `repeat(${currentState.rows}, 1fr)`;

  for (let y = 0; y < currentState.rows; y += 1) {
    for (let x = 0; x < currentState.columns; x += 1) {
      const key = `${x},${y}`;
      const cell = document.createElement("div");
      cell.className = "cell";

      if (snakeLookup.has(key)) {
        cell.classList.add("cell--snake");
        if (snakeLookup.get(key) === 0) {
          cell.classList.add("cell--head");
        }
      } else if (foodKey === key) {
        cell.classList.add("cell--food");
      }

      boardElement.append(cell);
    }
  }
}

function render(currentState) {
  scoreElement.textContent = String(currentState.score);
  statusElement.textContent = labelStatus(currentState.status);
  pauseButton.textContent = currentState.status === "paused" ? "Resume" : "Pause";
  renderBoard(currentState);
}

function applyState(nextState) {
  state = nextState;
  render(state);
}

function stopLoop() {
  if (tickHandle !== null) {
    window.clearInterval(tickHandle);
    tickHandle = null;
  }
}

function startLoop() {
  stopLoop();
  tickHandle = window.setInterval(() => {
    applyState(stepGame(state));
    if (state.status === "game-over" || state.status === "won") {
      stopLoop();
    }
  }, TICK_MS);
}

function resetGame(autostart = false) {
  const nextState = createGameState();
  applyState(autostart ? startGame(nextState) : nextState);

  if (autostart) {
    startLoop();
  } else {
    stopLoop();
  }
}

function beginGame() {
  if (state.status === "running") {
    return;
  }

  const nextState = state.status === "ready" ? startGame(state) : resumeGame(state);
  applyState(nextState);

  if (nextState.status === "running") {
    startLoop();
  }
}

function handleDirection(direction) {
  if (state.status === "ready") {
    applyState(startGame(queueDirection(state, direction)));
    startLoop();
    return;
  }

  if (state.status === "paused") {
    applyState(resumeGame(queueDirection(state, direction)));
    startLoop();
    return;
  }

  if (state.status === "running") {
    applyState(queueDirection(state, direction));
  }
}

const KEY_DIRECTIONS = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  w: "up",
  W: "up",
  a: "left",
  A: "left",
  s: "down",
  S: "down",
  d: "right",
  D: "right"
};

document.addEventListener("keydown", (event) => {
  const direction = KEY_DIRECTIONS[event.key];

  if (direction) {
    event.preventDefault();
    handleDirection(direction);
    return;
  }

  if (event.key === " " || event.key === "p" || event.key === "P") {
    event.preventDefault();
    const nextState = togglePause(state);
    applyState(nextState);
    if (nextState.status === "running") {
      startLoop();
    } else if (nextState.status === "paused") {
      stopLoop();
    }
    return;
  }

  if (event.key === "Enter" && (state.status === "game-over" || state.status === "won")) {
    event.preventDefault();
    resetGame(true);
  }
});

startButton.addEventListener("click", beginGame);

pauseButton.addEventListener("click", () => {
  const nextState = togglePause(state);
  applyState(nextState);

  if (nextState.status === "running") {
    startLoop();
  } else if (nextState.status === "paused") {
    stopLoop();
  }
});

restartButton.addEventListener("click", () => resetGame(true));

directionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    handleDirection(button.dataset.direction);
  });
});

render(state);