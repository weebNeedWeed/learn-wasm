import { Universe, Cell } from "gol";
import { memory } from "gol/index_bg.wasm";

const fps = new class {
	constructor() {
		this.fps = document.getElementById("fps");
		this.frames = [];
		this.lastFrameTimeStamp = performance.now();
	}

	render() {
		const now = performance.now();
		const deltaTime = now - this.lastFrameTimeStamp;
		this.lastFrameTimeStamp = now;
		const fps = 1 / deltaTime * 1000;

		this.frames.push(fps);
		if (this.frames.length > 100) {
			this.frames.shift();
		}

		let min = Infinity;
		let max = -Infinity;
		let sum = 0;
		for (let i = 0; i < this.frames.length; i++) {
			sum += this.frames[i];
			min = Math.min(this.frames[i], min);
			max = Math.max(this.frames[i], max);
		}
		let mean = sum / this.frames.length;

		// Render the statistics.
		this.fps.textContent = `
Frames per Second:
         latest = ${Math.round(fps)}
avg of last 100 = ${Math.round(mean)}
min of last 100 = ${Math.round(min)}
max of last 100 = ${Math.round(max)}
`.trim();
	}
}

const WIDTH = 128;
const HEIGHT = 128;
const CELL_WIDTH = 8;
const DEAD_COLOR = "#FFFFFF";
const ALIVE_COLOR = "#000000";
const STROKE_COLOR = "#94a3b8";

const universe = Universe.new();

const canvas = document.getElementById("canvas");
canvas.width = WIDTH * (CELL_WIDTH + 1) + 2;
canvas.height = HEIGHT * (CELL_WIDTH + 1) + 2;
const ctx = canvas.getContext("2d");

function renderLoop() {
	fps.render();
	universe.tick();
	drawGrids();
	drawCells();
	requestAnimationFrame(renderLoop);
}
renderLoop();

function drawGrids() {
	ctx.beginPath();
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.strokeStyle = STROKE_COLOR;
	ctx.lineWidth = 1;
	for (let row = 0; row <= WIDTH; ++row) {
		ctx.moveTo(0, row * (CELL_WIDTH + 1) + 1);
		ctx.lineTo(WIDTH * (CELL_WIDTH + 1) + 1, row * (CELL_WIDTH + 1) + 1);
	}
	for (let col = 0; col <= HEIGHT; ++col) {
		ctx.moveTo(col * (CELL_WIDTH + 1) + 1, 0);
		ctx.lineTo(col * (CELL_WIDTH + 1) + 1, HEIGHT * (CELL_WIDTH + 1) + 1);
	}
	ctx.stroke();
}

function getIndex(row, col) {
	return (row * WIDTH) + col;
}

function drawCells() {
	const cells = new Uint8Array(memory.buffer, universe.cells(), WIDTH * HEIGHT);
	ctx.beginPath();
	for (let row = 0; row < HEIGHT; ++row) {
		for (let col = 0; col < WIDTH; ++col) {
			let idx = getIndex(row, col);
			let cell = cells[idx];

			let color = DEAD_COLOR;
			if (cell === Cell.Alive) {
				color = ALIVE_COLOR;
			}

			ctx.fillStyle = color;

			ctx.moveTo(row * (CELL_WIDTH + 1) + 1 + 1, col * (CELL_WIDTH + 1) + 1 + 1);
			ctx.fillRect(
				row * (CELL_WIDTH + 1) + 1 + 1,
				col * (CELL_WIDTH + 1) + 1 + 1,
				CELL_WIDTH,
				CELL_WIDTH);
		}
	}

	ctx.stroke();
}

