import { IVector2 } from "./IVector2";

export class Stack{
    public cells: Array<number> = [];
    public direction: number;
    public initialPosition: IVector2;
  
    private colorsCount: number;
    private stackLength: number = 3;
  
    constructor(colorsCount: number, direction: number, initialPosition:IVector2){
      this.colorsCount = colorsCount;
      this.direction = direction;
      this.initialPosition = initialPosition;
      for (let j = 0; j < this.stackLength; j++){
        this.push(this.getRandomColor());
      }
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
  }
  