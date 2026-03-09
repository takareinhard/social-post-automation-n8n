export const DIRECTIONS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 }
};

const DEFAULT_COLUMNS = 16;
const DEFAULT_ROWS = 16;
const DEFAULT_DIRECTION = "right";
const STARTING_SNAKE = [
  { x: 4, y: 8 },
  { x: 3, y: 8 },
  { x: 2, y: 8 }
];

function areOppositeDirections(currentDirection, nextDirection) {
  if (!currentDirection || !nextDirection) {
    return false;
  }

  const current = DIRECTIONS[currentDirection];
  const next = DIRECTIONS[nextDirection];
  return current.x + next.x === 0 && current.y + next.y === 0;
}

function pointKey(point) {
  return `${point.x},${point.y}`;
}

export function spawnFood(snake, columns, rows, rng = Math.random) {
  const occupied = new Set(snake.map(pointKey));
  const openCells = [];

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < columns; x += 1) {
      if (!occupied.has(pointKey({ x, y }))) {
        openCells.push({ x, y });
      }
    }
  }

  if (openCells.length === 0) {
    return null;
  }

  const index = Math.min(openCells.length - 1, Math.floor(rng() * openCells.length));
  return openCells[index];
}

export function createGameState(options = {}, rng = Math.random) {
  const columns = options.columns ?? DEFAULT_COLUMNS;
  const rows = options.rows ?? DEFAULT_ROWS;
  const snake = options.snake ?? STARTING_SNAKE.map((segment) => ({ ...segment }));
  const direction = options.direction ?? DEFAULT_DIRECTION;
  const food = options.food ?? spawnFood(snake, columns, rows, rng);

  return {
    columns,
    rows,
    snake,
    direction,
    queuedDirection: direction,
    food,
    score: options.score ?? 0,
    status: options.status ?? "ready"
  };
}

export function queueDirection(state, nextDirection) {
  if (!DIRECTIONS[nextDirection]) {
    return state;
  }

  const baseDirection = state.queuedDirection ?? state.direction;
  if (areOppositeDirections(baseDirection, nextDirection)) {
    return state;
  }

  return {
    ...state,
    queuedDirection: nextDirection
  };
}

export function startGame(state) {
  return {
    ...state,
    status: "running"
  };
}

export function pauseGame(state) {
  return {
    ...state,
    status: state.status === "running" ? "paused" : state.status
  };
}

export function resumeGame(state) {
  return {
    ...state,
    status: state.status === "paused" || state.status === "ready" ? "running" : state.status
  };
}

export function togglePause(state) {
  if (state.status === "running") {
    return pauseGame(state);
  }

  if (state.status === "paused" || state.status === "ready") {
    return resumeGame(state);
  }

  return state;
}

export function stepGame(state, rng = Math.random) {
  if (state.status !== "running") {
    return state;
  }

  const direction = state.queuedDirection ?? state.direction;
  const vector = DIRECTIONS[direction];
  const currentHead = state.snake[0];
  const nextHead = {
    x: currentHead.x + vector.x,
    y: currentHead.y + vector.y
  };

  const hitsWall =
    nextHead.x < 0 ||
    nextHead.x >= state.columns ||
    nextHead.y < 0 ||
    nextHead.y >= state.rows;

  const grows = Boolean(state.food) && nextHead.x === state.food.x && nextHead.y === state.food.y;
  const bodyToCheck = grows ? state.snake : state.snake.slice(0, -1);
  const hitsSelf = bodyToCheck.some((segment) => segment.x === nextHead.x && segment.y === nextHead.y);

  if (hitsWall || hitsSelf) {
    return {
      ...state,
      direction,
      queuedDirection: direction,
      status: "game-over"
    };
  }

  const snake = grows
    ? [nextHead, ...state.snake]
    : [nextHead, ...state.snake.slice(0, -1)];
  const food = grows ? spawnFood(snake, state.columns, state.rows, rng) : state.food;

  return {
    ...state,
    snake,
    direction,
    queuedDirection: direction,
    food,
    score: grows ? state.score + 1 : state.score,
    status: food ? state.status : "won"
  };
}