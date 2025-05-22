export var CELL_STATE;
(function (CELL_STATE) {
    CELL_STATE[CELL_STATE["empty"] = 0] = "empty";
    CELL_STATE[CELL_STATE["source"] = 1] = "source";
    CELL_STATE[CELL_STATE["destination"] = 2] = "destination";
    CELL_STATE[CELL_STATE["wall"] = 3] = "wall";
})(CELL_STATE || (CELL_STATE = {}));
export class Visualizer {
    context;
    matrix;
    cellSize;
    cnt;
    constructor(ctx, mat, n) {
        this.context = ctx;
        this.matrix = mat;
        this.cellSize = n;
        this.cnt = 0;
    }
    updateExplore(r, c, d, delay) {
        setTimeout(() => {
            this.cnt--;
            const [x, y] = this.matrix[r][c];
            if (d === 1) {
                this.context.fillStyle = "#00f6ff";
                this.context.fillRect(x, y, this.cellSize, this.cellSize);
                return;
            }
            this.context.beginPath();
            this.context.fillStyle = "indigo";
            this.context.arc(x + this.cellSize / 2, y + this.cellSize / 2, this.cellSize / d, 0, Math.PI * 2);
            this.context.fill();
            requestAnimationFrame(() => this.updateExplore(r, c, d - 1, delay));
        }, delay);
    }
    visualize(r, c, delay) {
        if (this.matrix[r][c][2] === CELL_STATE.empty) {
            this.cnt += 3;
            requestAnimationFrame(() => this.updateExplore(r, c, 3, delay));
        }
    }
    drawPath(sr, sc, dr, dc) {
        const path = this.calculateShortestPath(sr, sc, dr, dc);
        const id = setInterval(() => {
            if (this.cnt === 0) {
                clearInterval(id);
                for (let [r, c] of path) {
                    const [x, y] = this.matrix[r][c];
                    if (this.matrix[r][c][2] === CELL_STATE.empty) {
                        this.context.fillStyle = "#fff100";
                        this.context.fillRect(x, y, this.cellSize, this.cellSize);
                    }
                }
            }
        }, 10);
    }
}
