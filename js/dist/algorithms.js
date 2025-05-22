import { CELL_STATE, Visualizer } from "./helper.js";
class Node {
    val;
    next;
    constructor(val) {
        this.val = val;
        this.next = null;
    }
}
class Queue {
    head;
    tail;
    size;
    constructor() {
        this.head = null;
        this.tail = null;
        this.size = 0;
    }
    enqueue(val) {
        if (this.tail === null) {
            this.head = new Node(val);
            this.tail = this.head;
        }
        else {
            this.tail.next = new Node(val);
            this.tail = this.tail.next;
        }
        this.size++;
    }
    dequeue() {
        if (this.head === null)
            throw new Error("empty list");
        const temp = this.head.val;
        if (this.tail == this.head) {
            this.head = null;
            this.tail = null;
        }
        else {
            this.head = this.head.next;
        }
        this.size--;
        return temp;
    }
}
export class BFS extends Visualizer {
    constructor(ctx, mat, cellSize) {
        super(ctx, mat, cellSize);
    }
    calculateShortestPath(sr, sc, dr, dc) {
        const n = this.matrix.length;
        const m = this.matrix[0].length;
        const visited = new Array(n).fill(0).map(() => new Array(m).fill(Number.POSITIVE_INFINITY));
        const R = [1, -1, 0, 0];
        const C = [0, 0, 1, -1];
        visited[sr][sc] = 1;
        const q = new Queue();
        q.enqueue([sr, sc]);
        let delay = 10;
        while (q.size > 0) {
            const [r, c] = q.dequeue();
            if (this.matrix[r][c][2] === CELL_STATE.destination)
                break;
            for (let i = 0; i < 4; i++) {
                const nr = R[i] + r;
                const nc = C[i] + c;
                if (0 <= nr && nr < n && 0 <= nc && nc < m && this.matrix[nr][nc][2] !== CELL_STATE.wall && visited[nr][nc] > visited[r][c] + 1) {
                    this.visualize(nr, nc, delay);
                    visited[nr][nc] = visited[r][c] + 1;
                    q.enqueue([nr, nc]);
                }
            }
            delay += 1;
        }
        const path = new Array(visited[dr][dc]).fill(0).map(() => new Array());
        for (let ind = path.length - 1; ind >= 0; ind--) {
            path[ind] = [dr, dc];
            for (let i = 0; i < 4; i++) {
                const nr = R[i] + dr;
                const nc = C[i] + dc;
                if (0 <= nr && nr < n && 0 <= nc && nc < m && visited[nr][nc] + 1 === visited[dr][dc]) {
                    dr = nr;
                    dc = nc;
                    break;
                }
            }
        }
        return path;
    }
}
export class DFS extends Visualizer {
    constructor(ctx, mat, cellSize) {
        super(ctx, mat, cellSize);
    }
    rec(r, c, delay, visited) {
        const n = this.matrix.length, m = this.matrix[0].length;
        const R = [0, 0, 1, -1], C = [1, -1, 0, 0];
        for (let i = 0; i < 4; i++) {
            const nr = R[i] + r, nc = C[i] + c;
            if (0 <= nr && nr < n && 0 <= nc && nc < m && this.matrix[nr][nc][2] !== CELL_STATE.wall && visited[nr][nc] > visited[r][c] + 1) {
                if (visited[nr][nc] === Number.POSITIVE_INFINITY) {
                    this.visualize(nr, nc, delay);
                }
                visited[nr][nc] = visited[r][c] + 1;
                delay = this.rec(nr, nc, delay + 2, visited);
            }
        }
        return Math.min(delay, 1000);
    }
    calculateShortestPath(sr, sc, dr, dc) {
        const n = this.matrix.length, m = this.matrix[0].length;
        const R = [1, -1, 0, 0], C = [0, 0, 1, -1];
        const visited = new Array(n).fill(0).map(() => new Array(m).fill(Number.POSITIVE_INFINITY));
        visited[sr][sc] = 10;
        const a = this.rec(sr, sc, 10, visited);
        const path = new Array(visited[dr][dc]).fill(0).map(() => new Array());
        for (let ind = path.length - 1; ind >= 0; ind--) {
            path[ind] = [dr, dc];
            for (let i = 0; i < 4; i++) {
                const nr = R[i] + dr;
                const nc = C[i] + dc;
                if (0 <= nr && nr < n && 0 <= nc && nc < m && visited[nr][nc] + 1 === visited[dr][dc]) {
                    dr = nr;
                    dc = nc;
                    break;
                }
            }
        }
        return path;
    }
}
