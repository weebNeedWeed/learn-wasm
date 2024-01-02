import {Cell, Universe} from "wasm-game-of-life";
import {memory} from "wasm-game-of-life/wasm_game_of_life_bg";

const width = 64;
const height = 64;
const CELL_SIZE = 8; // px
const GRID_COLOR = "#CCCCCC";
const DEAD_COLOR = "#FFFFFF";
const ALIVE_COLOR = "#000000";

const canvas = document.getElementById("game-of-life-canvas");
canvas.width = (CELL_SIZE + 1) * width + 1;
canvas.height = (CELL_SIZE + 1) * height + 1;
const ctx = canvas.getContext("2d");
const universe = Universe.new();
universe.set_width(width);
universe.set_height(height);
drawGrid();

canvas.addEventListener("click", e => {
    const x = e.offsetX;
    const y = e.offsetY;

    const row = Math.min(Math.floor(x / (CELL_SIZE + 1)), 63);
    const col = Math.min(Math.floor(y / (CELL_SIZE + 1)), 63);

    universe.toggle_cell(row, col);

    drawGrid();
    drawCells();
});

function drawGrid() {
    ctx.strokeStyle = GRID_COLOR;

    // vertically drawing
    for(let i = 0; i <= width; ++i) {
        ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);
        ctx.lineTo(i * (CELL_SIZE + 1) + 1, canvas.height);
    }

    // horizontally drawing
    for(let i = 0; i <= height; ++i) {
        ctx.moveTo(0, i * (CELL_SIZE + 1) + 1);
        ctx.lineTo(canvas.width, i * (CELL_SIZE + 1) + 1);
    }

    ctx.stroke();
}

function getIndex(row, column) {
    return row * width + column;
}

function drawCells() {
    const cellPtr = universe.cells();
    const cells = new Uint8Array(memory.buffer, cellPtr, width * height);

    ctx.beginPath();

    for(let row = 0; row < height; ++row) {
        for(let col = 0; col < width; ++col) {
            const idx = getIndex(row, col);
            const cell = cells[idx];

            ctx.fillStyle = cell === Cell.Dead ?
                DEAD_COLOR : ALIVE_COLOR;

            ctx.fillRect(
                row * (CELL_SIZE + 1) + 1,
                col * (CELL_SIZE + 1) + 1,
                CELL_SIZE,
                CELL_SIZE
            );
        }
    }

    ctx.stroke();
}

let animationId = null;
function renderLoop() {
    fps.render();
    universe.tick();

    drawGrid();
    drawCells();

    animationId = requestAnimationFrame(renderLoop);
}

const playPauseBtn = document.getElementById("play-pause");
let isPaused = () => animationId === null;

const setPlay = () => {
    renderLoop();
    playPauseBtn.innerText = "||";
};

const setPause = () => {
    if(animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
    playPauseBtn.innerText = "▶︎";
}

playPauseBtn.addEventListener("click", () => {
    if(isPaused()) setPlay();
    else setPause();
});

const initButton = document.getElementById("init");
initButton.onclick = () => {
    universe.generate_random();
    drawCells();
};

const resetButton = document.getElementById("reset");
resetButton.onclick = () => {
    universe.reset();
    drawCells();
};

const fps = new class {
    constructor() {
        this.fpsBox = document.getElementById("fps");
        this.frames = [];
        this.lastFrameTimestamp = performance.now();
    }

    render() {
        const now = performance.now();
        const delta = now - this.lastFrameTimestamp;
        this.lastFrameTimestamp = now;
        const fps = (1 / delta) * 1000;

        this.frames.push(fps);
        if(this.frames.length > 100) {
            this.frames.shift();
        }

        let max = -Infinity;
        let min = Infinity;
        let sum = 0;
        for(let i = 0; i < this.frames.length; ++i) {
            max = Math.max(max, this.frames[i]);
            min = Math.min(min, this.frames[i]);
            sum += this.frames[i];
        }

        const mean = sum / this.frames.length;

        this.fpsBox.textContent = `
Frames per Second:
         |latest = ${Math.round(fps)}
|avg of last 100 = ${Math.round(mean)}
|min of last 100 = ${Math.round(min)}
|max of last 100 = ${Math.round(max)}
`.trim();
    }
};