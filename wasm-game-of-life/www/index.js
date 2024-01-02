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
universe.set_width(height);

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

function renderLoop() {
    universe.tick();

    drawGrid();
    drawCells();

    requestAnimationFrame(renderLoop);
}

requestAnimationFrame(renderLoop);