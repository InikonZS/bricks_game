import { IVector2 } from "./IVector2";

interface IStackData{
    cells: Array<number>;
    direction: number;
    position: IVector2;
}

export class Stack{
    public cells: Array<number> = [];
    public direction: number;
    public initialPosition: IVector2;
  
    private colorsCount: number;
    private stackLength: number = 3;
  
    constructor(colorsCount: number, direction: number, initialPosition:IVector2, cells:Array<number>){
      this.colorsCount = colorsCount;
      this.direction = direction;
      this.initialPosition = initialPosition;
      /*for (let j = 0; j < this.stackLength; j++){
        this.push(this.getRandomColor());
      }*/
      cells.forEach(it=>{
        this.push(it);
      })
    }

    static generate(stackLength:number, colorsCount:number){
      const result: Array<number> = [];
      for (let j = 0; j < stackLength; j++){
        result.push(Math.floor(Math.random() * colorsCount));
      }
      return result;
    }
  
    private getRandomColor(){
      return Math.floor(Math.random() * this.colorsCount);
    }
  
    pop(){
      const cell = this.cells.pop();
      this.cells.unshift(this.getRandomColor());
      return cell;
    }
  
    push(color:number){
      this.cells = this.cells.slice(this.cells.length + 1 - this.stackLength);
      return this.cells.push(color); 
    }

    save(){
        return this.cells/*{
            cells: this.cells,
            direction: this.direction,
            position: this.initialPosition
        }*/
    }

    /*static load(data:IStackData){
        const stack = new Stack(2, data.direction, data.position);
        stack.cells = data.cells;
        return stack;
    }*/
  }
  