export enum CELL_STATE{
    empty,
    source,
    destination,
    wall
}

export abstract class Visualizer{
    protected context:CanvasRenderingContext2D;
    protected matrix:Array<Array<Array<number>>>
    protected cellSize;
    private cnt;

    constructor(ctx:CanvasRenderingContext2D,mat:Array<Array<Array<number>>>,n:number){
        this.context = ctx;
        this.matrix = mat;
        this.cellSize = n;
        this.cnt = 0;
    }

    private updateExplore(r:number,c:number,d:number,delay:number){
        setTimeout(()=>{
            this.cnt--;
            const [x,y] = this.matrix[r][c];
            if(d === 1){
                this.context.fillStyle = "#00f6ff";
                this.context.fillRect(x,y,this.cellSize,this.cellSize);
                return;
            }
            this.context.beginPath();
            this.context.fillStyle = "indigo";
            this.context.arc(x + this.cellSize / 2,y + this.cellSize / 2,this.cellSize / d,0,Math.PI * 2);
            this.context.fill();
            requestAnimationFrame(()=>this.updateExplore(r,c,d - 1,delay));
        },delay);
    }


    visualize(r:number,c:number,delay:number){
        if(this.matrix[r][c][2] === CELL_STATE.empty){
            this.cnt += 3;
            requestAnimationFrame(()=>this.updateExplore(r,c,3,delay));
        }
    }

    abstract calculateShortestPath(sr:number,sc:number,dr:number,dc:number):Array<Array<number>>

    drawPath(sr:number,sc:number,dr:number,dc:number){
        const path = this.calculateShortestPath(sr,sc,dr,dc);
        
        const id = setInterval(()=>{
            if(this.cnt === 0){
                clearInterval(id);
                for(let [r,c] of path){
                    const [x,y] = this.matrix[r][c];
                    if(this.matrix[r][c][2] === CELL_STATE.empty){
                        this.context.fillStyle = "#fff100";
                        this.context.fillRect(x,y,this.cellSize,this.cellSize);
                    }
                } 
            }
        },10); 
    }

}