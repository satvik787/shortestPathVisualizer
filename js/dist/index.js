import { CELL_STATE } from "./helper.js";
import { BFS, DFS } from "./algorithms.js";
const canvas = document.getElementById("canvas");
const star = document.getElementById("star");
const target = document.getElementById("target");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("btn_start");
const bfsBtn = document.getElementById("algo_bfs");
const dfsBtn = document.getElementById("algo_dfs");
const gridMenu = document.getElementById("grid_menu");
const algoMenu = document.getElementById("algo_menu");
const gridBtn = document.getElementById("grid_btn");
const algoBtn = document.getElementById("algo_btn");
const clearBoardBtn = document.getElementById("btn_clear_board");
const Y_START = 104;
const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight - Y_START;
const CELL_WIDTH = 20;
const CELL_HEIGHT = 20;
const CONTENT_WIDTH = CELL_WIDTH - 2;
const CONTENT_HEIGHT = CELL_HEIGHT - 2;
let step = 1;
let mat;
let sr, sc, dr, dc;
let algo;
canvas.width = WIDTH;
canvas.height = HEIGHT;
function initalizeGrid() {
    const n = Math.floor(HEIGHT / CELL_HEIGHT);
    const m = Math.floor(WIDTH / CELL_WIDTH);
    const mat = new Array(n).fill(0).map(() => new Array(m));
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < m; j++) {
            mat[i][j] = [j * CELL_WIDTH, i * CELL_HEIGHT, CELL_STATE.empty];
        }
    }
    ctx.beginPath();
    ctx.strokeStyle = "#89CFF0";
    ctx.lineWidth = 2;
    let last = 0;
    for (let i = 0; i <= WIDTH; i += CELL_WIDTH) {
        ctx.moveTo(i, 0);
        ctx.lineTo(i, HEIGHT - (HEIGHT % CELL_HEIGHT));
        last = i;
    }
    ctx.stroke();
    for (let i = 0; i <= HEIGHT; i += CELL_HEIGHT) {
        ctx.moveTo(0, i);
        ctx.lineTo(WIDTH - (WIDTH % CELL_WIDTH), i);
    }
    ctx.stroke();
    return mat;
}
clearBoardBtn.addEventListener("click", () => {
    step = 1;
    sr = undefined;
    sc = undefined;
    dr = undefined;
    dc = undefined;
    algo = undefined;
    algoBtn.innerText = "Algorithm";
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    mat = initalizeGrid();
});
mat = initalizeGrid();
function mouseMoveHandler(e) {
    const row = Math.floor((e.pageY - Y_START) / CELL_HEIGHT);
    const col = Math.floor(e.pageX / CELL_WIDTH);
    const [x, y, state] = mat[row][col];
    if (state !== CELL_STATE.empty)
        return;
    mat[row][col][2] = CELL_STATE.wall;
    ctx.fillRect(x, y, CELL_WIDTH, CELL_HEIGHT);
}
function mouseClickHandler(event) {
    const row = Math.floor((event.pageY - Y_START) / CELL_HEIGHT);
    const col = Math.floor(event.pageX / CELL_WIDTH);
    const [x, y, state] = mat[row][col];
    if (state !== CELL_STATE.empty)
        return;
    if (step === 1) {
        ctx.drawImage(star, x, y, CONTENT_WIDTH, CONTENT_HEIGHT);
        mat[row][col][2] = CELL_STATE.source;
        sr = row;
        sc = col;
        step++;
    }
    else if (step === 2) {
        ctx.drawImage(target, x, y, CONTENT_WIDTH, CONTENT_HEIGHT);
        mat[row][col][2] = CELL_STATE.destination;
        dr = row;
        dc = col;
        step++;
    }
    else {
        ctx.fillStyle = "black";
        mat[row][col][2] = CELL_STATE.wall;
        ctx.fillRect(x, y, CELL_WIDTH, CELL_HEIGHT);
        canvas.addEventListener("mousemove", mouseMoveHandler);
    }
}
canvas.addEventListener('mousedown', mouseClickHandler);
canvas.addEventListener("mouseup", () => {
    if (step === 3)
        canvas.removeEventListener("mousemove", mouseMoveHandler);
});
bfsBtn.addEventListener("click", () => {
    algo = new BFS(ctx, mat, CONTENT_WIDTH);
    algoBtn.innerText = "BFS";
    algoMenu.style.display = "none";
});
dfsBtn.addEventListener("click", () => {
    algo = new DFS(ctx, mat, CONTENT_WIDTH);
    algoBtn.innerText = "DFS";
    algoMenu.style.display = "none";
});
startBtn.addEventListener("click", () => {
    if (sr !== undefined && sc !== undefined && dr !== undefined && dc !== undefined && algo !== undefined) {
        algo.drawPath(sr, sc, dr, dc);
    }
});
gridBtn.addEventListener("click", (event) => {
    gridMenu.style.display = gridMenu.style.display === "block" ? "none" : "block";
});
algoBtn?.addEventListener("click", () => {
    algoMenu.style.display = algoMenu.style.display === "block" ? "none" : "block";
});
